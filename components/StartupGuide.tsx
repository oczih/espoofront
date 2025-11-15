'use client';

import { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { CheckCircle2, ArrowRight, User, Briefcase, Sparkles, TrendingUp, FileText, Shield, Building2, Rocket } from 'lucide-react';

type Language = 'en' | 'fi';

type BusinessStage = 'idea' | 'planning' | 'registered' | 'operating';

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
}

const translations = {
  en: {
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
  onProfileUpdate = () => {}, 
  language = 'en', 
  onNavigate = () => {} 
}: StartupGuideProps) {
  const t = translations[language];
  const [userProfile, setUserProfile] = useState<UserProfile | null>(userProfileProp);
  const [formData, setFormData] = useState<{
    name: string;
    businessStage: BusinessStage;
    industry: string;
  }>({
    name: '',
    businessStage: 'idea',
    industry: '',
  });

  useEffect(() => {
    if (userProfileProp) {
      setUserProfile(userProfileProp);
      setFormData({
        name: userProfileProp.name,
        businessStage: userProfileProp.businessStage,
        industry: userProfileProp.industry,
      });
    }
  }, [userProfileProp]);

  const handleSaveProfile = () => {
    const profile: UserProfile = {
      ...formData,
      language,
      completedSteps: ['step1'],
      notes: '',
    };
    setUserProfile(profile);
    onProfileUpdate(profile);
  };

  const businessSteps = [
    { id: 'step1', page: 'home', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
    { id: 'step2', page: 'funding', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { id: 'step3', page: 'taxation', icon: FileText, color: 'from-orange-500 to-amber-500' },
    { id: 'step4', page: 'permits', icon: Shield, color: 'from-red-500 to-rose-500' },
    { id: 'step5', page: 'banking', icon: Building2, color: 'from-indigo-500 to-blue-500' },
    { id: 'step6', page: 'insurance', icon: Shield, color: 'from-teal-500 to-cyan-500' },
    { id: 'step7', page: 'home', icon: Briefcase, color: 'from-slate-600 to-slate-700' },
    { id: 'step8', page: 'home', icon: Rocket, color: 'from-blue-600 to-indigo-600' },
  ];

  const completedSteps = userProfile?.completedSteps || [];
  const progress = (completedSteps.length / businessSteps.length) * 100;

  // Animated background particles - use useState with lazy initializer to avoid calling Math.random during render
  const particles = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
    }))
  )[0];

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-400/20"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="relative inline-block mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-30"
                />
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                {t.welcome}
              </h1>
              <p className="text-slate-600 text-lg">{t.setupProfile}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.businessStage}
                </label>
                <select
                  value={formData.businessStage}
                  onChange={(e) => setFormData({ ...formData, businessStage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur"
                >
                  <option value="idea">{t.stages.idea}</option>
                  <option value="planning">{t.stages.planning}</option>
                  <option value="registered">{t.stages.registered}</option>
                  <option value="operating">{t.stages.operating}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.industry}
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur"
                >
                  <option value="">Select industry...</option>
                  <option value="technology">{t.industries.technology}</option>
                  <option value="retail">{t.industries.retail}</option>
                  <option value="services">{t.industries.services}</option>
                  <option value="manufacturing">{t.industries.manufacturing}</option>
                  <option value="hospitality">{t.industries.hospitality}</option>
                  <option value="healthcare">{t.industries.healthcare}</option>
                  <option value="education">{t.industries.education}</option>
                  <option value="other">{t.industries.other}</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={!formData.name || !formData.industry}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold shadow-lg transition-colors hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.saveProfile}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            {t.welcome}, {userProfile.name}!
          </h1>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-sm font-medium">
              {t.stages[userProfile.businessStage]}
            </span>
            <span className="text-slate-400">•</span>
            <span className="px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-sm font-medium">
              {t.industries[userProfile.industry] || userProfile.industry}
            </span>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{t.progressTitle}</h2>
            <div className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-lg">
              {completedSteps.length} / {businessSteps.length}
            </div>
          </div>
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            />
            <motion.div
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>

        {/* Journey Map */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-slate-800 mb-8"
          >
            {t.journeyMap}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                      : 'bg-white/70 backdrop-blur-xl border-2 border-white/40'
                  } shadow-lg transition-colors hover:shadow-2xl transition-all`}
                  onClick={() => step.page !== 'home' && onNavigate(step.page)}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-transition-colors hover:opacity-5 transition-opacity`}
                  />

                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`relative p-3 rounded-xl ${
                          isCompleted
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                            : `bg-gradient-to-br ${step.color}`
                        } shadow-lg`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-slate-500">
                            Step {index + 1}
                          </span>
                          {isCompleted && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-3 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                            >
                              {t.completed}
                            </motion.span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {t.steps[step.id]}
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {t.stepDescriptions[step.id]}
                        </p>
                        {step.page !== 'home' && (
                          <motion.button
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2 text-blue-600 font-semibold group/btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate(step.page);
                            }}
                          >
                            {t.explore}
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}