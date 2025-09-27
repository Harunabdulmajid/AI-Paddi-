import React from 'react';

interface TooltipTermProps {
  term: string;
  definition: string;
}

export const TooltipTerm: React.FC<TooltipTermProps> = ({ term, definition }) => {
  return (
    <span className="relative group inline-block">
      <span className="text-primary font-semibold border-b-2 border-dotted border-primary/50 cursor-pointer">
        {term}
      </span>
      <div className="absolute bottom-full mb-2 w-60 sm:w-64 p-3 bg-neutral-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 transform -translate-x-1/2 left-1/2">
        {definition}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-neutral-800"></div>
      </div>
    </span>
  );
};