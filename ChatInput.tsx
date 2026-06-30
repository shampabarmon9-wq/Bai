import { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  credits: number;
}

export function ChatInput({ onSend, disabled, credits }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && credits > 0) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isOutOfCredits = credits <= 0;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOutOfCredits ? "Out of credits. Please recharge." : "Ask anything or paste code for review..."}
            disabled={disabled || isOutOfCredits}
            rows={1}
            className="w-full resize-none rounded-2xl bg-[#121212] border border-white/10 pl-5 pr-32 py-5 text-sm text-[#e0e0e0]
                       focus:outline-none focus:border-indigo-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed font-sans leading-relaxed
                       transition-shadow"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-4">
            <span className="text-[10px] text-white/30 uppercase tracking-widest hidden sm:inline-block">Cost: 1 Credit</span>
            <button
              type="submit"
              disabled={!input.trim() || disabled || isOutOfCredits}
              className={cn(
                "px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                input.trim() && !disabled && !isOutOfCredits
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
              )}
            >
              SEND <SendHorizontal className="w-3 h-3" />
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-[10px] text-white/20 uppercase tracking-widest">
          Professional AI Workspace — Encrypted & Private
        </p>
      </div>
    </div>
  );
}
