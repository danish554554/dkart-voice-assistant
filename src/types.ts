export interface VoiceOption {
  id: string;
  name: string;
  urduName?: string;
  gender: 'male' | 'female';
  accent?: string;
  tone: string;
  bestFor: string;
  baseVoice: string;
  sampleStyle: string;
  avatarColor?: string;
  isPopular?: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  latency: string;
}

export interface ScriptLine {
  id: number;
  urdu: string;
  roman: string;
  english: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  role: 'Hook' | 'Feature' | 'Convenience' | 'CTA';
  pronunciationNote?: string;
}

export interface CommercialConfig {
  voice: string;
  model?: string;
  style: string;
  pace: string;
  script: string;
}

export interface GeneratedAudioState {
  audioBase64: string | null;
  mimeType: string;
  source: string;
  model: string;
  duration: number;
  isLoading: boolean;
  error: string | null;
}
