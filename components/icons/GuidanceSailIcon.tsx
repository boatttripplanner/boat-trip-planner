
import React from 'react';

export const GuidanceSailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    {/* Base line for water */}
    <path d="M2 21H22V22H2Z" />
    {/* Hull */}
    <path d="M3 18C4.66667 16.6667 7.66667 16 12 16C16.3333 16 19.3333 16.6667 21 18L20 20H4L3 18Z" />
    {/* Mast */}
    <path d="M11.5 20V5H12.5V20H11.5Z" /> {/* Corrected mast to sit on hull */}
    {/* Arrowhead on mast top */}
    <path d="M12 5L10 7.5H14L12 5Z" />
    {/* Sail */}
    <path d="M11.5 7.5L5 17L11.5 17L11.5 7.5Z" />
  </svg>
);
