import React, { useState } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from '../i18n';

interface QuizProps {
  quiz: QuizType;
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const t = useTranslations();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onComplete();
    }
  };

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center">{t.lesson.quizTitle}</h3>
      <div className="bg-neutral-50 p-6 rounded-xl">
        <p className="text-lg font-semibold text-neutral-700 mb-5">{currentQuestion.question}</p>
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
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all text-md flex items-center justify-between ${buttonClass}`}
              >
                <span>{option}</span>
                {isAnswered && index === selectedAnswer && (isCorrect ? <CheckCircle /> : <XCircle />)}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-5 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
            <p className="font-bold">{isCorrect ? t.lesson.quizCorrect : t.lesson.quizIncorrect}</p>
            {!isCorrect && <p className="mt-1">{currentQuestion.options[currentQuestion.correctAnswerIndex]}</p>}
            <p className="text-sm mt-2">{currentQuestion.explanation}</p>
          </div>
        )}
        
        {isAnswered && (
            <div className="mt-6 text-center">
                 <button
                    onClick={handleNext}
                    className="bg-secondary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg text-base transition-transform active:scale-95"
                >
                    {isLastQuestion ? t.lesson.completeLessonButton : t.lesson.nextQuestionButton}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};