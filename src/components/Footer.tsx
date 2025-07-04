import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 text-cyan-700 text-sm py-4 px-4 flex flex-col sm:flex-row items-center justify-between mt-10 border-t border-cyan-100">
      <div className="flex items-center gap-1">
        <Image src="/favicon.ico" alt="Favicon" width={16} height={16} />
        <span>© {new Date().getFullYear()} BoatTrip Planner</span>
      </div>
      <div className="flex gap-4 mt-2 sm:mt-0">
        <a href="#" className="hover:underline">Contacto</a>
        <a href="#" className="hover:underline">Política de privacidad</a>
      </div>
    </footer>
  );
} 