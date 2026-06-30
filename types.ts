export type Role = 'user' | 'assistant' | 'system';

export type AIModel = 
  | 'gemini-light' 
  | 'chat-standard' 
  | 'gemini-pro-vision'
  | 'gemini-ultra'
  | 'gpt-4-omni'
  | 'claude-3-opus';

export type PlanTier = 'free' | 'micro' | 'starter' | 'plus' | 'basic' | 'pro' | 'ultra';

export interface Message {
  id: string;
  role: Role;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface UserCredits {
  available: number;
  max: number;
}

