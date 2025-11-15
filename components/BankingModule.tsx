'use client';

import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Building2, CheckCircle2, ExternalLink, CreditCard, Smartphone } from 'lucide-react';

interface BankingModuleProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const translations = {
  en: {
    title: 'Business Banking',
    subtitle: 'Set up banking and payment systems for your business',
    progress: 'Module Progress',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    majorBanks: 'Major Finnish Banks',
    requirements: 'What You Need',
    paymentSolutions: 'Payment Solutions',
    requirementsList: [
      'Valid Business ID (Y-tunnus)',
      'Proof of business registration',
      'Valid identification (passport or ID card)',
      'Business plan or description',
      'Beneficial owner information',
    ],
    nordea: {
      title: 'Nordea',
      desc: 'Largest bank in the Nordic region',
      details: 'Comprehensive business banking services including accounts, loans, payment solutions, and international services. Strong digital banking platform. Good for businesses with Nordic connections.',
      features: 'Business account, online banking, cards, payment terminals',
      link: 'https://www.nordea.fi/en/business/',
    },
    op: {
      title: 'OP Financial Group',
      desc: 'Finland\'s largest financial services group',
      details: 'Cooperative bank offering full range of business services. Known for good customer service and local presence. Especially strong in SME sector.',
      features: 'Business account, financing, insurance, investment services',
      link: 'https://www.op.fi/business-customers',
    },
    danske: {
      title: 'Danske Bank',
      desc: 'Nordic banking services',
      details: 'Full-service bank with focus on business customers. Good international connectivity. Offers specialized services for growing companies.',
      features: 'Business banking, trade finance, cash management',
      link: 'https://danskebank.fi/yritys',
    },
    holvi: {
      title: 'Holvi',
      desc: 'Digital banking for entrepreneurs',
      details: 'Modern online banking platform designed for small businesses and freelancers. Easy account opening, integrated invoicing, and accounting tools. No physical branches.',
      features: 'Business account, invoicing, expense tracking, debit card',
      link: 'https://www.holvi.com',
    },
    paytrail: {
      title: 'Paytrail (Checkout Finland)',
      desc: 'Payment service provider',
      details: 'Leading Finnish payment gateway for online businesses. Supports all major Finnish payment methods, cards, and mobile payments. Easy integration with e-commerce platforms.',
      features: 'Online payments, cards, mobile pay, invoicing',
      link: 'https://www.paytrail.com',
    },
    stripe: {
      title: 'Stripe',
      desc: 'International payment platform',
      details: 'Global payment processor popular among tech companies and online businesses. Easy API integration, supports international cards and currencies. Good for scaling internationally.',
      features: 'Card payments, subscriptions, global reach',
      link: 'https://stripe.com',
    },
    klarna: {
      title: 'Klarna',
      desc: 'Payment and shopping service',
      details: 'Offers "buy now, pay later" solutions for e-commerce. Very popular among Finnish consumers. Can increase conversion rates for online stores.',
      features: 'Delayed payments, installments, direct payments',
      link: 'https://www.klarna.com/fi/yritys/',
    },
  },
  fi: {
    title: 'Yrityksen pankkipalvelut',
    subtitle: 'Perusta pankkitili ja maksujärjestelmät yrityksellesi',
    progress: 'Moduulin edistyminen',
    markComplete: 'Merkitse valmiiksi',
    completed: 'Valmis',
    majorBanks: 'Suuret suomalaiset pankit',
    requirements: 'Mitä tarvitset',
    paymentSolutions: 'Maksuratkaisut',
    requirementsList: [
      'Voimassa oleva Y-tunnus',
      'Todiste yrityksen rekisteröinnistä',
      'Voimassa oleva henkilöllisyystodistus',
      'Liiketoimintasuunnitelma tai kuvaus',
      'Tosiasiallisen edunsaajan tiedot',
    ],
    nordea: {
      title: 'Nordea',
      desc: 'Pohjoismaiden suurin pankki',
      details: 'Kattavat yrityspankkipalvelut mukaan lukien tilit, lainat, maksuratkaisut ja kansainväliset palvelut. Vahva digitaalinen pankkialusta. Hyvä yrityksille, joilla on pohjoismaisia yhteyksiä.',
      features: 'Yritystili, verkkopankki, kortit, maksupäätteet',
      link: 'https://www.nordea.fi/yritys/',
    },
    op: {
      title: 'OP Ryhmä',
      desc: 'Suomen suurin finanssipalveluryhmä',
      details: 'Osuuspankki, joka tarjoaa täyden valikoiman yrityspalveluita. Tunnettu hyvästä asiakaspalvelusta ja paikallisesta läsnäolosta. Erityisen vahva pk-sektorilla.',
      features: 'Yritystili, rahoitus, vakuutukset, sijoituspalvelut',
      link: 'https://www.op.fi/yritys',
    },
    danske: {
      title: 'Danske Bank',
      desc: 'Pohjoismainen pankkipalvelu',
      details: 'Täyden palvelun pankki, joka keskittyy yritysasiakkaisiin. Hyvä kansainvälinen yhteys. Tarjoaa erikoispalveluita kasvaville yrityksille.',
      features: 'Yrityspankkipalvelut, kaupparahoitus, kassanhallinta',
      link: 'https://danskebank.fi/yritys',
    },
    holvi: {
      title: 'Holvi',
      desc: 'Digitaalinen pankki yrittäjille',
      details: 'Moderni verkkopankkialusta pienyrityksille ja freelancereille. Helppo tilin avaus, integroitu laskutus ja kirjanpitotyökalut. Ei fyysisiä konttoreita.',
      features: 'Yritystili, laskutus, kulujen seuranta, pankkikortti',
      link: 'https://www.holvi.com/fi',
    },
    paytrail: {
      title: 'Paytrail (Checkout Finland)',
      desc: 'Maksupalveluntarjoaja',
      details: 'Johtava suomalainen maksuväylä verkkoyrityksille. Tukee kaikkia suuria suomalaisia maksutapoja, kortteja ja mobiilimaksuja. Helppo integrointi verkkokauppa-alustoihin.',
      features: 'Verkkomaksut, kortit, mobiilimaksu, laskutus',
      link: 'https://www.paytrail.com/fi',
    },
    stripe: {
      title: 'Stripe',
      desc: 'Kansainvälinen maksualusta',
      details: 'Globaali maksuprosessori suosittu teknologiayritysten ja verkkoyritysten keskuudessa. Helppo API-integraatio, tukee kansainvälisiä kortteja ja valuuttoja. Hyvä kansainväliseen skaalautumiseen.',
      features: 'Korttimaksut, tilaukset, globaali kattavuus',
      link: 'https://stripe.com',
    },
    klarna: {
      title: 'Klarna',
      desc: 'Maksu- ja ostospalvelu',
      details: 'Tarjoaa "osta nyt, maksa myöhemmin" -ratkaisuja verkkokaupalle. Erittäin suosittu suomalaisten kuluttajien keskuudessa. Voi lisätä verkkokauppojen konversiota.',
      features: 'Viivästetyt maksut, osamaksut, suorat maksut',
      link: 'https://www.klarna.com/fi/yritys/',
    },
  }
};

