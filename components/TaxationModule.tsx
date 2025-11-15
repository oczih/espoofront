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
import { FileText, CheckCircle2, ExternalLink, AlertCircle, Calculator } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface TaxationModuleProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const translations = {
  en: {
    title: 'Understanding Taxation',
    subtitle: 'Navigate Finnish tax requirements for your business',
    progress: 'Module Progress',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    visitWebsite: 'Visit Tax Administration',
    keyDeadlines: 'Key Tax Deadlines',
    vat: {
      title: 'Value Added Tax (VAT)',
      desc: 'Most businesses must register for VAT',
      details: 'If your annual turnover exceeds €15,000, you must register for VAT. Standard VAT rate is 24%, with reduced rates of 14% (food, animal feed) and 10% (books, medicines, culture, transport). VAT returns are typically filed monthly or quarterly.',
      requirement: 'Required if turnover > €15,000/year',
      rate: 'Standard rate: 24%',
    },
    income: {
      title: 'Business Income Tax',
      desc: 'Tax on company profits',
      details: 'Corporate income tax rate in Finland is 20% on company profits. Sole proprietors and partnerships are taxed differently - profits are taxed as personal income with progressive rates (6-31.25% municipal tax plus state tax).',
      requirement: 'All profitable businesses',
      rate: 'Corporate: 20% | Personal: 6-44%',
    },
    employer: {
      title: 'Employer Contributions',
      desc: 'Social security and pension contributions',
      details: 'If you hire employees, you must pay employer contributions including pension insurance (average 17%), unemployment insurance (0.5-2%), accident insurance, and group life insurance. Employee contributions are deducted from wages.',
      requirement: 'Required when hiring employees',
      rate: 'Approximately 20-25% of wages',
    },
    prepayment: {
      title: 'Prepayment Tax Register',
      desc: 'Advance tax payments system',
      details: 'Self-employed individuals and companies must register for prepayment tax. You make advance tax payments based on estimated income, and the final tax is determined in annual taxation. Prevents large tax bills at year-end.',
      requirement: 'Required for self-employed',
      rate: 'Based on estimated income',
    },
    ytunnus: {
      title: 'Business ID (Y-tunnus)',
      desc: 'Your unique business identifier',
      details: 'When registering your business with the Trade Register, you receive a Business ID (Y-tunnus) in format 1234567-8. This ID is used in all tax matters, invoicing, and official business communications.',
      requirement: 'Assigned at registration',
      rate: 'Free with business registration',
    },
    deadlines: [
      { period: 'Monthly', task: 'VAT return (if monthly filer)', date: '12th of following month' },
      { period: 'Quarterly', task: 'VAT return (if quarterly filer)', date: '12th of month after quarter' },
      { period: 'Annually', task: 'Income tax return', date: 'End of February (sole traders) / 4 months after fiscal year (companies)' },
      { period: 'Annually', task: 'Employer annual report', date: 'End of January' },
    ],
    alert: 'Always consult with a tax professional or accountant for your specific situation. Tax rules can be complex and vary based on business structure.',
  },
  fi: {
    title: 'Verotuksen ymmärtäminen',
    subtitle: 'Suomen verovaatimukset yrityksellesi',
    progress: 'Moduulin edistyminen',
    markComplete: 'Merkitse valmiiksi',
    completed: 'Valmis',
    visitWebsite: 'Siirry Verohallinnolle',
    keyDeadlines: 'Tärkeimmät verokalenterin päivät',
    vat: {
      title: 'Arvonlisävero (ALV)',
      desc: 'Useimmat yritykset on rekisteröitävä ALV:n maksajiksi',
      details: 'Jos vuotuinen liikevaihto ylittää 15 000 €, sinun on rekisteröidyttävä ALV:n maksajaksi. Yleinen ALV-kanta on 24%, alennetut kannat 14% (elintarvikkeet, rehut) ja 10% (kirjat, lääkkeet, kulttuuri, liikenne). ALV-ilmoitukset tehdään yleensä kuukausittain tai neljännesvuosittain.',
      requirement: 'Pakollinen, jos liikevaihto > 15 000 €/v',
      rate: 'Yleinen kanta: 24%',
    },
    income: {
      title: 'Yritystulovero',
      desc: 'Vero yrityksen voitosta',
      details: 'Yhteisövero Suomessa on 20% yrityksen voitosta. Yksityisiä elinkeinonharjoittajia ja henkilöyhtiöitä verotetaan eri tavalla - voitot verotetaan henkilökohtaisina tuloina progressiivisilla verokannoilla (6-31,25% kunnallisvero plus valtion vero).',
      requirement: 'Kaikki voittoa tekevät yritykset',
      rate: 'Yhteisö: 20% | Henkilö: 6-44%',
    },
    employer: {
      title: 'Työnantajan sivukulut',
      desc: 'Sosiaaliturva- ja eläkemaksut',
      details: 'Jos palkkaat työntekijöitä, sinun on maksettava työnantajan sivukulut mukaan lukien eläkevakuutus (keskimäärin 17%), työttömyysvakuutus (0,5-2%), tapaturmavakuutus ja ryhmähenkivakuutus. Työntekijän maksut vähennetään palkasta.',
      requirement: 'Pakollinen työntekijöitä palkattaessa',
      rate: 'Noin 20-25% palkoista',
    },
    prepayment: {
      title: 'Ennakkoperintärekisteri',
      desc: 'Ennakkoverojen maksujärjestelmä',
      details: 'Itsenäisten ammatinharjoittajien ja yritysten on rekisteröidyttävä ennakkoperintärekisteriin. Maksat ennakkoveroja arvioidun tulon perusteella, ja lopullinen vero määritetään vuosittaisessa verotuksessa. Estää suuret verolaskut vuoden lopussa.',
      requirement: 'Pakollinen itsenäisille ammatinharjoittajille',
      rate: 'Perustuu arvioituun tuloon',
    },
    ytunnus: {
      title: 'Y-tunnus',
      desc: 'Yrityksesi yksilöllinen tunniste',
      details: 'Kun rekisteröit yrityksesi kaupparekisteriin, saat Y-tunnuksen muodossa 1234567-8. Tätä tunnusta käytetään kaikissa veroasioissa, laskutuksessa ja virallisissa yritysviestinnöissä.',
      requirement: 'Myönnetään rekisteröinnin yhteydessä',
      rate: 'Ilmainen yritysrekisteröinnin yhteydessä',
    },
    deadlines: [
      { period: 'Kuukausittain', task: 'ALV-ilmoitus (kuukausittain ilmoittavat)', date: '12. pv seuraavaa kuuta' },
      { period: 'Neljännesvuosittain', task: 'ALV-ilmoitus (neljännesvuosittain ilmoittavat)', date: '12. pv neljännestä seuraavaa kuuta' },
      { period: 'Vuosittain', task: 'Veroilmoitus', date: 'Helmikuun loppu (toiminimet) / 4 kk tilivuoden jälkeen (yhtiöt)' },
      { period: 'Vuosittain', task: 'Työnantajan vuosi-ilmoitus', date: 'Tammikuun loppu' },
    ],
    alert: 'Ota aina yhteyttä veroasiantuntijaan tai kirjanpitäjään omaa tilannettasi varten. Verosäännöt voivat olla monimutkaisia ja vaihtelevat yritysmuodon mukaan.',
  }
};

