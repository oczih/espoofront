/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2,  ArrowRight,  Briefcase, Sparkles, TrendingUp, FileText, Shield, Building2, Rocket, Globe, MessageSquare, BookOpen, Users, Zap, Target, Award, ChevronRight, Play } from 'lucide-react';
import { TextReveal } from '@/components/ui/text-reveal';
import Particles from '@/components/particles';
import { useRouter } from 'next/navigation';
import { useSession} from "next-auth/react";
import Link from 'next/link';
type Language = 'en' | 'fi';

type BusinessStage = 'idea' | 'planning' | 'registered' | 'operating';

type UserType = 'entrepreneur' | 'advisor' | null;

interface UserProfile {
  name: string;
  businessStage: BusinessStage;
  industry: string;
  language: Language;
  completedSteps: string[];
  notes: string;
}

interface StartupGuideProps {
  userProfile?: UserProfile | null;
  onProfileUpdate?: (profile: UserProfile) => void;
  language?: Language;
  onNavigate?: (page: string) => void;
  onSelectUserType?: (type: UserType) => void;
}

const translations = {
  en: {
    // Landing page
    hero: {
      title: 'Start Your Business Journey',
      description: 'Your digital guide to starting and growing a business in Finland. Get personalized guidance, navigate regulations, and connect with expert advisors.',
      ctaEntrepreneur: 'I\'m Starting a Business',
      ctaAdvisor: 'I\'m an Advisor',
      watchDemo: 'Watch Demo',
    },
    features: {
      title: 'Everything You Need to Succeed',
      subtitle: 'Comprehensive tools and guidance for your entrepreneurial journey',
      items: [
        {
          title: 'AI-Powered Guidance',
          description: 'Get instant answers to your business questions with our intelligent assistant',
        },
        {
          title: 'Step-by-Step Roadmap',
          description: 'Follow a personalized path from idea to launch with clear milestones',
        },
        {
          title: 'Expert Support',
          description: 'Connect with Espoo business advisors who understand your needs',
        },
        {
          title: 'Multilingual Support',
          description: 'Access all content in English or Finnish for seamless understanding',
        },
        {
          title: 'Real-Time Resources',
          description: 'Access up-to-date information on permits, funding, and regulations',
        },
        {
          title: 'Pre-Meeting Prep',
          description: 'Prepare for advisor meetings with guided preparation tools',
        },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Your journey from idea to successful business in three simple steps',
      steps: [
        {
          title: 'Create Your Profile',
          description: 'Tell us about your business idea and where you are in your journey',
        },
        {
          title: 'Follow Your Roadmap',
          description: 'Get personalized guidance through funding, taxation, permits, and more',
        },
        {
          title: 'Launch & Grow',
          description: 'Access ongoing support and resources as your business grows',
        },
      ],
    },
    stats: {
      title: 'Join Espoo\'s Thriving Business Community',
      entrepreneurs: 'Entrepreneurs Supported',
      resources: 'Resources Available',
      languages: 'Languages Supported',
      satisfaction: 'Satisfaction Rate',
    },
    cta: {
      title: 'Ready to Start Your Journey?',
      description: 'Join hundreds of entrepreneurs who have successfully launched their businesses with our platform',
      button: 'Get Started Free',
    },
    // Original translations
    welcome: 'Welcome to Your Business Journey',
    setupProfile: 'Let\'s set up your profile',
    name: 'Your Name',
    businessStage: 'Business Stage',
    industry: 'Industry',
    saveProfile: 'Save Profile',
    progressTitle: 'Your Progress',
    journeyMap: 'Your Business Journey',
    stages: {
      idea: 'Idea Stage',
      planning: 'Planning Stage',
      registered: 'Registered',
      operating: 'Operating',
    },
    industries: {
      technology: 'Technology',
      retail: 'Retail',
      services: 'Services',
      manufacturing: 'Manufacturing',
      hospitality: 'Hospitality',
      healthcare: 'Healthcare',
      education: 'Education',
      other: 'Other',
    },
    steps: {
      step1: 'Define Your Business Idea',
      step2: 'Research Funding Options',
      step3: 'Understand Taxation',
      step4: 'Get Required Permits',
      step5: 'Set Up Business Banking',
      step6: 'Arrange Insurance',
      step7: 'Register Your Business',
      step8: 'Launch Your Business',
    },
    stepDescriptions: {
      step1: 'Clarify your business concept and value proposition',
      step2: 'Explore grants, loans, and funding opportunities',
      step3: 'Learn about VAT, income tax, and employer obligations',
      step4: 'Identify and apply for necessary licenses',
      step5: 'Open a business bank account and set up payment systems',
      step6: 'Protect your business with appropriate insurance',
      step7: 'Register with Finnish Trade Register and Tax Administration',
      step8: 'Go to market and start operating',
    },
    explore: 'Explore',
    completed: 'Completed',
    inProgress: 'In Progress',
  },
  fi: {
    // Landing page
    hero: {
      title: 'Aloita Yritysmatkasi',
      subtitle: 'Espoossa',
      description: 'Digitaalinen oppaasi yrityksen perustamiseen ja kasvattamiseen Suomessa. Saat henkilökohtaista ohjausta, navigoit säädöksissä ja otat yhteyttä asiantuntija-neuvonantajiin.',
      ctaEntrepreneur: 'Perustan Yrityksen',
      ctaAdvisor: 'Olen Neuvonantaja',
      watchDemo: 'Katso Demo',
    },
    features: {
      title: 'Kaikki Mitä Tarvitset Menestykseen',
      subtitle: 'Kattavat työkalut ja ohjaus yrittäjyysmatkallesi',
      items: [
        {
          title: 'Tekoälyavusteinen Ohjaus',
          description: 'Saa välittömiä vastauksia liiketoimintakysymyksiisi älykkäällä avustajalla',
        },
        {
          title: 'Vaiheittainen Tiekartta',
          description: 'Seuraa henkilökohtaista polkua ideasta käynnistykseen selkeiden välitavoitteiden avulla',
        },
        {
          title: 'Asiantuntijatuki',
          description: 'Ota yhteyttä Espoon yritysneuvonantajiin, jotka ymmärtävät tarpeesi',
        },
        {
          title: 'Monikielinen Tuki',
          description: 'Käytä kaikkea sisältöä englanniksi tai suomeksi saumattoman ymmärryksen saavuttamiseksi',
        },
        {
          title: 'Reaaliaikaiset Resurssit',
          description: 'Käytä ajantasaista tietoa luvista, rahoituksesta ja säädöksistä',
        },
        {
          title: 'Tapaamisen Valmistelu',
          description: 'Valmistaudu neuvonantajatapaamisiin ohjattujen valmistelutyökalujen avulla',
        },
      ],
    },
    howItWorks: {
      title: 'Näin Se Toimii',
      subtitle: 'Matkasi ideasta menestyväksi yritykseksi kolmessa yksinkertaisessa vaiheessa',
      steps: [
        {
          title: 'Luo Profiilisi',
          description: 'Kerro meille liikeideasta ja siitä, missä olet matkallasi',
        },
        {
          title: 'Seuraa Tiekarttaasi',
          description: 'Saa henkilökohtaista ohjausta rahoitukseen, verotukseen, lupiin ja muuhun',
        },
        {
          title: 'Käynnistä ja Kasva',
          description: 'Käytä jatkuvaa tukea ja resursseja yrityksesi kasvaessa',
        },
      ],
    },
    stats: {
      title: 'Liity Espoon Kukoistavaan Yritysyhteisöön',
      entrepreneurs: 'Tuettua Yrittäjää',
      resources: 'Saatavilla Olevaa Resurssia',
      languages: 'Tuettua Kieltä',
      satisfaction: 'Tyytyväisyysaste',
    },
    cta: {
      title: 'Valmis Aloittamaan Matkasi?',
      description: 'Liity satoihin yrittäjiin, jotka ovat onnistuneesti käynnistäneet yrityksensä alustallamme',
      button: 'Aloita Ilmaiseksi',
    },
    // Original translations
    welcome: 'Tervetuloa yritysmatkallesi',
    setupProfile: 'Luodaan profiilisi',
    name: 'Nimesi',
    businessStage: 'Yrityksen vaihe',
    industry: 'Toimiala',
    saveProfile: 'Tallenna profiili',
    progressTitle: 'Edistymisesi',
    journeyMap: 'Yritysmatkasi',
    stages: {
      idea: 'Ideointivaihe',
      planning: 'Suunnitteluvaihe',
      registered: 'Rekisteröity',
      operating: 'Toiminnassa',
    },
    industries: {
      technology: 'Teknologia',
      retail: 'Vähittäiskauppa',
      services: 'Palvelut',
      manufacturing: 'Valmistus',
      hospitality: 'Majoitus ja ravintola',
      healthcare: 'Terveydenhuolto',
      education: 'Koulutus',
      other: 'Muu',
    },
    steps: {
      step1: 'Määrittele liikeidea',
      step2: 'Tutki rahoitusvaihtoehtoja',
      step3: 'Ymmärrä verotus',
      step4: 'Hanki tarvittavat luvat',
      step5: 'Perusta yrityksen pankkitili',
      step6: 'Järjestä vakuutukset',
      step7: 'Rekisteröi yrityksesi',
      step8: 'Käynnistä yrityksesi',
    },
    stepDescriptions: {
      step1: 'Selkeytä liiketoimintakonsepti ja arvolupaus',
      step2: 'Tutustu avustuksiin, lainoihin ja rahoitusmahdollisuuksiin',
      step3: 'Opi ALV:sta, tuloverosta ja työnantajavelvoitteista',
      step4: 'Tunnista ja hae tarvittavat lisenssit',
      step5: 'Avaa yrityksen pankkitili ja asenna maksujärjestelmät',
      step6: 'Suojaa yrityksesi asianmukaisilla vakuutuksilla',
      step7: 'Rekisteröidy kaupparekisteriin ja verohallinnolle',
      step8: 'Mene markkinoille ja aloita toiminta',
    },
    explore: 'Tutustu',
    completed: 'Valmis',
    inProgress: 'Käynnissä',
  }
};

export default function StartupGuide({ 
  userProfile: userProfileProp = null, 
  language = 'en', 
  onSelectUserType
}: StartupGuideProps) {
  const { data: session } = useSession();
  const t = translations[language];
  const [mounted, setMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(!userProfileProp);

  const router = useRouter()
  
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-700">Loading the app...</span>
        </div>
      </div>
    );
  }


  // Landing Page Component
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <Particles />
        </div>
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
<div className="w-full max-w-4xl mx-auto pb-10">
<img
src="/businessespoo.png"
alt="Business Espoo logo"
className="w-full h-auto object-contain"
/>
</div>
                <h1 className="text-6xl md:text-7xl font-bold mb-4">
                  <TextReveal className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t.hero.title}
                  </TextReveal>
                  <br />
                </h1>
                <motion.p
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.3 }}
className="text-xl text-slate-600 max-w-3xl mx-auto mb-12"
>
{t.hero.description}
</motion.p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t.hero.ctaEntrepreneur}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-32"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                  {t.howItWorks.title}
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  {t.howItWorks.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                {t.howItWorks.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="relative"
                  >
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                          {index + 1}
                        </div>
                        {index < 2 && (
                          <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-16 shadow-2xl"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                {t.cta.title}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t.cta.description}
              </p>
              <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                {t.cta.button}
              </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

}