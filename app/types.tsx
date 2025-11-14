export type UserType = 'entrepreneur' | 'advisor' | null;
export type Language = 'en' | 'fi';

export interface UserProfile {
  name: string;
  businessStage: 'idea' | 'planning' | 'registered' | 'operating';
  industry: string;
  language: Language;
  completedSteps: string[];
  notes: string;
}

