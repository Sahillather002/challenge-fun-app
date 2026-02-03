
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingLinks?: Array<{ web?: { uri: string; title: string }; maps?: { uri: string; title: string } }>;
}

export interface Model {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  params: string;
  context: string;
  speed: string;
  price: string;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  stream: boolean;
  useMaps: boolean;
}

export enum NavigationTab {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  MODELS = 'models',
  CREATIVE = 'creative',
  STATUS = 'status',
  ANALYTICS = 'analytics',
  API_KEYS = 'api-keys',
  SETTINGS = 'settings',
  DOCS = 'docs',
  PRICING = 'pricing',
  FAQ = 'faq'
}
