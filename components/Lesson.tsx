import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { Page, Badge, Language, LessonContent } from '../types';
import { useTranslations, englishTranslations } from '../i18n';
import { Quiz } from './Quiz';
import { TooltipTerm } from './TooltipTerm';
import { Award, PartyPopper, Loader2, Volume2 } from 'lucide-react';
import { BADGES } from '../constants';
import { BadgeIcon } from './BadgeIcon';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/db';

type LessonState = 'reading' | 'quizzing' | 'complete';

const CompletionModal: React.FC<{ onAcknowledge: () => void; points: number, unlockedBadgeIds: string[] }> = ({ onAcknowledge, points, unlockedBadgeIds }) => {
    const t = useTranslations();
    const unlockedBadges: Badge[] = unlockedBadgeIds.map(id => BADGES[id]).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all animate-slide-up">
                <PartyPopper className="text-accent mx-auto" size={48} />
                <h2 className="text-3xl font-extrabold text-neutral-800 mt-4">{t.lesson.completionModalTitle}</h2>
                <p className="text-lg text-secondary font-bold mt-4 flex items-center justify-center gap-2">
                    <Award size={24} /> {t.lesson.completionModalPoints(points)}
                </p>
                {unlockedBadges.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-bold text-neutral-700">{t.lesson.badgeUnlocked}</h3>
                        <div className="flex justify-center gap-4 mt-2">
                            {unlockedBadges.map(badge => (
                                <BadgeIcon key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                )}
                <button 
                    onClick={onAcknowledge}
                    className="mt-8 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl text-lg transition-transform active:scale-95"
                >
                    {t.lesson.returnToDashboardButton}
                </button>
            </div>
        </div>
    );
};

export const Lesson: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Lesson component must be used within AppProvider");
    const { activeModuleId, setCurrentPage, setActiveModuleId, completeModule, user, language, isOnline, isVoiceModeEnabled, speak } = context;
    const t = useTranslations();
    
    const [lessonState, setLessonState] = useState<LessonState>('reading');
    const [unlockedBadgesOnComplete, setUnlockedBadgesOnComplete] = useState<string[]>([]);

    const [dynamicContent, setDynamicContent] = useState<Omit<LessonContent, 'quiz' | 'title'> | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [isOfflineContent, setIsOfflineContent] = useState(false);

    const initialBadges = user?.badges || [];
    const staticModuleContent = activeModuleId ? t.curriculum[activeModuleId]?.lessonContent : null;
    const englishModuleContent = activeModuleId ? englishTranslations.curriculum[activeModuleId]?.lessonContent : null;

    useEffect(() => {
        const fetchContent = async () => {
            if (!activeModuleId || !englishModuleContent) {
                 setIsLoadingContent(false);
                 return;
            }
            
            setIsLoadingContent(true);
            setIsOfflineContent(false);

            // Try fetching from offline DB first
            const offlineContent = await dbService.getContent(activeModuleId, language);
            if (offlineContent) {
                setDynamicContent(offlineContent);
                setIsOfflineContent(true);
                setIsLoadingContent(false);
                return;
            }

            // If not available offline and user is offline, show message
            if (!isOnline) {
                setDynamicContent(null);
                setIsLoadingContent(false);
                return;
            }

            // Fetch from API if online
            try {
                if (language === Language.English) {
                    const { title, quiz, ...content } = englishModuleContent;
                    setDynamicContent(content);
                } else {
                    const { title, quiz, ...contentToTranslate } = englishModuleContent;
                    const generatedContent = await geminiService.generateDynamicLessonContent(contentToTranslate, language);
                    setDynamicContent(generatedContent);
                }
            } catch (error) {
                console.error("Failed to generate dynamic content, falling back to static translations.", error);
                if (staticModuleContent) {
                    const { title, quiz, ...staticContent } = staticModuleContent;
                    setDynamicContent(staticContent);
                }
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchContent();
    }, [activeModuleId, language, isOnline, staticModuleContent, englishModuleContent]);

    useEffect(() => {
      if (lessonState === 'complete' && user) {
        const newBadges = user.badges.filter(b => !initialBadges.includes(b));
        setUnlockedBadgesOnComplete(newBadges);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonState, user?.badges]);

    if (!activeModuleId) {
        setCurrentPage(Page.Dashboard);
        return null;
    }
    
    if (isLoadingContent) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="mt-4 text-lg font-semibold text-neutral-600">Loading lesson...</p>
                </div>
            </div>
        );
    }
    
    if (!dynamicContent) {
        return (
             <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center min-h-[50vh] flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-neutral-700">{t.offline.notAvailable}</h2>
                    <p className="text-neutral-500 mt-2">Please connect to the internet to view or download this lesson.</p>
                </div>
            </div>
        )
    }

    const displayContent = { ...dynamicContent, title: staticModuleContent!.title, quiz: staticModuleContent!.quiz };

    const handleCompleteQuiz = async () => {
        if (activeModuleId && user && !user.completedModules.includes(activeModuleId)) {
            await completeModule(activeModuleId);
        }
        setLessonState('complete');
    };

    const handleAcknowledgeCompletion = () => {
        setCurrentPage(Page.Dashboard);
        setActiveModuleId(null);
    }
    
    const handleSpeak = (text: string) => {
        speak(text, language);
    };

    const renderContentWithTooltips = (text: string) => {
        const tooltips = t.tooltips;
        const terms = Object.keys(tooltips);
        if (!tooltips || terms.length === 0) return text;
    
        const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
        const parts = text.split(regex);
    
        return parts.map((part, index) => {
          const lowerPart = part.toLowerCase();
          if (terms.includes(lowerPart)) {
            return <TooltipTerm key={`${part}-${index}`} term={part} definition={tooltips[lowerPart]} />;
          }
          return part;
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {lessonState === 'complete' && <CompletionModal onAcknowledge={handleAcknowledgeCompletion} points={25} unlockedBadgeIds={unlockedBadgesOnComplete} />}
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4">{displayContent.title}</h1>
                <div className="group flex gap-2 items-start">
                    <p className="text-lg md:text-xl text-neutral-600 italic border-l-4 border-primary pl-4">{renderContentWithTooltips(displayContent.introduction)}</p>
                     {isVoiceModeEnabled && <button onClick={() => handleSpeak(displayContent.introduction)} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-primary p-1" aria-label={t.lesson.readAloud}><Volume2/></button>}
                </div>

                <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-6 mt-8">
                    {displayContent.sections.map((section, index) => (
                        <div key={index} className="group">
                             <div className="flex gap-2 items-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 !mb-3">{section.heading}</h2>
                                {isVoiceModeEnabled && <button onClick={() => handleSpeak(section.heading + ". " + section.content)} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-primary" aria-label={t.lesson.readAloud}><Volume2/></button>}
                             </div>
                            <p className="whitespace-pre-line mt-6">{renderContentWithTooltips(section.content)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200 group">
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">Key Takeaway</h3>
                    <div className="flex gap-2 items-start">
                        <p className="bg-primary/10 text-primary-dark font-medium p-6 rounded-xl flex-grow">{renderContentWithTooltips(displayContent.summary)}</p>
                        {isVoiceModeEnabled && <button onClick={() => handleSpeak(displayContent.summary)} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-primary p-1 mt-4" aria-label={t.lesson.readAloud}><Volume2/></button>}
                    </div>
                </div>
                
                {lessonState === 'reading' && (
                     <div className="mt-12 text-center">
                        <button 
                            onClick={() => setLessonState('quizzing')}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl text-lg transition-transform active:scale-95"
                        >
                            {t.lesson.startQuizButton}
                        </button>
                    </div>
                )}
               
               {lessonState === 'quizzing' && (
                    <Quiz quiz={displayContent.quiz} onComplete={handleCompleteQuiz} />
               )}
            </div>
        </div>
    );
};