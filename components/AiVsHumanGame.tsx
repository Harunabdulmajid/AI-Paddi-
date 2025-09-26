
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { geminiService } from '../services/geminiService';
import { Loader2, Bot, User, RefreshCw } from 'lucide-react';
import { useTranslations } from '../i18n';

export const AiVsHumanGame: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AiVsHumanGame must be used within an AppProvider");
  const { language, user, setUser } = context;
  const t = useTranslations();
  
  const [content, setContent] = useState<{ text: string; isAi: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guess, setGuess] = useState<'ai' | 'human' | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setGuess(null);
    setResult(null);
    const newContent = await geminiService.generateAiVsHumanContent(language);
    setContent(newContent);
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleGuess = (madeGuess: 'ai' | 'human') => {
    if (!content || guess) return;
    setGuess(madeGuess);
    const correctGuess = (madeGuess === 'ai' && content.isAi) || (madeGuess === 'human' && !content.isAi);
    if (correctGuess) {
      setResult('correct');
      setUser(prev => ({ ...prev, points: prev.points + 10 }));
    } else {
      setResult('incorrect');
    }
  };

  const getResultClasses = () => {
    if (result === 'correct') return 'bg-green-100 border-green-400 text-green-900';
    if (result === 'incorrect') return 'bg-red-100 border-red-400 text-red-900';
    return 'bg-neutral-100 border-neutral-300 text-neutral-700';
  };
  
  const getButtonClasses = (buttonType: 'human' | 'ai') => {
    if (!guess) {
        return 'border-transparent hover:border-primary hover:bg-primary/10';
    }
    if (guess !== buttonType) {
        return 'border-transparent opacity-50';
    }
    // This is the button the user guessed
    if (result === 'correct') {
        return 'border-secondary bg-secondary/10';
    }
    if (result === 'incorrect') {
        return 'border-red-500 bg-red-500/10';
    }
    return 'border-transparent';
  }


  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-4xl font-extrabold text-neutral-800 mb-2">{t.game.title}</h2>
            <p className="text-neutral-500 mb-8 text-lg">{t.game.description}</p>

            <div className={`p-8 rounded-2xl min-h-[200px] flex items-center justify-center text-2xl italic font-medium border-2 ${getResultClasses()} transition-colors duration-300`}>
                {isLoading ? (
                    <Loader2 className="animate-spin text-primary" size={40} />
                ) : (
                    <blockquote className="transition-opacity duration-300 leading-relaxed">"{content?.text}"</blockquote>
                )}
            </div>

            {result && (
                <div className="mt-6">
                    <p className={`font-bold text-2xl ${result === 'correct' ? 'text-secondary' : 'text-red-600'}`}>
                        {result === 'correct' ? t.game.correct : t.game.incorrect}
                    </p>
                    <p className="text-md font-medium text-neutral-500">
                        {t.game.writtenBy(content?.isAi ? t.game.aiAuthor : t.game.humanAuthor)}
                    </p>
                </div>
            )}

            <div className={`mt-8 grid grid-cols-2 gap-6`}>
                <button
                    onClick={() => handleGuess('human')}
                    disabled={!!guess}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border-4 rounded-2xl bg-neutral-100 transition-all duration-300 disabled:cursor-not-allowed ${getButtonClasses('human')}`}
                >
                    <User size={48} className="text-neutral-600"/>
                    <span className="font-bold text-xl">{t.game.humanButton}</span>
                </button>
                 <button
                    onClick={() => handleGuess('ai')}
                    disabled={!!guess}
                    className={`flex flex-col items-center justify-center gap-3 p-6 border-4 rounded-2xl bg-neutral-100 transition-all duration-300 disabled:cursor-not-allowed ${getButtonClasses('ai')}`}
                >
                    <Bot size={48} className="text-neutral-600"/>
                    <span className="font-bold text-xl">{t.game.aiButton}</span>
                </button>
            </div>
            {guess && (
                 <button
                    onClick={fetchContent}
                    className="mt-8 flex items-center justify-center gap-3 w-full bg-primary text-white font-bold py-4 rounded-xl text-lg hover:bg-primary-dark transition-transform active:scale-95"
                >
                    <RefreshCw size={22} /> {t.game.playAgainButton}
                </button>
            )}
        </div>
    </div>
  );
};