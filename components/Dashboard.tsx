import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../constants';
import { ModuleCard } from './ModuleCard';
import { Page, Module } from '../types';
import { Mic, Sword, UserCircle, ArrowRight, BarChart3 } from 'lucide-react';
import { useTranslations } from '../i18n';

const FeatureButton: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="w-full text-left bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-neutral-50 transition-all duration-300 flex items-center gap-5 group">
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-bold text-neutral-800 text-lg">{title}</h3>
            <p className="text-base text-neutral-500">{description}</p>
        </div>
         <ArrowRight className="text-neutral-300 group-hover:text-primary transition-colors" size={24} />
    </button>
);


export const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Dashboard must be used within an AppProvider");
  const { user, setCurrentPage } = context;
  const t = useTranslations();

  const curriculumTopics: Module[] = CURRICULUM_MODULES.map(module => ({
    ...module,
    title: t.curriculum[module.id].title,
    description: t.curriculum[module.id].description,
  }));

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mb-10">
        <h2 className="text-5xl font-extrabold text-neutral-800">{t.dashboard.greeting(user.name)}</h2>
        <p className="text-neutral-500 mt-2 text-xl">{t.dashboard.subGreeting}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <FeatureButton 
            icon={<Mic size={32} />}
            title={t.dashboard.podcastTitle}
            description={t.dashboard.podcastDescription}
            onClick={() => setCurrentPage(Page.PodcastGenerator)}
        />
        <FeatureButton 
            icon={<Sword size={32} />}
            title={t.dashboard.gameTitle}
            description={t.dashboard.gameDescription}
            onClick={() => setCurrentPage(Page.AiVsHuman)}
        />
         <FeatureButton 
            icon={<UserCircle size={32} />}
            title={t.dashboard.profileTitle}
            description={t.dashboard.profileDescription}
            onClick={() => setCurrentPage(Page.Profile)}
        />
        <FeatureButton 
            icon={<BarChart3 size={32} />}
            title={t.dashboard.leaderboardTitle}
            description={t.dashboard.leaderboardDescription}
            onClick={() => setCurrentPage(Page.Leaderboard)}
        />
      </div>

      <div>
        <h3 className="text-3xl font-bold text-neutral-800 mb-6">{t.dashboard.learningPathTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {curriculumTopics.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </main>
  );
};