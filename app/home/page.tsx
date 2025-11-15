'use client';

import { useState, useEffect, startTransition } from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import UserDataModal from '@/components/UserDataModal';
import { UserType, Language, UserProfile, EspooUser, Appointment } from '@/app/types';
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(false);
  const router = useRouter();

  const fetchAppointments = async () => {
    if (!session?.user?.business) return;

    const businesses = Array.isArray(session.user.business)
      ? session.user.business
      : [session.user.business];

    const businessId = typeof businesses[0] === 'string'
      ? businesses[0]
      : businesses[0]._id;

    try {
      const res = await fetch(`/api/appointments?businessId=${businessId}`);
      const data = await res.json();
      const apps = (data.appointments || []).map((a: Appointment) => ({
        ...a,
        type: a.type || "remote", // default to remote if missing
      }));
      setAppointments(apps);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    }
  };

  // Initialize session user & profile
  useEffect(() => {
    if (!session?.user) return;
    startTransition(() => {
      setUserType('entrepreneur');
      setEspooUser(session.user);

      const savedProfile = typeof window !== 'undefined' && localStorage.getItem('userProfile');
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

  // Initial fetch
  useEffect(() => {
    if (!session?.user?.business) return;
  
    const fetch = async () => {
      await fetchAppointments();
    };
  
    fetch();
  }, [session?.user?.business]);

  useEffect(() => {
    if (!appointmentsUpdated) return;
  
    const refetchAppointments = async () => {
      await fetchAppointments(); // fetch new appointments
      startTransition(() => {
        setAppointmentsUpdated(false); // mark as done without cascading render
      });
    };
  
    refetchAppointments();
  }, [appointmentsUpdated]);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {needsModal && espooUser && <UserDataModal user={espooUser} onComplete={handleModalComplete} />}
      
      <Navigation
        language={language}
        onLanguageChange={handleLanguageChange}
        onBooked={() => setAppointmentsUpdated(true)}
        />

      <div className="flex flex-1 gap-4 px-4 mt-4">
        <div className="flex-1">
          <AIAssistant userProfile={userProfile} language={language} />
        </div>

        <div className="w-80 bg-white rounded-xl shadow-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-black">{language === "fi" ? "Tulevat Tapaamiset" : "Upcoming Appointments"}</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm text-black">{language === "fi" ? "Ei tulevia tapaamisia":"No upcoming appointments."}</p>
          ) : (
            <ul className="space-y-3">
              {appointments
                .filter(app => new Date(app.date) > new Date())
                .map(app => (
                  <li key={app.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <p className="text-sm text-gray-600">
                      {language === "fi" 
                        ? new Date(app.date).toLocaleDateString('fi-FI') + ' ' + new Date(app.date).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) 
                        : new Date(app.date).toLocaleDateString('en-US') + ' ' + new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    </p>
                    {app.notes && <p className="text-sm text-gray-800 mt-1">{app.notes}</p>}
                    <p className={`text-xs mt-1 font-medium ${app.status === 'scheduled' ? 'text-blue-600' : 'text-gray-400'}`}>
                      {language === "fi" 
                        ? app.status === 'scheduled' 
                          ? 'Aikataulutettu' 
                          : 'Peruutettu' 
                        : app.status.charAt(0).toUpperCase() + app.status.slice(1)
                      }
                    </p>
                    <p className="text-xs mt-1 font-medium text-black">{app.type === "onsite" ? (language === "fi" ? "Paikan päällä" : "On-site") : (language === "fi" ? "Etänä" : "Remote")}</p>
                  </li>
                ))
              }
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
