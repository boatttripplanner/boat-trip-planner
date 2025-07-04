
import React from 'react';

// New multi-color, multi-layer SVG for a more realistic and dynamic TikTok icon.
// Using a group to apply transformations easily.
export const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="tiktok-icon" 
    {...props}
  >
    <defs>
      <path
        id="tiktok-shape"
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.86-.95-6.69-2.81-1.77-1.8-2.65-4.14-2.65-6.55 0-1.92 1.31-3.66 3.44-4.34 1.05-.33 2.15-.36 3.23-.31.05-1.04-.01-2.07.02-3.11.02-1.22.47-2.39 1.17-3.44.81-1.24 2.11-2.24 3.54-2.77.01 0 .01 0 .01 0zM12.14 8.41c-1.31.25-2.45.93-3.23 2.05-.28.4-.5.85-.66 1.31-.19.56-.31 1.15-.31 1.76 0 2.11 1.55 3.89 3.81 4.38 2.29.5 4.58-.23 6.09-2.05.62-.75 1.05-1.63 1.25-2.57.12-.55.18-1.12.18-1.69 0-.25-.01-.5-.03-.75l-.01-.25c-.02-.25-.05-.5-.08-.75-.03-.25-.06-.5-.1-.75-.03-.25-.07-.5-.11-.75l-.02-.13c-.22-1.22-1.01-2.29-2.11-2.92-1.18-.69-2.62-1-4.01-.81z"
      />
    </defs>
    {/* Use a group to apply mix-blend-mode to the color layers */}
    <g className="tiktok-glitch-layers" style={{ isolation: 'isolate' }}>
      <use href="#tiktok-shape" fill="#0f172a" /> {/* Base black shape */}
      {/* Cyan layer */}
      <use
        href="#tiktok-shape"
        fill="#2dd4bf" // A nice cyan/teal
        className="tiktok-glitch-cyan"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Magenta layer */}
      <use
        href="#tiktok-shape"
        fill="#f43f5e" // A nice magenta/rose
        className="tiktok-glitch-magenta"
        style={{ mixBlendMode: 'screen' }}
      />
    </g>
  </svg>
);