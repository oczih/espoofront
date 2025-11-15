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
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface InsuranceModuleProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const translations = {
  en: {
    title: 'Business Insurance',
    subtitle: 'Protect your business with appropriate insurance coverage',
    progress: 'Module Progress',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    required: 'Required',
    recommended: 'Recommended',
    optional: 'Optional',
    alert: 'Insurance requirements vary by industry and business type. Consult with insurance professionals for tailored coverage.',
    pension: {
      title: 'YEL Insurance (Entrepreneur\'s Pension)',
      desc: 'Mandatory pension insurance for entrepreneurs',
      details: 'All entrepreneurs working in their business must have YEL insurance. Provides pension, disability, and rehabilitation coverage. Premium is calculated based on your assessed annual income (minimum €8,575 in 2024). Must be arranged within 6 months of starting business.',
      cost: 'Approx. 24.1% of assessed income',
      coverage: 'Pension, disability, rehabilitation',
      requirement: 'required',
    },
    liability: {
      title: 'Business Liability Insurance',
      desc: 'Protection against claims and lawsuits',
      details: 'Covers legal costs and damages if your business causes injury or damage to third parties. Highly recommended for all businesses. Required for certain professions (construction, healthcare).',
      cost: '€200-€2,000/year',
      coverage: 'Third-party injuries, property damage, legal costs',
      requirement: 'recommended',
    },
    property: {
      title: 'Business Property Insurance',
      desc: 'Protects business assets and equipment',
      details: 'Covers damage to business property from fire, water, theft, and vandalism. Important if you have significant equipment, inventory, or office space. Often bundled with liability insurance.',
      cost: '€300-€3,000/year',
      coverage: 'Equipment, inventory, premises, business interruption',
      requirement: 'recommended',
    },
    professional: {
      title: 'Professional Indemnity Insurance',
      desc: 'For professional services and advice',
      details: 'Covers claims arising from professional mistakes, negligence, or breach of professional duty. Essential for consultants, advisors, designers, engineers, and healthcare professionals.',
      cost: '€500-€5,000/year',
      coverage: 'Professional errors, negligence, legal defense',
      requirement: 'recommended',
    },
    cyber: {
      title: 'Cyber Insurance',
      desc: 'Protection against digital threats',
      details: 'Covers costs from data breaches, cyber attacks, and system failures. Increasingly important for businesses handling customer data or relying on digital systems. Includes legal costs and notification expenses.',
      cost: '€500-€3,000/year',
      coverage: 'Data breaches, cyber attacks, business interruption, legal costs',
      requirement: 'optional',
    },
    key: {
      title: 'Key Person Insurance',
      desc: 'Protects against loss of essential personnel',
      details: 'Life and disability insurance for key employees or owners. Provides funds to cover recruitment, training, or loan repayments if a key person becomes unable to work. Important for small businesses dependent on specific individuals.',
      cost: 'Varies by coverage',
      coverage: 'Death, disability, critical illness',
      requirement: 'optional',
    },
    vehicle: {
      title: 'Business Vehicle Insurance',
      desc: 'For company cars and vehicles',
      details: 'Mandatory for all vehicles. Minimum requirement is third-party liability. Comprehensive coverage recommended for business vehicles. Can include coverage for goods in transit.',
      cost: 'Varies by vehicle',
      coverage: 'Liability, collision, comprehensive, goods',
      requirement: 'required',
      note: 'If you use vehicles',
    },
  },
  fi: {
    title: 'Yritysvakuutukset',
    subtitle: 'Suojaa yrityksesi asianmukaisilla vakuutuksilla',
    progress: 'Moduulin edistyminen',
    markComplete: 'Merkitse valmiiksi',
    completed: 'Valmis',
    required: 'Pakollinen',
    recommended: 'Suositeltu',
    optional: 'Valinnainen',
    alert: 'Vakuutusvaatimukset vaihtelevat toimialan ja yritystyypin mukaan. Keskustele vakuutusasiantuntijoiden kanssa räätälöidystä kattavuudesta.',
    pension: {
      title: 'YEL-vakuutus (Yrittäjän eläkevakuutus)',
      desc: 'Pakollinen eläkevakuutus yrittäjille',
      details: 'Kaikilla yrityksessään työskentelevällä yrittäjällä on oltava YEL-vakuutus. Tarjoaa eläke-, työkyvyttömyys- ja kuntoutusturvan. Maksu lasketaan arvioidun vuositulon perusteella (vähintään 8 575 € vuonna 2024). Järjestettävä 6 kuukauden kuluessa yritystoiminnan aloittamisesta.',
      cost: 'N. 24,1% arvioidusta tulosta',
      coverage: 'Eläke, työkyvyttömyys, kuntoutus',
      requirement: 'required',
    },
    liability: {
      title: 'Vastuuvakuutus',
      desc: 'Suoja korvausvaatimuksilta ja oikeudenkäynneiltä',
      details: 'Kattaa oikeudenkäyntikulut ja vahingonkorvaukset, jos yrityksesi aiheuttaa vammoja tai vahinkoja kolmansille osapuolille. Erittäin suositeltava kaikille yrityksille. Pakollinen tietyille ammateille (rakentaminen, terveydenhuolto).',
      cost: '200-2000 €/vuosi',
      coverage: 'Kolmansien osapuolten vammat, omaisuusvahingot, oikeudenkäyntikulut',
      requirement: 'recommended',
    },
    property: {
      title: 'Omaisuusvakuutus',
      desc: 'Suojaa yrityksen omaisuutta ja laitteita',
      details: 'Kattaa liikeomaisuuden vauriot tulipalosta, vedestä, varkaudesta ja ilkivallasta. Tärkeä, jos sinulla on merkittäviä laitteita, varastoa tai toimistotilaa. Usein yhdistetty vastuuvakuutukseen.',
      cost: '300-3000 €/vuosi',
      coverage: 'Laitteet, varasto, toimitilat, keskeytys',
      requirement: 'recommended',
    },
    professional: {
      title: 'Ammatillinen vastuuvakuutus',
      desc: 'Ammattimaisille palveluille ja neuvonnalle',
      details: 'Kattaa ammatillisista virheistä, laiminlyönneistä tai ammatillisen velvollisuuden rikkomisesta johtuvat vaatimukset. Välttämätön konsulteille, neuvonantajille, suunnittelijoille, insinööreille ja terveydenhuollon ammattilaisille.',
      cost: '500-5000 €/vuosi',
      coverage: 'Ammattimaiset virheet, laiminlyönnit, oikeudellinen puolustus',
      requirement: 'recommended',
    },
    cyber: {
      title: 'Kyberturvallisuusvakuutus',
      desc: 'Suoja digitaalisilta uhilta',
      details: 'Kattaa tietomurroista, kyberhyökkäyksistä ja järjestelmävikoista aiheutuvat kustannukset. Yhä tärkeämpi yrityksille, jotka käsittelevät asiakastietoja tai luottavat digitaalisiin järjestelmiin. Sisältää oikeudenkäyntikulut ja ilmoituskulut.',
      cost: '500-3000 €/vuosi',
      coverage: 'Tietomurrot, kyberhyökkäykset, keskeytys, oikeudenkäyntikulut',
      requirement: 'optional',
    },
    key: {
      title: 'Avainhenkilövakuutus',
      desc: 'Suojaa olennaisten henkilöiden menetykseltä',
      details: 'Henki- ja työkyvyttömyysvakuutus avaintyöntekijöille tai omistajille. Tarjoaa varoja rekrytoinnin, koulutuksen tai lainojen takaisinmaksuun, jos avainhenkilö ei pysty työskentelemään. Tärkeä pienille yrityksille, jotka ovat riippuvaisia tietyistä henkilöistä.',
      cost: 'Vaihtelee kattavuuden mukaan',
      coverage: 'Kuolema, työkyvyttömyys, vakava sairaus',
      requirement: 'optional',
    },
    vehicle: {
      title: 'Ajoneuvovakuutus',
      desc: 'Yrityksen autoille ja ajoneuvoille',
      details: 'Pakollinen kaikille ajoneuvoille. Vähimmäisvaatimus on kolmannen osapuolen vastuuvakuutus. Kattava vakuutus suositellaan yritysajoneuvoille. Voi sisältää kuljetettavien tavaroiden kattavuuden.',
      cost: 'Vaihtelee ajoneuvon mukaan',
      coverage: 'Vastuu, törmäys, kattava, tavarat',
      requirement: 'required',
      note: 'Jos käytät ajoneuvoja',
    },
  }
};

