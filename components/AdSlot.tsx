import React, { useEffect } from 'react';

interface AdSlotProps {
  slotId: string;
  adClientId: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId, adClientId, className, style }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('Error pushing AdSense ad:', e);
    }
  }, [slotId]); // Re-run if slotId changes, though typically it won't for a given slot.

  // AdSense recommends not hiding the ad unit with display:none if it's not loaded
  // It handles its own display logic.
  // The key is to ensure the parent container can accommodate the ad when it loads.
  // The 'ins' tag needs to be empty initially.
  return (
    <div className={`adsense-ad-container ${className || ''}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }} // AdSense often requires 'block' or specific sizes
        data-ad-client={adClientId}
        data-ad-slot={slotId}
        data-ad-format="auto" // 'auto' lets AdSense choose the size. Or use 'rectangle', 'vertical', etc.
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSlot;