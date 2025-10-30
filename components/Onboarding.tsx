import React, { useState, useEffect } from 'react';
// FIX: Aliased the `User` icon to `UserIcon` to avoid a name conflict with the `User` type.
import { Loader2, ArrowRight, GraduationCap, PartyPopper, CheckCircle, Feather, BookOpen, BrainCircuit, User as UserIcon, Users, Book } from 'lucide-react';
import { apiService } from '../services/apiService';
import { LearningPath, User, UserRole } from '../types';
import { Translation } from '../i18n';

interface OnboardingProps {
    setUser: (user: User | null) => void;
    t: Translation;
}

const WelcomeStep: React.FC<{ onGetStarted: () => void, t: Translation }> = ({ onGetStarted, t }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
        <div className="w-full max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                <GraduationCap className="text-primary mx-auto" size={48} />
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">{t.onboarding.welcome.title}</h1>
                <p className="text-neutral-500 mt-2 mb-8 text-lg">{t.onboarding.welcome.subtitle}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200">
                        <h3 className="font-bold text-lg text-neutral-700">{t.onboarding.welcome.consumerTitle}</h3>
                        <p className="text-neutral-500 mt-1">{t.onboarding.welcome.consumerParagraph}</p>
                    </div>
                     <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20">
                        <h3 className="font-bold text-lg text-secondary-dark">{t.onboarding.welcome.creatorTitle}</h3>
                        <p className="text-secondary-dark/80 mt-1">{t.onboarding.welcome.creatorParagraph}</p>
                    </div>
                </div>
                 <button 
                  onClick={onGetStarted}
                  className="mt-10 w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-primary-dark transition-transform active:scale-95"
                >
                    {t.onboarding.welcome.ctaButton} <ArrowRight size={22} />
                </button>
            </div>
        </div>
    </div>
);

