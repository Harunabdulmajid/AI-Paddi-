
import React, { useState, useContext } from 'react';
import { Bot, Loader2, Send, ArrowRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AppContext } from '../context/AppContext';
import { ChatMessage } from './ChatMessage';
import { useTranslations } from '../i18n';

export const Onboarding: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Onboarding must be used within an AppProvider");
  const { language, setUser, setIsOnboarded } = context;
  const t = useTranslations();

  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;

    setIsLoading(true);
    setEvaluation(null);

    const result = await geminiService.evaluateOnboardingAnswer(
      t.onboarding.triviaQuestion,
      answer,
      language
    );

    setEvaluation(result.explanation);
    setUser(prevUser => ({ ...prevUser, level: result.level, name: 'Learner' })); // Ensure name is set
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-neutral-800">{t.onboarding.welcome}</h1>
          <p className="text-neutral-500 mt-2 text-lg">{t.onboarding.prompt}</p>
        </div>
        
        <div className="space-y-6">
            <ChatMessage sender="ai" message={t.onboarding.triviaQuestion} avatar={<Bot size={24} />} />
            
            {answer && !evaluation && (
                 <ChatMessage sender="user" message={answer} avatar="You" />
            )}

            {isLoading && (
                 <div className="flex justify-center items-center gap-3 text-neutral-500 py-4">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span className="font-semibold text-lg">{t.onboarding.thinking}</span>
                </div>
            )}

            {evaluation && (
                <ChatMessage sender="ai" message={evaluation} avatar={<Bot size={24} />} />
            )}
        </div>

        {!evaluation && (
          <form onSubmit={handleSubmit} className="flex gap-4 items-start pt-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.onboarding.textAreaPlaceholder}
              className="flex-grow p-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none text-base"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !answer.trim()}
              className="flex-shrink-0 h-14 w-14 bg-primary text-white rounded-full flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-dark transition-transform active:scale-95"
              aria-label={t.onboarding.sendButtonLabel}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
            </button>
          </form>
        )}

         {evaluation && (
            <div className="text-center flex flex-col items-center gap-4 p-4 bg-secondary-light/20 border-l-4 border-secondary rounded-r-lg">
                <div>
                    <h3 className="font-bold text-secondary-dark text-lg">{t.onboarding.successTitle}</h3>
                    <p className="text-secondary-dark/80">{t.onboarding.successMessage}</p>
                </div>
                 <button 
                    onClick={() => setIsOnboarded(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-secondary text-white font-bold py-3 px-6 rounded-xl text-lg hover:opacity-90 transition-transform active:scale-95"
                 >
                    {t.onboarding.ctaButton} <ArrowRight size={22}/>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};