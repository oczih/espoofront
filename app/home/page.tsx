'use client';

import { useState, useEffect, startTransition } from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import UserDataModal from '@/components/UserDataModal';
import { UserType, Language, UserProfile, EspooUser } from '@/app/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function App() {
  const { data: session } = useSession();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [espooUser, setEspooUser] = useState<EspooUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [needsModal, setNeedsModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Initialize session user & profile
  useEffect(() => {
    if (!session?.user) return;
    startTransition(() => {
      setUserType('entrepreneur');
      setEspooUser(session.user);

      if (typeof window !== 'undefined') {
        const savedProfile = localStorage.getItem('userProfile');
        setUserProfile(savedProfile
          ? JSON.parse(savedProfile)
          : {
              name: session.user.name || '',
              businessStage: 'idea',
              industry: '',
              language,
              completedSteps: [],
              notes: '',
            });
      }
    });
  }, [session, language]);

  // Check missing DB fields
  useEffect(() => {
    if (!session?.user?.id) return;
    const checkMissing = async () => {
      const res = await fetch('/api/user/missing', { headers: { 'x-user-id': session.user.id } });
      const data = await res.json();
      if (data.missingFields.length > 0) setNeedsModal(true);
    };
    checkMissing();
  }, [session?.user?.id]);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!session) router.push('/');
  }, [session, router]);

  const handleModalComplete = () => setNeedsModal(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (userProfile) {
      const updatedProfile = { ...userProfile, language: lang };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {needsModal && espooUser && <UserDataModal user={espooUser} onComplete={handleModalComplete} />}
      
      <Navigation
        language={language}
        onLanguageChange={handleLanguageChange} // only language control
      />
  
      <AIAssistant userProfile={userProfile} language={language} />
    </div>
  );
}
