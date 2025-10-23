import React, { useState, useContext, useEffect, useRef } from 'react';
import { Quiz as QuizType } from '../types';
import { CheckCircle, XCircle, Mic } from 'lucide-react';
import { useTranslations } from '../i18n';
import { AppContext } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';

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


  useEffect(() => {
    if (isVoiceModeEnabled && !isAnswered) {
      let textToSpeak = currentQuestion.question;
      if (currentQuestion.type === 'multiple-choice') {
        textToSpeak += currentQuestion.options.map((opt, i) => ` Option ${i + 1}: ${opt}`).join('. ');
      }
      speak(textToSpeak, language);
    }
  }, [currentQuestion, isVoiceModeEnabled, isAnswered, speak, language]);

  // Reset focus when question changes for keyboard navigation
  useEffect(() => {
      setFocusedIndex(0);
      optionRefs.current = [];
  }, [currentQuestionIndex]);
  
  // Set focus on the active element for keyboard navigation
  useEffect(() => {
    if (currentQuestion.type === 'multiple-choice' && !isAnswered && optionRefs.current[focusedIndex]) {
        optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, currentQuestion.type, isAnswered]);


  const handleVoiceAnswer = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (currentQuestion.type === 'multiple-choice') {
        const foundIndex = currentQuestion.options.findIndex((opt, index) => 
            lowerTranscript.includes(opt.toLowerCase()) || 
            lowerTranscript.includes(`option ${index + 1}`) ||
            (index + 1).toString() === lowerTranscript.trim()
        );
        if (foundIndex !== -1) {
            handleSubmitAnswer(foundIndex);
        }
    } else if (currentQuestion.type === 'fill-in-the-blank') {
        setInputValue(transcript);
        handleSubmitAnswer(transcript);
    }
  };
  
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
        const points = 5;
        const bonus = Math.min(5, streak); // 1 bonus point per streak item, max 5
        const totalPoints = points + bonus;
        addTransaction({
            type: 'earn',
            description: `Correct answer in '${t.curriculum[activeModuleId!]?.title}' quiz`,
            amount: totalPoints
        });
        setStreak(s => s + 1);
    } else {
        setStreak(0);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (currentQuestion.type !== 'multiple-choice' || isAnswered) return;

    const optionsCount = currentQuestion.options.length;
    let newIndex = focusedIndex;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = (focusedIndex + 1) % optionsCount;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = (focusedIndex - 1 + optionsCount) % optionsCount;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer(focusedIndex);
    }
    
    setFocusedIndex(newIndex);
  };

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
        <div className="flex justify-between items-start">
            <p id={questionId} className="text-lg font-semibold text-neutral-700 mb-5 flex-grow">{currentQuestion.question}</p>
            {isVoiceModeEnabled && !isAnswered && (
                <button onClick={() => startListening(handleVoiceAnswer, language)} disabled={isListening} className="ml-4 p-2 rounded-full bg-primary/10 text-primary disabled:opacity-50" aria-label="Answer with voice">
                    <Mic className={isListening ? 'animate-pulse' : ''}/>
                </button>
            )}
        </div>
        
        {currentQuestion.type === 'multiple-choice' ? (
             <div role="radiogroup" aria-labelledby={questionId} onKeyDown={handleKeyDown} className="space-y-3">
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
                        // FIX: Ensure callback ref does not return a value.
                        ref={(el) => { optionRefs.current[index] = el; }}
                        role="radio"
                        aria-checked={selectedAnswer === index}
                        tabIndex={focusedIndex === index && !isAnswered ? 0 : -1}
                        onClick={() => {
                            setFocusedIndex(index);
                            handleSubmitAnswer(index);
                        }}
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
                    aria-labelledby={questionId}
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
            <p className="font-bold">{isCorrect ? t.lesson.quizCorrect(5 + Math.min(5, streak -1)) : t.lesson.quizIncorrect}</p>
            {!isCorrect && <p className="mt-1 font-semibold">{currentQuestion.type === 'multiple-choice' ? currentQuestion.options[currentQuestion.correctAnswerIndex] : currentQuestion.answer}</p>}
            <p className="text-sm mt-2">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};