import React, { useContext, useRef, useCallback, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, CheckCircle, Download, Share2, Edit, X, Check, Loader2, LogOut, ShieldCheck, MessageSquarePlus, Swords } from 'lucide-react';
import { LearningPath, User } from '../types';
import { useTranslations } from '../i18n';
import { CURRICULUM_MODULES, BADGES } from '../constants';
import * as htmlToImage from 'html-to-image';
import { apiService } from '../services/apiService';
import { BadgeIcon } from './BadgeIcon';
import { FeedbackModal } from './FeedbackModal';

const Certificate: React.FC<{ userName: string, certificateRef: React.RefObject<HTMLDivElement> }> = ({ userName, certificateRef }) => {
    const t = useTranslations();
    const completionDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const certificateId = `AIK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return (
        <div ref={certificateRef} className="bg-white p-6 md:p-8 rounded-xl border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-neutral-50 z-0 opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full z-0"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/10 rounded-full z-0"></div>
            
            <div className="relative z-10 text-center">
                <div className="flex justify-center items-center gap-3">
                  <ShieldCheck className="text-primary" size={40} />
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">{t.profile.certificateTitleSingle}</h3>
                </div>
                <p className="text-neutral-500 mt-2">{t.profile.certificateFor}</p>
                <p className="text-3xl md:text-4xl font-extrabold text-neutral-800 my-4 md:my-6 border-y-2 border-neutral-200 py-4">{userName}</p>
                <p className="text-base md:text-lg text-neutral-600 font-medium">{t.profile.certificateCourseName}</p>
                <div className="flex justify-center items-center gap-2 mt-4 text-secondary">
                    <CheckCircle size={24} />
                    <p className="font-bold">{t.profile.certificateCompletedOn(completionDate)}</p>
                </div>
                <p className="text-xs text-neutral-400 mt-6">{t.profile.certificateId}: {certificateId}</p>
            </div>
        </div>
    );
};


export const Profile: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Profile must be used within an AppProvider");
    const { user, setUser, logout } = context;
    const t = useTranslations();
    const certificateRef = useRef<HTMLDivElement>(null);

    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    
    if (!user) return null;

    const handleEditName = () => {
        setIsEditingName(true);
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setEditedName(user.name);
    };

    const handleSaveName = async () => {
        if (editedName.trim() === '' || editedName.trim() === user.name) {
            setIsEditingName(false);
            return;
        }
        setIsSaving(true);
        const updatedUser = await apiService.updateUser(user.email, { name: editedName.trim() });
        if (updatedUser) {
            setUser(updatedUser as User);
        }
        setIsSaving(false);
        setIsEditingName(false);
    };

    const completedModulesCount = user.completedModules.length;
    const totalModules = CURRICULUM_MODULES.length;
    const progressPercentage = totalModules > 0 ? (completedModulesCount / totalModules) * 100 : 0;
    const allModulesCompleted = completedModulesCount === totalModules && totalModules > 0;
    
    const handleDownload = useCallback(() => {
        if (certificateRef.current === null) return;
        htmlToImage.toPng(certificateRef.current, { cacheBust: true, backgroundColor: '#ffffff' })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `AI-Kasahorow-Certificate-${user.name}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => { console.error('Oops, something went wrong!', err); });
    }, [user.name]);


    return (
        <>
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
            <div className="container mx-auto p-4 md:p-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-2">{t.profile.title}</h2>
                <p className="text-neutral-500 mb-8 text-base md:text-lg">{t.profile.description}</p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-4xl md:text-5xl mb-5 ring-4 ring-white shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        {!isEditingName ? (
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">{user.name}</h3>
                                <button onClick={handleEditName} className="text-neutral-500 hover:text-primary"><Edit size={20}/></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 w-full">
                                <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full text-center text-2xl font-bold border-b-2 border-primary focus:outline-none bg-transparent text-neutral-900"/>
                                <button onClick={handleSaveName} disabled={isSaving} className="text-green-600 hover:text-green-800 disabled:text-neutral-400">
                                    {isSaving ? <Loader2 className="animate-spin" size={24}/> : <Check size={24}/>}
                                </button>
                                <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-800"><X size={24}/></button>
                            </div>
                        )}

                        <p className="text-neutral-500 text-base md:text-lg mt-1">{t.profile.learnerLevel(user.level || LearningPath.Beginner)}</p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-bold px-6 py-3 rounded-full text-base md:text-lg">
                            <Award size={22} />
                            {user.points} {t.profile.points}
                        </div>
                        <div className="mt-8 border-t border-neutral-200 w-full pt-6 flex flex-col items-center gap-4">
                            <button onClick={() => setIsFeedbackModalOpen(true)} className="flex items-center justify-center gap-2 text-md font-bold text-neutral-600 hover:text-primary transition-colors">
                                <MessageSquarePlus size={20} /> {t.profile.feedbackButton}
                            </button>
                            <button onClick={logout} className="flex items-center justify-center gap-2 text-md font-bold text-red-600 hover:text-red-800 transition-colors">
                                <LogOut size={20} /> {t.header.logout}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Multiplayer Stats */}
                         <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                            <h4 className="text-xl md:text-2xl font-bold text-neutral-800 mb-5">{t.profile.multiplayerStatsTitle}</h4>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-primary/10 p-4 rounded-xl">
                                    <p className="text-3xl font-bold text-primary">{user.multiplayerStats.wins}</p>
                                    <p className="text-sm font-semibold text-primary/80">{t.profile.wins}</p>
                                </div>
                                <div className="bg-secondary/10 p-4 rounded-xl">
                                    <p className="text-3xl font-bold text-secondary">{user.multiplayerStats.gamesPlayed}</p>
                                    <p className="text-sm font-semibold text-secondary/80">{t.profile.gamesPlayed}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                            <h4 className="text-xl md:text-2xl font-bold text-neutral-800 mb-5">{t.profile.progressTitle}</h4>
                            <div className="relative">
                                <div className="w-full bg-neutral-200 rounded-full h-6 overflow-hidden">
                                <div className="bg-secondary h-6 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white font-bold text-sm drop-shadow-sm">
                                    {Math.round(progressPercentage)}%
                                </span>
                            </div>
                            <p className="text-md text-neutral-500 text-right mt-2">{t.profile.progressDescription(completedModulesCount, totalModules)}</p>
                        </div>

                        {/* Badges */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                            <h4 className="text-xl md:text-2xl font-bold text-neutral-800 mb-5">{t.profile.badgesTitle}</h4>
                            {user.badges.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {user.badges.map(badgeId => (
                                        <BadgeIcon key={badgeId} badge={BADGES[badgeId]} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                                    <p className="text-neutral-500">{t.profile.noBadges}</p>
                                </div>
                            )}
                        </div>

                        {/* Certificates */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                            <h4 className="text-xl md:text-2xl font-bold text-neutral-800 mb-5">{t.profile.certificatesTitle}</h4>
                            { allModulesCompleted ? (
                                <div>
                                    <Certificate userName={user.name} certificateRef={certificateRef} />
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-end">
                                        <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-neutral-700 text-white font-bold py-3 px-5 rounded-lg hover:bg-neutral-800 transition text-base" aria-label="Download certificate">
                                            <Download size={20} /> {t.profile.downloadButton}
                                        </button>
                                        <button className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-5 rounded-lg hover:bg-primary-dark transition text-base" aria-label="Share certificate">
                                            <Share2 size={20} /> {t.profile.shareButton}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-neutral-50 rounded-xl border border-neutral-200">
                                    <p className="text-neutral-500">{t.profile.moreCertificates}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}