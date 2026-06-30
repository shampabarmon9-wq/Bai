import { useState } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showAccounts, setShowAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const mockAccounts = [
    'shampabarmon9@gmail.com',
    'pro.user@gmail.com',
    'developer@example.com'
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white items-center justify-center font-sans">
      <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-[#0a0a0a] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 relative">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Welcome to B AI</h2>
        <p className="text-center text-white/50 text-sm mb-8">Sign in to access your professional AI workspace</p>

        {!showAccounts ? (
          <button 
            onClick={() => setShowAccounts(true)}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        ) : selectedAccount ? (
          <div className="space-y-4">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-2 text-center">Confirm login as</p>
            <div className="w-full flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-left">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{selectedAccount.split('@')[0]}</p>
                <p className="text-xs text-indigo-300 truncate">{selectedAccount}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedAccount(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => onLogin(selectedAccount)}
                className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                Confirm Login
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-4 px-2 text-center">Select an account</p>
            {mockAccounts.map(email => (
              <button 
                key={email}
                onClick={() => setSelectedAccount(email)}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{email.split('@')[0]}</p>
                  <p className="text-xs text-white/50 truncate">{email}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-center text-white/30 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Secure & Encrypted Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
