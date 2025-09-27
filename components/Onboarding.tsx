import React, { useState, useContext } from 'react';
import { Loader2, ArrowRight, GraduationCap, PartyPopper } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AppContext } from '../context/AppContext';
import { useTranslations } from '../i18n';
import { LearningPath } from '../types';

// Simplified sign-in flow
export const Onboarding: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Onboarding must be used within an AppProvider");
  const { setUser } = context;
  const t = useTranslations();

  const [name, setName] = useState('');
  const [step, setStep] = useState<'signin' | 'path_assigned'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [assignedLevel, setAssignedLevel] = useState<LearningPath | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;
    
    setIsLoading(true);
    const assignedLevel = LearningPath.Beginner;
    setAssignedLevel(assignedLevel);
    
    // Create the user in the "backend" with a unique dummy email
    const googleId = `gid-${Date.now()}`;
    const uniqueEmail = `${name.toLowerCase().replace(/\s+/g, '.')}.${Date.now()}@example.com`;
    const createdUser = await apiService.createUser({ name, email: uniqueEmail, level: assignedLevel, googleId });
    
    // Set user in context and transition to the "Path Assigned" screen
    setUser(createdUser); 
    setIsLoading(false);
    setStep('path_assigned');
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


  // Initial Sign-in Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4">
        <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <GraduationCap className="text-primary" size={40} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800">AI Kasahorow</h1>
                </div>
                <p className="text-neutral-500 mb-8 text-base sm:text-lg">AI Literacy for All. In Your Language.</p>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                    <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary bg-white text-neutral-900 placeholder:text-neutral-400 text-lg" required />
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:bg-neutral-400 text-lg">
                        {isLoading ? <Loader2 className="animate-spin" /> : t.onboarding.signInButton}
                    </button>
                </form>
            </div>
             <p className="text-sm text-neutral-400 mt-8">{t.common.footer(new Date().getFullYear())}</p>
        </div>
    </div>
  );
};
