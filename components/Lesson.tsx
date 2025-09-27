import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Page, Badge, Language, LessonContent } from '../types';
import { useTranslations, englishTranslations } from '../i18n';
import { Quiz } from './Quiz';
import { TooltipTerm } from './TooltipTerm';
import { Award, PartyPopper, Loader2 } from 'lucide-react';
import { BADGES } from '../constants';
import { BadgeIcon } from './BadgeIcon';
import { geminiService } from '../services/geminiService';

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
    const { activeModuleId, setCurrentPage, setActiveModuleId, completeModule, user, language } = context;
    const t = useTranslations();
    
    const [lessonState, setLessonState] = useState<LessonState>('reading');
    const [unlockedBadgesOnComplete, setUnlockedBadgesOnComplete] = useState<string[]>([]);

    const [dynamicContent, setDynamicContent] = useState<Omit<LessonContent, 'quiz' | 'title'> | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    const [sectionImages, setSectionImages] = useState<Record<string, string | null>>({});

    const initialBadges = user?.badges || [];
    const staticModuleContent = activeModuleId ? t.curriculum[activeModuleId]?.lessonContent : null;
    const englishModuleContent = activeModuleId ? englishTranslations.curriculum[activeModuleId]?.lessonContent : null;

    useEffect(() => {
        const generateContent = async () => {
            if (!englishModuleContent) {
                setIsLoadingContent(false);
                return;
            }

            setIsLoadingContent(true);
            try {
                // For English, use the source of truth directly without an API call.
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
                // On failure, use the pre-translated static content as a fallback.
                if (staticModuleContent) {
                    const { title, quiz, ...staticContent } = staticModuleContent;
                    setDynamicContent(staticContent);
                }
            } finally {
                setIsLoadingContent(false);
            }
        };

        if (activeModuleId) {
            generateContent();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeModuleId, language]);

    useEffect(() => {
      // Logic to determine which badges were newly unlocked after this lesson
      if (lessonState === 'complete' && user) {
        const newBadges = user.badges.filter(b => !initialBadges.includes(b));
        setUnlockedBadgesOnComplete(newBadges);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonState, user?.badges]);

    useEffect(() => {
        const generateImages = async () => {
            if (!activeModuleId || isLoadingContent || !dynamicContent) return;
    
            if (!englishModuleContent) return;
    
            const sections = dynamicContent.sections;
            const initialImageState = sections.reduce((acc, section) => {
                acc[section.heading] = null; // null indicates loading
                return acc;
            }, {} as Record<string, string | null>);
            setSectionImages(initialImageState);
    
            for (let i = 0; i < sections.length; i++) {
                const currentSection = sections[i];
                // Use the English source text for the image prompt for consistency and better results.
                const englishSection = englishModuleContent.sections[i];
    
                if (!englishSection) continue;

                try {
                    const prompt = `A simple, flat, colorful illustration for an educational app about AI. The topic is "${englishSection.heading}". The image should visually represent the concept of: "${englishSection.content.substring(0, 150)}...". The style should be clean, modern, and engaging for learners. No text in the image.`;
                    const imageDataUrl = await geminiService.generateImageForLesson(prompt);
                    setSectionImages(prev => ({ ...prev, [currentSection.heading]: imageDataUrl }));
                } catch (error) {
                    console.error(`Failed to generate image for section "${currentSection.heading}":`, error);
                    setSectionImages(prev => ({ ...prev, [currentSection.heading]: '' })); // Empty string indicates error
                }
            }
        };
    
        if (!isLoadingContent) {
            generateImages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeModuleId, isLoadingContent, dynamicContent]);

    if (!activeModuleId) {
        // Fallback to prevent crashing if the page is loaded without a module
        setCurrentPage(Page.Dashboard);
        return null;
    }
    
    if (!staticModuleContent) {
        return <div className="p-8 text-center text-red-500">Error: Lesson content not found for this module.</div>;
    }

    if (isLoadingContent) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="mt-4 text-lg font-semibold text-neutral-600">Creating your personalized lesson...</p>
                </div>
            </div>
        );
    }
    
    // Use dynamic content if available, otherwise fall back to static
    const displayContent = dynamicContent 
        ? { ...dynamicContent, title: staticModuleContent.title, quiz: staticModuleContent.quiz } 
        : staticModuleContent;

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
                <p className="text-lg md:text-xl text-neutral-600 italic mb-8 border-l-4 border-primary pl-4">{renderContentWithTooltips(displayContent.introduction)}</p>

                <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-6">
                    {displayContent.sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 !mb-3">{section.heading}</h2>
                             <div className="my-6 aspect-video bg-neutral-100 rounded-xl flex items-center justify-center overflow-hidden border border-neutral-200">
                                {sectionImages[section.heading] === null && (
                                    <div className="animate-pulse w-full h-full bg-neutral-200 flex flex-col items-center justify-center">
                                        <Loader2 className="animate-spin text-neutral-500" size={32} />
                                        <span className="mt-3 text-neutral-500 font-semibold">Generating illustration...</span>
                                    </div>
                                )}
                                {sectionImages[section.heading] && (
                                    <img src={sectionImages[section.heading]} alt={`Illustration for ${section.heading}`} className="w-full h-full object-cover" />
                                )}
                                {sectionImages[section.heading] === '' && (
                                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                        <span className="text-neutral-500">Could not load image.</span>
                                    </div>
                                )}
                            </div>
                            <p className="whitespace-pre-line">{renderContentWithTooltips(section.content)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">Key Takeaway</h3>
                    <p className="bg-primary/10 text-primary-dark font-medium p-6 rounded-xl">{renderContentWithTooltips(displayContent.summary)}</p>
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