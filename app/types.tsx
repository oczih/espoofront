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

export interface EspooUser {
  id: string;
  username?: string;
  dob?: string;
  email?: string;
  name: string;
  number?: string;
  oauthProvider?: string;
  business: Business[] | string[]; // array of Business or ObjectId
  appointments?: Appointment[] | string[]; // array of Appointment or ObjectId
}
declare module "next-auth" {
  interface User {
    id: string;
    username?: string;
    dob?: string;
    email?: string;
    name: string;
    number?: string;
    oauthProvider?: string;
    business: Business[] | string[]; // array of Business or ObjectId
    appointments?: Appointment[] | string[]; // array of Appointment or ObjectId
  }

  interface Session {
    user: User & {
      name?: string;
      email?: string;
      image?: string;
    };
    accessToken?: string;
  }
}
export interface Business {
  id: string;
  name: string;
  businessId: string;
  managers: EspooUser[] | string[]; // array of EspooUser or ObjectId
  description: string;
}

export interface Appointment {
  id: string;
  business: Business | string; // populated Business or ObjectId
  user: EspooUser | string; // populated user or ObjectId
  date: Date;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}