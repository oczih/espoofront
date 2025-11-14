'use client';

import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Award, CheckCircle2, ExternalLink, FileCheck } from 'lucide-react';

interface PermitsModuleProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const translations = {
  en: {
    title: 'Permits & Licenses',
    subtitle: 'Ensure your business has all required permissions',
    progress: 'Module Progress',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    universal: 'Universal Requirements',
    industrySpecific: 'Industry-Specific Permits',
    optional: 'Optional',
    required: 'Required',
    trade: {
      title: 'Trade Register Entry',
      desc: 'Basic requirement for most businesses',
      details: 'Almost all businesses operating in Finland must be registered in the Trade Register. Registration is done through the Finnish Patent and Registration Office (PRH). The registration grants you a Business ID (Y-tunnus) and makes your business legally recognized.',
      fee: '€110-€380',
      timeline: '2-4 weeks',
      authority: 'Finnish Patent and Registration Office (PRH)',
    },
    vat: {
      title: 'VAT Registration',
      desc: 'Required if turnover exceeds €15,000',
      details: 'Value Added Tax registration is mandatory when your annual turnover exceeds €15,000. You can voluntarily register even below this threshold. Registration is done through the Tax Administration.',
      fee: 'Free',
      timeline: 'Immediate',
      authority: 'Finnish Tax Administration',
    },
    prepayment: {
      title: 'Prepayment Tax Register',
      desc: 'For businesses that invoice other companies',
      details: 'Registration in the Prepayment Tax Register allows you to invoice other businesses without withholding tax. Highly recommended for B2B businesses. Requires advance tax payments to be up to date.',
      fee: 'Free',
      timeline: '1-2 weeks',
      authority: 'Finnish Tax Administration',
    },
    food: {
      title: 'Food Handling Permit',
      desc: 'For restaurants, cafes, and food production',
      details: 'Businesses handling food must notify local health authorities and employees need food hygiene training. Facilities must meet health and safety standards. Inspections are conducted regularly.',
      fee: 'Varies by municipality',
      timeline: '4-8 weeks',
      authority: 'Local Health Authority (Valvira)',
      industries: ['hospitality', 'retail'],
    },
    alcohol: {
      title: 'Alcohol License',
      desc: 'To sell or serve alcoholic beverages',
      details: 'Serving alcohol requires a license from the Regional State Administrative Agency (AVI). Different licenses for selling packaged alcohol vs. serving in restaurants. Strict requirements on applicants and premises.',
      fee: '€500-€5,000',
      timeline: '2-6 months',
      authority: 'Regional State Administrative Agency (AVI)',
      industries: ['hospitality'],
    },
    healthcare: {
      title: 'Healthcare Service License',
      desc: 'For medical and healthcare services',
      details: 'Private healthcare services must be registered with Valvira (National Supervisory Authority for Welfare and Health). Requires qualified healthcare professionals and compliant facilities.',
      fee: '€150-€400',
      timeline: '1-3 months',
      authority: 'Valvira',
      industries: ['healthcare'],
    },
    building: {
      title: 'Building Permit',
      desc: 'For construction and renovation',
      details: 'Major construction or renovation work requires a building permit from the local municipality. Includes structural changes, new buildings, and significant renovations. Plans must be approved by authorities.',
      fee: 'Varies significantly',
      timeline: '1-6 months',
      authority: 'Local Municipality',
      industries: ['manufacturing', 'hospitality', 'retail'],
    },
    environmental: {
      title: 'Environmental Permit',
      desc: 'For activities affecting the environment',
      details: 'Businesses with environmental impact (emissions, waste, chemicals) may need environmental permits. Required by the Environmental Protection Act. Scope varies based on activity type and scale.',
      fee: '€200-€5,000+',
      timeline: '3-12 months',
      authority: 'Regional State Administrative Agency (AVI) or ELY Centre',
      industries: ['manufacturing'],
    },
  },
  fi: {
    title: 'Luvat ja lisenssit',
    subtitle: 'Varmista, että yrityksellä on kaikki tarvittavat luvat',
    progress: 'Moduulin edistyminen',
    markComplete: 'Merkitse valmiiksi',
    completed: 'Valmis',
    universal: 'Yleiset vaatimukset',
    industrySpecific: 'Toimialakohtaiset luvat',
    optional: 'Valinnainen',
    required: 'Pakollinen',
    trade: {
      title: 'Kaupparekisteri-ilmoitus',
      desc: 'Perusvaatimus useimmille yrityksille',
      details: 'Lähes kaikkien Suomessa toimivien yritysten on oltava rekisteröitynä kaupparekisteriin. Rekisteröinti tehdään Patentti- ja rekisterihallituksen (PRH) kautta. Rekisteröinti antaa Y-tunnuksen ja tekee yrityksestäsi laillisesti tunnustetun.',
      fee: '110-380 €',
      timeline: '2-4 viikkoa',
      authority: 'Patentti- ja rekisterihallitus (PRH)',
    },
    vat: {
      title: 'ALV-rekisteröinti',
      desc: 'Pakollinen, jos liikevaihto ylittää 15 000 €',
      details: 'Arvonlisäverorekisteröinti on pakollinen, kun vuotuinen liikevaihto ylittää 15 000 €. Voit rekisteröityä vapaaehtoisesti myös tämän kynnyksen alapuolella. Rekisteröinti tehdään Verohallinnon kautta.',
      fee: 'Ilmainen',
      timeline: 'Välitön',
      authority: 'Verohallinto',
    },
    prepayment: {
      title: 'Ennakkoperintärekisteri',
      desc: 'Yrityksille, jotka laskuttavat muita yrityksiä',
      details: 'Ennakkoperintärekisteriin rekisteröityminen mahdollistaa muiden yritysten laskuttamisen ilman ennakonpidätystä. Erittäin suositeltava B2B-yrityksille. Edellyttää ennakkoverojen olevan ajan tasalla.',
      fee: 'Ilmainen',
      timeline: '1-2 viikkoa',
      authority: 'Verohallinto',
    },
    food: {
      title: 'Elintarvikelupa',
      desc: 'Ravintoloille, kahviloille ja elintarviketuotannolle',
      details: 'Elintarvikkeita käsittelevien yritysten on ilmoitettava paikallisille terveysviranomaisille ja työntekijöillä tulee olla elintarvikehygieeninen koulutus. Tilojen on täytettävä terveys- ja turvallisuusstandardit. Tarkastuksia tehdään säännöllisesti.',
      fee: 'Vaihtelee kunnan mukaan',
      timeline: '4-8 viikkoa',
      authority: 'Paikallinen terveysviranomainen (Valvira)',
      industries: ['hospitality', 'retail'],
    },
    alcohol: {
      title: 'Alkoholilupa',
      desc: 'Alkoholijuomien myyntiin tai tarjoiluun',
      details: 'Alkoholin tarjoiluun tarvitaan lupa aluehallintovirastolta (AVI). Erilaiset luvat pakattuna myytävälle alkoholille vs. ravintoloissa tarjoiluun. Tiukat vaatimukset hakijoille ja tiloille.',
      fee: '500-5000 €',
      timeline: '2-6 kuukautta',
      authority: 'Aluehallintovirasto (AVI)',
      industries: ['hospitality'],
    },
    healthcare: {
      title: 'Terveydenhuoltopalvelulupa',
      desc: 'Lääketieteellisille ja terveyspalveluille',
      details: 'Yksityiset terveyspalvelut on rekisteröitävä Valviraan (Sosiaali- ja terveysalan lupa- ja valvontavirasto). Edellyttää päteviä terveydenhuollon ammattilaisia ja vaatimusten mukaisia tiloja.',
      fee: '150-400 €',
      timeline: '1-3 kuukautta',
      authority: 'Valvira',
      industries: ['healthcare'],
    },
    building: {
      title: 'Rakennuslupa',
      desc: 'Rakentamiseen ja kunnostukseen',
      details: 'Merkittävät rakentamis- tai kunnostustyöt vaativat rakennusluvan paikalliselta kunnalta. Sisältää rakenteelliset muutokset, uudet rakennukset ja merkittävät kunnostukset. Suunnitelmat on hyväksytettävä viranomaisilla.',
      fee: 'Vaihtelee merkittävästi',
      timeline: '1-6 kuukautta',
      authority: 'Paikallinen kunta',
      industries: ['manufacturing', 'hospitality', 'retail'],
    },
    environmental: {
      title: 'Ympäristölupa',
      desc: 'Ympäristöön vaikuttaville toiminnoille',
      details: 'Ympäristövaikutuksia aiheuttavat yritykset (päästöt, jätteet, kemikaalit) saattavat tarvita ympäristölupia. Ympäristönsuojelulain vaatimus. Laajuus vaihtelee toiminnan tyypin ja mittakaavan mukaan.',
      fee: '200-5000+ €',
      timeline: '3-12 kuukautta',
      authority: 'Aluehallintovirasto (AVI) tai ELY-keskus',
      industries: ['manufacturing'],
    },
  }
};

