import React from 'react';

export enum LearningPath {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum Language {
  English = 'English',
  Hausa = 'Hausa',
  Yoruba = 'Yoruba',
  Igbo = 'Igbo',
  Pidgin = 'Pidgin English',
  Swahili = 'Swahili',
  Amharic = 'Amharic',
  Zulu = 'Zulu',
  Shona = 'Shona',
  Somali = 'Somali',
}

export enum Page {
  Dashboard = 'Dashboard',
  Multiplayer = 'Multi-player',
  AiVsHuman = 'AI vs Human',
  Profile = 'Profile & Certificates',
  Lesson = 'Lesson',
  Leaderboard = 'Leaderboard',
}

export type Difficulty = 'Easy' | 'Hard';

export enum FeedbackType {
    Bug = 'Bug Report',
    Suggestion = 'Suggestion',
    General = 'General Feedback'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface MultiplayerStats {
    wins: number;
    gamesPlayed: number;
}

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  level: LearningPath | null;
  points: number;
  completedModules: string[];
  badges: string[];
  multiplayerStats: MultiplayerStats;
}

export interface Question {
  type: 'multiple-choice' | 'fill-in-the-blank';
  question: string;
  options: string[];
  correctAnswerIndex: number; // Unused for fill-in-the-blank
  answer?: string; // For fill-in-the-blank questions
  explanation: string;
}


export interface Quiz {
  questions: Question[];
}

export interface LessonContent {
  title: string;
  introduction: string;
  sections: { heading: string; content: string }[];
  summary: string;
  quiz: Quiz;
}


export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

// --- Multiplayer Types ---
export type GameStatus = 'waiting' | 'in-progress' | 'finished';

export interface Player {
    id: string;
    name: string;
    score: number;
    progressIndex: number;
    language: Language;
    streak: number;
}

export interface MultiplayerQuestion {
    id: string; // e.g., 'what-is-ai-q1'
    moduleId: string;
    questionIndexInModule: number;
}

export interface GameSession {
    code: string;
    hostId: string;
    status: GameStatus;
    players: Player[];
    questions: MultiplayerQuestion[];
    createdAt: number;
    currentQuestionIndex: number;
}
// --- End Multiplayer Types ---

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
  activeModuleId: string | null;
  setActiveModuleId: React.Dispatch<React.SetStateAction<string | null>>;
  addPoints: (points: number) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  awardBadge: (badgeId: string) => Promise<void>;
  gameSession: GameSession | null;
  setGameSession: React.Dispatch<React.SetStateAction<GameSession | null>>;
}