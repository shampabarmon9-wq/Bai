import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Mic, Loader2, Square, Copy, Check, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useRef, useState } from 'react';

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  processingType?: 'text' | 'image' | 'video';
}

const ImageWithLoading = ({ src, alt, downloadFilename }: { src: string, alt: string, downloadFilename: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download file', err);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="mb-4">
      <div className="relative rounded-xl overflow-hidden max-w-2xl border border-white/10 shadow-lg bg-[#121212] aspect-square flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}
        <img 
          src={src} 
          alt={alt} 
          onLoad={() => setIsLoaded(true)}
          className={cn("w-full h-full object-cover transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0")}
          referrerPolicy="no-referrer" 
        />
      </div>
      <button onClick={() => handleDownload(src, downloadFilename)} className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/10 cursor-pointer">
        <Download className="w-3.5 h-3.5" /> Download Image
      </button>
    </div>
  );
};

export function ChatBox({ messages, isLoading, processingType = 'text' }: ChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isPreparingAudio, setIsPreparingAudio] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download file', err);
      // Fallback
      window.open(url, '_blank');
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    setSpeakingId(id);

    // Split text into chunks to avoid TTS cutoff on long texts
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentChunk = 0;

    const speakNextChunk = () => {
      if (currentChunk >= chunks.length) {
        setSpeakingId(null);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(chunks[currentChunk].trim());
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') || 
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('zira')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onend = () => {
        currentChunk++;
        // Check if still speaking this id
        if (speakingId === id || true) {
           speakNextChunk();
        }
      };
      
      utterance.onerror = () => {
        setSpeakingId(null);
      };
      
      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-transparent">
        <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <span className="text-indigo-400 font-bold text-3xl">B</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">How can I help you today?</h2>
        <p className="text-white/50 max-w-md">
          I am your professional AI assistant. Ask me questions, request code snippets, or discuss any topic.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 group",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
          >
            <div className="flex-shrink-0">
              {message.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white/60" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                  B
                </div>
              )}
            </div>
            <div className={cn(
              "max-w-3xl space-y-2",
              message.role === 'user' ? "text-right" : ""
            )}>
              {message.role === 'assistant' && (
                <div className="flex justify-end mb-1">
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              {message.imageUrl && (
                <ImageWithLoading src={message.imageUrl} alt="Generated UI" downloadFilename={`generated-image-${message.id}.png`} />
              )}
              {message.videoUrl && (
                <div className="mb-4">
                  <video src={message.videoUrl} controls autoPlay loop className="rounded-xl w-full max-w-2xl border border-white/10 shadow-lg bg-[#121212]" />
                  <button onClick={() => handleDownload(message.videoUrl!, `generated-video-${message.id}.mp4`)} className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/10 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Download Video
                  </button>
                </div>
              )}
              {message.content && (
                <div className="prose prose-sm sm:prose-base prose-invert max-w-none 
                                prose-p:leading-relaxed prose-p:text-white/80
                                prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                                prose-code:text-indigo-300 prose-code:bg-indigo-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                                font-sans text-left">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {message.role === 'assistant' && message.content.length > 0 && (
                <div className="flex items-center gap-2 pt-2 transition-opacity">
                  <button
                    onClick={() => handleSpeak(message.id, message.content)}
                    disabled={isPreparingAudio !== null && isPreparingAudio !== message.id}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex items-center gap-1.5 text-xs border border-transparent hover:border-white/10 bg-white/5"
                    title={speakingId === message.id ? "Stop reading" : "Read aloud"}
                  >
                    {isPreparingAudio === message.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    ) : speakingId === message.id ? (
                      <>
                        <Square className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                        <span className="text-indigo-400 font-medium">Stop Reading</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Listen to Audio</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start pl-12">
             <div className="flex-1 flex flex-col items-start gap-3">
               <div className="flex items-center gap-3 bg-transparent px-4 py-3 rounded-2xl w-full max-w-sm relative overflow-hidden">
                 
                 {processingType === 'text' ? (
                   <>
                     <div className="flex space-x-2 shrink-0 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg">
                       <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                     </div>
                     <div className="text-sm font-medium text-white/40 tracking-wide animate-pulse">
                       Typing...
                     </div>
                   </>
                 ) : processingType === 'image' ? (
                   <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden relative border border-white/10 shadow-xl bg-gradient-to-br from-white/5 to-white/10 flex flex-col items-center justify-center p-6 mt-2">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] w-[200%]"></div>
                     <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                       <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                     </div>
                     <div className="relative z-10 text-sm font-medium text-purple-300/80 tracking-wide animate-pulse text-center">
                       Creating image...
                     </div>
                   </div>
                 ) : (
                   <>
                     <div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden relative border border-white/10 shadow-xl bg-gradient-to-br from-white/5 to-white/10 flex flex-col items-center justify-center p-6 mt-2">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] w-[200%]"></div>
  <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
  </div>
  <div className="relative z-10 text-sm font-medium text-indigo-300/80 tracking-wide animate-pulse text-center">
    Rendering video...
  </div>
</div>
                   </>
                 )}

               </div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
