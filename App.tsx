import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBox } from './components/ChatBox';
import { ChatInput } from './components/ChatInput';
import { PricingModal } from './components/PricingModal';
import { PaymentPortal } from './components/PaymentPortal';
import { LoginScreen } from './components/LoginScreen';
import { Message, UserCredits, AIModel, PlanTier } from './types';
import { LayoutPanelLeft, ChevronDown, Check, X, Crown, Zap } from 'lucide-react';

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingType, setProcessingType] = useState<'text' | 'image' | 'video'>('text');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Model and Upgrade State
  const [model, setModel] = useState<AIModel>('gemini-light');
  const [plan, setPlan] = useState<PlanTier>('free');
  const [proUses, setProUses] = useState(3);
  const [showPricing, setShowPricing] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanTier | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  
  // Initialize credits
  const [credits, setCredits] = useState<UserCredits>({
    available: 10,
    max: 10
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('bai_user_email');
    const savedPlan = localStorage.getItem('bai_user_plan') as PlanTier;
    if (savedEmail) {
      setUserEmail(savedEmail);
      if (savedPlan) setPlan(savedPlan);
      // Brief loading before showing dashboard if already logged in
      setTimeout(() => setIsAppLoading(false), 800);
    } else {
      setIsAppLoading(false);
    }
  }, []);

  const handleRecharge = () => {
    setCredits(prev => ({ ...prev, available: prev.max }));
  };

  const handleLogin = (email: string) => {
    setIsAppLoading(true);
    localStorage.setItem('bai_user_email', email);
    localStorage.setItem('bai_user_plan', plan);
    setUserEmail(email);
    // Simulate loading for 1.5s after fresh login
    setTimeout(() => setIsAppLoading(false), 1500);
  };

  const handleModelSelect = (selectedModel: AIModel) => {
    // Pro features check
    if (selectedModel === 'gemini-pro-vision') {
      if (plan === 'free' && proUses <= 0) {
        setShowPricing(true);
        setModelDropdownOpen(false);
        return;
      }
    }
    // Ultra features check
    if (selectedModel === 'gemini-ultra' || selectedModel === 'gpt-4-omni' || selectedModel === 'claude-3-opus') {
      if (plan !== 'ultra') {
        setShowPricing(true);
        setModelDropdownOpen(false);
        return;
      }
    }
    
    setModel(selectedModel);
    setModelDropdownOpen(false);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (plan === 'free' && credits.available <= 0) return;

    if (model === 'gemini-pro-vision' && plan === 'free') {
      if (proUses <= 0) {
        setShowPricing(true);
        return;
      }
      setProUses(prev => prev - 1);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    // Determine processing type based on content
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('video') || lowerContent.includes('.mp4') || lowerContent.includes('youtube')) {
      setProcessingType('video');
    } else if (lowerContent.includes('image') || lowerContent.includes('photo') || lowerContent.includes('pic') || lowerContent.includes('.jpg') || lowerContent.includes('.png') || lowerContent.includes('https://')) {
      setProcessingType('image');
    } else {
      setProcessingType('text');
    }

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    if (plan === 'free') {
      setCredits(prev => ({ ...prev, available: prev.available - 1 }));
    }

    try {
      if (processingType === 'image') {
        try {
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: content })
          });
          if (!response.ok) throw new Error('Failed to generate image');
          const data = await response.json();
          
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: '', imageUrl: data.imageUrl }
          ]);
        } catch (error) {
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: 'There was an error generating the image. Please try again.', imageUrl: undefined }
          ]);
        }
      } else if (processingType === 'video') {
        try {
          const response = await fetch('/api/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: content })
          });
          if (!response.ok) throw new Error('Failed to generate video');
          const data = await response.json();
          
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: '', videoUrl: data.videoUrl }
          ]);
        } catch (error) {
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: 'There was an error generating the video. Please try again.', videoUrl: undefined }
          ]);
        }
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            credits: plan !== 'free' ? 9999 : credits.available - 1,
            model
          }),
        });

        if (!response.ok) {
          if (response.status === 403) {
             throw new Error('Out of credits');
          }
          throw new Error('Failed to fetch response');
        }

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        const assistantMessageId = crypto.randomUUID();
        
        setMessages(prev => [
          ...prev,
          { id: assistantMessageId, role: 'assistant', content: '' }
        ]);

        let done = false;
        let text = '';
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            text += chunk;
            
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: text }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, credits.available, model, plan, proUses]);

  if (isAppLoading) {
    return (
      <div className="flex h-screen w-full bg-[#050505] items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 relative animate-pulse">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <div className="flex gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden selection:bg-indigo-500/30 selection:text-white relative">
      <Sidebar 
        credits={credits} 
        onRecharge={handleRecharge} 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        plan={plan}
        userEmail={userEmail}
        onUpgradeClick={() => setShowPricing(true)}
      />
      
      <main className="flex-1 flex flex-col h-full relative w-full lg:w-[calc(100%-18rem)]">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0a]/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:bg-white/5 hover:text-white rounded-lg transition-colors -ml-2"
            >
              <LayoutPanelLeft className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${model === 'gemini-pro-vision' ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                <span className="text-[11px] font-medium tracking-wide uppercase truncate max-w-[100px] sm:max-w-none">
                  {model === 'gemini-light' && 'Gemini Light'}
                  {model === 'chat-standard' && 'ChatGPT'}
                  {model === 'gemini-pro-vision' && 'Gemini Pro'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {modelDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
                    <button onClick={() => handleModelSelect('gemini-light')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-white">Gemini Light</div>
                        <div className="text-[10px] text-white/40">Free Unlimited</div>
                      </div>
                      {model === 'gemini-light' && <Check className="w-4 h-4 text-green-500" />}
                    </button>
                    <button onClick={() => handleModelSelect('chat-standard')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-white">ChatGPT Standard</div>
                        <div className="text-[10px] text-white/40">Free Unlimited</div>
                      </div>
                      {model === 'chat-standard' && <Check className="w-4 h-4 text-green-500" />}
                    </button>
                    <button onClick={() => handleModelSelect('gemini-pro-vision')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors border-t border-white/5">
                      <div>
                        <div className="text-sm font-medium text-indigo-400 flex items-center gap-1">
                          Gemini Pro Vision <Crown className="w-3 h-3" />
                        </div>
                        <div className="text-[10px] text-white/40">
                          {plan === 'free' ? `${proUses} uses remaining` : 'Unlimited'}
                        </div>
                      </div>
                      {model === 'gemini-pro-vision' && <Check className="w-4 h-4 text-indigo-500" />}
                    </button>
                    <button onClick={() => handleModelSelect('gemini-ultra')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors border-t border-white/5">
                      <div>
                        <div className="text-sm font-medium text-purple-400 flex items-center gap-1">
                          Gemini Ultra <Zap className="w-3 h-3" />
                        </div>
                        <div className="text-[10px] text-white/40">Ultra Plan Only</div>
                      </div>
                      {model === 'gemini-ultra' && <Check className="w-4 h-4 text-purple-500" />}
                    </button>
                    <button onClick={() => handleModelSelect('gpt-4-omni')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-purple-400 flex items-center gap-1">
                          GPT-4 Omni <Zap className="w-3 h-3" />
                        </div>
                        <div className="text-[10px] text-white/40">Ultra Plan Only</div>
                      </div>
                      {model === 'gpt-4-omni' && <Check className="w-4 h-4 text-purple-500" />}
                    </button>
                    <button onClick={() => handleModelSelect('claude-3-opus')} className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-purple-400 flex items-center gap-1">
                          Claude 3 Opus <Zap className="w-3 h-3" />
                        </div>
                        <div className="text-[10px] text-white/40">Ultra Plan Only</div>
                      </div>
                      {model === 'claude-3-opus' && <Check className="w-4 h-4 text-purple-500" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {plan === 'free' ? (
              <button 
                onClick={() => setShowPricing(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                UPGRADE
              </button>
            ) : (
              <button
                onClick={() => setShowPricing(true)}
                className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20 rounded-lg flex items-center gap-2"
              >
                <Crown className="w-3 h-3 text-indigo-400" />
                <span className="text-[11px] font-bold text-indigo-400 tracking-wide uppercase">{plan} ACTIVE</span>
              </button>
            )}
          </div>
        </header>

        <ChatBox messages={messages} isLoading={isLoading} processingType={processingType} />
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading} 
          credits={plan !== 'free' ? 9999 : credits.available} 
        />
      </main>

      {showPricing && (
        <PricingModal 
          currentPlan={plan}
          onClose={() => setShowPricing(false)}
          onSelectPlan={(selectedPlan) => {
            setShowPricing(false);
            setCheckoutPlan(selectedPlan);
          }}
        />
      )}

      {checkoutPlan && (
        <PaymentPortal 
          plan={checkoutPlan}
          onCancel={() => setCheckoutPlan(null)}
          onSuccess={(newPlan) => {
            setPlan(newPlan);
            setCheckoutPlan(null);
          }}
        />
      )}
    </div>
  );
}
