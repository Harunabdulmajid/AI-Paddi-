import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Page } from '../types';
import { useTranslations } from '../i18n';
import { Quiz } from './Quiz';

type LessonState = 'reading' | 'quizzing';

export const Lesson: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Lesson component must be used within AppProvider");
    const { activeModuleId, setCurrentPage, setActiveModuleId, setUser } = context;
    const t = useTranslations();
    
    const [lessonState, setLessonState] = useState<LessonState>('reading');

    if (!activeModuleId) {
        // Fallback to prevent crashing if the page is loaded without a module
        setCurrentPage(Page.Dashboard);
        return null;
    }

    const moduleContent = t.curriculum[activeModuleId]?.lessonContent;

    if (!moduleContent) {
        return <div className="p-8 text-center text-red-500">Error: Lesson content not found for this module.</div>;
    }

    const handleCompleteLesson = () => {
        setUser(prevUser => {
            if (!activeModuleId) return prevUser;
            const alreadyCompleted = prevUser.completedModules.includes(activeModuleId);
            return {
                ...prevUser,
                points: prevUser.points + (alreadyCompleted ? 0 : 25),
                completedModules: alreadyCompleted ? prevUser.completedModules : [...prevUser.completedModules, activeModuleId],
            };
        });
        setCurrentPage(Page.Dashboard);
        setActiveModuleId(null);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4">{moduleContent.title}</h1>
                <p className="text-lg md:text-xl text-neutral-600 italic mb-8 border-l-4 border-primary pl-4">{moduleContent.introduction}</p>

                <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-6">
                    {moduleContent.sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 !mb-3">{section.heading}</h2>
                            <p className="whitespace-pre-line">{section.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">Key Takeaway</h3>
                    <p className="bg-primary/10 text-primary-dark font-medium p-6 rounded-xl">{moduleContent.summary}</p>
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
                    <Quiz quiz={moduleContent.quiz} onComplete={handleCompleteLesson} />
               )}
            </div>
        </div>
    );
};
