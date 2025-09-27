import React from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { PodcastGenerator } from './components/PodcastGenerator';
import { AiVsHumanGame } from './components/AiVsHumanGame';
import { Profile } from './components/Profile';
import { AppContextType, User, Language, Page } from './types';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from './i18n';
import { Lesson } from './components/Lesson';
import { AppContext } from './context/AppContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Leaderboard } from './components/Leaderboard';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User>('user', {
    name: 'Learner',
    level: null,
    points: 0,
    completedModules: [],
  });
  const [language, setLanguage] = useLocalStorage<Language>('language', Language.English);
  const [currentPage, setCurrentPage] = useLocalStorage<Page>('currentPage', Page.Dashboard);
  const [isOnboarded, setIsOnboarded] = useLocalStorage<boolean>('isOnboarded', false);
  const [activeModuleId, setActiveModuleId] = useLocalStorage<string | null>('activeModuleId', null);

  const contextValue: AppContextType = {
    user,
    setUser,
    language,
    setLanguage,
    currentPage,
    setCurrentPage,
    isOnboarded,
    setIsOnboarded,
    activeModuleId,
    setActiveModuleId,
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
        case Page.Dashboard:
            return <Dashboard />;
        case Page.PodcastGenerator:
            return <PodcastGenerator />;
        case Page.AiVsHuman:
            return <AiVsHumanGame />;
        case Page.Profile:
            return <Profile />;
        case Page.Lesson:
            return <Lesson />;
        case Page.Leaderboard:
            return <Leaderboard />;
        default:
            return <Dashboard />;
    }
  }

  const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const t = useTranslations();
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col">
                 {currentPage !== Page.Dashboard && (
                    <div className="container mx-auto pt-6 px-4 md:px-8">
                         <button onClick={() => {
                             setCurrentPage(Page.Dashboard);
                             setActiveModuleId(null);
                            }} className="flex items-center gap-2 text-md font-bold text-neutral-600 hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                            {t.common.backToDashboard}
                        </button>
                    </div>
                )}
                {children}
            </div>
             <footer className="text-center p-6 text-sm text-neutral-500 border-t border-neutral-200 mt-auto">
                {t.common.footer(new Date().getFullYear())}
            </footer>
        </div>
    );
  };


  if (!isOnboarded) {
    return (
        <AppContext.Provider value={contextValue}>
            <Onboarding />
        </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
        <PageWrapper>
          {renderCurrentPage()}
        </PageWrapper>
    </AppContext.Provider>
  );
};

export default App;