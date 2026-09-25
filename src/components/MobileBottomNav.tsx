import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { 
  Home, 
  BookOpen, 
  Users, 
  Bell, 
  MoreHorizontal,
  Lock,
  Globe,
  FolderKanban,
  CreditCard
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMoreMenu }) => {
  const { activeTab, setActiveTab, isPublicView, setIsPublicView, isAdminLoggedIn } = useMaktab();

  const handleTabClick = (tabId: string) => {
    setIsPublicView(false);
    setActiveTab(tabId);
  };

  // If unauthenticated public viewer
  if (!isAdminLoggedIn || isPublicView) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden no-print">
        <div className="grid grid-cols-4 items-center h-16 px-1">
          {/* Public Home */}
          <button
            onClick={() => {
              setIsPublicView(true);
              setActiveTab('public');
            }}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
              activeTab === 'public'
                ? 'text-emerald-800 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-bold">পাবলিক সাইট</span>
          </button>

          {/* Public Projects */}
          <button
            onClick={() => {
              setIsPublicView(true);
              setActiveTab('public');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center h-full cursor-pointer text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FolderKanban className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">প্রকল্প</span>
          </button>

          {/* Payment & Donation */}
          <button
            onClick={() => {
              setIsPublicView(true);
              setActiveTab('public');
              window.scrollTo({ top: 800, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center h-full cursor-pointer text-slate-500 hover:text-slate-900 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">অনুদানের নম্বর</span>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => setActiveTab('login')}
            className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
              activeTab === 'login'
                ? 'text-emerald-800 font-semibold'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-bold">এডমিন লগইন</span>
          </button>
        </div>
      </nav>
    );
  }

  // Authenticated Admin Nav
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden no-print">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            !isPublicView && activeTab === 'dashboard'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">হোম</span>
        </button>

        {/* Tab 2: হিসাব */}
        <button
          onClick={() => handleTabClick('ledger')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            !isPublicView && activeTab === 'ledger'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">হিসাব</span>
        </button>

        {/* Tab 3: সদস্য */}
        <button
          onClick={() => handleTabClick('members')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            !isPublicView && activeTab === 'members'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">সদস্য</span>
        </button>

        {/* Tab 4: নোটিশ */}
        <button
          onClick={() => handleTabClick('notices')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            !isPublicView && activeTab === 'notices'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">নোটিশ</span>
        </button>

        {/* Tab 5: আরও */}
        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center h-full cursor-pointer text-slate-500 hover:text-slate-900 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">আরও</span>
        </button>

      </div>
    </nav>
  );
};
