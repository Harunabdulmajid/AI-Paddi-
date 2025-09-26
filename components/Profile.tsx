
import React, { useContext, useRef, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, CheckCircle, Download, Share2 } from 'lucide-react';
import { LearningPath } from '../types';
import { useTranslations } from '../i18n';
import { CURRICULUM_MODULES } from '../constants';
import * as htmlToImage from 'html-to-image';

const Certificate: React.FC<{ userName: string, certificateRef: React.RefObject<HTMLDivElement> }> = ({ userName, certificateRef }) => {
    const t = useTranslations();
    const completionDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const certificateId = `AIK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return (
        <div ref={certificateRef} className="bg-neutral-50 p-6 md:p-8 rounded-xl border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/10 rounded-full z-0"></div>
            
            <div className="relative z-10 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-primary">{t.profile.certificateTitleSingle}</h3>
                <p className="text-neutral-500 mt-1">{t.profile.certificateFor}</p>
                <p className="text-3xl md:text-4xl font-extrabold text-neutral-800 my-4 md:my-6">{userName}</p>
                <p className="text-lg text-neutral-600 font-medium">{t.profile.certificateCourseName}</p>
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
    const { user } = context;
    const t = useTranslations();
    const certificateRef = useRef<HTMLDivElement>(null);

    const completedModulesCount = user.completedModules.length;
    const totalModules = CURRICULUM_MODULES.length;
    const progressPercentage = totalModules > 0 ? (completedModulesCount / totalModules) * 100 : 0;
    const allModulesCompleted = completedModulesCount === totalModules && totalModules > 0;
    
    const handleDownload = useCallback(() => {
        if (certificateRef.current === null) {
          return;
        }
        htmlToImage.toPng(certificateRef.current, { cacheBust: true })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `AI-Kasahorow-Certificate-${user.name}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('oops, something went wrong!', err);
          });
    }, [user.name]);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-4xl font-extrabold text-neutral-800 mb-2">{t.profile.title}</h2>
            <p className="text-neutral-500 mb-8 text-lg">{t.profile.description}</p>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-neutral-200 mx-auto mb-5 flex items-center justify-center text-6xl font-bold text-neutral-600">
                        {user.name.charAt(0)}
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-800">{user.name}</h3>
                    <p className="text-neutral-500 text-lg">{t.profile.learnerLevel(user.level || LearningPath.Beginner)}</p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-bold px-6 py-3 rounded-full text-lg">
                        <Award size={22} />
                        {user.points} {t.profile.points}
                    </div>
                </div>

                {/* Progress & Certificates */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold text-neutral-800 mb-5">{t.profile.progressTitle}</h4>
                    <div className="relative">
                        <div className="w-full bg-neutral-200 rounded-full h-6 overflow-hidden">
                           <div className="bg-secondary h-6 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white font-bold text-sm drop-shadow-sm">
                            {Math.round(progressPercentage)}%
                         </span>
                    </div>
                    <p className="text-md text-neutral-500 text-right mt-2">{t.profile.progressDescription(completedModulesCount, totalModules)}</p>

                    <div className="mt-10">
                         <h4 className="text-2xl font-bold text-neutral-800 mb-5">{t.profile.certificatesTitle}</h4>
                         { allModulesCompleted ? (
                             <div>
                                 <Certificate userName={user.name} certificateRef={certificateRef} />
                                 <div className="flex gap-3 mt-4 justify-end">
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
    );
}