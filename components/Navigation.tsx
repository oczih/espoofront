'use client';

import { UserType, Language } from '../app/types';
import { Menu, Home, DollarSign, FileText, Award, Building2, Shield, MessageSquare, ClipboardList, BookOpen, LogOut, Globe } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType: UserType;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
}

const translations = {
  en: {
    home: 'Home',
    funding: 'Funding',
    taxation: 'Taxation',
    permits: 'Permits & Licenses',
    banking: 'Banking',
    insurance: 'Insurance',
    aiAssistant: 'AI Assistant',
    preMeeting: 'Prepare for Meeting',
    resources: 'Resources',
    logout: 'Logout',
    menu: 'Menu',
  },
  fi: {
    home: 'Etusivu',
    funding: 'Rahoitus',
    taxation: 'Verotus',
    permits: 'Luvat ja lisenssit',
    banking: 'Pankkipalvelut',
    insurance: 'Vakuutus',
    aiAssistant: 'AI-avustaja',
    preMeeting: 'Valmistaudu tapaamiseen',
    resources: 'Resurssit',
    logout: 'Kirjaudu ulos',
    menu: 'Valikko',
  }
};

export default function Navigation({ currentPage, onNavigate, userType, language, onLanguageChange, onLogout }: NavigationProps) {
  const t = translations[language];

  const menuItems = userType === 'entrepreneur' ? [
    { id: 'home', label: t.home, icon: Home },
    { id: 'funding', label: t.funding, icon: DollarSign },
    { id: 'taxation', label: t.taxation, icon: FileText },
    { id: 'permits', label: t.permits, icon: Award },
    { id: 'banking', label: t.banking, icon: Building2 },
    { id: 'insurance', label: t.insurance, icon: Shield },
    { id: 'ai-assistant', label: t.aiAssistant, icon: MessageSquare },
    { id: 'pre-meeting', label: t.preMeeting, icon: ClipboardList },
    { id: 'resources', label: t.resources, icon: BookOpen },
  ] : [];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-blue-900">Espoo Business Hub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.slice(0, 5).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 transition-colors hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              
              onClick={() => onLanguageChange(language === 'en' ? 'fi' : 'en')}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'FI' : 'EN'}
            </button>

            <button
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">{t.menu}</span>
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-2 mt-8">
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          currentPage === item.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 transition-colors hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