export default function BankingModule({ language, userProfile, onProfileUpdate }: BankingModuleProps) {
  const t = translations[language];

  const banks = [
    { id: 'nordea', icon: Building2, ...t.nordea },
    { id: 'op', icon: Building2, ...t.op },
    { id: 'danske', icon: Building2, ...t.danske },
    { id: 'holvi', icon: Smartphone, ...t.holvi },
  ];

  const paymentSolutions = [
    { id: 'paytrail', icon: CreditCard, ...t.paytrail },
    { id: 'stripe', icon: CreditCard, ...t.stripe },
    { id: 'klarna', icon: Smartphone, ...t.klarna },
  ];

  const handleMarkComplete = () => {
    if (userProfile) {
      const completedSteps = userProfile.completedSteps.includes('step5')
        ? userProfile.completedSteps
        : [...userProfile.completedSteps, 'step5'];
      onProfileUpdate({ ...userProfile, completedSteps });
    }
  };

  const isModuleComplete = userProfile?.completedSteps.includes('step5');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 mb-2">{t.progress}</p>
              <Progress value={isModuleComplete ? 100 : 0} className="h-2" />
            </div>
            <button
              onClick={handleMarkComplete}
              disabled={isModuleComplete}
              className="ml-4 bg-blue-600 transition-colors hover:bg-blue-700"
            >
              {isModuleComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t.completed}
                </>
              ) : (
                t.markComplete
              )}
            </button>
          </div>
        </Card>
      </div>

      {/* Requirements */}
      <Card className="p-6 mb-8">
        <h2 className="text-gray-900 mb-4">{t.requirements}</h2>
        <ul className="space-y-2">
          {t.requirementsList.map((req, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Banks */}
      <div className="mb-12">
        <h2 className="text-gray-900 mb-4">{t.majorBanks}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {banks.map((bank) => {
            const Icon = bank.icon;
            return (
              <AccordionItem key={bank.id} value={bank.id} className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="transition-colors hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-900">{bank.title}</h3>
                      <p className="text-gray-600">{bank.desc}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4 pl-10">
                    <p className="text-gray-700">{bank.details}</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900 mb-1">Services</p>
                      <p className="text-blue-700">{bank.features}</p>
                    </div>

                    <button
                      
                      className="gap-2"
                      onClick={() => window.open(bank.link, '_blank')}
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Payment Solutions */}
      <div>
        <h2 className="text-gray-900 mb-4">{t.paymentSolutions}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {paymentSolutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <AccordionItem key={solution.id} value={solution.id} className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="transition-colors hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-900">{solution.title}</h3>
                      <p className="text-gray-600">{solution.desc}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4 pl-10">
                    <p className="text-gray-700">{solution.details}</p>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-900 mb-1">Features</p>
                      <p className="text-green-700">{solution.features}</p>
                    </div>

                    <button
                      
                      className="gap-2"
                      onClick={() => window.open(solution.link, '_blank')}
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
