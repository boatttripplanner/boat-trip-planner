"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-cyan-800 text-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-4 z-50 animate-fade-in">
      <span>¿Quieres agregar BoatTrip Planner a tu pantalla de inicio?</span>
      <button onClick={handleInstall} className="bg-white text-cyan-800 font-bold px-4 py-2 rounded-lg hover:bg-cyan-100 transition">Agregar</button>
      <button onClick={() => setVisible(false)} aria-label="Cerrar aviso" className="ml-2 text-white/70 hover:text-white text-2xl leading-none">×</button>
    </div>
  );
} 