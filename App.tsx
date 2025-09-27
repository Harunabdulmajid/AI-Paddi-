import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Multiplayer } from './components/Multiplayer';
import { AiVsHumanGame } from './components/AiVsHumanGame';
import { Profile } from './components/Profile';
import { AppContextType, User, Language, Page, Badge, GameSession } from './types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslations } from './i18n';
import { Lesson } from './components/Lesson';
import { AppContext } from './context/AppContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Leaderboard } from './components/Leaderboard';
import { apiService } from './services/apiService';
import { Toast } from './components/Toast';
import { BADGES, CURRICULUM_MODULES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useLocalStorage<Language>('language', Language.English);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          const fetchedUser = await apiService.getUserByEmail(userEmail);
          setUser(fetchedUser);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem('userEmail');
        }
      }
      setIsLoading(false);
    };
    checkUserSession();
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('userEmail', newUser.email);
    } else {
      localStorage.removeItem('userEmail');
    }
  };
  
  const logout = () => {
    handleSetUser(null);
    setCurrentPage(Page.Dashboard);
    setActiveModuleId(null);
    setGameSession(null);
  };

  const awardBadge = async (badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    
    const badge = BADGES[badgeId];
    if (badge) {
        const updatedUser = await apiService.updateUser(user.email, {
            badges: [...user.badges, badgeId],
        });
        if (updatedUser) {
            setUser(updatedUser as User);
            setUnlockedBadge(badge);
            setTimeout(() => setUnlockedBadge(null), 5000); // Hide toast after 5s
        }
    }
  };

  const addPoints = async (pointsToAdd: number) => {
    if (!user) return;
    const oldPoints = user.points;
    const newPoints = oldPoints + pointsToAdd;
    const updatedUser = await apiService.updateUser(user.email, { points: newPoints });
    if (updatedUser) {
      setUser(updatedUser as User);
      // Award badge if they cross 100 points
      if(oldPoints < 100 && newPoints >= 100) {
        awardBadge('point-pioneer');
      }
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!user || user.completedModules.includes(moduleId)) return;

    const updatedCompletedModules = [...user.completedModules, moduleId];

    const updatedUser = await apiService.updateUser(user.email, {
        points: user.points + 25,
        completedModules: updatedCompletedModules,
    });
    if (updatedUser) {
      setUser(updatedUser as User);
      // Award badges based on progress
      if(updatedCompletedModules.length === 1) {
        awardBadge('first-step');
      }
      if(updatedCompletedModules.length === CURRICULUM_MODULES.length) {
        awardBadge('ai-graduate');
      }
    }
  };

  const contextValue: AppContextType = {
    user,
    setUser: handleSetUser,
    logout,
    language,
    setLanguage,
    currentPage,
    setCurrentPage,
    activeModuleId,
    setActiveModuleId,
    addPoints,
    completeModule,
    awardBadge,
    gameSession,
    setGameSession,
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
        case Page.Dashboard:
            return <Dashboard />;
        case Page.Multiplayer:
            return <Multiplayer />;
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
        <div className="min-h-screen flex flex-col bg-neutral-100">
            <Header />
            <div className="flex-grow flex flex-col">
                 {currentPage !== Page.Dashboard && (
                    <div className="container mx-auto pt-6 px-4 md:px-8">
                         <button onClick={() => {
                             setCurrentPage(Page.Dashboard);
                             setActiveModuleId(null);
                             setGameSession(null); // Clear game session when leaving a sub-page
                            }} className="flex items-center gap-2 text-md font-bold text-neutral-600 hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                            {t.common.backToDashboard}
                        </button>
                    </div>
                )}
                <div className="flex-grow">
                  {children}
                </div>
            </div>
             <footer className="text-center p-4 md:p-6 text-sm text-neutral-500 border-t border-neutral-200 mt-auto">
                {t.common.footer(new Date().getFullYear())}
            </footer>
        </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 text-neutral-600">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="mt-4 text-lg font-semibold">Loading your session...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
        {unlockedBadge && <Toast badge={unlockedBadge} />}
        {!user ? (
            <Onboarding />
        ) : (
            <PageWrapper>
                {renderCurrentPage()}
            </PageWrapper>
        )}
    </AppContext.Provider>
  );
};

export default App;