export default function InsuranceModule({ language, userProfile, onProfileUpdate }: InsuranceModuleProps) {
  const t = translations[language];

  const insuranceTypes = [
    { id: 'pension', ...t.pension },
    { id: 'liability', ...t.liability },
    { id: 'property', ...t.property },
    { id: 'professional', ...t.professional },
    { id: 'cyber', ...t.cyber },
    { id: 'key', ...t.key },
    { id: 'vehicle', ...t.vehicle },
  ];

  const handleMarkComplete = () => {
    if (userProfile) {
      const completedSteps = userProfile.completedSteps.includes('step6')
        ? userProfile.completedSteps
        : [...userProfile.completedSteps, 'step6'];
      onProfileUpdate({ ...userProfile, completedSteps });
    }
  };

  const isModuleComplete = userProfile?.completedSteps.includes('step6');

  const getRequirementBadge = (requirement: string) => {
    switch (requirement) {
      case 'required':
        return <Badge className="bg-red-100 text-red-700">{t.required}</Badge>;
      case 'recommended':
        return <Badge className="bg-yellow-100 text-yellow-700">{t.recommended}</Badge>;
      case 'optional':
        return <Badge >{t.optional}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-10 h-10 text-blue-600" />
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

      <Accordion type="single" collapsible className="space-y-3">
        {insuranceTypes.map((insurance) => (
          <AccordionItem
            key={insurance.id}
            value={insurance.id}
            className={`border rounded-lg px-6 ${
              insurance.requirement === 'required' ? 'bg-red-50 border-red-200' :
              insurance.requirement === 'recommended' ? 'bg-yellow-50 border-yellow-200' :
              'bg-white'
            }`}
          >
            <AccordionTrigger className="transition-colors hover:no-underline">
              <div className="flex items-center gap-4 text-left flex-1">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-gray-900">{insurance.title}</h3>
                    {getRequirementBadge(insurance.requirement)}
                  </div>
                  <p className="text-gray-600">{insurance.desc}</p>
                  {insurance.note && (
                    <p className="text-gray-500 text-sm mt-1">{insurance.note}</p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4 pl-10">
                <p className="text-gray-700">{insurance.details}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-900 mb-1">Typical Cost</p>
                    <p className="text-blue-700">{insurance.cost}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-900 mb-1">Coverage</p>
                    <p className="text-green-700">{insurance.coverage}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
