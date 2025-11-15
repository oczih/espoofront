'use client';

import { Language } from '../app/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Search,
  FileText,
  Video,
  Link as LinkIcon,
  Download,
} from 'lucide-react';

interface ResourceLibraryProps {
  language: Language;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'link' | 'template';
  category: string;
  url: string;
  language: string;
}

const translations = {
  en: {
    title: 'Resource Library',
    subtitle: 'Helpful guides, templates, and links',
    search: 'Search resources...',
    allCategories: 'All Categories',
    categories: {
      general: 'General Business',
      funding: 'Funding',
      taxation: 'Taxation',
      legal: 'Legal & Permits',
      hr: 'HR & Employment',
      finance: 'Finance & Banking',
    },
    types: {
      guide: 'Guide',
      video: 'Video',
      link: 'Link',
      template: 'Template',
    },
    resources: [
      {
        id: '1',
        title: 'Starting a Business in Finland - Complete Guide',
        description: 'Comprehensive guide covering all steps from idea to registration',
        type: 'guide',
        category: 'general',
        url: 'https://www.suomi.fi/company/starting-a-business',
        language: 'en',
      },
      {
        id: '2',
        title: 'Business Finland Funding Programs',
        description: 'Overview of available grants and loans for innovative businesses',
        type: 'link',
        category: 'funding',
        url: 'https://www.businessfinland.fi/en/for-finnish-customers/services/funding',
        language: 'en',
      },
      {
        id: '3',
        title: 'Tax Calendar for Entrepreneurs',
        description: 'Important tax deadlines and obligations throughout the year',
        type: 'template',
        category: 'taxation',
        url: 'https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/',
        language: 'en',
      },
      {
        id: '4',
        title: 'How to Register Your Business',
        description: 'Step-by-step video tutorial on Trade Register registration',
        type: 'video',
        category: 'legal',
        url: 'https://www.ytj.fi/en/index.html',
        language: 'en',
      },
      {
        id: '5',
        title: 'Employment Contract Template',
        description: 'Standard Finnish employment contract template',
        type: 'template',
        category: 'hr',
        url: 'https://www.ely-keskus.fi/en/',
        language: 'en',
      },
      {
        id: '6',
        title: 'Business Banking Comparison',
        description: 'Compare services and fees from major Finnish banks',
        type: 'guide',
        category: 'finance',
        url: 'https://www.finanssivalvonta.fi/en/',
        language: 'en',
      },
      {
        id: '7',
        title: 'VAT Guide for Entrepreneurs',
        description: 'Everything you need to know about VAT registration and filing',
        type: 'guide',
        category: 'taxation',
        url: 'https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/',
        language: 'en',
      },
      {
        id: '8',
        title: 'Startup Permits Checklist',
        description: 'Industry-specific permit requirements checklist',
        type: 'template',
        category: 'legal',
        url: 'https://www.prh.fi/en/',
        language: 'en',
      },
    ],
  },
  fi: {
    title: 'Resurssikirjasto',
    subtitle: 'Hyödyllisiä oppaita, malleja ja linkkejä',
    search: 'Hae resursseja...',
    allCategories: 'Kaikki kategoriat',
    categories: {
      general: 'Yleinen liiketoiminta',
      funding: 'Rahoitus',
      taxation: 'Verotus',
      legal: 'Laki ja luvat',
      hr: 'HR ja työllisyys',
      finance: 'Rahoitus ja pankkipalvelut',
    },
    types: {
      guide: 'Opas',
      video: 'Video',
      link: 'Linkki',
      template: 'Malli',
    },
    resources: [
      {
        id: '1',
        title: 'Yrityksen perustaminen Suomessa - Täydellinen opas',
        description: 'Kattava opas, joka kattaa kaikki vaiheet ideasta rekisteröintiin',
        type: 'guide',
        category: 'general',
        url: 'https://www.suomi.fi/yritys/yrityksen-perustaminen',
        language: 'fi',
      },
      {
        id: '2',
        title: 'Business Finlandin rahoitusohjelmat',
        description: 'Yleiskatsaus saatavilla olevista avustuksista ja lainoista innovatiivisille yrityksille',
        type: 'link',
        category: 'funding',
        url: 'https://www.businessfinland.fi/suomalaisille-asiakkaille/palvelut/rahoitus',
        language: 'fi',
      },
      {
        id: '3',
        title: 'Verokalenteri yrittäjille',
        description: 'Tärkeät veropäivämäärät ja velvoitteet ympäri vuoden',
        type: 'template',
        category: 'taxation',
        url: 'https://www.vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/',
        language: 'fi',
      },
      {
        id: '4',
        title: 'Kuinka rekisteröidä yrityksesi',
        description: 'Vaiheittainen video-opas kaupparekisteriin rekisteröitymisestä',
        type: 'video',
        category: 'legal',
        url: 'https://www.ytj.fi/',
        language: 'fi',
      },
      {
        id: '5',
        title: 'Työsopimuspohja',
        description: 'Suomalainen työsopimuspohja',
        type: 'template',
        category: 'hr',
        url: 'https://www.ely-keskus.fi/',
        language: 'fi',
      },
      {
        id: '6',
        title: 'Yrityspankkien vertailu',
        description: 'Vertaa suomalaisten suurpankkien palveluita ja maksuja',
        type: 'guide',
        category: 'finance',
        url: 'https://www.finanssivalvonta.fi/',
        language: 'fi',
      },
      {
        id: '7',
        title: 'ALV-opas yrittäjille',
        description: 'Kaikki mitä sinun tarvitsee tietää ALV-rekisteröinnistä ja ilmoittamisesta',
        type: 'guide',
        category: 'taxation',
        url: 'https://www.vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/',
        language: 'fi',
      },
      {
        id: '8',
        title: 'Startup-lupien tarkistuslista',
        description: 'Toimialakohtaiset lupavelvoitteet tarkistuslistana',
        type: 'template',
        category: 'legal',
        url: 'https://www.prh.fi/',
        language: 'fi',
      },
    ],
  }
};

export default function ResourceLibrary({ language }: ResourceLibraryProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const resources = t.resources;

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-green-600" />;
      case 'template':
        return <Download className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            
            onClick={() => setCategoryFilter('all')}
          >
            {t.allCategories}
          </button>
          {Object.entries(t.categories).map(([key, label]) => (
            <button
              key={key}
              variant={categoryFilter === key ? 'default' : 'outline'}
              
              onClick={() => setCategoryFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-6 transition-colors hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-gray-900">{resource.title}</h3>
                  <Badge  className="flex-shrink-0">
                    {t.types[resource.type as keyof typeof t.types]}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <Badge >
                    {t.categories[resource.category as keyof typeof t.categories]}
                  </Badge>
                  <button
                    variant="ghost"
                    
                    className="gap-2"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    Open
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resources found</p>
        </Card>
      )}
    </div>
  );
}
