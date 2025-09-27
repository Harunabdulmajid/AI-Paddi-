import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Language } from '../types';
import { Award, GraduationCap, Languages, LogOut, UserCircle, Settings } from 'lucide-react';
import { useTranslations } from '../i18n';
import { Page } from '../types';

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />;
    }
    return (
        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
            {name?.charAt(0).toUpperCase()}
        </div>
    );
};

export const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('Header must be used within an AppProvider');
  const { user, language, setLanguage, setCurrentPage, logout } = context;
  const t = useTranslations();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null; 
  }

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsDropdownOpen(false);
  }

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-20 shadow-sm p-3 md:p-4 border-b border-neutral-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-primary" size={28} />
          <h1 className="text-xl md:text-2xl font-bold text-neutral-800"><span className="hidden sm:inline">AI </span>Kasahorow</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 md:gap-2">
            <Award className="text-accent" size={22} />
            <span className="font-bold text-neutral-700 text-base md:text-lg">{user.points} <span className="hidden sm:inline">{t.common.pointsAbbr}</span></span>
          </div>
          
          <div className="relative">
            <Languages className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-8 pr-3 py-1.5 border border-neutral-300 rounded-lg bg-white text-neutral-700 text-sm md:text-base font-medium focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
              aria-label="Select language"
            >
              {Object.values(Language).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-primary transition-all">
                <UserAvatar name={user.name} />
            </button>
            {isDropdownOpen && (
                <div className="absolute top-14 right-0 w-64 sm:w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-30">
                    <div className="px-4 py-2 border-b border-neutral-200 mb-2">
                        <p className="font-bold text-neutral-800 truncate">{user.name}</p>
                        <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => handleNavigation(Page.Profile)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100">
                        <UserCircle size={20} /> {t.header.profile}
                    </button>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50">
                        <LogOut size={20} /> {t.header.logout}
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};