export default function PermitsModule({ language, userProfile, onProfileUpdate }: PermitsModuleProps) {
  const t = translations[language];

  const universalPermits = [
    { id: 'trade', ...t.trade },
    { id: 'vat', ...t.vat },
    { id: 'prepayment', ...t.prepayment },
  ];

  const industryPermits = [
    { id: 'food', ...t.food },
    { id: 'alcohol', ...t.alcohol },
    { id: 'healthcare', ...t.healthcare },
    { id: 'building', ...t.building },
    { id: 'environmental', ...t.environmental },
  ];

  const handleMarkComplete = () => {
    if (userProfile) {
      const completedSteps = userProfile.completedSteps.includes('step4')
        ? userProfile.completedSteps
        : [...userProfile.completedSteps, 'step4'];
      onProfileUpdate({ ...userProfile, completedSteps });
    }
  };

  const isModuleComplete = userProfile?.completedSteps.includes('step4');
  const userIndustry = userProfile?.industry;

  const isRelevantPermit = (permit: any) => {
    if (!permit.industries || !userIndustry) return true;
    return permit.industries.includes(userIndustry);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-10 h-10 text-blue-600" />
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
              className="ml-4 bg-blue-600 hover:bg-blue-700"
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

      {/* Universal Requirements */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-gray-900">{t.universal}</h2>
          <Badge className="bg-blue-100 text-blue-700">{t.required}</Badge>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {universalPermits.map((permit) => (
            <AccordionItem key={permit.id} value={permit.id} className="border rounded-lg px-6 bg-white">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <FileCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-gray-900">{permit.title}</h3>
                    <p className="text-gray-600">{permit.desc}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4 pl-10">
                  <p className="text-gray-700">{permit.details}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900 mb-1">Fee</p>
                      <p className="text-blue-700">{permit.fee}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-900 mb-1">Timeline</p>
                      <p className="text-green-700">{permit.timeline}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-purple-900 mb-1">Authority</p>
                      <p className="text-purple-700">{permit.authority}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Industry-Specific Permits */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-gray-900">{t.industrySpecific}</h2>
          <Badge >{t.optional}</Badge>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {industryPermits.map((permit) => {
            const isRelevant = isRelevantPermit(permit);
            return (
              <AccordionItem
                key={permit.id}
                value={permit.id}
                className={`border rounded-lg px-6 ${
                  isRelevant ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
                }`}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <Award className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{permit.title}</h3>
                        {isRelevant && userIndustry && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Relevant to your industry
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{permit.desc}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4 pl-10">
                    <p className="text-gray-700">{permit.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-900 mb-1">Fee</p>
                        <p className="text-blue-700">{permit.fee}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-900 mb-1">Timeline</p>
                        <p className="text-green-700">{permit.timeline}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-purple-900 mb-1">Authority</p>
                        <p className="text-purple-700">{permit.authority}</p>
                      </div>
                    </div>
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