import { BrainCircuit, BookOpen, Bot, ShieldCheck, Briefcase, Star, Award, Trophy, Swords, Zap, Paintbrush, Medal, GraduationCap, Users, MessageSquarePlus, RotateCcw, Image as ImageIcon, Palette, Gift, HeartHandshake, Leaf, Landmark, PenTool } from 'lucide-react';
import { Badge, MarketplaceItem, User, Language, LearningPath } from './types';

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

export const LEARNING_PATHS = {
  [LearningPath.Beginner]: {
    modules: ['what-is-ai', 'ai-in-daily-life'],
  },
  [LearningPath.Intermediate]: {
    modules: ['how-ai-works', 'risks-and-bias'],
  },
  [LearningPath.Advanced]: {
    modules: ['ai-and-jobs'],
  },
};

export const CAREER_PROFILES = [
  {
    id: 'agritech-specialist',
    icon: Leaf,
    relevantModuleIds: ['ai-in-daily-life', 'how-ai-works'],
  },
  {
    id: 'fintech-ml-engineer',
    icon: Landmark,
    relevantModuleIds: ['how-ai-works', 'risks-and-bias'],
  },
  {
    id: 'ai-content-creator',
    icon: PenTool,
    relevantModuleIds: ['what-is-ai', 'ai-in-daily-life'],
  },
  {
    id: 'ai-ethicist',
    icon: ShieldCheck,
    relevantModuleIds: ['risks-and-bias', 'ai-and-jobs'],
  }
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
    name: 'Practice Partner',
    description: 'Completed your first practice session with a peer.',
    icon: Users,
  },
  'multiplayer-maestro': {
    id: 'multiplayer-maestro',
    name: 'Practice Pro',
    description: 'Completed 10 peer-to-peer practice sessions.',
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
        isOwned: (user: User) => user.unlockedThemes.includes('dark'),
        payload: { unlockTheme: 'dark' },
    },
    {
        id: 'theme-savanna',
        category: 'Customization',
        title: 'Savanna Sunset Theme',
        description: 'A warm and vibrant theme inspired by the colors of the African savanna.',
        cost: 150,
        icon: Palette,
        isOwned: (user: User) => user.unlockedThemes.includes('savanna'),
        payload: { unlockTheme: 'savanna' },
    },
    {
        id: 'banner-afro',
        category: 'Customization',
        title: 'Afrofuturist Profile Banner',
        description: 'Give your profile a cool, futuristic look with this unique banner.',
        cost: 200,
        icon: ImageIcon,
        isOwned: (user: User) => user.unlockedBanners.includes('afrofuturist-banner'),
        payload: { unlockBanner: 'afrofuturist-banner' },
    },
    {
        id: 'voice-swahili',
        category: 'Customization',
        title: 'Unlock Swahili AI Voice',
        description: 'Experience the app with a natural-sounding Swahili narrator for the "Read Aloud" feature.',
        cost: 300,
        icon: Users,
        isOwned: (user: User) => user.unlockedVoices.includes(Language.Swahili),
        payload: { unlockVoice: Language.Swahili },
    },
    // Learning Boosters
    {
        id: 'booster-tutor-tokens',
        category: 'Learning Boosters',
        title: 'AI Tutor Session Pass (x3)',
        description: 'Get three passes to ask our AI Tutor a complex follow-up question on any lesson.',
        cost: 250,
        icon: MessageSquarePlus,
        payload: { addTutorTokens: 3 },
    },
    {
        id: 'booster-quiz-rewind',
        category: 'Learning Boosters',
        title: 'Quiz Rewind Tokens (x5)',
        description: 'Get five tokens that let you immediately retake a quiz you failed.',
        cost: 100,
        icon: RotateCcw,
        payload: { addQuizRewinds: 5 },
    },
    {
        id: 'booster-case-study',
        category: 'Learning Boosters',
        title: 'Unlock a Real-World Case Study',
        description: 'Purchase access to a special lesson on how AI is being used in your region.',
        cost: 300,
        icon: Zap,
        isComingSoon: true,
        payload: { packId: 'case-study-1' },
    },
    // Social Play
    {
        id: 'social-gift-item',
        category: 'Social Play',
        title: 'Gift an Item to a Friend',
        description: 'Purchase an item from the marketplace and send it to a fellow learner.',
        cost: 10,
        icon: Gift,
        isComingSoon: true,
        payload: {},
    },
     {
        id: 'social-cheer-friend',
        category: 'Social Play',
        title: 'Cheer a Friend',
        description: 'Send a small point bonus and a positive message to someone on the leaderboard.',
        cost: 25,
        icon: HeartHandshake,
        isComingSoon: true,
        payload: {},
    },
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