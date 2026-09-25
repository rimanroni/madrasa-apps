import React, { useState } from 'react';
import { MaktabProvider, useMaktab } from './context/MaktabContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ReceiptModal } from './components/ReceiptModal';
import { MemberDetailModal } from './components/MemberDetailModal';
import { 
  ContributionModal, 
  IncomeModal, 
  ExpenseModal, 
  MemberModal 
} from './components/QuickActionModals';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { LedgerView } from './views/LedgerView';
import { ContributionsView } from './views/ContributionsView';
import { MembersView } from './views/MembersView';
import { ProjectsView } from './views/ProjectsView';
import { NoticesMeetingsView } from './views/NoticesMeetingsView';
import { ReportsView } from './views/ReportsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SettingsView } from './views/SettingsView';
import { PublicPortalView } from './views/PublicPortalView';
import { AdminLoginView } from './views/AdminLoginView';
import { ThemeModal } from './components/ThemeModal';
import { Member } from './types/database';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isPublicView, 
    setIsPublicView,
    isAdminLoggedIn,
    activeMemberDetail, 
    setActiveMemberDetail 
  } = useMaktab();

  // Mobile Drawer & Theme Modal State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Quick Action Modal States
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  
  // Selected Member for Modal
  const [selectedMemberForContribution, setSelectedMemberForContribution] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const handleOpenContributionWithMember = (member: Member) => {
    setSelectedMemberForContribution(member);
    setIsContributionModalOpen(true);
  };

  const handleOpenMemberModal = (member?: Member) => {
    setMemberToEdit(member || null);
    setIsMemberModalOpen(true);
  };

  // 1. If on Login View OR unauthenticated trying to access Admin
  if (activeTab === 'login' || (!isAdminLoggedIn && !isPublicView && activeTab !== 'public')) {
    return (
      <div className="min-h-screen bg-slate-900">
        <AdminLoginView 
          onBackToPublic={() => {
            setIsPublicView(true);
            setActiveTab('public');
          }}
          onLoginSuccess={() => {
            setIsPublicView(false);
            setActiveTab('dashboard');
          }}
        />
        <Toast />
      </div>
    );
  }

  // 2. If in Public View
  const isViewingPublicSite = isPublicView || activeTab === 'public' || !isAdminLoggedIn;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Header 
        onToggleMobileMenu={() => setIsMobileDrawerOpen(true)} 
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      <div className="flex-1 flex min-w-0">
        
        {/* Desktop Sidebar / Mobile Drawer (Admin Mode Only) */}
        {!isViewingPublicSite && (
          <Sidebar 
            isOpen={isMobileDrawerOpen} 
            onClose={() => setIsMobileDrawerOpen(false)} 
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
          />
        )}

        {/* Main Body Content Container */}
        <main className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 transition-all ${
          !isViewingPublicSite ? 'md:ml-64' : 'max-w-6xl mx-auto w-full'
        }`}>
          <div className="max-w-7xl mx-auto">
            {isViewingPublicSite ? (
              <PublicPortalView />
            ) : activeTab === 'dashboard' ? (
              <DashboardView
                onOpenContributionModal={() => {
                  setSelectedMemberForContribution(null);
                  setIsContributionModalOpen(true);
                }}
                onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                onOpenMemberModal={() => handleOpenMemberModal()}
              />
            ) : activeTab === 'ledger' ? (
              <LedgerView
                onOpenContributionModal={() => {
                  setSelectedMemberForContribution(null);
                  setIsContributionModalOpen(true);
                }}
                onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
              />
            ) : activeTab === 'contributions' ? (
              <ContributionsView
                onOpenContributionModal={() => {
                  setSelectedMemberForContribution(null);
                  setIsContributionModalOpen(true);
                }}
              />
            ) : activeTab === 'members' ? (
              <MembersView
                onOpenMemberModal={handleOpenMemberModal}
                onOpenContributionModalWithMember={handleOpenContributionWithMember}
              />
            ) : activeTab === 'projects' ? (
              <ProjectsView />
            ) : activeTab === 'notices' ? (
              <NoticesMeetingsView />
            ) : activeTab === 'reports' ? (
              <ReportsView />
            ) : activeTab === 'audit' ? (
              <AuditLogsView />
            ) : activeTab === 'settings' ? (
              <SettingsView />
            ) : (
              <DashboardView
                onOpenContributionModal={() => {
                  setSelectedMemberForContribution(null);
                  setIsContributionModalOpen(true);
                }}
                onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                onOpenMemberModal={() => handleOpenMemberModal()}
              />
            )}

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenMoreMenu={() => setIsMobileDrawerOpen(true)} />

      {/* Floating '+' Action Button for Android Mobile (Admin Only) */}
      <FloatingActionButton
        onOpenContributionModal={() => {
          setSelectedMemberForContribution(null);
          setIsContributionModalOpen(true);
        }}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenMemberModal={() => handleOpenMemberModal()}
      />

      {/* Official Cash Receipt Modal */}
      <ReceiptModal />

      {/* Member Details & Statement Modal */}
      <MemberDetailModal
        member={activeMemberDetail}
        onClose={() => setActiveMemberDetail(null)}
        onAddContributionForMember={handleOpenContributionWithMember}
      />

      {/* Quick Action Modals */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false);
          setSelectedMemberForContribution(null);
        }}
        preSelectedMember={selectedMemberForContribution}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />

      {/* Theme Customizer Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Floating System Toast */}
      <Toast />

    </div>
  );
};

export default function App() {
  return (
    <MaktabProvider>
      <MainAppContent />
    </MaktabProvider>
  );
}
