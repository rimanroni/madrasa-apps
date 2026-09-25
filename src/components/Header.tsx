import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { getThemeClasses } from '../types/theme';
import { 
  Building2, 
  Globe, 
  UserCheck, 
  ShieldCheck, 
  Wallet,
  Menu,
  ChevronDown,
  Lock,
  LogOut,
  Palette
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  onOpenThemeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenThemeModal }) => {
  const { 
    maktabSettings, 
    currentUser, 
    isAdminLoggedIn,
    adminRole,
    logoutAdmin,
    isPublicView, 
    setIsPublicView,
    activeTab,
    setActiveTab,
    isSupabaseConnected,
    themeConfig
  } = useMaktab();

  const themeClasses = getThemeClasses(themeConfig?.color);
  const firstLetter = maktabSettings.maktab_name ? maktabSettings.maktab_name.trim().charAt(0) : 'ম';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-colors no-print">
      
      {/* Zone 1: Single text element Brand Zone */}
      <div className="flex items-center gap-3 min-w-0">
        {isAdminLoggedIn && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <button 
          onClick={() => {
            if (isAdminLoggedIn) {
              setIsPublicView(false);
              setActiveTab('dashboard');
            } else {
              setIsPublicView(true);
              setActiveTab('public');
            }
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate flex items-center gap-2.5 cursor-pointer text-left group"
        >
          <span className={`w-8 h-8 rounded-xl ${themeClasses.primaryBtn} flex items-center justify-center shrink-0 shadow-xs font-serif font-black text-sm group-hover:scale-105 transition-transform`}>
            {firstLetter}
          </span>
          <span className="truncate">{maktabSettings.maktab_name}</span>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Desktop) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {isAdminLoggedIn && !isPublicView ? (
          <>
            {[
              { id: 'dashboard', label: 'ড্যাশবোর্ড' },
              { id: 'ledger', label: 'হিসাব খাতা' },
              { id: 'contributions', label: 'অবদান ও অনুদান' },
              { id: 'members', label: 'সদস্যবৃন্দ' },
              { id: 'projects', label: 'উন্নয়ন প্রকল্প' },
              { id: 'reports', label: 'রিপোর্ট' },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsPublicView(false);
                    setActiveTab(item.id);
                  }}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                    isActive ? `${themeClasses.primaryText} font-bold underline underline-offset-8 decoration-2` : ''
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsPublicView(true);
                setActiveTab('public');
              }}
              className={`${themeClasses.primaryText} font-bold underline underline-offset-8 decoration-2 cursor-pointer`}
            >
              পাবলিক আর্থিক পোর্টাল
            </button>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
              গ্রামবাসীর জন্য উন্মুক্ত ও স্বচ্ছ হিসাব ব্যবস্থা
            </span>
          </>
        )}
      </nav>

      {/* Zone 3: Primary Actions (Admin Login / Logout / Public Switch / Theme) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Theme Customizer Quick Button */}
        {onOpenThemeModal && (
          <button
            onClick={onOpenThemeModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="থিম ও রঙ কাস্টমাইজ করুন"
            aria-label="থিম পরিবর্তন"
          >
            <Palette className={`w-3.5 h-3.5 ${themeClasses.iconColor}`} />
            <span className="hidden sm:inline">থিম</span>
          </button>
        )}

        {isAdminLoggedIn ? (
          <>
            {/* Toggle Public / Admin View Button */}
            <button
              onClick={() => {
                const next = !isPublicView;
                setIsPublicView(next);
                if (next) {
                  setActiveTab('public');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPublicView 
                  ? `${themeClasses.primaryBtn} shadow-xs` 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPublicView ? 'এডমিন ড্যাশবোর্ড' : 'পাবলিক সাইট'}</span>
              <span className="sm:hidden">{isPublicView ? 'এডমিন' : 'পাবলিক'}</span>
            </button>

            {/* Admin Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 ${themeClasses.primaryLightBg} rounded-xl text-xs font-semibold`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminRole === 'super_admin' ? 'সুপার অ্যাডমিন' : 'প্রধান অ্যাডমিন'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutAdmin}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="অ্যাডমিন সেশন শেষ করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </>
        ) : (
          /* Public Viewer: Only One Login Button to Admin Login */
          <button
            onClick={() => setActiveTab('login')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${themeClasses.primaryBtn} shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>অ্যাডমিন লগইন</span>
          </button>
        )}

      </div>
    </header>
  );
};