const RoleSelectionStep: React.FC<{ onSelect: (role: UserRole) => void, isLoading: boolean, t: Translation }> = ({ onSelect, isLoading, t }) => {
    const roles = [
        // FIX: Replaced `User` icon with the aliased `UserIcon`.
        { role: UserRole.Student, icon: UserIcon, title: t.onboarding.roleSelection.student, desc: t.onboarding.roleSelection.studentDescription },
        { role: UserRole.Teacher, icon: Book, title: t.onboarding.roleSelection.teacher, desc: t.onboarding.roleSelection.teacherDescription },
        { role: UserRole.Parent, icon: Users, title: t.onboarding.roleSelection.parent, desc: t.onboarding.roleSelection.parentDescription },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
            <div className="w-full max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">{t.onboarding.roleSelection.title}</h1>
                    <p className="text-neutral-500 mt-2 mb-8 text-lg">{t.onboarding.roleSelection.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {roles.map(({ role, icon: Icon, title, desc }) => (
                            <button
                                key={role}
                                onClick={() => onSelect(role)}
                                disabled={isLoading}
                                className="text-left p-6 border-2 border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group disabled:opacity-50"
                            >
                                <Icon className="text-primary mb-3" size={32} />
                                <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
                                <p className="text-neutral-500 text-sm mt-1">{desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const PathSelectionStep: React.FC<{ onSelect: (path: LearningPath) => void, isLoading: boolean, t: Translation }> = ({ onSelect, isLoading, t }) => {
    const paths = [
        { level: LearningPath.Beginner, icon: Feather },
        { level: LearningPath.Intermediate, icon: BookOpen },
        { level: LearningPath.Advanced, icon: BrainCircuit },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
            <div className="w-full max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                    <GraduationCap className="text-primary mx-auto" size={48} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">Choose Your Learning Path</h1>
                    <p className="text-neutral-500 mt-2 mb-8 text-lg">Select the path that best fits your current knowledge.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {paths.map(({ level, icon: Icon }) => (
                            <button
                                key={level}
                                onClick={() => onSelect(level)}
                                disabled={isLoading}
                                className="text-left p-6 border-2 border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group disabled:opacity-50"
                            >
                                <Icon className="text-primary mb-3" size={32} />
                                <h3 className="text-xl font-bold text-neutral-800">{t.paths[level].name}</h3>
                                <p className="text-neutral-500 text-sm mt-1">{t.paths[level].description}</p>
                            </button>
                        ))}
                    </div>
                    {isLoading && <Loader2 className="animate-spin text-primary mx-auto mt-6" size={32} />}
                </div>
            </div>
        </div>
    );
};

export const Onboarding: React.FC<OnboardingProps> = ({ setUser, t }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'welcome' | 'auth' | 'select_role' | 'select_path' | 'path_assigned' | 'success_signin'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<LearningPath | null>(null);
  const [transitionUser, setTransitionUser] = useState<User | null>(null);
  const [signupDetails, setSignupDetails] = useState<{ name: string; email: string; role: UserRole } | null>(null);

  useEffect(() => {
    if (step === 'success_signin') {
        const timer = setTimeout(() => {
            if (transitionUser) {
                setUser(transitionUser);
            }
        }, 2000); // Wait for 2 seconds before transitioning

        return () => clearTimeout(timer);
    }
  }, [step, transitionUser, setUser]);


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError(null);
    setIsLoading(true);

    if (authMode === 'signin') {
        try {
            const existingUser = await apiService.getUserByEmail(email);
            if (existingUser) {
                setTransitionUser(existingUser);
                setStep('success_signin');
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
            const existingUser = await apiService.getUserByEmail(email);
            if (existingUser) {
                setError(t.onboarding.errorUserExists);
                setIsLoading(false);
                return;
            }
            // Temporarily store name and email, then move to role selection
            setSignupDetails({ name, email, role: UserRole.Student }); // role is temporary
            setStep('select_role');
        } catch (err: any) {
            setError(t.onboarding.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    }
  };
  
  const handleSelectRole = (role: UserRole) => {
      if (!signupDetails) return;
      setSignupDetails(prev => prev ? { ...prev, role } : null);
      setStep('select_path');
  };

  const handleSelectPath = async (level: LearningPath) => {
    if (!signupDetails) return;
    setIsLoading(true);
    try {
      const googleId = `gid-${Date.now()}`;
      const createdUser = await apiService.createUser({ ...signupDetails, level, googleId });
      setTransitionUser(createdUser);
      setAssignedLevel(level);
      setStep('path_assigned');
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
          setError(t.onboarding.errorUserExists);
      } else {
          setError(t.onboarding.errorGeneric);
      }
      setStep('auth'); // Go back to auth screen on error
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMode = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setError(null);
    setName('');
    setEmail('');
  };
  
  if (step === 'welcome') {
      return <WelcomeStep onGetStarted={() => setStep('auth')} t={t} />;
  }

  if (step === 'select_role') {
      return <RoleSelectionStep onSelect={handleSelectRole} isLoading={isLoading} t={t} />;
  }

  if (step === 'select_path') {
      return <PathSelectionStep onSelect={handleSelectPath} isLoading={isLoading} t={t} />;
  }

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
                  onClick={() => { if (transitionUser) setUser(transitionUser); }}
                  className="mt-8 w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-primary-dark transition-transform active:scale-95"
                >
                    {t.onboarding.ctaButton} <ArrowRight size={22} />
                </button>
             </div>
         </div>
       </div>
    );
  }

  if (step === 'success_signin') {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
         <div className="w-full max-w-md mx-auto text-center">
             <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                <CheckCircle className="text-secondary mx-auto" size={48} />
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">Welcome Back!</h1>
                <p className="text-neutral-500 mt-2 mb-6 text-lg">We're glad to see you again. Redirecting you to your dashboard...</p>
                <Loader2 className="animate-spin text-primary mx-auto" size={32} />
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