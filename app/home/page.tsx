'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import LandingPage from '@/components/LandingPage';
import StartupGuide from '@/components/StartupGuide';
import FundingModule from '@/components/FundingModule';
import TaxationModule from '@/components/TaxationModule';
import PermitsModule from '@/components/PermitsModule';
import BankingModule from '@/components/BankingModule';
import InsuranceModule from '@/components/InsuranceModule';
import AIAssistant from '@/components/AIAssistant';
import PreMeetingPrep from '@/components/PreMeetingPrep';
import AdvisorDashboard from '@/components/AdvisorDashboard';
import ResourceLibrary from '@/components/ResourceLibrary';
import { UserType, Language, UserProfile } from '@/app/types';

export type { UserType, Language, UserProfile };

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState<UserType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userType');
      return saved ? (saved as UserType) : null;
    }
    return null;
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved ? (saved as Language) : 'en';
    }
    return 'en';
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // Save user data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
      if (userType) {
        localStorage.setItem('userType', userType);
      }
      localStorage.setItem('language', language);
    }
  }, [userProfile, userType, language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (userProfile) {
      setUserProfile({ ...userProfile, language: lang });
    }
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const renderPage = () => {
    if (!userType) {
      return (
        <LandingPage 
          onSelectUserType={setUserType}
          language={language}
        />
      );
    }

    if (userType === 'advisor') {
      return <AdvisorDashboard language={language} />;
    }

    switch (currentPage) {
      case 'home':
        return (
          <StartupGuide 
            userProfile={userProfile}
            onProfileUpdate={handleProfileUpdate}
            language={language}
            onNavigate={setCurrentPage}
          />
        );
      case 'funding':
        return <FundingModule language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'taxation':
        return <TaxationModule language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'permits':
        return <PermitsModule language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'banking':
        return <BankingModule language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'insurance':
        return <InsuranceModule language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'ai-assistant':
        return <AIAssistant language={language} userProfile={userProfile} />;
      case 'pre-meeting':
        return <PreMeetingPrep language={language} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'resources':
        return <ResourceLibrary language={language} />;
      default:
        return (
          <StartupGuide 
            userProfile={userProfile}
            onProfileUpdate={handleProfileUpdate}
            language={language}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {userType && (
        <Navigation 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userType={userType}
          language={language}
          onLanguageChange={handleLanguageChange}
          onLogout={() => {
            setUserType(null);
            setUserProfile(null);
            setCurrentPage('home');
          }}
        />
      )}
      {renderPage()}
    </div>
  );
}
