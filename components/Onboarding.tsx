import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, GraduationCap, PartyPopper, CheckCircle, Feather, BookOpen, User as UserIcon, Users, Book, PenTool, Briefcase, ShieldCheck, BookCopy, UserPlus, Eye, EyeOff, Lock, Mail, Globe, Phone, AlertCircle } from 'lucide-react';
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
                     {isLoading && <Loader2 className="animate-spin text-primary mx-auto mt-6" size={32} />}
                </div>
            </div>
        </div>
    );
};


const PathSelectionStep: React.FC<{ onSelect: (path: LearningPath) => void, isLoading: boolean, t: Translation }> = ({ onSelect, isLoading, t }) => {
    const paths = [
        { level: LearningPath.Explorer, icon: Feather },
        { level: LearningPath.Creator, icon: PenTool },
        { level: LearningPath.Innovator, icon: Briefcase },
        { level: LearningPath.Ethicist, icon: ShieldCheck },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
            <div className="w-full max-w-3xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                    <GraduationCap className="text-primary mx-auto" size={48} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mt-4">Choose Your Learning Path</h1>
                    <p className="text-neutral-500 mt-2 mb-8 text-lg">Select the path that best fits your current knowledge.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

const CreateClassStep: React.FC<{ t: Translation, transitionUser: User, setUser: (user: User) => void }> = ({ t, transitionUser, setUser }) => {
    const [className, setClassName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreated, setIsCreated] = useState(false);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!className.trim()) return;
        setIsLoading(true);
        try {
            await apiService.createClass(transitionUser.id, className);
            setIsCreated(true);
            setTimeout(() => setUser(transitionUser), 2000); // Wait 2s before finishing
        } catch (error) {
            console.error(error); // Show error to user
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        setUser(transitionUser);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
            <div className="w-full max-w-md mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                    {isCreated ? (
                         <>
                            <CheckCircle className="text-secondary mx-auto" size={48} />
                            <h1 className="text-3xl font-extrabold text-neutral-800 mt-4">{t.onboarding.createClass.successMessage}</h1>
                            <p className="text-neutral-500 mt-2">Redirecting you to your dashboard...</p>
                         </>
                    ) : (
                        <>
                            <BookCopy className="text-primary mx-auto" size={48} />
                            <h1 className="text-3xl font-extrabold text-neutral-800 mt-4">{t.onboarding.createClass.title}</h1>
                            <p className="text-neutral-500 mt-2 mb-6">{t.onboarding.createClass.description}</p>
                            <form onSubmit={handleCreateClass} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder={t.onboarding.createClass.placeholder}
                                    value={className}
                                    onChange={e => setClassName(e.target.value)}
                                    className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:bg-neutral-400">
                                    {isLoading ? <Loader2 className="animate-spin"/> : t.onboarding.createClass.ctaButton}
                                </button>
                                <button type="button" onClick={handleSkip} className="font-bold text-neutral-500 hover:text-primary transition">
                                    {t.onboarding.skipButton}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const LinkChildStep: React.FC<{ t: Translation, transitionUser: User, setUser: (user: User) => void }> = ({ t, transitionUser, setUser }) => {
    const [childEmail, setChildEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [error, setError] = useState('');

    const handleLinkAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!childEmail.trim()) return;
        setIsLoading(true);
        setError('');
        try {
            await apiService.linkChildAccount(transitionUser.email, childEmail);
            setIsLinked(true);
            setTimeout(() => setUser(transitionUser), 2000); // Wait 2s before finishing
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSkip = () => {
        setUser(transitionUser);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
            <div className="w-full max-w-md mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 transform transition-all animate-slide-up">
                    {isLinked ? (
                         <>
                            <CheckCircle className="text-secondary mx-auto" size={48} />
                            <h1 className="text-3xl font-extrabold text-neutral-800 mt-4">{t.onboarding.linkChild.successMessage}</h1>
                            <p className="text-neutral-500 mt-2">Redirecting you to your dashboard...</p>
                         </>
                    ) : (
                        <>
                            <UserPlus className="text-primary mx-auto" size={48} />
                            <h1 className="text-3xl font-extrabold text-neutral-800 mt-4">{t.onboarding.linkChild.title}</h1>
                            <p className="text-neutral-500 mt-2 mb-6">{t.onboarding.linkChild.description}</p>
                            {error && <p className="text-red-500 text-sm font-semibold mb-3">{error}</p>}
                            <form onSubmit={handleLinkAccount} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder={t.onboarding.linkChild.placeholder}
                                    value={childEmail}
                                    onChange={e => setChildEmail(e.target.value)}
                                    className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:bg-neutral-400">
                                    {isLoading ? <Loader2 className="animate-spin"/> : t.onboarding.linkChild.ctaButton}
                                </button>
                                <button type="button" onClick={handleSkip} className="font-bold text-neutral-500 hover:text-primary transition">
                                    {t.onboarding.skipButton}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Onboarding: React.FC<OnboardingProps> = ({ setUser, t }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'welcome' | 'auth' | 'select_role' | 'select_path' | 'create_class' | 'link_child' | 'path_assigned' | 'success_signin'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<LearningPath | null>(null);
  const [transitionUser, setTransitionUser] = useState<User | null>(null);
  const [signupDetails, setSignupDetails] = useState<{ 
      firstName: string; 
      lastName: string; 
      email: string; 
      phoneNumber: string;
      country: string;
      password?: string;
      role: UserRole | null; 
      avatarUrl?: string 
  }>({ firstName: '', lastName: '', email: '', phoneNumber: '', country: '', role: null });

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
            const authenticatedUser = await apiService.authenticateUser(email, password);
            setTransitionUser(authenticatedUser);
            setStep('success_signin');
        } catch (err: any) {
            setError(err.message || t.onboarding.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    } else if (authMode === 'signup') {
        try {
            const existingUser = await apiService.getUserByEmail(email);
            if (existingUser) {
                setError(t.onboarding.errorUserExists);
                setIsLoading(false);
                return;
            }
            // Store full details temporarily
            setSignupDetails({ 
                firstName, 
                lastName, 
                email, 
                phoneNumber,
                country,
                password,
                role: null 
            });
            setStep('select_role');
        } catch (err: any) {
            setError(t.onboarding.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    } else if (authMode === 'forgot-password') {
        try {
            await apiService.requestPasswordReset(email);
            alert('If an account exists with this email, you will receive a password reset link shortly.');
            setAuthMode('signin');
        } catch (err) {
            setError('Failed to request password reset. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
  };
  
  const handleSelectRole = async (role: UserRole) => {
      setSignupDetails(prev => ({ ...prev, role }));

      if (role === UserRole.Student) {
          setStep('select_path');
      } else {
          setIsLoading(true);
          try {
              const googleId = `gid-${Date.now()}`; // Placeholder for non-Google signups
              const createdUser = await apiService.createUser({ 
                  ...signupDetails, 
                  role, 
                  level: null, 
                  googleId, 
                  avatarUrl: signupDetails.avatarUrl 
              });
              setTransitionUser(createdUser);
              
              if (role === UserRole.Teacher) {
                  setStep('create_class');
              } else if (role === UserRole.Parent) {
                  setStep('link_child');
              }
          } catch (err: any) {
              setError(t.onboarding.errorGeneric);
              setStep('auth');
          } finally {
              setIsLoading(false);
          }
      }
  };

  const handleSelectPath = async (level: LearningPath) => {
    if (!signupDetails || !signupDetails.role) return;
    setIsLoading(true);
    try {
      const googleId = `gid-${Date.now()}`;
      const createdUser = await apiService.createUser({ 
          ...signupDetails, 
          role: signupDetails.role, 
          level, 
          googleId, 
          avatarUrl: signupDetails.avatarUrl 
      });
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

  const switchAuthMode = (mode: 'signin' | 'signup' | 'forgot-password') => {
    setAuthMode(mode);
    setError(null);
    // Keep email if switching between signin/forgot password
    if (mode === 'signup') {
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setCountry('');
    } else if (mode === 'signin') {
        // Retain email
    }
  };
  
  if (step === 'welcome') {
      return <WelcomeStep onGetStarted={() => setStep('auth')} t={t} />;
  }
  
  if (step === 'create_class' && transitionUser) {
      return <CreateClassStep t={t} transitionUser={transitionUser} setUser={setUser} />;
  }

  if (step === 'link_child' && transitionUser) {
      return <LinkChildStep t={t} transitionUser={transitionUser} setUser={setUser} />;
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
                    <span>{t.levels[assignedLevel || LearningPath.Explorer]} Path</span>
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

  // Auth Screen (Sign In / Sign Up / Forgot Password)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
        <div className={`w-full ${authMode === 'signup' ? 'max-w-2xl' : 'max-w-md'} mx-auto transition-all duration-300`}>
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center gap-3 mb-2">
                        <GraduationCap className="text-primary" size={40} />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">AI Kasahorow</h1>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-600">
                        {authMode === 'signin' ? t.onboarding.signInTitle : 
                         authMode === 'signup' ? t.onboarding.signUpTitle : 
                         "Reset Password"}
                    </h2>
                    {authMode === 'forgot-password' && (
                        <p className="text-neutral-500 text-sm mt-2">Enter your email to receive reset instructions.</p>
                    )}
                </div>
                
                <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">First Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="First Name" 
                                        value={firstName} 
                                        onChange={e => setFirstName(e.target.value)} 
                                        className="w-full pl-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Last Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Last Name" 
                                        value={lastName} 
                                        onChange={e => setLastName(e.target.value)} 
                                        className="w-full pl-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full pl-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                required 
                            />
                        </div>
                    </div>

                    {authMode === 'signup' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input 
                                        type="tel" 
                                        placeholder="+234..." 
                                        value={phoneNumber} 
                                        onChange={e => setPhoneNumber(e.target.value)} 
                                        className="w-full pl-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Nigeria" 
                                        value={country} 
                                        onChange={e => setCountry(e.target.value)} 
                                        className="w-full pl-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {(authMode === 'signin' || authMode === 'signup') && (
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    className="w-full pl-10 pr-10 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition" 
                                    required 
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {authMode === 'signin' && (
                                <div className="text-right mt-2">
                                    <button 
                                        type="button"
                                        onClick={() => switchAuthMode('forgot-password')}
                                        className="text-sm font-semibold text-primary hover:text-primary-dark transition"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:bg-neutral-400 text-lg mt-4 shadow-md hover:shadow-lg transform active:scale-[0.98]">
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            authMode === 'signin' ? t.onboarding.signInButton : 
                            authMode === 'signup' ? t.onboarding.signUpButton : 
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-neutral-600">
                    {authMode === 'signin' ? (
                        <>
                            {t.onboarding.switchToSignUp.split('?')[0]}?{' '}
                            <button onClick={() => switchAuthMode('signup')} className="font-bold text-primary hover:underline">{t.onboarding.switchToSignUp.split('? ')[1]}</button>
                        </>
                    ) : authMode === 'signup' ? (
                        <>
                            {t.onboarding.switchToSignIn.split('?')[0]}?{' '}
                            <button onClick={() => switchAuthMode('signin')} className="font-bold text-primary hover:underline">{t.onboarding.switchToSignIn.split('? ')[1]}</button>
                        </>
                    ) : (
                        <button onClick={() => switchAuthMode('signin')} className="font-bold text-primary hover:underline flex items-center justify-center gap-2 mx-auto">
                            <ArrowRight className="rotate-180" size={16}/> Back to Sign In
                        </button>
                    )}
                </div>
            </div>
             <p className="text-sm text-neutral-400 mt-8 text-center">{t.common.footer(new Date().getFullYear())}</p>
        </div>
    </div>
  );
};