export default function TaxationModule({ language, userProfile, onProfileUpdate }: TaxationModuleProps) {
  const t = translations[language];

  const taxTypes = [
    { id: 'vat', icon: Calculator, ...t.vat },
    { id: 'income', icon: FileText, ...t.income },
    { id: 'employer', icon: FileText, ...t.employer },
    { id: 'prepayment', icon: Calculator, ...t.prepayment },
    { id: 'ytunnus', icon: FileText, ...t.ytunnus },
  ];

  const handleMarkComplete = () => {
    if (userProfile) {
      const completedSteps = userProfile.completedSteps.includes('step3')
        ? userProfile.completedSteps
        : [...userProfile.completedSteps, 'step3'];
      onProfileUpdate({ ...userProfile, completedSteps });
    }
  };

  const isModuleComplete = userProfile?.completedSteps.includes('step3');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t.alert}</AlertDescription>
        </Alert>

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

      <div className="space-y-6 mb-12">
        <Accordion type="single" collapsible className="space-y-3">
          {taxTypes.map((tax) => {
            const Icon = tax.icon;
            return (
              <AccordionItem key={tax.id} value={tax.id} className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="transition-colors hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-900">{tax.title}</h3>
                      <p className="text-gray-600">{tax.desc}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4 pl-10">
                    <p className="text-gray-700">{tax.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-900 mb-1">Requirement</p>
                        <p className="text-blue-700">{tax.requirement}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-900 mb-1">Rate/Details</p>
                        <p className="text-green-700">{tax.rate}</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <Card className="p-6">
        <h2 className="text-gray-900 mb-4">{t.keyDeadlines}</h2>
        <div className="space-y-3">
          {t.deadlines.map((deadline, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-700">{deadline.period}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{deadline.task}</h3>
                <p className="text-gray-600">{deadline.date}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          
          className="gap-2 mt-6"
          onClick={() => window.open('https://www.vero.fi/en/', '_blank')}
        >
          {t.visitWebsite}
          <ExternalLink className="w-4 h-4" />
        </button>
      </Card>
    </div>
  );
}
