'use client';

import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { DollarSign, ExternalLink, CheckCircle2, Building2, Lightbulb, TrendingUp } from 'lucide-react';

interface FundingModuleProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const translations = {
  en: {
    title: 'Funding Your Business',
    subtitle: 'Explore funding options available for businesses in Finland',
    progress: 'Module Progress',
    markComplete: 'Mark as Complete',
    completed: 'Completed',
    visitWebsite: 'Visit Website',
    categories: {
      grants: 'Grants & Subsidies',
      loans: 'Business Loans',
      equity: 'Equity Funding',
      other: 'Other Options',
    },
    businessFinland: {
      title: 'Business Finland',
      desc: 'Public funding for innovative and growth-oriented companies',
      details: 'Business Finland offers grants, loans, and advisory services for companies developing new products, services, or business models. They support both startups and established companies aiming for international growth.',
      amount: 'Up to €500,000',
      eligibility: 'Innovative projects with growth potential',
    },
    teAvustus: {
      title: 'TE Services Start-up Grant',
      desc: 'Financial support for new entrepreneurs',
      details: 'A grant for entrepreneurs starting a new business. Covers living expenses during the startup phase (typically 6 months). Requires a viable business plan and meeting with TE Services.',
      amount: '€840-€1,260/month',
      eligibility: 'Unemployed or at risk of unemployment',
    },
    ely: {
      title: 'ELY Centre Development Grant',
      desc: 'Regional development and investment support',
      details: 'Development grants for improving business competitiveness through investments in equipment, facilities, or expertise. Particularly supports rural and regional businesses.',
      amount: 'Up to 35% of eligible costs',
      eligibility: 'SMEs with development projects',
    },
    finnvera: {
      title: 'Finnvera Loans',
      desc: 'State-backed financing for businesses',
      details: 'Finnvera provides loans, guarantees, and export credit guarantees. Special focus on startups, growth companies, and businesses that might have difficulty obtaining bank financing.',
      amount: 'Varies by need',
      eligibility: 'Viable business with financing gap',
    },
    bankLoans: {
      title: 'Commercial Bank Loans',
      desc: 'Traditional business financing',
      details: 'Finnish banks (Nordea, OP, Danske, etc.) offer business loans, overdrafts, and credit facilities. Typically require business plan, collateral, and personal guarantee.',
      amount: 'Based on creditworthiness',
      eligibility: 'Established businesses with credit history',
    },
    angels: {
      title: 'Angel Investors',
      desc: 'Private investors for early-stage companies',
      details: 'FiBAN (Finnish Business Angels Network) connects startups with experienced angel investors. Typical investments range from €25,000 to €250,000.',
      amount: '€25,000-€250,000',
      eligibility: 'Scalable business model',
    },
    vcFunds: {
      title: 'Venture Capital',
      desc: 'Professional investment funds',
      details: 'Active VC ecosystem in Finland. Firms like Lifeline Ventures, Inventure, and Butterfly Ventures invest in growth-stage companies with high potential.',
      amount: '€500,000-€5M+',
      eligibility: 'High-growth potential, proven traction',
    },
  },
  fi: {
    title: 'Yrityksen rahoitus',
    subtitle: 'Tutustu Suomessa saatavilla oleviin rahoitusvaihtoehtoihin',
    progress: 'Moduulin edistyminen',
    markComplete: 'Merkitse valmiiksi',
    completed: 'Valmis',
    visitWebsite: 'Siirry sivustolle',
    categories: {
      grants: 'Avustukset ja tuet',
      loans: 'Yrityslainat',
      equity: 'Pääomasijoitukset',
      other: 'Muut vaihtoehdot',
    },
    businessFinland: {
      title: 'Business Finland',
      desc: 'Julkinen rahoitus innovatiivisille kasvuyrityksille',
      details: 'Business Finland tarjoaa avustuksia, lainoja ja neuvontapalveluita yrityksille, jotka kehittävät uusia tuotteita, palveluita tai liiketoimintamalleja. Tukee sekä startuppeja että vakiintuneita yrityksiä kansainväliseen kasvuun.',
      amount: 'Jopa 500 000 €',
      eligibility: 'Innovatiiviset projektit kasvupotentiaalilla',
    },
    teAvustus: {
      title: 'TE-palveluiden starttiraha',
      desc: 'Taloudellinen tuki uusille yrittäjille',
      details: 'Avustus yrittäjille, jotka aloittavat uuden yrityksen. Kattaa toimeentulokulut käynnistysvaiheessa (tyypillisesti 6 kuukautta). Vaatii toimivan liiketoimintasuunnitelman ja tapaamisen TE-palveluiden kanssa.',
      amount: '840-1260 €/kk',
      eligibility: 'Työtön tai työttömyysuhassa',
    },
    ely: {
      title: 'ELY-keskuksen kehittämisavustus',
      desc: 'Alueellinen kehitys- ja investointituki',
      details: 'Kehittämisavustuksia yrityksen kilpailukyvyn parantamiseen investoinneilla laitteisiin, tiloihin tai osaamiseen. Erityisesti tukee maaseudun ja alueiden yrityksiä.',
      amount: 'Jopa 35% tukikelpoisista kustannuksista',
      eligibility: 'PK-yritykset kehityshankkeilla',
    },
    finnvera: {
      title: 'Finnveran lainat',
      desc: 'Valtion tukema yritysrahoitus',
      details: 'Finnvera tarjoaa lainoja, takauksia ja vientitakuita. Erityisesti tukee startuppeja, kasvuyrityksiä ja yrityksiä, joilla voi olla vaikeuksia saada pankkilainaa.',
      amount: 'Vaihtelee tarpeen mukaan',
      eligibility: 'Elinkelpoinen yritys rahoitusvajeen kanssa',
    },
    bankLoans: {
      title: 'Pankkien yrityslainat',
      desc: 'Perinteinen yritysrahoitus',
      details: 'Suomalaiset pankit (Nordea, OP, Danske jne.) tarjoavat yrityslainoja, luottoja ja luottojärjestelyjä. Tyypillisesti vaativat liiketoimintasuunnitelman, vakuuksia ja henkilökohtaisen takauksen.',
      amount: 'Perustuu luottokelpoisuuteen',
      eligibility: 'Vakiintuneet yritykset luottohistorialla',
    },
    angels: {
      title: 'Enkelisijoittajat',
      desc: 'Yksityiset sijoittajat alkuvaiheen yrityksille',
      details: 'FiBAN (Finnish Business Angels Network) yhdistää startupit kokeneisiin enkelisijoittajiin. Tyypilliset sijoitukset 25 000–250 000 €.',
      amount: '25 000–250 000 €',
      eligibility: 'Skaalautuva liiketoimintamalli',
    },
    vcFunds: {
      title: 'Pääomasijoittajat',
      desc: 'Ammattimaiset sijoitusrahastot',
      details: 'Aktiivinen pääomasijoitusekosysteemi Suomessa. Yritykset kuten Lifeline Ventures, Inventure ja Butterfly Ventures sijoittavat kasvuvaiheen yrityksiin suurella potentiaalilla.',
      amount: '500 000–5M+ €',
      eligibility: 'Korkea kasvupotentiaali, todistettu vetovoima',
    },
  }
};

