import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  MaktabSettings, 
  PublicSettings, 
  Member, 
  Contribution, 
  Income, 
  Expense, 
  Transaction, 
  Project, 
  Notice, 
  Meeting, 
  AuditLog, 
  AccountTransfer,
  UserProfile, 
  UserRole 
} from '../types/database';
import { ThemeConfig } from '../types/theme';
import { 
  defaultMaktabSettings, 
  defaultPublicSettings, 
  defaultMembers, 
  defaultContributions, 
  defaultIncomes, 
  defaultExpenses, 
  defaultTransactions, 
  defaultProjects, 
  defaultNotices, 
  defaultMeetings, 
  defaultAuditLogs,
  getSupabaseClient,
  resetSupabaseClient,
  getSupabaseConfig,
  fetchAllSupabaseData,
  seedDatabaseIfEmpty,
  dbUpdateMaktabSettings,
  dbUpdatePublicSettings,
  dbAddMember,
  dbUpdateMember,
  dbDeleteMember,
  dbAddContribution,
  dbAddIncome,
  dbAddExpense,
  dbRecordAccountTransfer,
  dbAddProject,
  dbUpdateProject,
  dbAddNotice,
  dbUpdateNotice,
  dbDeleteNotice,
  dbAddMeeting,
  dbAddAuditLog
} from '../lib/supabase';

export const defaultThemeConfig: ThemeConfig = {
  color: 'emerald',
  mode: 'light',
  radius: 'rounded',
  density: 'comfortable'
};

interface MaktabContextType {
  maktabSettings: MaktabSettings;
  publicSettings: PublicSettings;
  members: Member[];
  contributions: Contribution[];
  incomes: Income[];
  expenses: Expense[];
  transactions: Transaction[];
  projects: Project[];
  notices: Notice[];
  meetings: Meeting[];
  auditLogs: AuditLog[];
  currentUser: UserProfile;
  activeTab: string;
  isPublicView: boolean;
  isSupabaseConnected: boolean;
  isLoading: boolean;
  viewingReceipt: Contribution | null;
  activeMemberDetail: Member | null;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  
  // Administrator Session Authentication (Single secure login)
  isAdminLoggedIn: boolean;
  adminSessionToken: string | null;
  adminRole: 'main_admin' | 'super_admin' | null;

  // Theme & Visual Customization (Harmless UI state allowed in localStorage)
  themeConfig: ThemeConfig;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;

  // Financial totals (Dynamic calculated from authoritative database records)
  totalContributions: number;
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  cashBalance: number;
  bankBalance: number;
  mobileWalletBalance: number;

  // Actions (All write directly to Supabase with server confirmation)
  loginAdmin: (token: string, role: 'main_admin' | 'super_admin') => void;
  logoutAdmin: () => void;
  setActiveTab: (tab: string) => void;
  setIsPublicView: (isPublic: boolean) => void;
  setViewingReceipt: (c: Contribution | null) => void;
  setActiveMemberDetail: (m: Member | null) => void;
  setCurrentUserRole: (role: UserRole) => void;
  refreshData: () => Promise<void>;

  updateMaktabSettings: (settings: Partial<MaktabSettings>) => Promise<boolean>;
  updatePublicSettings: (settings: Partial<PublicSettings>) => Promise<boolean>;
  addMember: (member: Omit<Member, 'id' | 'created_at'>) => Promise<Member | null>;
  updateMember: (member: Member) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
  addContribution: (contribution: Omit<Contribution, 'id' | 'created_at' | 'receipt_number' | 'created_by'> & { created_by?: string }) => Promise<Contribution | null>;
  addIncome: (income: Omit<Income, 'id' | 'created_at' | 'receipt_number' | 'created_by'> & { created_by?: string }) => Promise<Income | null>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'voucher_number' | 'created_by'> & { created_by?: string }) => Promise<Expense | null>;
  transferFunds: (transfer: AccountTransfer) => Promise<boolean>;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<boolean>;
  updateProject: (project: Project) => Promise<boolean>;
  addNotice: (notice: Omit<Notice, 'id' | 'created_at'>) => Promise<boolean>;
  updateNotice: (notice: Notice) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'created_at'>) => Promise<boolean>;
  connectSupabase: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => Promise<boolean>;
}

