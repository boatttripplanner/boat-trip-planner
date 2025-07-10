import React, { useEffect } from 'react';

export const MobileOptimizations: React.FC = () => {
  useEffect(() => {
    // Prevenir zoom en inputs en iOS
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevenir doble tap para zoom
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Agregar listeners para gestos táctiles
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    // Mejorar el scroll en móviles
    const improveMobileScroll = () => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-overflow-scrolling: touch;
        }
        body {
          overscroll-behavior: none;
        }
        .main-container {
          -webkit-overflow-scrolling: touch;
        }
      `;
      document.head.appendChild(style);
    };

    improveMobileScroll();

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Agregar clase para estilos específicos de móvil
      document.body.classList.add('mobile-device');
      
      // Optimizar para pantallas pequeñas
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.body.classList.remove('mobile-device');
    };
  }, []);

  return null; // Este componente no renderiza nada
}; 