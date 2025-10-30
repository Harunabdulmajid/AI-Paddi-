import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle, XCircle, Mic } from 'lucide-react';
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
  const { addTransaction, isVoiceModeEnabled, language, activeModuleId } = context;
  const { isListening, speak, startListening } = useSpeech();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const t = useTranslations();

  // For Keyboard Navigation
  const [focusedIndex, setFocusedIndex] = useState(0);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const questionId = `quiz-question-${currentQuestionIndex}`;

  // Use a ref to hold the advancement logic. This prevents the timer's useEffect
  // from re-running every time the parent re-renders and passes a new onComplete function.
  // FIX: Initialize useRef with `null` to fix "Expected 1 arguments, but got 0." error.
  const advanceToNextStepRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Keep the ref updated with the latest state and props.
    advanceToNextStepRef.current = () => {
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
  }, [currentQuestionIndex, quiz.questions.length, onComplete]);

  useEffect(() => {
    if (isAnswered) {
      const delay = isCorrect ? 1500 : 3000; // Shorter delay for correct, longer for incorrect to read explanation
      const timer = setTimeout(() => {
        if (advanceToNextStepRef.current) {
          advanceToNextStepRef.current();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isAnswered, isCorrect]);

  // FIX: Wrap handleSubmit in useCallback to prevent it from being recreated on every render,
  // which stabilizes the dependency for the voice command useEffect.
  const handleSubmit = useCallback((answerIndex: number | string) => {
    if (isAnswered) return;

    let isAnswerCorrect = false;
    if (typeof answerIndex === 'number') { // Multiple choice
      setSelectedAnswer(answerIndex);
      isAnswerCorrect = answerIndex === currentQuestion.correctAnswerIndex;
    } else { // Fill in the blank
      setInputValue(answerIndex);
      isAnswerCorrect = answerIndex.toLowerCase().trim() === currentQuestion.answer?.toLowerCase().trim();
    }
    
    setIsAnswered(true);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
        const points = 10 + (streak * 2);
        addTransaction({
            type: 'earn',
            description: t.lesson.quizCorrect(points),
            amount: points
        });
        setStreak(prev => prev + 1);
    } else {
        setStreak(0);
    }
  }, [isAnswered, currentQuestion, streak, addTransaction, t.lesson]);

  // FIX: Remove return null from useEffect, which is invalid and can cause type inference issues.
  // Also, update the dependency array to include all necessary dependencies like `handleSubmit`.
  useEffect(() => {
    if (isVoiceModeEnabled && !isAnswered) {
      let textToSpeak = currentQuestion.question;
      if (currentQuestion.type === 'multiple-choice') {
        textToSpeak += currentQuestion.options.map((opt, i) => ` Option ${i + 1}: ${opt}`).join('. ');
      }
      speak(textToSpeak, language);
      
      const handleVoiceCommand = (command: string) => {
        const lowerCommand = command.toLowerCase();
        let answerIndex = -1;

        if (currentQuestion.type === 'multiple-choice') {
            const options = ['one', 'two', 'three', 'four'];
            for (let i = 0; i < options.length; i++) {
                if (lowerCommand.includes(`option ${options[i]}`) || lowerCommand.includes(`number ${options[i]}`) || lowerCommand.includes(` ${i+1} `) || lowerCommand.endsWith(` ${i+1}`)) {
                    answerIndex = i;
                    break;
                }
            }
        } else {
            // for fill-in-the-blank, we could try to match the answer, but for now we'll skip voice for this type.
            return;
        }

        if (answerIndex !== -1 && answerIndex < currentQuestion.options.length) {
            handleSubmit(answerIndex);
        }
      };

      startListening(handleVoiceCommand, language);
    }
  }, [isVoiceModeEnabled, isAnswered, currentQuestion, language, speak, startListening, handleSubmit]);

  useEffect(() => {
    // Reset focus when question changes
    setFocusedIndex(0);
    optionRefs.current = optionRefs.current.slice(0, currentQuestion.options.length);
  }, [currentQuestionIndex, currentQuestion.options.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (currentQuestion.type !== 'multiple-choice') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = (focusedIndex + 1) % currentQuestion.options.length;
      setFocusedIndex(newIndex);
      optionRefs.current[newIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = (focusedIndex - 1 + currentQuestion.options.length) % currentQuestion.options.length;
      setFocusedIndex(newIndex);
      optionRefs.current[newIndex]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSubmit(focusedIndex);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t-2 border-dashed border-neutral-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-neutral-800 mb-2">{t.lesson.quizTitle}</h2>
      <p className="font-semibold text-neutral-600 mb-6">{currentQuestionIndex + 1} / {quiz.questions.length}: {currentQuestion.question}</p>

      {currentQuestion.type === 'multiple-choice' ? (
        <div role="radiogroup" aria-labelledby={questionId} onKeyDown={handleKeyDown} className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;
            let buttonClass = 'bg-white hover:bg-neutral-100 border-neutral-300';

            if (isAnswered) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-green-100 border-green-400 text-green-800';
              } else if (isSelected) {
                buttonClass = 'bg-red-100 border-red-400 text-red-800';
              } else {
                 buttonClass = 'bg-neutral-100 border-neutral-200 opacity-60';
              }
            } else if (isSelected) {
                buttonClass = 'bg-primary/10 border-primary';
            }

            return (
              <button
                key={index}
                // FIX: Use a block body for the ref callback to prevent an implicit return value, resolving the TypeScript error.
                ref={(el) => { optionRefs.current[index] = el; }}
                onClick={() => handleSubmit(index)}
                disabled={isAnswered}
                role="radio"
                aria-checked={isSelected}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all text-md flex items-center justify-between ${buttonClass}`}
              >
                <span>{option}</span>
                {isAnswered && isSelected && (isCorrect ? <CheckCircle /> : <XCircle />)}
              </button>
            );
          })}
        </div>
      ) : ( // Fill-in-the-blank
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(inputValue); }} className="flex gap-2">
           <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.lesson.yourAnswer}
                disabled={isAnswered}
                className="flex-grow p-4 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-neutral-900"
            />
            <button
                type="submit"
                disabled={isAnswered || !inputValue.trim()}
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition disabled:bg-neutral-300"
            >
                {t.lesson.submitAnswer}
            </button>
        </form>
      )}

      {isAnswered && (
        <div className={`mt-4 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
          <p className="font-bold">{isCorrect ? `${t.lesson.quizCorrect(10 + (streak-1)*2)}` : t.lesson.quizIncorrect}</p>
          <p>{currentQuestion.explanation}</p>
          {isCorrect && streak > 1 && <p className="font-bold mt-1">{t.lesson.quizStreak(streak)}</p>}
        </div>
      )}
      
      {isVoiceModeEnabled && !isAnswered && (
          <div className="mt-4 flex justify-center">
            <button onClick={() => {}} className="p-3 bg-neutral-100 rounded-full text-primary">
                <Mic className={isListening ? 'animate-pulse' : ''} />
            </button>
        </div>
      )}
    </div>
  );
};