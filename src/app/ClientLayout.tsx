"use client";

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AppView } from '../../types';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Event handlers para Header y Footer
  const handleNavigateHome = () => {
    // Implementar navegación a home
  };

  const handleShowPrivacyPolicy = () => {
    // Implementar mostrar política de privacidad
  };

  const handleShowTermsOfService = () => {
    // Implementar mostrar términos de servicio
  };

  const handleNavigateToMainApp = () => {
    // Implementar navegación a la app principal
  };

  const headerProps = {
    title: "BoatTrip Planner",
    onNavigateHome: handleNavigateHome,
    currentView: AppView.MAIN_APP,
  };

  const footerProps = {
    onShowPrivacyPolicy: handleShowPrivacyPolicy,
    onShowTermsOfService: handleShowTermsOfService,
    onNavigateToMainApp: handleNavigateToMainApp,
    showAds: false,
    currentView: AppView.MAIN_APP,
  };

  return (
    <>
      <Header {...headerProps} />
      <main role="main">{children}</main>
      <Footer {...footerProps} />
    </>
  );
} 