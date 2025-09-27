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
  PodcastGenerator = 'Podcast Generator',
  AiVsHuman = 'AI vs Human',
  Profile = 'Profile & Certificates',
  Lesson = 'Lesson',
  Leaderboard = 'Leaderboard',
}

export interface User {
  name: string;
  level: LearningPath | null;
  points: number;
  completedModules: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
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

export interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
  isOnboarded: boolean;
  setIsOnboarded: React.Dispatch<React.SetStateAction<boolean>>;
  activeModuleId: string | null;
  setActiveModuleId: React.Dispatch<React.SetStateAction<string | null>>;
}