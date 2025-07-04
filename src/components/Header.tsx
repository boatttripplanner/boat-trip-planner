"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full bg-white/90 shadow-md py-3 px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Image src="/favicon.ico" alt="Favicon" width={36} height={36} className="w-9 h-9" />
        <span className="font-bold text-cyan-800 text-xl flex items-center" style={{lineHeight: '36px'}}>BoatTrip</span>
      </div>
      <nav aria-label="Navegación principal">
        <button
          className="sm:hidden text-cyan-700 text-3xl focus:outline-none"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(v => !v)}
        >
          {open ? "×" : "☰"}
        </button>
        <ul className={`flex flex-col sm:flex-row gap-4 sm:gap-6 text-cyan-700 font-semibold absolute sm:static bg-white/95 sm:bg-transparent left-0 right-0 top-16 sm:top-auto px-4 sm:px-0 py-4 sm:py-0 shadow-lg sm:shadow-none transition-all duration-200 ${open ? 'block' : 'hidden sm:flex'}`}>
          <li><Link href="/" className="hover:underline" onClick={() => setOpen(false)}>Inicio</Link></li>
          <li><Link href="/destinos" className="hover:underline" onClick={() => setOpen(false)}>Destinos</Link></li>
          <li><Link href="/blog" className="hover:underline" onClick={() => setOpen(false)}>Blog</Link></li>
        </ul>
      </nav>
    </header>
  );
} 