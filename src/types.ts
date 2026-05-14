export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  type: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  adminResponse?: string;
  createdAt: any;
}

export interface Visit {
  id: string;
  name: string;
  phone: string;
  projectId: string;
  projectTitle: string;
  preferredDate: string;
  preferredTime?: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  adminNotes?: string;
  createdAt: any;
}
