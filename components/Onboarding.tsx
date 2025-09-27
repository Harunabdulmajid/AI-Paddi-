
import React, { useState } from 'react';
import { Loader2, ArrowRight, GraduationCap, PartyPopper } from 'lucide-react';
import { apiService } from '../services/apiService';
import { LearningPath, User } from '../types';
import { Translation } from '../i18n';

interface OnboardingProps {
    setUser: (user: User | null) => void;
    t: Translation;
}

export const Onboarding: React.FC<OnboardingProps> = ({ setUser, t }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'auth' | 'path_assigned'>('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<LearningPath | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError(null);
    setIsLoading(true);

    if (authMode === 'signin') {
        try {
            const existingUser = await apiService.getUserByEmail(email);
            if (existingUser) {
                setUser(existingUser);
                // The parent App component will handle the transition
            } else {
                setError(t.onboarding.errorUserNotFound);
            }
        } catch (err) {
            setError(t.onboarding.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    } else { // signup
        try {
            const assignedLevel = LearningPath.Beginner;
            setAssignedLevel(assignedLevel);

            const googleId = `gid-${Date.now()}`;
            const createdUser = await apiService.createUser({ name, email, level: assignedLevel, googleId });
            setUser(createdUser); 
            setStep('path_assigned');
        } catch (err: any) {
            if (err.message?.includes('already exists')) {
                setError(t.onboarding.errorUserExists);
            } else {
                setError(t.onboarding.errorGeneric);
            }
        } finally {
            setIsLoading(false);
        }
    }
  };

  const switchAuthMode = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setError(null);
    setName('');
    setEmail('');
  };
  
  if (step === 'path_assigned') {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
         <div className="w-full max-w-md mx-auto text-center">
             <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                <PartyPopper className="text-accent mx-auto" size={48} />
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">{t.onboarding.pathAssignedTitle}</h1>
                <p className="text-neutral-500 mt-2 mb-6 text-lg">{t.onboarding.pathAssignedDescription}</p>
                <div className="bg-primary/10 text-primary font-bold text-xl p-4 rounded-xl flex items-center justify-center gap-3">
                    <GraduationCap size={24} />
                    <span>{t.levels[assignedLevel || LearningPath.Beginner]} Path</span>
                </div>
                <button 
                  onClick={() => { /* User is already set, so this just visually transitions */ }}
                  className="mt-8 w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-primary-dark transition-transform active:scale-95"
                >
                    {t.onboarding.ctaButton} <ArrowRight size={22} />
                </button>
             </div>
         </div>
       </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-2">
                    <GraduationCap className="text-primary" size={40} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">AI Kasahorow</h1>
                </div>
                <h2 className="text-xl font-bold text-neutral-600 mb-6">{authMode === 'signin' ? t.onboarding.signInTitle : t.onboarding.signUpTitle}</h2>
                
                <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                        <input type="text" placeholder={t.onboarding.namePlaceholder} value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-neutral-900 placeholder:text-neutral-400 text-lg" required />
                    )}
                     <input type="email" placeholder={t.onboarding.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-neutral-900 placeholder:text-neutral-400 text-lg" required />
                    
                    {error && <p className="text-red-500 text-sm font-semibold text-left pt-1">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:bg-neutral-400 text-lg mt-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : (authMode === 'signin' ? t.onboarding.signInButton : t.onboarding.signUpButton)}
                    </button>
                </form>

                <p className="mt-6 text-center text-neutral-600">
                    {authMode === 'signin' ? (
                        <>
                            {t.onboarding.switchToSignUp.split('?')[0]}?{' '}
                            <button onClick={() => switchAuthMode('signup')} className="font-bold text-primary hover:underline">{t.onboarding.switchToSignUp.split('? ')[1]}</button>
                        </>
                    ) : (
                        <>
                            {t.onboarding.switchToSignIn.split('?')[0]}?{' '}
                            <button onClick={() => switchAuthMode('signin')} className="font-bold text-primary hover:underline">{t.onboarding.switchToSignIn.split('? ')[1]}</button>
                        </>
                    )}
                </p>
            </div>
             <p className="text-sm text-neutral-400 mt-8 text-center">{t.common.footer(new Date().getFullYear())}</p>
        </div>
    </div>
  );
};
