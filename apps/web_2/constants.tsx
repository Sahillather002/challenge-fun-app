
import { Model } from './types';

export const MODELS: Model[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    icon: '⚡',
    gradient: 'from-blue-500 to-cyan-400',
    description: 'Fast and efficient for general high-speed tasks.',
    params: 'Standard',
    context: '1M context',
    speed: 'High',
    price: '$0.01/1M tokens'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    icon: '🚀',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Advanced reasoning and complex problem solving.',
    params: 'Max',
    context: '2M context',
    speed: 'Medium',
    price: '$0.05/1M tokens'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Maps)',
    icon: '📍',
    gradient: 'from-green-500 to-emerald-400',
    description: 'Optimized for spatial awareness and Google Maps grounding.',
    params: 'Standard',
    context: '1M context',
    speed: 'Fast',
    price: '$0.01/1M tokens'
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Gen-3 Image Pro',
    icon: '🎨',
    gradient: 'from-orange-500 to-red-500',
    description: 'Professional high-fidelity image generation up to 4K.',
    params: 'Hifi',
    context: 'N/A',
    speed: 'Optimized',
    price: '$0.03/Image'
  }
];
