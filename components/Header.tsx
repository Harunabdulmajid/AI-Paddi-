
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Language, LearningPath } from '../types';
import { Award, GraduationCap, Languages } from 'lucide-react';
import { useTranslations } from '../i18n';

const getLevelBadgeClass = (level: LearningPath | null) => {
  switch (level) {
    case LearningPath.Beginner:
      return 'bg-green-100 text-green-800';
    case LearningPath.Intermediate:
      return 'bg-blue-100 text-blue-800';
    case LearningPath.Advanced:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-neutral-200 text-neutral-800';
  }
};

export const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('Header must be used within an AppProvider');
  const { user, language, setLanguage } = context;
  const t = useTranslations();

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-10 shadow-sm p-4 border-b border-neutral-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-neutral-800">AI Kasahorow</h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Award className="text-accent" size={22} />
            <span className="font-bold text-neutral-700 text-lg">{user.points} {t.common.pointsAbbr}</span>
          </div>
          {user.level && (
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getLevelBadgeClass(user.level)}`}
            >
              {t.levels[user.level]}
            </span>
          )}
          <div className="relative">
            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-700 font-medium focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
              aria-label="Select language"
            >
              {Object.values(Language).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
