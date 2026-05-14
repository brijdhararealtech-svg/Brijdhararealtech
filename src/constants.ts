import { Project, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '/about' },
];

export const PROJECTS: Project[] = [
  {
    id: 'kanha-kunj',
    title: 'Kanha Kunj',
    description: 'Boutique residential plots nestled in the serene landscapes of Vrindavan.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
    location: 'Vrindavan',
    type: 'Residential Plots',
  },
  {
    id: 'hetvik-plaza',
    title: 'Hetvik Plaza',
    description: 'Prime commercial land strategically located for maximum visibility and growth.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
    location: 'Mathura Highway',
    type: 'Commercial Land',
  },
  {
    id: 'brij-town',
    title: 'Brij Town',
    description: 'A mega-township project offering a blend of modern infrastructure and natural beauty.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
    location: 'Near Goverdhan',
    type: 'Township Plots',
  },
  {
    id: 'brij-green-highway',
    title: 'Brij Green Highway',
    description: 'Eco-conscious living with expansive green plots along the corridor of progress.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
    location: 'Yamuna Expressway',
    type: 'Eco-Plots',
  },
];

export const HERO_VIDEO = '';
export const HERO_FALLBACK = 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1600';
