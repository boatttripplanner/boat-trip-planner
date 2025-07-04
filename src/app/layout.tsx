import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AppView } from '../../types';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoatTrip Planner",
  description: "Recomienda rutas, ideas y productos para navegar en cualquier destino del mundo.",
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/android-chrome-512x512.png' },
    { rel: 'manifest', url: '/site.webmanifest' },
  ],
};

export const viewport: Viewport = {
  themeColor: '#0e7490',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Mocks para los props requeridos
  const headerProps = {
    title: "BoatTrip Planner",
    onNavigateHome: () => {},
    currentView: AppView.MAIN_APP,
  };
  const footerProps = {
    onShowPrivacyPolicy: () => {},
    onShowTermsOfService: () => {},
    onNavigateToMainApp: () => {},
    showAds: false,
    currentView: AppView.MAIN_APP,
  };
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sky-50 text-cyan-900`}
      >
        <Header {...headerProps} />
        <main role="main">{children}</main>
        <Footer {...footerProps} />
      </body>
    </html>
  );
}