export default function FundingModule({ language, userProfile, onProfileUpdate }: FundingModuleProps) {
  const t = translations[language];
  // const [completedSections, setCompletedSections] = useState<string[]>([]); // Reserved for future tracking

  const fundingOptions = [
    {
      id: 'business-finland',
      category: 'grants',
      icon: Lightbulb,
      ...t.businessFinland,
      link: 'https://www.businessfinland.fi/en',
    },
    {
      id: 'te-avustus',
      category: 'grants',
      icon: TrendingUp,
      ...t.teAvustus,
      link: 'https://www.te-palvelut.fi/en',
    },
    {
      id: 'ely',
      category: 'grants',
      icon: Building2,
      ...t.ely,
      link: 'https://www.ely-keskus.fi/en',
    },
    {
      id: 'finnvera',
      category: 'loans',
      icon: DollarSign,
      ...t.finnvera,
      link: 'https://www.finnvera.fi/en',
    },
    {
      id: 'bank-loans',
      category: 'loans',
      icon: Building2,
      ...t.bankLoans,
      link: 'https://www.op.fi/business-customers',
    },
    {
      id: 'angels',
      category: 'equity',
      icon: TrendingUp,
      ...t.angels,
      link: 'https://www.fiban.org',
    },
    {
      id: 'vc',
      category: 'equity',
      icon: Lightbulb,
      ...t.vcFunds,
      link: 'https://www.fvca.fi/en',
    },
  ];

  const handleMarkComplete = () => {
    if (userProfile) {
      const completedSteps = userProfile.completedSteps.includes('step2')
        ? userProfile.completedSteps
        : [...userProfile.completedSteps, 'step2'];
      onProfileUpdate({ ...userProfile, completedSteps });
    }
  };

  const isModuleComplete = userProfile?.completedSteps.includes('step2');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <Card className="p-4 mt-6">
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

      <div className="space-y-8">
        {Object.entries(t.categories).map(([key, title]) => {
          const categoryOptions = fundingOptions.filter(opt => opt.category === key);
          
          return (
            <div key={key}>
              <h2 className="text-gray-900 mb-4">{title}</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {categoryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <AccordionItem key={option.id} value={option.id} className="border rounded-lg px-6 bg-white">
                      <AccordionTrigger className="transition-colors hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-gray-900">{option.title}</h3>
                            <p className="text-gray-600">{option.desc}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4 pl-10">
                          <p className="text-gray-700">{option.details}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-blue-900 mb-1">Funding Amount</p>
                              <p className="text-blue-700">{option.amount}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-green-900 mb-1">Eligibility</p>
                              <p className="text-green-700">{option.eligibility}</p>
                            </div>
                          </div>

                          <button
                            
                            className="gap-2"
                            onClick={() => window.open(option.link, '_blank')}
                          >
                            {t.visitWebsite}
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}
