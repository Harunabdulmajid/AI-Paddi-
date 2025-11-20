import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle, XCircle, Mic, RefreshCw, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { useTranslations } from '../i18n';
import { AppContext } from './AppContext';
import { useSpeech } from '../services/hooks/useSpeech';

interface QuizProps {
  quiz: QuizType;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Quiz must be used within an AppProvider");
  const { addTransaction, isVoiceModeEnabled, language } = context;
  const { isListening, speak, startListening } = useSpeech();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastPointsAwarded, setLastPointsAwarded] = useState(0);
  const [quizScore, setQuizScore] = useState(0); // Track score for this specific quiz session
  const t = useTranslations();

  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Reset state when the quiz changes (e.g. new module loaded)
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setStreak(0);
    resetQuestionState();
  }, [quiz]);

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setInputValue('');
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      onComplete();
    }
  }, [currentQuestionIndex, quiz.questions.length, onComplete]);

  const handleSubmit = useCallback((answer: number | string) => {
    if (isAnswered) return;

    let isAnswerCorrect = false;
    if (currentQuestion.type === 'multiple-choice' && typeof answer === 'number') {
        setSelectedAnswer(answer);
        isAnswerCorrect = answer === currentQuestion.correctAnswerIndex;
    } else if (currentQuestion.type === 'fill-in-the-blank' && typeof answer === 'string') {
        setInputValue(answer);
        isAnswerCorrect = answer.toLowerCase().trim() === currentQuestion.answer?.toLowerCase().trim();
    }
    
    setIsAnswered(true);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
        const points = 10 + (streak * 2);
        setLastPointsAwarded(points);
        setQuizScore(prev => prev + points);
        addTransaction({
            type: 'earn',
            description: `Correct quiz answer`,
            amount: points
        });
        setStreak(prev => prev + 1);
        
        if (isVoiceModeEnabled) {
            speak(t.lesson.quizCorrect(points), language);
        }
    } else {
        setStreak(0);
        if (isVoiceModeEnabled) {
            speak(t.lesson.quizIncorrect, language);
        }
    }
  }, [isAnswered, currentQuestion, streak, addTransaction, isVoiceModeEnabled, speak, language, t]);

  const handleTryAgain = () => {
    resetQuestionState();
  };

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, currentQuestion.options.length);
  }, [currentQuestionIndex, currentQuestion.options.length]);

  const progressPercent = ((currentQuestionIndex + (isAnswered ? 1 : 0)) / quiz.questions.length) * 100;

  return (
    <div className="mt-8 animate-fade-in">
      {/* Quiz Header / Stats */}
      <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-200 flex items-center justify-between flex-wrap gap-4">
         <div className="flex-grow max-w-xs">
            <div className="flex justify-between text-xs font-bold text-neutral-500 mb-1">
                <span>Progress</span>
                <span>{currentQuestionIndex + 1} / {quiz.questions.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2.5">
                <div className="bg-secondary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
             {streak > 1 && (
                 <div className="flex items-center gap-1 text-orange-500 font-bold text-sm animate-pulse">
                     <span className="text-lg">🔥</span> {streak} Streak
                 </div>
             )}
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm">
                 <Award size={18} className="text-amber-500" />
                 <span className="font-bold text-neutral-800">{quizScore} pts</span>
             </div>
         </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-neutral-800 mb-6 leading-snug">{currentQuestion.question}</h2>

      {currentQuestion.type === 'multiple-choice' ? (
        <div role="radiogroup" className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;
            let buttonClass = 'bg-white hover:bg-neutral-50 border-neutral-200 shadow-sm';
            let icon = <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />;

            if (isAnswered) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-green-50 border-green-500 ring-1 ring-green-500';
                icon = <CheckCircle className="text-green-600" size={20} />;
              } else if (isSelected) {
                buttonClass = 'bg-red-50 border-red-500 ring-1 ring-red-500';
                icon = <XCircle className="text-red-600" size={20} />;
              } else {
                 buttonClass = 'bg-neutral-100 border-neutral-200 opacity-50';
              }
            } else if (isSelected) {
                buttonClass = 'bg-primary/5 border-primary ring-1 ring-primary';
                icon = <div className="w-5 h-5 rounded-full border-4 border-primary" />;
            }

            return (
              <button
                key={index}
                ref={(el) => { optionRefs.current[index] = el; }}
                onClick={() => handleSubmit(index)}
                disabled={isAnswered}
                role="radio"
                aria-checked={isSelected}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-base md:text-lg font-medium flex items-center justify-between group ${buttonClass}`}
              >
                <span className={isAnswered && !isCorrectAnswer && !isSelected ? 'text-neutral-400' : 'text-neutral-700'}>{option}</span>
                <div className="flex-shrink-0 ml-3">
                    {icon}
                </div>
              </button>
            );
          })}
        </div>
      ) : ( // Fill-in-the-blank
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(inputValue); }} className="flex flex-col sm:flex-row gap-3">
           <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.lesson.yourAnswer}
                disabled={isAnswered}
                className="flex-grow p-4 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg bg-white text-neutral-900 transition-shadow"
            />
            <button
                type="submit"
                disabled={isAnswered || !inputValue.trim()}
                className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-dark transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm"
            >
                {t.lesson.submitAnswer}
            </button>
        </form>
      )}

      {/* Feedback Section */}
      {isAnswered && (
         <div className={`mt-8 p-6 rounded-2xl border-2 animate-slide-up ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isCorrect ? <CheckCircle size={32} /> : <HelpCircle size={32} />}
                </div>
                <div className="flex-grow">
                    <h3 className={`text-lg font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? t.lesson.quizCorrect(lastPointsAwarded) : t.lesson.quizIncorrect}
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                        {currentQuestion.explanation}
                    </p>
                    {!isCorrect && currentQuestion.hint && (
                        <div className="mt-3 p-3 bg-white/60 rounded-lg border border-red-100 text-sm text-red-800">
                             <strong>Hint:</strong> {currentQuestion.hint}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                {!isCorrect ? (
                    <button
                        onClick={handleTryAgain}
                        className="flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-700 font-bold py-3 px-6 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                    >
                        <RefreshCw size={18}/> {t.lesson.tryAgainButton}
                    </button>
                ) : (
                     <button
                        onClick={handleNext}
                        className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-dark transition-transform active:scale-95 shadow-md shadow-primary/30"
                    >
                        {currentQuestionIndex === quiz.questions.length - 1 ? (
                            "Complete Lesson"
                        ) : (
                            t.lesson.nextQuestionButton
                        )}
                        <ArrowRight size={20} />
                    </button>
                )}
            </div>
         </div>
      )}
      
      {isVoiceModeEnabled && !isAnswered && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => {}} className="p-4 bg-neutral-100 rounded-full text-primary hover:bg-neutral-200 transition-colors">
                <Mic size={24} className={isListening ? 'animate-pulse' : ''} />
            </button>
        </div>
      )}
    </div>
  );
};