const MaktabContext = createContext<MaktabContextType | undefined>(undefined);

export const MaktabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SUPABASE IS THE SINGLE SOURCE OF TRUTH.
  // Initial state uses default schemas while live Supabase query runs.
  const [maktabSettings, setMaktabSettings] = useState<MaktabSettings>(defaultMaktabSettings);
  const [publicSettings, setPublicSettings] = useState<PublicSettings>(defaultPublicSettings);
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [contributions, setContributions] = useState<Contribution[]>(defaultContributions);
  const [incomes, setIncomes] = useState<Income[]>(defaultIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [notices, setNotices] = useState<Notice[]>(defaultNotices);
  const [meetings, setMeetings] = useState<Meeting[]>(defaultMeetings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-admin-1',
    email: 'admin@maktab.org',
    full_name: defaultMaktabSettings.chairman_name || 'সভাপতি সাহেব',
    phone: defaultMaktabSettings.chairman_phone || '০১৭১১-২২৩৩৪৪',
    role: 'chairman'
  });

  // Administrator Session Authentication (Single secure login)
  const [adminSessionToken, setAdminSessionToken] = useState<string | null>(() => {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('maktab_admin_token') : null;
  });
  const [adminRole, setAdminRole] = useState<'main_admin' | 'super_admin' | null>(() => {
    return typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('maktab_admin_role') as 'main_admin' | 'super_admin') : null;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return typeof sessionStorage !== 'undefined' ? !!sessionStorage.getItem('maktab_admin_token') : false;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('maktab_admin_token')) {
      return 'dashboard';
    }
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/admin') || path.includes('/login')) {
        return 'login';
      }
    }
    return 'public';
  });

  const [isPublicView, setIsPublicView] = useState<boolean>(() => {
    return typeof sessionStorage !== 'undefined' ? !sessionStorage.getItem('maktab_admin_token') : true;
  });

  const [viewingReceipt, setViewingReceipt] = useState<Contribution | null>(null);
  const [activeMemberDetail, setActiveMemberDetail] = useState<Member | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Theme & Appearance State (Only harmless UI preference stored in localStorage)
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('maktab_theme_config');
      return saved ? JSON.parse(saved) : defaultThemeConfig;
    } catch {
      return defaultThemeConfig;
    }
  });

  const updateThemeConfig = (updated: Partial<ThemeConfig>) => {
    setThemeConfig(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('maktab_theme_config', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Sync theme changes to document DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeConfig.color);
      document.documentElement.setAttribute('data-radius', themeConfig.radius);
      if (themeConfig.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeConfig]);

  // Toast notification
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  // Fetch all live data from Supabase
  const loadSupabaseData = useCallback(async (clientInstance?: any) => {
    const client = clientInstance || getSupabaseClient();
    if (!client) {
      setIsLoading(false);
      setIsSupabaseConnected(false);
      return;
    }

    try {
      setIsLoading(true);
      // Attempt safe seed if database is brand new (0 rows)
      await seedDatabaseIfEmpty(client);

      // Fetch all tables
      const data = await fetchAllSupabaseData(client);

      if (data.maktabSettings) {
        setMaktabSettings(data.maktabSettings);
      }
      if (data.publicSettings) {
        setPublicSettings(data.publicSettings);
      }
      setMembers(data.members);
      setContributions(data.contributions);
      setIncomes(data.incomes);
      setExpenses(data.expenses);
      setTransactions(data.transactions);
      setProjects(data.projects);
      setNotices(data.notices);
      setMeetings(data.meetings);
      setAuditLogs(data.auditLogs);

      setIsSupabaseConnected(true);
    } catch (err: any) {
      console.warn('Supabase data load error:', err);
      setIsSupabaseConnected(false);
      showToast('সুপাবেস ডাটাবেজ থেকে তথ্য লোড করতে সমস্যা হয়েছে। সংযোগ যাচাই করুন।', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Initial connection on mount and Realtime Subscription
  useEffect(() => {
    const client = getSupabaseClient();
    if (client) {
      loadSupabaseData(client);

      // Realtime subscription across key tables
      const channel = client
        .channel('maktab-live-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          (payload) => {
            console.log('Realtime change received from Supabase:', payload.table, payload.eventType);
            // Refresh data gracefully when remote change happens
            loadSupabaseData(client);
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } else {
      setIsLoading(false);
    }
  }, [loadSupabaseData]);

  // Login handler
  const loginAdmin = (token: string, role: 'main_admin' | 'super_admin') => {
    sessionStorage.setItem('maktab_admin_token', token);
    sessionStorage.setItem('maktab_admin_role', role);
    setAdminSessionToken(token);
    setAdminRole(role);
    setIsAdminLoggedIn(true);
    setIsPublicView(false);
    setActiveTab('dashboard');

    setCurrentUser({
      id: `usr-${role}`,
      email: 'admin@maktab.org',
      full_name: role === 'super_admin' ? 'সুপার অ্যাডমিন' : (maktabSettings.chairman_name || 'প্রধান অ্যাডমিন'),
      phone: maktabSettings.chairman_phone || '',
      role: role === 'super_admin' ? 'super_admin' : 'chairman'
    });

    // Record audit log to Supabase
    const client = getSupabaseClient();
    if (client) {
      dbAddAuditLog(client, {
        user_name: role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'প্রধান অ্যাডমিন',
        action: 'লগইন',
        entity: 'অ্যাডমিন সিকিউরিটি',
        entity_id: token.slice(0, 8),
        details: 'অ্যাডমিন ড্যাশবোর্ডে সফলভাবে লগইন করেছেন।'
      });
    }
  };

  // Logout handler
  const logoutAdmin = () => {
    const currentToken = adminSessionToken || sessionStorage.getItem('maktab_admin_token');
    if (currentToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken })
      }).catch(() => {});
    }

    sessionStorage.removeItem('maktab_admin_token');
    sessionStorage.removeItem('maktab_admin_role');
    setAdminSessionToken(null);
    setAdminRole(null);
    setIsAdminLoggedIn(false);
    setIsPublicView(true);
    setActiveTab('public');

    setCurrentUser({
      id: 'usr-public',
      email: 'public@maktab.org',
      full_name: 'পাবলিক ভিজিটর',
      phone: '',
      role: 'normal_user'
    });

    showToast('অ্যাডমিন সেশন সফলভাবে সমাপ্ত হয়েছে।', 'info');
  };

  // Verify session on mount with server
  useEffect(() => {
    if (adminSessionToken) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSessionToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) {
          logoutAdmin();
        }
      })
      .catch(err => {
        console.warn('Session verification error:', err);
      });
    }
  }, []);

  // Sync document title to live maktab_name
  useEffect(() => {
    if (maktabSettings.maktab_name) {
      document.title = `${maktabSettings.maktab_name} - আর্থিক হিসাব ও ব্যবস্থাপনা`;
    }
  }, [maktabSettings.maktab_name]);

  // ----------------------------------------------------------------------------
  // FINANCIAL TOTALS DYNAMICALLY CALCULATED FROM DATABASE RECORDS
  // ----------------------------------------------------------------------------
  const totalContributions = contributions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalIncome = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const currentBalance = (Number(maktabSettings.opening_balance) || 0) + totalIncome + totalContributions - totalExpenses;

  // Account transfers impact:
  const transfers = transactions.filter(t => t.type === 'transfer');

  const getTransfersIn = (account: string) => 
    transfers.filter(t => t.to_account === account).reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const getTransfersOut = (account: string) => 
    transfers.filter(t => t.from_account === account || (t.payment_method === account && !t.from_account)).reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // Breakdown by accounts
  const cashIncome = (Number(maktabSettings.opening_balance) || 0) + 
    contributions.filter(c => c.payment_method === 'cash').reduce((s, c) => s + (Number(c.amount) || 0), 0) +
    incomes.filter(i => i.payment_method === 'cash').reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const cashExpense = expenses.filter(e => e.payment_method === 'cash').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const cashBalance = cashIncome - cashExpense + getTransfersIn('cash') - getTransfersOut('cash');

  const bankIncome = contributions.filter(c => c.payment_method === 'bank').reduce((s, c) => s + (Number(c.amount) || 0), 0) +
    incomes.filter(i => i.payment_method === 'bank').reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const bankExpense = expenses.filter(e => e.payment_method === 'bank').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const bankBalance = bankIncome - bankExpense + getTransfersIn('bank') - getTransfersOut('bank');

  const mobileIncome = contributions.filter(c => c.payment_method === 'bkash' || c.payment_method === 'nagad' || c.payment_method === 'other').reduce((s, c) => s + (Number(c.amount) || 0), 0) +
    incomes.filter(i => i.payment_method === 'bkash' || i.payment_method === 'nagad' || i.payment_method === 'other').reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const mobileExpense = expenses.filter(e => e.payment_method === 'bkash' || e.payment_method === 'nagad' || e.payment_method === 'other').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const mobileWalletBalance = mobileIncome - mobileExpense + 
    (getTransfersIn('bkash') + getTransfersIn('nagad')) - 
    (getTransfersOut('bkash') + getTransfersOut('nagad'));

  // ----------------------------------------------------------------------------
  // MUTATION OPERATIONS (WRITING TO SUPABASE AND UPDATING LIVE STATE)
  // ----------------------------------------------------------------------------

  const updateMaktabSettings = async (newSettings: Partial<MaktabSettings>): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbUpdateMaktabSettings(client, newSettings, maktabSettings.id);
      setMaktabSettings(saved);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'সেটিংস পরিবর্তন',
        entity: 'মক্তব প্রোফাইল',
        entity_id: saved.id,
        details: 'মক্তবের নাম বা পেমেন্ট নম্বর সংক্রান্ত তথ্য আপডেট করা হয়েছে।'
      });

      showToast('মক্তবের সার্বিক সেটিংস সুপাবেসে সফলভাবে সংরক্ষিত হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to update maktab settings in Supabase:', err);
      showToast(`সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি। (${err.message || 'ত্রুটি'})`, 'error');
      return false;
    }
  };

  const updatePublicSettings = async (newSettings: Partial<PublicSettings>): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbUpdatePublicSettings(client, newSettings);
      setPublicSettings(saved);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'পাবলিক ভিউ পরিবর্তন',
        entity: 'পাবলিক দৃশ্যমানতা',
        entity_id: 'public_settings',
        details: 'জনসাধারণের জন্য তথ্য প্রদর্শনের অনুমতি পরিবর্তন করা হয়েছে।'
      });

      showToast('পাবলিক দৃশ্যমানতা সেটিংস সংরক্ষিত হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to update public settings in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'created_at'>): Promise<Member | null> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return null;
    }

    try {
      const saved = await dbAddMember(client, memberData);
      setMembers(prev => [saved, ...prev]);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'সদস্য যোগ',
        entity: 'সদস্য তালিকা',
        entity_id: saved.member_id,
        details: `নতুন সদস্য "${saved.name}" সফলভাবে অন্তর্ভুক্ত করা হয়েছে।`
      });

      showToast(`সদস্য "${saved.name}" সফলভাবে যুক্ত হয়েছেন।`, 'success');
      return saved;
    } catch (err: any) {
      console.error('Failed to add member to Supabase:', err);
      showToast(`সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি। (${err.message || 'ত্রুটি'})`, 'error');
      return null;
    }
  };

  const updateMember = async (updatedMember: Member): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbUpdateMember(client, updatedMember);
      setMembers(prev => prev.map(m => m.id === saved.id ? saved : m));

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'সদস্য সম্পাদনা',
        entity: 'সদস্য তালিকা',
        entity_id: saved.member_id,
        details: `সদস্য "${saved.name}" এর তথ্য আপডেট করা হয়েছে।`
      });

      showToast('সদস্য তথ্য সফলভাবে হালনাগাদ করা হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to update member in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const deleteMember = async (id: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const target = members.find(m => m.id === id);
      await dbDeleteMember(client, id);
      setMembers(prev => prev.filter(m => m.id !== id));

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'সদস্য অপসারণ',
        entity: 'সদস্য তালিকা',
        entity_id: id,
        details: `সদস্য "${target?.name || id}" কে ডাটাবেজ থেকে মুছে ফেলা হয়েছে।`
      });

      showToast('সদস্য সফলভাবে মুছে ফেলা হয়েছে।', 'info');
      return true;
    } catch (err: any) {
      console.error('Failed to delete member in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const addContribution = async (data: Omit<Contribution, 'id' | 'created_at' | 'receipt_number' | 'created_by'> & { created_by?: string }): Promise<Contribution | null> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return null;
    }

    try {
      const receiptNum = `REC-${new Date().getFullYear()}-${String(contributions.length + 1).padStart(4, '0')}`;
      const payload = {
        ...data,
        receipt_number: receiptNum,
        created_by: data.created_by || currentUser.full_name
      };

      const result = await dbAddContribution(client, payload);
      setContributions(prev => [result.contribution, ...prev]);
      if (result.transaction) {
        setTransactions(prev => [result.transaction, ...prev]);
      }

      setViewingReceipt(result.contribution);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'অবদান গ্রহণ',
        entity: 'অবদান ও রশিদ',
        entity_id: receiptNum,
        details: `${result.contribution.donor_name} হতে ৳${result.contribution.amount} গ্রহণ ও রশিদ প্রস্তুত।`
      });

      showToast(`৳${result.contribution.amount} সফলভাবে জমা হয়েছে। রশিদ প্রস্তুত!`, 'success');
      return result.contribution;
    } catch (err: any) {
      console.error('Failed to add contribution in Supabase:', err);
      showToast(`সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি। (${err.message || 'ত্রুটি'})`, 'error');
      return null;
    }
  };

  const addIncome = async (data: Omit<Income, 'id' | 'created_at' | 'receipt_number' | 'created_by'> & { created_by?: string }): Promise<Income | null> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return null;
    }

    try {
      const receiptNum = `INC-${new Date().getFullYear()}-${String(incomes.length + 1).padStart(4, '0')}`;
      const payload = {
        ...data,
        receipt_number: receiptNum,
        created_by: data.created_by || currentUser.full_name
      };

      const result = await dbAddIncome(client, payload);
      setIncomes(prev => [result.income, ...prev]);
      if (result.transaction) {
        setTransactions(prev => [result.transaction, ...prev]);
      }

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'আয় এন্ট্রি',
        entity: 'আয় বিবরণী',
        entity_id: receiptNum,
        details: `${result.income.source_category} বাবদ ৳${result.income.amount} আয় অন্তর্ভুক্ত।`
      });

      showToast(`৳${result.income.amount} আয় সফলভাবে যুক্ত হয়েছে।`, 'success');
      return result.income;
    } catch (err: any) {
      console.error('Failed to add income in Supabase:', err);
      showToast(`সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি। (${err.message || 'ত্রুটি'})`, 'error');
      return null;
    }
  };

  const addExpense = async (data: Omit<Expense, 'id' | 'created_at' | 'voucher_number' | 'created_by'> & { created_by?: string }): Promise<Expense | null> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return null;
    }

    try {
      const voucherNum = `VCH-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(4, '0')}`;
      const payload = {
        ...data,
        voucher_number: voucherNum,
        created_by: data.created_by || currentUser.full_name
      };

      const result = await dbAddExpense(client, payload);
      setExpenses(prev => [result.expense, ...prev]);
      if (result.transaction) {
        setTransactions(prev => [result.transaction, ...prev]);
      }

      if (data.project_id) {
        setProjects(prev => prev.map(p => {
          if (p.id === data.project_id) {
            return {
              ...p,
              current_expense: (Number(p.current_expense) || 0) + Number(data.amount)
            };
          }
          return p;
        }));
      }

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'ব্যয় এন্ট্রি',
        entity: 'ব্যয় বিবরণী',
        entity_id: voucherNum,
        details: `${result.expense.expense_category} বাবদ ৳${result.expense.amount} ব্যয় ভাউচার সংরক্ষিত।`
      });

      showToast(`৳${result.expense.amount} ব্যয় ভাউচার সফলভাবে সংরক্ষিত হয়েছে।`, 'success');
      return result.expense;
    } catch (err: any) {
      console.error('Failed to add expense in Supabase:', err);
      showToast(`সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি। (${err.message || 'ত্রুটি'})`, 'error');
      return null;
    }
  };

  const transferFunds = async (transfer: AccountTransfer): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const tx = await dbRecordAccountTransfer(client, {
        ...transfer,
        created_by: currentUser.full_name
      });
      setTransactions(prev => [tx, ...prev]);

      showToast(`তহবিল স্থানান্তর সফল হয়েছে: ${transfer.from_account} ➔ ${transfer.to_account} (৳${transfer.amount})`, 'success');
      return true;
    } catch (err: any) {
      console.error('Fund transfer error in Supabase:', err);
      showToast(`তহবিল স্থানান্তর ব্যর্থ হয়েছে: ${err.message || 'সার্ভার ত্রুটি'}`, 'error');
      return false;
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'created_at'>): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbAddProject(client, projectData);
      setProjects(prev => [saved, ...prev]);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'নতুন প্রকল্প',
        entity: 'চলমান প্রকল্প',
        entity_id: saved.id,
        details: `নতুন উন্নয়ন প্রকল্প "${saved.name}" শুরু করা হয়েছে।`
      });

      showToast(`প্রকল্প "${saved.name}" সফলভাবে যুক্ত হয়েছে।`, 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to add project in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const updateProject = async (updated: Project): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbUpdateProject(client, updated);
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
      showToast('প্রকল্প তথ্য সংরক্ষিত হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to update project in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const addNotice = async (noticeData: Omit<Notice, 'id' | 'created_at'>): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbAddNotice(client, noticeData);
      setNotices(prev => [saved, ...prev]);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'নোটিশ প্রকাশ',
        entity: 'নোটিশ বোর্ড',
        entity_id: saved.id,
        details: `নতুন নোটিশ "${saved.title}" জারি করা হয়েছে।`
      });

      showToast('নোটিশ সফলভাবে প্রকাশিত হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to add notice in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const updateNotice = async (notice: Notice): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbUpdateNotice(client, notice);
      setNotices(prev => prev.map(n => n.id === saved.id ? saved : n));
      showToast('নোটিশ হালনাগাদ হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to update notice in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const deleteNotice = async (id: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      await dbDeleteNotice(client, id);
      setNotices(prev => prev.filter(n => n.id !== id));
      showToast('নোটিশ মুছে ফেলা হয়েছে।', 'info');
      return true;
    } catch (err: any) {
      console.error('Failed to delete notice in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const addMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at'>): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }

    try {
      const saved = await dbAddMeeting(client, meetingData);
      setMeetings(prev => [saved, ...prev]);

      dbAddAuditLog(client, {
        user_name: currentUser.full_name,
        action: 'সভা শিডিউল',
        entity: 'মিটিং ও সিদ্ধান্ত',
        entity_id: saved.id,
        details: `নতুন সভা "${saved.title}" নির্ধারণ করা হয়েছে।`
      });

      showToast('মিটিং নোটিশ সফলভাবে তৈরি হয়েছে।', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to add meeting in Supabase:', err);
      showToast('সার্ভারের সাথে সংযোগ করা যাচ্ছে না। তথ্য সংরক্ষণ হয়নি।', 'error');
      return false;
    }
  };

  const connectSupabase = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
    try {
      resetSupabaseClient(url, key);
      const client = getSupabaseClient();
      if (!client) {
        setIsSupabaseConnected(false);
        return { success: false, message: 'URL অথবা Anon Key ভুল রয়েছে।' };
      }

      await loadSupabaseData(client);
      showToast('সুপাবেস ডাটাবেজের সাথে সফলভাবে সংযোগ স্থাপিত হয়েছে!');
      return { success: true, message: 'সুপাবেস সফলভাবে যুক্ত হয়েছে এবং লাইভ ডাটা লোড হয়েছে!' };
    } catch (e: any) {
      setIsSupabaseConnected(false);
      return { success: false, message: e?.message || 'সংযোগ ব্যর্থ হয়েছে' };
    }
  };

  const setCurrentUserRole = (role: UserRole) => {
    let name = 'সাধারণ দর্শক';
    if (role === 'chairman') name = maktabSettings.chairman_name || 'সভাপতি';
    else if (role === 'accountant') name = maktabSettings.accountant_name || 'হিসাবরক্ষক';
    else if (role === 'super_admin') name = 'প্রধান অ্যাডমিন';

    setCurrentUser({
      id: `usr-${role}`,
      email: `${role}@maktab.org`,
      full_name: name,
      phone: role === 'chairman' ? maktabSettings.chairman_phone : maktabSettings.accountant_phone,
      role
    });

    if (role === 'normal_user') {
      setIsPublicView(true);
    }
    showToast(`ইউজার রোল পরিবর্তন: ${role === 'chairman' ? 'সভাপতি' : role === 'accountant' ? 'হিসাবরক্ষক' : role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'সাধারণ ব্যবহারকারী (ভিউ-অনলি)'}`, 'info');
  };

  // Export / Backup
  const exportDatabaseJson = () => {
    const state = {
      maktabSettings,
      publicSettings,
      members,
      contributions,
      incomes,
      expenses,
      transactions,
      projects,
      notices,
      meetings,
      auditLogs,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(state, null, 2);
  };

  const importDatabaseJson = async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      const client = getSupabaseClient();
      if (!client) {
        showToast('ডাটাবেজ কানেক্টেড নেই। ব্যাকআপ ইমপোর্ট করা সম্ভব নয়।', 'error');
        return false;
      }

      if (data.maktabSettings) await dbUpdateMaktabSettings(client, data.maktabSettings);
      if (data.publicSettings) await dbUpdatePublicSettings(client, data.publicSettings);
      await loadSupabaseData(client);

      showToast('ডাটাবেজ ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!', 'success');
      return true;
    } catch (e) {
      showToast('ভুল ফাইল ফরম্যাট। রিস্টোর ব্যর্থ হয়েছে।', 'error');
      return false;
    }
  };

  return (
    <MaktabContext.Provider
      value={{
        maktabSettings,
        publicSettings,
        members,
        contributions,
        incomes,
        expenses,
        transactions,
        projects,
        notices,
        meetings,
        auditLogs,
        currentUser,
        activeTab,
        isPublicView,
        isAdminLoggedIn,
        adminSessionToken,
        adminRole,
        themeConfig,
        updateThemeConfig,
        isSupabaseConnected,
        isLoading,
        viewingReceipt,
        activeMemberDetail,
        toastMessage,

        totalContributions,
        totalIncome,
        totalExpenses,
        currentBalance,
        cashBalance,
        bankBalance,
        mobileWalletBalance,

        loginAdmin,
        logoutAdmin,
        setActiveTab,
        setIsPublicView,
        setViewingReceipt,
        setActiveMemberDetail,
        setCurrentUserRole,
        refreshData: () => loadSupabaseData(),

        updateMaktabSettings,
        updatePublicSettings,
        addMember,
        updateMember,
        deleteMember,
        addContribution,
        addIncome,
        addExpense,
        transferFunds,
        addProject,
        updateProject,
        addNotice,
        updateNotice,
        deleteNotice,
        addMeeting,
        connectSupabase,
        showToast,
        exportDatabaseJson,
        importDatabaseJson
      }}
    >
      {children}
    </MaktabContext.Provider>
  );
};

export const useMaktab = (): MaktabContextType => {
  const context = useContext(MaktabContext);
  if (!context) {
    throw new Error('useMaktab must be used within a MaktabProvider');
  }
  return context;
};
