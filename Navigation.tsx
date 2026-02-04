
import React from 'react';
import { NAV_ITEMS } from '../constants';

interface Props {
  currentView: string;
  setView: (v: string) => void;
}

const Navigation: React.FC<Props> = ({ currentView, setView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-around items-center h-16 px-4 z-50">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => setView(item.path)}
          className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
            currentView === item.path ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
