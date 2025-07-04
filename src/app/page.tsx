<<<<<<< HEAD
"use client";
import { useState } from "react";
import { WizardProvider } from "@/components/wizard/WizardContext";
import WizardSteps from "@/components/wizard/WizardSteps";
import TripCard, { Trip } from "@/components/TripCard";
import FloatingChat from '@/components/FloatingChat';

export default function Home() {
  const [result, setResult] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // Esta función será llamada desde el último paso del wizard
  const handleGenerate = async (data: any) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generateTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const trip = await res.json();
      setResult(trip);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLoading(false);
  };

  return (
    <WizardProvider>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-200 px-4 py-8">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-xl p-6">
          {!result && !loading && (
            <WizardSteps onGenerate={handleGenerate} />
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-700 border-opacity-50"></div>
              <span className="text-cyan-700 font-bold text-lg">Generando tu recomendación...</span>
            </div>
          )}
          {result && !loading && (
            <div>
              <TripCard trip={result} />
              <button onClick={handleReset} className="mt-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-6 rounded-lg">Nueva recomendación</button>
            </div>
          )}
        </div>
        <FloatingChat />
      </main>
    </WizardProvider>
=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
>>>>>>> d5fc395
  );
}
