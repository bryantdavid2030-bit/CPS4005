export interface Coach {
  id: string;
  name: string;
  discipline: string;
  location: string;
  headline: string;
  bio: string;
  portrait?: string;
  languages: string[];
  specialties: string[];
  baseRate?: string;
  availability: 'Available' | 'Limited' | 'Waitlist';
  featured?: boolean;
}

export interface Enquiry {
  coachId?: string;
  clientName: string;
  email: string;
  phone?: string;
  organisation?: string;
  type: 'individual' | 'concierge' | 'corporate';
  message: string;
  startDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'concierge' | 'corporate' | 'practitioner';
  createdAt: string;
}
