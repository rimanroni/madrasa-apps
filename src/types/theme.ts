export type ThemeColor = 'emerald' | 'teal' | 'indigo' | 'amber' | 'slate' | 'rose';
export type ThemeMode = 'light' | 'dark' | 'dim';
export type ThemeRadius = 'rounded' | 'modern' | 'sharp';
export type ThemeDensity = 'comfortable' | 'compact';

export interface ThemeConfig {
  color: ThemeColor;
  mode: ThemeMode;
  radius: ThemeRadius;
  density: ThemeDensity;
}

export interface ThemePreset {
  id: ThemeColor;
  name: string;
  nameEn: string;
  primaryHex: string;
  accentHex: string;
  badge: string;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'emerald',
    name: 'ঐতিহ্যবাহী পান্না (Emerald)',
    nameEn: 'Classic Emerald',
    primaryHex: '#047857',
    accentHex: '#10b981',
    badge: 'ডিফল্ট',
    description: 'ঐতিহ্যবাহী ইসলামিক সবুজ ও পরিপাটি আধুনিক রূপ'
  },
  {
    id: 'teal',
    name: 'সমুদ্রনীল (Oceanic Teal)',
    nameEn: 'Oceanic Teal',
    primaryHex: '#0f766e',
    accentHex: '#14b8a6',
    badge: 'আধুনিক',
    description: 'শান্ত ও প্রফুল্ল টিল রঙের ভারসাম্য'
  },
  {
    id: 'indigo',
    name: 'অভিজাত নীল (Royal Sapphire)',
    nameEn: 'Royal Sapphire',
    primaryHex: '#3730a3',
    accentHex: '#6366f1',
    badge: 'অভিজাত',
    description: 'গাঢ় রাজকীয় নীল ও প্রফেশনাল কর্পোরেট ভাব'
  },
  {
    id: 'amber',
    name: 'উষ্ণ সোনালী (Warm Bronze)',
    nameEn: 'Warm Bronze',
    primaryHex: '#b45309',
    accentHex: '#f59e0b',
    badge: 'ঐতিহাসিক',
    description: 'মাটির গন্ধযুক্ত ক্লাসিক ব্রোঞ্জ ও উষ্ণ সোনালী আভা'
  },
  {
    id: 'rose',
    name: 'রুবি রোজউড (Rosewood)',
    nameEn: 'Rosewood',
    primaryHex: '#be123c',
    accentHex: '#f43f5e',
    badge: 'উজ্জ্বল',
    description: 'সুস্পষ্ট ও প্রাণবন্ত রোজউড থিম'
  },
  {
    id: 'slate',
    name: 'মিনিমালিস্ট স্লেট (Modern Slate)',
    nameEn: 'Monochrome Slate',
    primaryHex: '#334155',
    accentHex: '#64748b',
    badge: 'মিনিমাল',
    description: 'অতিরিক্ত রঙবিহীন পরিচ্ছন্ন আধুনিক মনোক্রোম'
  }
];

export const defaultThemeConfig: ThemeConfig = {
  color: 'emerald',
  mode: 'light',
  radius: 'rounded',
  density: 'comfortable'
};

export interface ThemeClassSet {
  primaryBtn: string;
  primaryBtnHover: string;
  primaryText: string;
  primaryBorder: string;
  primaryLightBg: string;
  gradientBg: string;
  sidebarActive: string;
  ringColor: string;
  badge: string;
  iconColor: string;
  headerAccent: string;
}

export const THEME_CLASSES: Record<ThemeColor, ThemeClassSet> = {
  emerald: {
    primaryBtn: 'bg-emerald-800 hover:bg-emerald-700 text-white',
    primaryBtnHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-800 dark:text-emerald-400',
    primaryBorder: 'border-emerald-700',
    primaryLightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    gradientBg: 'from-emerald-900 via-emerald-800 to-teal-900',
    sidebarActive: 'bg-emerald-800 text-white shadow-xs',
    ringColor: 'focus:ring-emerald-500',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    headerAccent: 'text-emerald-950 dark:text-emerald-300'
  },
  teal: {
    primaryBtn: 'bg-teal-800 hover:bg-teal-700 text-white',
    primaryBtnHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-800 dark:text-teal-400',
    primaryBorder: 'border-teal-700',
    primaryLightBg: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    gradientBg: 'from-teal-900 via-teal-800 to-cyan-900',
    sidebarActive: 'bg-teal-800 text-white shadow-xs',
    ringColor: 'focus:ring-teal-500',
    badge: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-900/60 dark:text-teal-200',
    iconColor: 'text-teal-700 dark:text-teal-400',
    headerAccent: 'text-teal-950 dark:text-teal-300'
  },
  indigo: {
    primaryBtn: 'bg-indigo-800 hover:bg-indigo-700 text-white',
    primaryBtnHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-800 dark:text-indigo-400',
    primaryBorder: 'border-indigo-700',
    primaryLightBg: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    gradientBg: 'from-indigo-950 via-indigo-900 to-slate-900',
    sidebarActive: 'bg-indigo-800 text-white shadow-xs',
    ringColor: 'focus:ring-indigo-500',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-200',
    iconColor: 'text-indigo-700 dark:text-indigo-400',
    headerAccent: 'text-indigo-950 dark:text-indigo-300'
  },
  amber: {
    primaryBtn: 'bg-amber-800 hover:bg-amber-700 text-white',
    primaryBtnHover: 'hover:bg-amber-700',
    primaryText: 'text-amber-800 dark:text-amber-400',
    primaryBorder: 'border-amber-700',
    primaryLightBg: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    gradientBg: 'from-amber-950 via-amber-900 to-stone-900',
    sidebarActive: 'bg-amber-800 text-white shadow-xs',
    ringColor: 'focus:ring-amber-500',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200',
    iconColor: 'text-amber-700 dark:text-amber-400',
    headerAccent: 'text-amber-950 dark:text-amber-300'
  },
  rose: {
    primaryBtn: 'bg-rose-800 hover:bg-rose-700 text-white',
    primaryBtnHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-800 dark:text-rose-400',
    primaryBorder: 'border-rose-700',
    primaryLightBg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    gradientBg: 'from-rose-950 via-rose-900 to-slate-900',
    sidebarActive: 'bg-rose-800 text-white shadow-xs',
    ringColor: 'focus:ring-rose-500',
    badge: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/60 dark:text-rose-200',
    iconColor: 'text-rose-700 dark:text-rose-400',
    headerAccent: 'text-rose-950 dark:text-rose-300'
  },
  slate: {
    primaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
    primaryBtnHover: 'hover:bg-slate-800',
    primaryText: 'text-slate-900 dark:text-slate-200',
    primaryBorder: 'border-slate-800',
    primaryLightBg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    gradientBg: 'from-slate-950 via-slate-900 to-zinc-900',
    sidebarActive: 'bg-slate-800 text-white shadow-xs',
    ringColor: 'focus:ring-slate-500',
    badge: 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
    iconColor: 'text-slate-800 dark:text-slate-300',
    headerAccent: 'text-slate-900 dark:text-slate-100'
  }
};

export const getThemeClasses = (color?: ThemeColor): ThemeClassSet => {
  return THEME_CLASSES[color || 'emerald'] || THEME_CLASSES.emerald;
};
