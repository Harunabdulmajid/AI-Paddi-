import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { AppContext } from './AppContext';
import { Page, Badge, Language, LessonContent } from '../types';
import { useTranslations, englishTranslations } from '../i18n';
import { Quiz } from './Quiz';
import { TooltipTerm } from './TooltipTerm';
import { Award, PartyPopper, Loader2, Volume2, StopCircle, Construction, ArrowRight, BookOpen, Home } from 'lucide-react';
import { BADGES, CURRICULUM_MODULES } from '../constants';
import { BadgeIcon } from './BadgeIcon';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/db';

type LessonState = 'reading' | 'quizzing' | 'complete';

interface CompletionModalProps { 
    onAcknowledge: () => void; 
    onNextLesson: () => void;
    points: number; 
    unlockedBadgeIds: string[];
    nextLessonTitle?: string;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ onAcknowledge, onNextLesson, points, unlockedBadgeIds, nextLessonTitle }) => {
    const t = useTranslations();
    const unlockedBadges: Badge[] = unlockedBadgeIds.map(id => BADGES[id]).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all animate-slide-up border-4 border-primary/20">
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-4 text-green-600 shadow-inner">
                    <PartyPopper size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 mt-2">{t.lesson.completionModalTitle}</h2>
                
                <div className="my-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider mb-1">Rewards Earned</p>
                    <p className="text-3xl font-black text-secondary flex items-center justify-center gap-2">
                        <Award size={32} /> {t.lesson.completionModalPoints(points)}
                    </p>
                </div>

                {unlockedBadges.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-neutral-700 mb-3 flex items-center justify-center gap-2">
                            <Award size={18} className="text-accent"/> {t.lesson.badgeUnlocked}
                        </h3>
                        <div className="flex justify-center gap-4">
                            {unlockedBadges.map(badge => (
                                <div key={badge.id} className="transform hover:scale-110 transition-transform">
                                    <BadgeIcon badge={badge} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {nextLessonTitle && (
                        <button 
                            onClick={onNextLesson}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <span>Next: {nextLessonTitle}</span>
                            <ArrowRight size={22} />
                        </button>
                    )}
                    <button 
                        onClick={onAcknowledge}
                        className="w-full bg-transparent hover:bg-neutral-100 text-neutral-600 font-bold py-3 px-6 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        {t.lesson.returnToDashboardButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper to decode base64 string to Uint8Array
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

export const Lesson: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Lesson component must be used within AppProvider");
    const { activeModuleId, setCurrentPage, setActiveModuleId, completeModule, user, language, isOnline } = context;
    const t = useTranslations();
    
    const [lessonState, setLessonState] = useState<LessonState>('reading');
    const [unlockedBadgesOnComplete, setUnlockedBadgesOnComplete] = useState<string[]>([]);

    const [dynamicContent, setDynamicContent] = useState<Omit<LessonContent, 'quiz' | 'title'> | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    
    // Track loaded module to prevent unnecessary re-fetching/loading states
    const loadedModuleRef = useRef<{ id: string, lang: Language } | null>(null);
    
    // TTS State
    const [speakingSectionKey, setSpeakingSectionKey] = useState<string | null>(null);
    const [isTTSLoading, setIsTTSLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const initialBadges = user?.badges || [];
    const staticModuleContent = activeModuleId ? t.curriculum[activeModuleId]?.lessonContent : null;
    const englishModuleContent = activeModuleId ? englishTranslations.curriculum[activeModuleId]?.lessonContent : null;

    // Calculate Next Module
    const nextModule = useMemo(() => {
        if (!activeModuleId) return null;
        const currentIndex = CURRICULUM_MODULES.findIndex(m => m.id === activeModuleId);
        if (currentIndex !== -1 && currentIndex < CURRICULUM_MODULES.length - 1) {
            const nextId = CURRICULUM_MODULES[currentIndex + 1].id;
            return {
                id: nextId,
                title: t.curriculum[nextId]?.title || 'Next Lesson'
            };
        }
        return null;
    }, [activeModuleId, t]);

    useEffect(() => {
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        }
        return () => {
            activeSourceRef.current?.stop();
            audioContextRef.current?.close().catch(console.error);
        };
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            // If we are already loaded for this module and language, DO NOT trigger loading state
            if (
                loadedModuleRef.current && 
                loadedModuleRef.current.id === activeModuleId && 
                loadedModuleRef.current.lang === language
            ) {
                return;
            }

            if (!activeModuleId) {
                 setIsLoadingContent(false);
                 return;
            }
            
            setIsLoadingContent(true);
            setLessonState('reading'); // Reset state when module changes

            // Local variable to use inside async context, avoiding dependency on the unstable 'englishModuleContent' object
            const currentEnglishContent = englishTranslations.curriculum[activeModuleId]?.lessonContent;

            if (!currentEnglishContent) {
                setIsLoadingContent(false);
                return;
            }

            // Try fetching from offline DB first
            const offlineContent = await dbService.getContent(activeModuleId, language);
            if (offlineContent) {
                setDynamicContent(offlineContent);
                loadedModuleRef.current = { id: activeModuleId, lang: language };
                setIsLoadingContent(false);
                return;
            }

            // If not available offline and user is offline, show message
            if (!isOnline) {
                setDynamicContent(null);
                loadedModuleRef.current = { id: activeModuleId, lang: language };
                setIsLoadingContent(false);
                return;
            }

            // Fetch from API if online
            try {
                if (language === Language.English) {
                    const { title, quiz, ...content } = currentEnglishContent;
                    setDynamicContent(content);
                } else {
                    const { title, quiz, ...contentToTranslate } = currentEnglishContent;
                    const generatedContent = await geminiService.generateDynamicLessonContent(contentToTranslate, language);
                    setDynamicContent(generatedContent);
                }
                loadedModuleRef.current = { id: activeModuleId, lang: language };
            } catch (error) {
                console.error("Failed to generate dynamic content, falling back to static translations.", error);
                // Fallback logic using the translation hook data
                const fallbackContent = t.curriculum[activeModuleId]?.lessonContent;
                if (fallbackContent) {
                    const { title, quiz, ...staticContent } = fallbackContent;
                    setDynamicContent(staticContent);
                }
                loadedModuleRef.current = { id: activeModuleId, lang: language };
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchContent();
    }, [activeModuleId, language, isOnline, t]);

    useEffect(() => {
      if (lessonState === 'complete' && user) {
        const newBadges = user.badges.filter(b => !initialBadges.includes(b));
        setUnlockedBadgesOnComplete(newBadges);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonState, user?.badges]);

    const playRawAudio = async (pcmData: Uint8Array) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;
    
        if (activeSourceRef.current) {
            activeSourceRef.current.stop();
        }
    
        const dataInt16 = new Int16Array(pcmData.buffer);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000); // 1 channel, 24000 sample rate
        const channelData = buffer.getChannelData(0);
    
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0; // convert from Int16 to Float32 range [-1, 1]
        }
    
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
        activeSourceRef.current = source;
        
        source.onended = () => {
            if (activeSourceRef.current === source) {
                setSpeakingSectionKey(null);
                activeSourceRef.current = null;
            }
        };
    };

    const handleReadAloud = async (sectionKey: string, text: string) => {
        if (speakingSectionKey === sectionKey) { // Clicked on the currently playing/loading section
            if (activeSourceRef.current) {
                activeSourceRef.current.stop();
            }
            setSpeakingSectionKey(null);
            setIsTTSLoading(false);
            return;
        }

        if (activeSourceRef.current) {
            activeSourceRef.current.stop();
        }

        setSpeakingSectionKey(sectionKey);
        setIsTTSLoading(true);

        try {
            const base64Audio = await geminiService.generateSpeech(text);
            const pcmData = decode(base64Audio);
            if (speakingSectionKey === sectionKey) { // Check if user hasn't clicked another button while loading
                await playRawAudio(pcmData);
            }
        } catch (error) {
            console.error("Failed to generate or play speech:", error);
            alert("Sorry, there was a problem reading this aloud.");
            setSpeakingSectionKey(null);
        } finally {
            setIsTTSLoading(false);
        }
    };
    
    const displayContent = useMemo(() => {
        if (!dynamicContent || !staticModuleContent) return null;
        return { ...dynamicContent, title: staticModuleContent.title, quiz: staticModuleContent.quiz };
    }, [dynamicContent, staticModuleContent]);

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
    
    if (!displayContent) {
        return (
             <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center min-h-[50vh] flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-neutral-700">{t.offline.notAvailable}</h2>
                    <p className="text-neutral-500 mt-2">Please connect to the internet to view or download this lesson.</p>
                </div>
            </div>
        )
    }

    const handleCompleteQuiz = async () => {
        if (activeModuleId && user && !user.completedModules.includes(activeModuleId)) {
            await completeModule(activeModuleId);
        }
        setLessonState('complete');
    };

    const handleAcknowledgeCompletion = () => {
        setCurrentPage(Page.Dashboard);
        setActiveModuleId(null);
    };

    const handleNextLesson = () => {
        if (nextModule) {
            setActiveModuleId(nextModule.id);
            // The useEffect will handle resetting state and fetching new content
        } else {
            handleAcknowledgeCompletion();
        }
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
    
    const ReadAloudButton: React.FC<{ sectionKey: string; text: string; }> = ({ sectionKey, text }) => {
        const isSpeakingThis = speakingSectionKey === sectionKey;
        const isLoadingThis = isSpeakingThis && isTTSLoading;
        const isPlayingThis = isSpeakingThis && !isTTSLoading;

        return (
            <button 
                onClick={() => handleReadAloud(sectionKey, text)} 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-primary p-1 disabled:cursor-not-allowed"
                aria-label={t.lesson.readAloud}
                disabled={isTTSLoading && !isSpeakingThis}
            >
                {isLoadingThis ? <Loader2 className="animate-spin"/> : isPlayingThis ? <StopCircle/> : <Volume2/>}
            </button>
        );
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {lessonState === 'complete' && (
                <CompletionModal 
                    onAcknowledge={handleAcknowledgeCompletion} 
                    onNextLesson={handleNextLesson}
                    points={25} 
                    unlockedBadgeIds={unlockedBadgesOnComplete} 
                    nextLessonTitle={nextModule?.title}
                />
            )}
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4">{displayContent.title}</h1>
                <div className="group flex gap-2 items-start">
                    <p className="text-lg md:text-xl text-neutral-600 italic border-l-4 border-primary pl-4">{renderContentWithTooltips(displayContent.introduction)}</p>
                    <ReadAloudButton sectionKey="introduction" text={displayContent.introduction} />
                </div>

                <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-6 mt-8">
                    {displayContent.sections.map((section, index) => (
                        <div key={index} className="group">
                             <div className="flex gap-2 items-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 !mb-3">{section.heading}</h2>
                                <ReadAloudButton sectionKey={`section-${index}`} text={`${section.heading}. ${section.content}`} />
                             </div>
                            <p className="whitespace-pre-line mt-6">{renderContentWithTooltips(section.content)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200 group">
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">Key Takeaway</h3>
                    <div className="flex gap-2 items-start">
                        <p className="bg-primary/10 text-primary-dark font-medium p-6 rounded-xl flex-grow">{renderContentWithTooltips(displayContent.summary)}</p>
                        <ReadAloudButton sectionKey="summary" text={displayContent.summary} />
                    </div>
                </div>
                
                {lessonState === 'reading' && (
                     <div className="mt-12 text-center">
                        <button 
                            onClick={() => setLessonState('quizzing')}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl text-lg transition-transform active:scale-95 shadow-lg shadow-primary/30"
                        >
                            {t.lesson.startQuizButton}
                        </button>
                    </div>
                )}
               
               {lessonState === 'quizzing' && (
                   <div className="mt-8 p-8 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 text-center animate-fade-in">
                       <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Construction size={32} />
                       </div>
                       <h2 className="text-2xl font-bold text-neutral-800 mb-2">Quiz Upgrade in Progress</h2>
                       <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                           We are improving the quiz experience to make learning smoother and more interactive. This feature is temporarily unavailable.
                       </p>
                       <button
                           onClick={handleCompleteQuiz}
                           className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl text-lg transition-transform active:scale-95 flex items-center gap-2 mx-auto shadow-lg shadow-primary/30"
                       >
                           Complete Lesson <ArrowRight size={20} />
                       </button>
                   </div>
               )}
            </div>
        </div>
    );
};
