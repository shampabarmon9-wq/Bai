import { Coins, Zap, Shield, Code, Sparkles, LayoutPanelLeft, Image as ImageIcon, Video, Trash2, Gamepad2, Lightbulb, Crown } from 'lucide-react';
import { UserCredits, PlanTier } from '../types';

interface SidebarProps {
  credits: UserCredits;
  onRecharge: () => void;
  isOpen: boolean;
  onToggle: () => void;
  plan: PlanTier;
  userEmail: string | null;
  onUpgradeClick: () => void;
}

export function Sidebar({ credits, onRecharge, isOpen, onToggle, plan, userEmail, onUpgradeClick }: SidebarProps) {
  const percentage = Math.max(0, Math.min(100, (credits.available / credits.max) * 100));
  
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-30
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
              B
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">B AI</h1>
          </div>
          
          <div className="space-y-6 flex-1">
            <nav>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 px-2">Capabilities</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Code className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Professional Coding</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <ImageIcon className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Generate Photos</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Video className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Generate Videos</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Trash2 className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Delete Photos</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Shield className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Encrypted & Private</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Gamepad2 className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Game Builder</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors cursor-default">
                  <Lightbulb className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/50 truncate">Prompt Generator</span>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="mt-auto pt-6 border-t border-white/10">
            {plan === 'free' ? (
              <div className="bg-gradient-to-br from-indigo-900/40 to-transparent p-4 rounded-xl border border-indigo-500/30 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-indigo-300">Free Credits</span>
                  <span className="text-xs font-bold text-white">{credits.available}</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-900/20 to-transparent p-4 rounded-xl border border-green-500/20 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-green-400">Status</span>
                  <span className="text-xs font-bold text-white uppercase">{plan} Active</span>
                </div>
                <p className="text-[10px] text-green-400/60 mt-1">Unlimited Access & Premium Models Unlocked</p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 group">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/50 shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium group-hover:text-white text-white/80 truncate">
                    {userEmail || (plan === 'free' ? 'Free User' : 'Pro User')}
                  </p>
                  <p className="text-xs text-white/40 capitalize">
                    {plan} Plan
                  </p>
                </div>
              </div>
              <button
                onClick={onUpgradeClick}
                className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 mt-2"
              >
                <Crown className="w-4 h-4" /> UPGRADE PLAN
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
