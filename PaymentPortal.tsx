import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { PlanTier } from '../types';

interface PaymentPortalProps {
  plan: PlanTier;
  onSuccess: (plan: PlanTier) => void;
  onCancel: () => void;
}

export function PaymentPortal({ plan, onSuccess, onCancel }: PaymentPortalProps) {
  const [step, setStep] = useState<'loading' | 'form' | 'processing' | 'success'>('loading');

  const prices: Record<PlanTier, number> = {
    free: 0,
    micro: 1,
    starter: 49,
    plus: 99,
    basic: 199,
    pro: 999,
    ultra: 2999
  };

  useEffect(() => {
    // Simulate gateway redirect delay
    const timer = setTimeout(() => {
      setStep('form');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        onSuccess(plan);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#f7f9fc] z-[100] flex flex-col font-sans text-gray-900">
      {/* Mock Browser Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="bg-gray-100 rounded-md py-1.5 px-4 text-xs font-mono text-gray-600 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3 text-green-600" />
            secure-checkout.bai.com/pay/{plan}
          </div>
        </div>
        <button onClick={onCancel} className="text-sm font-medium text-blue-600 hover:text-blue-700">Cancel</button>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        
        {step === 'loading' && (
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium animate-pulse">Redirecting to secure gateway...</p>
          </div>
        )}

        {(step === 'form' || step === 'processing') && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="p-6 bg-blue-600 text-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold opacity-90">B AI Subscription</h2>
                  <p className="text-2xl font-bold capitalize">{plan} Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 mb-1">Amount Due</p>
                  <p className="text-2xl font-bold">₹{prices[plan]}.00</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePay} className="p-6 space-y-6">
              {/* Internal Note: All payments routed securely to Merchant Account 1950201700018361 (IFSC: PUNB0195020) */}
              {plan !== 'free' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-800 font-medium mb-1">Secure Auto-Debit</p>
                    <p className="text-xs text-blue-600/80">
                      Payment will be automatically deducted from your saved payment method and routed securely.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-600">
                  <p className="text-sm">You are about to start a 5-day micro trial. No payment required.</p>
                </div>
              )}

              <button 
                disabled={step === 'processing'}
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {step === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Secure Transfer...
                  </>
                ) : plan === 'free' ? (
                  <>Confirm Free Trial</>
                ) : (
                  <>Pay ₹{prices[plan]}.00 Securely</>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Encrypted Direct Transfer
              </p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Detected Payment!</h2>
            <p className="text-green-600 text-sm font-medium mb-1 border-b border-green-100 pb-2 w-full">Transferred securely to Account 1950201700018361</p>
            <p className="text-gray-500 text-sm my-4 font-semibold text-indigo-600">Upgrade Successful! All Premium Models Unlocked.</p>
            
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-green-500 h-full w-full animate-[progress_1.5s_ease-in-out]"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
