import React from 'react';

interface ChevronIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen: boolean;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3} // Made thicker for better visibility
    stroke="currentColor"
    className={`w-5 h-5 transition-transform duration-200 ease-in-out ${isOpen ? 'transform rotate-180' : ''}`}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);