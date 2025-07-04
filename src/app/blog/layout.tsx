import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Blog | BoatTrip Planner',
  description: 'Consejos, rutas y experiencias para navegantes.',
};

export const viewport: Viewport = {
  themeColor: '#0e7490',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
} 