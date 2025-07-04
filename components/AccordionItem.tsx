import React, { ReactNode } from 'react';
import { ChevronIcon } from './icons/ChevronIcon';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  id?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, icon, isOpen, onToggle, id }) => {

  return (
    <div id={id} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200/80">
      <button
        onClick={onToggle}
        className="accordion-header flex items-center justify-between w-full p-5 text-left text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-x-4">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        </span>
        <ChevronIcon isOpen={isOpen} aria-hidden="true" />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden"> {/* This inner div is crucial for the grid animation */}
          <div className="accordion-content p-5 pt-2 text-slate-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
