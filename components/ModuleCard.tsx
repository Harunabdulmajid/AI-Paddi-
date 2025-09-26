
import React, { useContext } from 'react';
import { Module, Page } from '../types';
import { ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const context = useContext(AppContext);
  if (!context) throw new Error("ModuleCard must be used within an AppProvider");
  const { setCurrentPage, setActiveModuleId } = context;

  const Icon = module.icon;

  const handleStartLearning = () => {
    setActiveModuleId(module.id);
    setCurrentPage(Page.Lesson);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-2">{module.title}</h3>
        <p className="text-neutral-500 text-base leading-relaxed">{module.description}</p>
      </div>
      <button 
        onClick={handleStartLearning}
        className="mt-6 text-md font-semibold text-primary hover:text-primary-dark flex items-center gap-2 self-start group-hover:gap-3 transition-all">
        Start Learning <ArrowRight size={18} />
      </button>
    </div>
  );
};
