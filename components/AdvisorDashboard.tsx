'use client';

import { useState, useEffect } from 'react';
import { Language } from '../app/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Users, Search, TrendingUp, Briefcase, Clock, CheckCircle2 } from 'lucide-react';

interface AdvisorDashboardProps {
  language: Language;
}

interface Client {
  id: string;
  name: string;
  businessStage: string;
  industry: string;
  completedSteps: number;
  totalSteps: number;
  lastActive: Date;
  challenges: string;
  upcomingMeeting?: Date;
}

const translations = {
  en: {
    title: 'Advisor Dashboard',
    subtitle: 'Overview of your clients and their progress',
    search: 'Search clients...',
    filterStage: 'Filter by stage',
    allStages: 'All stages',
    totalClients: 'Total Clients',
    activeThisWeek: 'Active This Week',
    upcomingMeetings: 'Upcoming Meetings',
    avgProgress: 'Avg. Progress',
    clientList: 'Client List',
    progress: 'Progress',
    lastActive: 'Last Active',
    viewDetails: 'View Details',
    noClients: 'No clients found',
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
  },
  fi: {
    title: 'Neuvonantajan hallintapaneeli',
    subtitle: 'Yleiskatsaus asiakkaistasi ja heidän edistymisestään',
    search: 'Hae asiakkaita...',
    filterStage: 'Suodata vaiheen mukaan',
    allStages: 'Kaikki vaiheet',
    totalClients: 'Asiakkaat yhteensä',
    activeThisWeek: 'Aktiivisia tällä viikolla',
    upcomingMeetings: 'Tulevat tapaamiset',
    avgProgress: 'Keskimääräinen edistyminen',
    clientList: 'Asiakasluettelo',
    progress: 'Edistyminen',
    lastActive: 'Viimeksi aktiivinen',
    viewDetails: 'Näytä tiedot',
    noClients: 'Asiakkaita ei löytynyt',
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
  }
};

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Virtanen',
    businessStage: 'planning',
    industry: 'technology',
    completedSteps: 4,
    totalSteps: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    challenges: 'Finding seed funding for SaaS product',
    upcomingMeeting: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // in 2 days
  },
  {
    id: '2',
    name: 'Jukka Korhonen',
    businessStage: 'idea',
    industry: 'hospitality',
    completedSteps: 2,
    totalSteps: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    challenges: 'Understanding restaurant licensing and permits',
  },
  {
    id: '3',
    name: 'Anna Mäkinen',
    businessStage: 'registered',
    industry: 'services',
    completedSteps: 6,
    totalSteps: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    challenges: 'Hiring first employees, tax planning',
    upcomingMeeting: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
  },
  {
    id: '4',
    name: 'Petri Laine',
    businessStage: 'operating',
    industry: 'retail',
    completedSteps: 8,
    totalSteps: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    challenges: 'Scaling operations, international expansion',
  },
  {
    id: '5',
    name: 'Laura Salo',
    businessStage: 'planning',
    industry: 'healthcare',
    completedSteps: 3,
    totalSteps: 8,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    challenges: 'Healthcare licensing requirements, insurance',
    upcomingMeeting: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // in 5 days
  },
];

export default function AdvisorDashboard({ language }: AdvisorDashboardProps) {
  const t = translations[language];
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.challenges.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || client.businessStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const oneWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const activeThisWeek = clients.filter(c => c.lastActive > oneWeekAgo).length;
  const upcomingMeetingsCount = clients.filter(c => c.upcomingMeeting).length;
  const avgProgress = Math.round(
    clients.reduce((sum, c) => sum + (c.completedSteps / c.totalSteps) * 100, 0) / clients.length
  );

  const getRelativeTime = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return language === 'en' ? 'Just now' : 'Juuri nyt';
    if (hours < 24) return language === 'en' ? `${hours}h ago` : `${hours}h sitten`;
    if (days === 1) return language === 'en' ? 'Yesterday' : 'Eilen';
    return language === 'en' ? `${days} days ago` : `${days} päivää sitten`;
  };

  const getUpcomingTime = (date: Date): string => {
    const diff = date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return language === 'en' ? 'Today' : 'Tänään';
    if (days === 1) return language === 'en' ? 'Tomorrow' : 'Huomenna';
    return language === 'en' ? `In ${days} days` : `${days} päivän kuluttua`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{t.totalClients}</p>
                <p className="text-gray-900 mt-1">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{t.activeThisWeek}</p>
                <p className="text-gray-900 mt-1">{activeThisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{t.upcomingMeetings}</p>
                <p className="text-gray-900 mt-1">{upcomingMeetingsCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{t.avgProgress}</p>
                <p className="text-gray-900 mt-1">{avgProgress}%</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
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
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder={t.filterStage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStages}</SelectItem>
              <SelectItem value="idea">{t.stages.idea}</SelectItem>
              <SelectItem value="planning">{t.stages.planning}</SelectItem>
              <SelectItem value="registered">{t.stages.registered}</SelectItem>
              <SelectItem value="operating">{t.stages.operating}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Client List */}
      <div>
        <h2 className="text-gray-900 mb-4">{t.clientList}</h2>
        {filteredClients.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t.noClients}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{client.name}</h3>
                      <Badge >
                        {t.stages[client.businessStage as keyof typeof t.stages]}
                      </Badge>
                      <Badge >
                        {t.industries[client.industry as keyof typeof t.industries]}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{client.challenges}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {t.progress}: {client.completedSteps}/{client.totalSteps}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(client.completedSteps / client.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {t.lastActive}: {getRelativeTime(client.lastActive)}
                        </span>
                      </div>

                      {client.upcomingMeeting && (
                        <Badge className="bg-orange-100 text-orange-700">
                          Meeting: {getUpcomingTime(client.upcomingMeeting)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <button  >
                    {t.viewDetails}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
