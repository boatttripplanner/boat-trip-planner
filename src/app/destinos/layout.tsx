import type { ReactNode } from "react";
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#0e7490',
};

export default function DestinosLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 