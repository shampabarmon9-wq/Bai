import { X, Check, Crown, Zap, Shield } from 'lucide-react';
import { PlanTier } from '../types';

interface PricingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: PlanTier) => void;
  currentPlan: PlanTier;
}

export function PricingModal({ onClose, onSelectPlan, currentPlan }: PricingModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10 bg-black/50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 pb-4 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Upgrade Your Workspace</h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Unlock professional AI models, unlimited usage, game building, and media generation tools.
          </p>
        </div>

        <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Free Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Free Trial</h3>
              <p className="text-xs text-white/40">Try out the platform</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹0</span>
              <span className="text-xs text-white/40">/ 7 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Unlimited standard usage</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Gemini Pro Vision (3/day)</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Basic features</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('free')}
              disabled={currentPlan === 'free'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'free' ? 'CURRENT PLAN' : 'SELECT FREE'}
            </button>
          </div>

          {/* Micro Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Micro</h3>
              <p className="text-xs text-white/40">Tiny boost for short tasks</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹1</span>
              <span className="text-xs text-white/40">/ 5 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Basic AI Models Access</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Minimal daily limits</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Standard features</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('micro')}
              disabled={currentPlan === 'micro' || currentPlan === 'starter' || currentPlan === 'plus' || currentPlan === 'basic' || currentPlan === 'pro' || currentPlan === 'ultra'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'micro' ? 'CURRENT PLAN' : 'SELECT MICRO'}
            </button>
          </div>

          {/* Starter Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-white/40">Quick boost for short tasks</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹49</span>
              <span className="text-xs text-white/40">/ 10 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Basic AI Models Access</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Limited daily uses</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Standard support</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('starter')}
              disabled={currentPlan === 'starter' || currentPlan === 'plus' || currentPlan === 'basic' || currentPlan === 'pro' || currentPlan === 'ultra'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'starter' ? 'CURRENT PLAN' : 'SELECT STARTER'}
            </button>
          </div>

          {/* Plus Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Plus</h3>
              <p className="text-xs text-white/40">Extra power for half a month</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹99</span>
              <span className="text-xs text-white/40">/ 15 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Enhanced AI Models</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Increased daily limits</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Faster generation</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('plus')}
              disabled={currentPlan === 'plus' || currentPlan === 'basic' || currentPlan === 'pro' || currentPlan === 'ultra'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'plus' ? 'CURRENT PLAN' : 'SELECT PLUS'}
            </button>
          </div>

          {/* Basic Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Basic</h3>
              <p className="text-xs text-white/40">Essential AI for daily tasks</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹199</span>
              <span className="text-xs text-white/40">/ 30 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Unlimited ChatGPT Standard</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>100 Credits per day</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                <span>Basic Photo Generation</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('basic')}
              disabled={currentPlan === 'basic' || currentPlan === 'pro' || currentPlan === 'ultra'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'basic' ? 'CURRENT PLAN' : 'SELECT BASIC'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#121212] border border-indigo-500/50 rounded-2xl p-6 flex flex-col relative shadow-2xl shadow-indigo-500/10 transform lg:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> Most Popular
            </div>
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-bold text-indigo-400 mb-1">Pro</h3>
              <p className="text-xs text-white/40">Professional-grade workspace</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹999</span>
              <span className="text-xs text-white/40">/ 90 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-white font-medium">Unlimited Gemini Pro Vision</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Professional Coding Assistant</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Game Builder & Prompt Gen</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Generate & Delete Photos</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('pro')}
              disabled={currentPlan === 'pro' || currentPlan === 'ultra'}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'pro' ? 'CURRENT PLAN' : 'SELECT PRO'}
            </button>
          </div>

          {/* Ultra Plan */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-purple-500/30 transition-colors">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-purple-400 mb-1">Ultra</h3>
              <p className="text-xs text-white/40">Maximum capability</p>
            </div>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹2999</span>
              <span className="text-xs text-white/40">/ 365 days</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-white/70">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-white font-medium">Access to Ultra & Omni</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Video Generation unlocked</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Priority processing</span>
              </li>
              <li className="flex gap-3 text-sm text-white/70">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Dedicated encryption keys</span>
              </li>
            </ul>
            <button 
              onClick={() => onSelectPlan('ultra')}
              disabled={currentPlan === 'ultra'}
              className="w-full py-3 bg-white/5 hover:bg-purple-900/30 hover:border-purple-500/50 border border-transparent text-white rounded-xl font-bold tracking-wide transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlan === 'ultra' ? 'CURRENT PLAN' : 'SELECT ULTRA'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
