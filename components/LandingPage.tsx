'use client';

import { UserType, Language } from '../app/types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Building2, Users, TrendingUp, Shield, Globe, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onSelectUserType: (type: UserType) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Welcome to Espoo Business Hub',
    subtitle: 'Your comprehensive guide to starting and growing a business in Espoo, Finland',
    description: 'We provide personalized support, step-by-step guidance, and expert advisory services to help you navigate regulations, funding, taxation, and more.',
    entrepreneur: 'I\'m an Entrepreneur',
    advisor: 'I\'m an Advisor',
    features: 'What We Offer',
    feature1Title: 'Step-by-Step Guidance',
    feature1Desc: 'Clear, actionable steps for starting your business',
    feature2Title: 'Expert Advisory',
    feature2Desc: 'Connect with experienced business advisors',
    feature3Title: 'AI-Powered Support',
    feature3Desc: 'Get instant answers to your questions 24/7',
    feature4Title: 'Multilingual',
    feature4Desc: 'Available in English, Finnish, and more',
    feature5Title: 'Comprehensive Resources',
    feature5Desc: 'Access to funding, permits, taxation information',
    feature6Title: 'Secure & Confidential',
    feature6Desc: 'Your business information stays private',
  },
  fi: {
    title: 'Tervetuloa Espoo Business Hubiin',
    subtitle: 'Kattava oppaasi yrityksen perustamiseen ja kasvattamiseen Espoossa',
    description: 'Tarjoamme yksilöllistä tukea, vaiheittaisia ohjeita ja asiantuntija-neuvontaa, joka auttaa sinua hallitsemaan säännöksiä, rahoitusta, verotusta ja muuta.',
    entrepreneur: 'Olen yrittäjä',
    advisor: 'Olen neuvonantaja',
    features: 'Mitä tarjoamme',
    feature1Title: 'Vaiheittaiset ohjeet',
    feature1Desc: 'Selkeät, toimivat vaiheet yrityksen perustamiseen',
    feature2Title: 'Asiantuntijaneuvonta',
    feature2Desc: 'Yhteys kokeneisiin yritysneuvonantajiin',
    feature3Title: 'Tekoälytuki',
    feature3Desc: 'Saa välittömiä vastauksia kysymyksiisi 24/7',
    feature4Title: 'Monikielinen',
    feature4Desc: 'Saatavilla englanniksi, suomeksi ja muilla kielillä',
    feature5Title: 'Kattavat resurssit',
    feature5Desc: 'Pääsy rahoitus-, lupa- ja verotustietoihin',
    feature6Title: 'Turvallinen ja luottamuksellinen',
    feature6Desc: 'Yrityksesi tiedot pysyvät yksityisinä',
  }
};

export default function LandingPage({ onSelectUserType, language }: LandingPageProps) {
  const t = translations[language];

  const features = [
    { icon: TrendingUp, title: t.feature1Title, desc: t.feature1Desc },
    { icon: Users, title: t.feature2Title, desc: t.feature2Desc },
    { icon: MessageSquare, title: t.feature3Title, desc: t.feature3Desc },
    { icon: Globe, title: t.feature4Title, desc: t.feature4Desc },
    { icon: Building2, title: t.feature5Title, desc: t.feature5Desc },
    { icon: Shield, title: t.feature6Title, desc: t.feature6Desc },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <Building2 className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-blue-900 mb-6">
            {t.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {t.subtitle}
          </p>
          <p className="text-gray-600 mb-12">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onSelectUserType('entrepreneur')}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-8 py-6"
            >
              {t.entrepreneur}
            </button>
            <button
  onClick={() => onSelectUserType('advisor')}
  className="border cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6"
>
  {t.advisor}
</button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-center text-gray-900 mb-12">
            {t.features}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
