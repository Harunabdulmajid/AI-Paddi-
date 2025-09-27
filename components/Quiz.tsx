import React, { useState, useContext } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useTranslations } from '../i18n';
import { AppContext } from '../context/AppContext';

interface QuizProps {
  quiz: QuizType;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Quiz must be used within an AppProvider");
  const { addPoints } = context;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const t = useTranslations();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleSubmitAnswer = (answer: number | string) => {
    if (isAnswered) return;

    let correct = false;
    if (currentQuestion.type === 'multiple-choice' && typeof answer === 'number') {
        setSelectedAnswer(answer);
        correct = answer === currentQuestion.correctAnswerIndex;
    } else if (currentQuestion.type === 'fill-in-the-blank' && typeof answer === 'string') {
        correct = answer.trim().toLowerCase() === currentQuestion.answer?.trim().toLowerCase();
    }
    
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
        const bonus = Math.min(10, streak * 2); // 2 bonus points per streak item, max 10
        addPoints(10 + bonus);
        setStreak(s => s + 1);
    } else {
        setStreak(0);
    }
  };


  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setInputValue('');
    } else {
      onComplete();
    }
  };

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-800">{t.lesson.quizTitle}</h3>
        {streak > 1 && (
            <div className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-sm animate-fade-in">
                {t.lesson.quizStreak(streak)}
            </div>
        )}
      </div>
      <div className="bg-neutral-50 p-6 rounded-xl">
        <p className="text-lg font-semibold text-neutral-700 mb-5">{currentQuestion.question}</p>
        
        {currentQuestion.type === 'multiple-choice' ? (
             <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'bg-white hover:bg-neutral-100 border-neutral-300';
                    if (isAnswered) {
                    if (index === currentQuestion.correctAnswerIndex) {
                        buttonClass = 'bg-green-100 border-green-400 text-green-800';
                    } else if (index === selectedAnswer) {
                        buttonClass = 'bg-red-100 border-red-400 text-red-800';
                    } else {
                        buttonClass = 'bg-neutral-100 border-neutral-200 opacity-60';
                    }
                    }

                    return (
                    <button
                        key={index}
                        onClick={() => handleSubmitAnswer(index)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all text-md flex items-center justify-between ${buttonClass}`}
                    >
                        <span>{option}</span>
                        {isAnswered && index === selectedAnswer && (isCorrect ? <CheckCircle /> : <XCircle />)}
                    </button>
                    );
                })}
            </div>
        ) : (
             <form onSubmit={(e) => { e.preventDefault(); handleSubmitAnswer(inputValue); }} className="space-y-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.lesson.yourAnswer}
                    disabled={isAnswered}
                    className="w-full p-4 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-neutral-900 placeholder:text-neutral-400 text-lg disabled:bg-neutral-100"
                    autoFocus
                />
                {!isAnswered && (
                     <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-bold py-3 px-6 rounded-lg text-base transition hover:opacity-90 disabled:bg-neutral-300"
                    >
                        {t.lesson.submitAnswer}
                    </button>
                )}
             </form>
        )}


        {isAnswered && (
          <div className={`mt-5 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
            <p className="font-bold">{isCorrect ? t.lesson.quizCorrect : t.lesson.quizIncorrect}</p>
            {!isCorrect && <p className="mt-1 font-semibold">{currentQuestion.type === 'multiple-choice' ? currentQuestion.options[currentQuestion.correctAnswerIndex] : currentQuestion.answer}</p>}
            <p className="text-sm mt-2">{currentQuestion.explanation}</p>
          </div>
        )}
        
        {isAnswered && (
            <div className="mt-6 text-center">
                 <button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg text-base transition-transform active:scale-95 flex items-center gap-2 mx-auto"
                >
                    <span>{isLastQuestion ? t.lesson.completeLessonButton : t.lesson.nextQuestionButton}</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};