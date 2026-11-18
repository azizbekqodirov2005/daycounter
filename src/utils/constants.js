import {
  Cake,
  GraduationCap,
  Heart,
  Plane,
  PartyPopper,
  CalendarDays,
} from 'lucide-react';

/**
 * Sana turlari. `id` LocalStorage'da saqlanadi, shuning uchun o'zgartirilmasligi kerak.
 */
export const CATEGORIES = [
  { id: 'birthday', label: "Tug'ilgan kun", icon: Cake },
  { id: 'exam', label: 'Imtihon', icon: GraduationCap },
  { id: 'wedding', label: "To'y", icon: Heart },
  { id: 'travel', label: 'Sayohat', icon: Plane },
  { id: 'holiday', label: 'Bayram', icon: PartyPopper },
  { id: 'other', label: 'Boshqa', icon: CalendarDays },
];

export const DEFAULT_CATEGORY = 'other';

export const getCategory = (id) =>
  CATEGORIES.find((category) => category.id === id) ??
  CATEGORIES[CATEGORIES.length - 1];

/**
 * Karta accent ranglari. Light va dark rejimda ham yetarli kontrastga ega.
 */
export const COLORS = [
  { id: 'indigo', label: 'Indigo', value: '#4f46e5' },
  { id: 'violet', label: 'Violet', value: '#7c3aed' },
  { id: 'blue', label: "Ko'k", value: '#2563eb' },
  { id: 'teal', label: 'Teal', value: '#0d9488' },
  { id: 'amber', label: 'Amber', value: '#d97706' },
  { id: 'rose', label: 'Rose', value: '#e11d48' },
];

export const DEFAULT_COLOR = COLORS[0].id;

export const getColorValue = (id) =>
  (COLORS.find((color) => color.id === id) ?? COLORS[0]).value;

export const STORAGE_KEYS = {
  events: 'daycounter.events',
  theme: 'daycounter.theme',
};

export const SORT_OPTIONS = [
  { id: 'soonest', label: "Eng yaqin birinchi" },
  { id: 'farthest', label: 'Eng uzoq birinchi' },
  { id: 'name', label: 'Nom bo‘yicha (A-Z)' },
  { id: 'created', label: "Oxirgi qo‘shilgan" },
];
