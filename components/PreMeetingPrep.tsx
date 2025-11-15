'use client';

import { useState } from 'react';
import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ClipboardList, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PreMeetingPrepProps {
  language: Language;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

interface PrepData {
  challenges: string;
  questions: string;
  goals: string;
  documents: string[];
}

const translations = {
  en: {
    title: 'Prepare for Advisory Meeting',
    subtitle: 'Get the most out of your meeting with a business advisor',
    intro: 'Preparing for your advisory session helps ensure a productive conversation. Complete this form before your meeting so your advisor can provide tailored guidance.',
    currentSituation: 'Current Business Situation',
    challenges: 'What challenges are you facing?',
    challengesPlaceholder: 'e.g., Finding the right funding, understanding tax obligations, hiring first employee...',
    questions: 'Specific questions for the advisor',
    questionsPlaceholder: 'List your questions, one per line...',
    goals: 'What do you hope to achieve in the next 3-6 months?',
    goalsPlaceholder: 'e.g., Register my business, secure funding, hire 2 employees...',
    documents: 'Documents to bring/prepare',
    documentsList: [
      'Business plan or concept description',
      'Financial projections or budget',
      'Current financial statements (if existing business)',
      'List of competitors and market research',
      'Questions about specific regulations or permits',
      'Previous business registrations or documentation',
    ],
    save: 'Save Preparation',
    download: 'Download Summary',
    saved: 'Preparation Saved',
    tips: 'Meeting Tips',
    tipsList: [
      'Be specific about your challenges and goals',
      'Bring relevant documents and data',
      'Take notes during the meeting',
      'Ask for clarification if something is unclear',
      'Request follow-up resources or contacts',
      'Schedule a follow-up meeting if needed',
    ],
    yourProfile: 'Your Profile Summary',
  },
  fi: {
    title: 'Valmistaudu neuvontatapaamiseeen',
    subtitle: 'Hyödynnä maksimaalisen yritysneuvonantajasi tapaaminen',
    intro: 'Neuvontasessioon valmistautuminen auttaa varmistamaan tuottavan keskustelun. Täytä tämä lomake ennen tapaamistasi, jotta neuvonantajasi voi tarjota räätälöityä ohjausta.',
    currentSituation: 'Nykyinen yritystilanne',
    challenges: 'Mitä haasteita kohtaat?',
    challengesPlaceholder: 'esim. Oikean rahoituksen löytäminen, verovelvoitteiden ymmärtäminen, ensimmäisen työntekijän palkkaaminen...',
    questions: 'Erityiskysymykset neuvonantajalle',
    questionsPlaceholder: 'Listaa kysymyksesi, yksi per rivi...',
    goals: 'Mitä toivot saavuttavasi seuraavan 3-6 kuukauden aikana?',
    goalsPlaceholder: 'esim. Rekisteröi yritykseni, hanki rahoitus, palkkaa 2 työntekijää...',
    documents: 'Tuotavat/valmisteltavat asiakirjat',
    documentsList: [
      'Liiketoimintasuunnitelma tai konseptikuvaus',
      'Talousennusteet tai budjetti',
      'Nykyiset tilinpäätökset (jos olemassa oleva yritys)',
      'Lista kilpailijoista ja markkinatutkimus',
      'Kysymykset tietyistä säännöksistä tai luvista',
      'Aiemmat yritysrekisteröinnit tai dokumentaatio',
    ],
    save: 'Tallenna valmistautuminen',
    download: 'Lataa yhteenveto',
    saved: 'Valmistautuminen tallennettu',
    tips: 'Tapaamisen vinkit',
    tipsList: [
      'Ole tarkka haasteistasi ja tavoitteistasi',
      'Ota mukaan asiaankuuluvat asiakirjat ja tiedot',
      'Tee muistiinpanoja tapaamisen aikana',
      'Pyydä selvennystä, jos jokin on epäselvää',
      'Pyydä jatkoresursseja tai yhteystietoja',
      'Varaa seurantatapaaminen tarvittaessa',
    ],
    yourProfile: 'Profiilisi yhteenveto',
  }
};

export default function PreMeetingPrep({ language, userProfile, onProfileUpdate }: PreMeetingPrepProps) {
  const t = translations[language] as typeof translations['en'];
  const [prepData, setPrepData] = useState<PrepData>(() => {
    if (typeof window !== 'undefined') {
      const savedPrep = localStorage.getItem('meetingPrep');
      if (savedPrep) {
        return JSON.parse(savedPrep) as PrepData;
      }
    }
    return {
      challenges: '',
      questions: '',
      goals: '',
      documents: [],
    };
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('meetingPrep', JSON.stringify(prepData));
    }
    if (userProfile) {
      onProfileUpdate({
        ...userProfile,
        notes: `Meeting Prep:\n\nChallenges: ${prepData.challenges}\n\nQuestions: ${prepData.questions}\n\nGoals: ${prepData.goals}\n\nDocuments: ${prepData.documents.join(', ')}`,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDownload = () => {
    const content = `
BUSINESS ADVISORY MEETING PREPARATION
Generated: ${new Date().toLocaleDateString()}

ENTREPRENEUR PROFILE
Name: ${userProfile?.name || 'N/A'}
Business Stage: ${userProfile?.businessStage || 'N/A'}
Industry: ${userProfile?.industry || 'N/A'}

CHALLENGES
${prepData.challenges || 'Not specified'}

QUESTIONS FOR ADVISOR
${prepData.questions || 'Not specified'}

GOALS (Next 3-6 months)
${prepData.goals || 'Not specified'}

DOCUMENTS TO BRING
${prepData.documents.map(doc => `☐ ${doc}`).join('\n')}

MEETING TIPS
${t.tipsList.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-prep-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleDocumentToggle = (doc: string) => {
    setPrepData(prev => ({
      ...prev,
      documents: prev.documents.includes(doc)
        ? prev.documents.filter(d => d !== doc)
        : [...prev.documents, doc],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">{t.intro}</AlertDescription>
        </Alert>
      </div>

      <div className="space-y-6">
        {/* Profile Summary */}
        {userProfile && (
          <Card className="p-6">
            <h2 className="text-gray-900 mb-4">{t.yourProfile}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="text-gray-900">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Business Stage</p>
                <Badge>{userProfile.businessStage}</Badge>
              </div>
              <div>
                <p className="text-gray-500">Industry</p>
                <p className="text-gray-900">{userProfile.industry}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Challenges */}
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">{t.currentSituation}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="challenges">{t.challenges}</Label>
              <Textarea
                id="challenges"
                value={prepData.challenges}
                onChange={(e) => setPrepData({ ...prepData, challenges: e.target.value })}
                placeholder={t.challengesPlaceholder}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Questions */}
        <Card className="p-6">
          <div>
            <Label htmlFor="questions">{t.questions}</Label>
            <Textarea
              id="questions"
              value={prepData.questions}
              onChange={(e) => setPrepData({ ...prepData, questions: e.target.value })}
              placeholder={t.questionsPlaceholder}
              rows={5}
              className="mt-2"
            />
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-6">
          <div>
            <Label htmlFor="goals">{t.goals}</Label>
            <Textarea
              id="goals"
              value={prepData.goals}
              onChange={(e) => setPrepData({ ...prepData, goals: e.target.value })}
              placeholder={t.goalsPlaceholder}
              rows={4}
              className="mt-2"
            />
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">{t.documents}</h2>
          <div className="space-y-3">
            {t.documentsList.map((doc: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <Checkbox
                  id={`doc-${index}`}
                  checked={prepData.documents.includes(doc)}
                  onCheckedChange={() => handleDocumentToggle(doc)}
                />
                <Label htmlFor={`doc-${index}`} className="cursor-pointer">
                  {doc}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h2 className="text-gray-900 mb-4">{t.tips}</h2>
          <ul className="space-y-2">
            {t.tipsList.map((tip: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 transition-colors hover:bg-blue-700"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t.saved}
              </>
            ) : (
              t.save
            )}
          </button>
          <button
            onClick={handleDownload}
            
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {t.download}
          </button>
        </div>
      </div>
    </div>
  );
}
