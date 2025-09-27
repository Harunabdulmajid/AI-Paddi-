import React from 'react';
import { Badge } from '../types';
import { Award } from 'lucide-react';

interface ToastProps {
  badge: Badge;
}

export const Toast: React.FC<ToastProps> = ({ badge }) => {
  const Icon = badge.icon;
  return (
    <div className="fixed top-5 right-5 bg-white shadow-2xl rounded-xl p-4 flex items-center gap-4 z-50 animate-toast-in">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center rounded-lg shadow-md">
          <Icon size={28} />
      </div>
      <div>
        <p className="font-bold text-neutral-800">Badge Unlocked!</p>
        <p className="text-neutral-600">{badge.name}</p>
      </div>
    </div>
  );
};

// Add keyframes to index.html or a global CSS file if you have one.
// For this project structure, we can add a style tag to index.html
const keyframes = `
@keyframes toast-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-toast-in {
  animation: toast-in 0.5s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

@keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
    animation: slide-up 0.4s ease-out forwards;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);
