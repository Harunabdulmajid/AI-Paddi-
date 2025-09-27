import { BrainCircuit, BookOpen, Bot, ShieldCheck, Briefcase, Star, Award, Trophy, Swords } from 'lucide-react';
import { Badge, Module } from './types';

export const CURRICULUM_MODULES = [
  {
    id: 'what-is-ai',
    icon: BrainCircuit,
  },
  {
    id: 'how-ai-works',
    icon: BookOpen,
  },
  {
    id: 'ai-in-daily-life',
    icon: Bot,
  },
  {
    id: 'risks-and-bias',
    icon: ShieldCheck,
  },
  {
    id: 'ai-and-jobs',
    icon: Briefcase,
  },
];

export const BADGES: Record<string, Badge> = {
  'first-step': {
    id: 'first-step',
    name: 'First Step',
    description: 'Completed your first lesson module.',
    icon: BookOpen,
  },
  'ai-graduate': {
    id: 'ai-graduate',
    name: 'AI Graduate',
    description: 'Completed the entire AI Literacy curriculum.',
    icon: Star,
  },
  'point-pioneer': {
    id: 'point-pioneer',
    name: 'Point Pioneer',
    description: 'Earned your first 100 points.',
    icon: Award,
  },
   'top-contender': {
    id: 'top-contender',
    name: 'Top Contender',
    description: 'Reached the Top 3 on the leaderboard.',
    icon: Trophy,
  },
  'first-win': {
    id: 'first-win',
    name: 'First Win',
    description: 'Won your first multiplayer match.',
    icon: Trophy,
  },
  'multiplayer-maestro': {
    id: 'multiplayer-maestro',
    name: 'Multiplayer Maestro',
    description: 'Played 10 multiplayer matches.',
    icon: Swords,
  },
};