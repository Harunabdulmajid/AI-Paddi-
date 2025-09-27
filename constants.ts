import { BrainCircuit, BookOpen, Bot, ShieldCheck, Briefcase, Star, Award, Trophy, Swords, Zap, Paintbrush, Medal, GraduationCap, Users } from 'lucide-react';
import { Badge, MarketplaceItem, User } from './types';

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
  'bronze-supporter': {
      id: 'bronze-supporter',
      name: 'Bronze Supporter',
      description: 'Show your support for AI literacy by purchasing this badge.',
      icon: Medal,
      cost: 200,
  },
  'silver-patron': {
      id: 'silver-patron',
      name: 'Silver Patron',
      description: 'A badge for dedicated patrons of accessible education.',
      icon: Medal,
      cost: 500,
  },
  'gold-champion': {
      id: 'gold-champion',
      name: 'Gold Champion',
      description: 'The highest honor for champions of our mission.',
      icon: Medal,
      cost: 1000,
  }
};

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
    // Recognition
    {
        id: 'upgrade-certificate',
        category: 'Recognition',
        title: 'Upgrade to Certificate of Distinction',
        description: 'Add a mark of distinction to your AI Literacy certificate.',
        cost: 750,
        icon: GraduationCap,
        isOwned: (user: User) => user.certificateLevel === 'distinction',
        payload: { certificateLevel: 'distinction' },
    },
    {
        id: 'buy-badge-bronze',
        category: 'Recognition',
        title: 'Bronze Supporter Badge',
        description: 'Show your support and get a shiny bronze badge for your profile.',
        cost: BADGES['bronze-supporter'].cost!,
        icon: Medal,
        isOwned: (user: User) => user.badges.includes('bronze-supporter'),
        payload: { badgeId: 'bronze-supporter' },
    },
    {
        id: 'buy-badge-silver',
        category: 'Recognition',
        title: 'Silver Patron Badge',
        description: 'For those who go above and beyond in supporting our mission.',
        cost: BADGES['silver-patron'].cost!,
        icon: Medal,
        isOwned: (user: User) => user.badges.includes('silver-patron'),
        payload: { badgeId: 'silver-patron' },
    },
     {
        id: 'buy-badge-gold',
        category: 'Recognition',
        title: 'Gold Champion Badge',
        description: 'The ultimate badge for true champions of AI literacy for all.',
        cost: BADGES['gold-champion'].cost!,
        icon: Medal,
        isOwned: (user: User) => user.badges.includes('gold-champion'),
        payload: { badgeId: 'gold-champion' },
    },
    // Customization
    {
        id: 'theme-dark',
        category: 'Customization',
        title: 'Unlock Dark Mode Theme',
        description: 'Give your eyes a rest with a sleek and stylish dark theme.',
        cost: 150,
        icon: Paintbrush,
        isOwned: (user: User) => user.theme === 'dark',
        payload: { theme: 'dark' },
    },
    // Learning Boosters
    {
        id: 'booster-extra-quiz',
        category: 'Learning Boosters',
        title: 'Bonus Quiz Pack',
        description: 'Unlock a special set of challenging questions for each module.',
        cost: 300,
        icon: Zap,
        isComingSoon: true,
        payload: { packId: 'quiz-pack-1' },
    },
    // Social Play
    {
        id: 'social-sponsor-leaderboard',
        category: 'Social Play',
        title: 'Sponsor the Leaderboard',
        description: 'Highlight the leaderboard for a day with your name as a sponsor.',
        cost: 1000,
        icon: Users,
        isComingSoon: true,
        payload: {},
    },
];
