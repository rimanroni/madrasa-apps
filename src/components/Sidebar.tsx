import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { getThemeClasses } from '../types/theme';
import { 
  LayoutDashboard, 
  BookOpen, 
  HandCoins, 
  Users, 
  FolderKanban, 
  Bell, 
  FileSpreadsheet, 
  ShieldAlert, 
  Settings, 
  Globe,
  X,
  PhoneCall,
  Palette
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenThemeModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    maktabSettings, 
    currentUser, 
    isPublicView, 
    setIsPublicView,
    adminRole,
    themeConfig
  } = useMaktab();

  const themeClasses = getThemeClasses(themeConfig?.color);

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'ledger', label: 'হিসাব ও লেজার', icon: BookOpen },
    { id: 'contributions', label: 'অবদান ও অনুদান', icon: HandCoins },
    { id: 'members', label: 'সদস্য তালিকা', icon: Users },
    { id: 'projects', label: 'উন্নয়ন প্রকল্প', icon: FolderKanban },
    { id: 'notices', label: 'নোটিশ ও মিটিং', icon: Bell },
    { id: 'reports', label: 'হিসাব বিবরণী ও রিপোর্ট', icon: FileSpreadsheet },
    { id: 'audit', label: 'অডিট লগ ও নিরীক্ষা', icon: ShieldAlert },
    { id: 'settings', label: 'মক্তব সেটিংস ও ডাটাবেজ', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setIsPublicView(false);
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs no-print"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              ম
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white tracking-tight truncate">
                {maktabSettings.maktab_name}
              </h2>
              <p className="text-[11px] text-emerald-400 truncate">
                {maktabSettings.village_name ? `গ্রাম: ${maktabSettings.village_name}` : 'ম্যানেজমেন্ট সিস্টেম'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Role Identity Card */}
        <div className="px-4 py-3 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="text-[11px] text-slate-400">লগইন অ্যাকাউন্ট:</div>
          <div className="font-semibold text-xs text-white truncate mt-0.5">
            {adminRole === 'super_admin' ? 'সুপার অ্যাডমিন' : 'প্রধান অ্যাডমিন'}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-300 font-medium">
              পূর্ণ ব্যবস্থাপনা ক্ষমতা
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            প্রধান মেনু
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isPublicView && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? `${themeClasses.primaryBtn} font-semibold shadow-xs`
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            পাবলিক ও রূপরেখা
          </div>

          <button
            onClick={() => {
              setIsPublicView(true);
              setActiveTab('public');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
              isPublicView
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">জনসাধারণ পেজ (Public View)</span>
          </button>

          {onOpenThemeModal && (
            <button
              onClick={() => {
                onOpenThemeModal();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Palette className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">থিম ও রঙ কাস্টমাইজেশন</span>
            </button>
          )}
        </div>

        {/* Footer Contact Info & Maktab Status */}
        <div className="p-3.5 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono truncate">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>মক্তব: {maktabSettings.phone || 'মোবাইল নেই'}</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {maktabSettings.village_name ? `${maktabSettings.village_name}, ` : ''}
            {maktabSettings.upazila ? `${maktabSettings.upazila}` : ''}
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-emerald-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              সিস্টেম লাইভ
            </span>
            <span className="text-slate-500">অনলাইন পোর্টাল</span>
          </div>
        </div>
      </aside>
    </>
  );
};
