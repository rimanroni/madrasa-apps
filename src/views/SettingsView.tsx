import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { MaktabSettings, PublicSettings } from '../types/database';
import { 
  Settings, 
  Building, 
  UserCheck, 
  Phone, 
  MapPin, 
  Globe, 
  Database, 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck,
  CreditCard,
  Table,
  CheckCircle2,
  FileCode,
  Palette,
  Sun,
  Moon,
  SlidersHorizontal
} from 'lucide-react';
import { THEME_PRESETS, ThemeColor, ThemeMode, ThemeRadius } from '../types/theme';

export const SettingsView: React.FC = () => {
  const { 
    maktabSettings, 
    updateMaktabSettings, 
    publicSettings, 
    updatePublicSettings,
    connectSupabase,
    isSupabaseConnected,
    exportDatabaseJson,
    importDatabaseJson,
    showToast,
    currentUser,
    themeConfig,
    updateThemeConfig
  } = useMaktab();

  // Tab State: 'profile' | 'payments' | 'theme' | 'public' | 'database' | 'schema'
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'theme' | 'public' | 'database' | 'schema'>('profile');

  // Form state for Maktab Settings
  const [formData, setFormData] = useState<MaktabSettings>(maktabSettings);
  const [publicData, setPublicData] = useState<PublicSettings>(publicSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with live database records
  React.useEffect(() => {
    setFormData(maktabSettings);
  }, [maktabSettings]);

  React.useEffect(() => {
    setPublicData(publicSettings);
  }, [publicSettings]);

  // Supabase connection state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleInputChange = (field: keyof MaktabSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublicToggle = async (field: keyof PublicSettings) => {
    const updated = { ...publicData, [field]: !publicData[field] };
    setPublicData(updated);
    await updatePublicSettings(updated);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateMaktabSettings(formData);
    setIsSaving(false);
  };

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      showToast('Supabase URL এবং Anon Key উভয়ই প্রদান করা আবশ্যক', 'error');
      return;
    }
    setIsConnecting(true);
    const res = await connectSupabase(supabaseUrl.trim(), supabaseKey.trim());
    setIsConnecting(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDownloadBackup = () => {
    const json = exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maktab_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড হয়েছে');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJson(content);
      }
    };
    reader.readAsText(file);
  };

  const fullSchemaSqlText = `-- ==============================================================================
-- MAKTAB MANAGEMENT & TRANSPARENT ACCOUNTING SYSTEM (মক্তব হিসাব ও স্বচ্ছ ব্যবস্থাপনা)
-- SUPABASE POSTGRESQL SCHEMA WITH RBAC & RLS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MAKTAB CENTRAL SETTINGS (প্রতিষ্ঠান পরিচিতি ও পেমেন্ট নম্বর)
CREATE TABLE IF NOT EXISTS maktab_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maktab_name TEXT NOT NULL DEFAULT 'নূরানী মক্তব',
  logo_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  address TEXT DEFAULT '',
  village_name TEXT DEFAULT '',
  union_name TEXT DEFAULT '',
  upazila TEXT DEFAULT '',
  district TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  phone2 TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  website TEXT DEFAULT '',
  chairman_name TEXT DEFAULT '',
  chairman_phone TEXT DEFAULT '',
  accountant_name TEXT DEFAULT '',
  accountant_phone TEXT DEFAULT '',
  secretary_name TEXT DEFAULT '',
  established_year TEXT DEFAULT '',
  opening_balance NUMERIC(14,2) DEFAULT 0,
  bkash_number TEXT DEFAULT '',
  nagad_number TEXT DEFAULT '',
  rocket_number TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  bank_account_name TEXT DEFAULT '',
  bank_account_no TEXT DEFAULT '',
  bank_branch TEXT DEFAULT '',
  payment_instructions TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PUBLIC SETTINGS (পাবলিক পেজের দৃশ্যমানতা)
CREATE TABLE IF NOT EXISTS public_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_chairman BOOLEAN DEFAULT true,
  show_accountant BOOLEAN DEFAULT true,
  show_member_names BOOLEAN DEFAULT true,
  show_individual_contributions BOOLEAN DEFAULT false,
  show_expenses BOOLEAN DEFAULT true,
  show_total_balance BOOLEAN DEFAULT true,
  show_contact_buttons BOOLEAN DEFAULT true,
  show_notices BOOLEAN DEFAULT true,
  show_projects BOOLEAN DEFAULT true,
  show_payment_methods BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEMBERS (সদস্য তালিকা)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  mobile TEXT NOT NULL,
  address TEXT DEFAULT '',
  joining_date DATE DEFAULT CURRENT_DATE,
  monthly_contribution_amount NUMERIC(10,2) NOT NULL DEFAULT 500,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTRIBUTIONS & DONATIONS (সদস্যদের অবদান ও সাধারণ অনুদান)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_mobile TEXT DEFAULT '',
  amount NUMERIC(14,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  contribution_month TEXT NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  receipt_number TEXT UNIQUE NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OTHER INCOME (অন্যান্য আয়)
CREATE TABLE IF NOT EXISTS income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'cash',
  donor_name TEXT DEFAULT '',
  receipt_number TEXT UNIQUE NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EXPENSES (খরচের খতিয়ান ও ভাউচার)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  voucher_number TEXT UNIQUE NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  payee_name TEXT NOT NULL,
  payee_phone TEXT DEFAULT '',
  project_id UUID,
  approved_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRANSACTIONS LEDGER (কেন্দ্রীয় সমন্বিত খতিয়ান)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('contribution', 'income', 'expense')),
  amount NUMERIC(14,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'cash',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  receipt_voucher_no TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROJECTS (উন্নয়ন ও অবকাঠামোগত কার্যক্রম)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE,
  budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  current_expense NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'running',
  responsible_person TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTICES (নোটিশ বোর্ড)
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  publish_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEETINGS (কার্যনির্বাহী সভা)
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TEXT NOT NULL,
  agenda TEXT NOT NULL,
  decisions TEXT DEFAULT '',
  presided_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS (নিরীক্ষা ও নিরাপত্তা লগ)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);`;

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(fullSchemaSqlText);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
    showToast('SQL স্কিমা ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <Settings className="w-4 h-4 text-emerald-700" />
            <span>সিস্টেম ও মক্তব পরিচিতি কনফিগারেশন</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            মক্তব প্রোফাইল, পেমেন্ট নম্বর ও সুপাবেস ডাটাবেজ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিষ্ঠান, সভাপতি, বিকাশ/ব্যাংক হিসাব ও সুপাবেস ক্লাউড ডাটাবেজ নিয়ন্ত্রণ করুন
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              activeTab === 'profile' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            মক্তব পরিচিতি
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              activeTab === 'payments' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            পেমেন্ট ও অনুদান নম্বর
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 ${
              activeTab === 'theme' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-700" />
            <span>থিম ও রঙ</span>
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              activeTab === 'public' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            পাবলিক দৃশ্যমানতা
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              activeTab === 'database' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            সুপাবেস কানেকশন
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition ${
              activeTab === 'schema' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            SQL টেবিল নির্দেশিকা
          </button>
        </div>
      </div>

      {/* TAB 1: MAKTAB PROFILE & LEADERSHIP SETTINGS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          
          {/* Section: Institution Identity */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>১. প্রতিষ্ঠানের মূল পরিচিতি ও নাম (সিস্টেমজুড়ে ডাইনামিক)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  মক্তব / মাদরাসার পূর্ণ নাম <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={formData.maktab_name}
                  onChange={(e) => handleInputChange('maktab_name', e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-sm text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  এখানে নাম পরিবর্তন করলে তা তৎক্ষণাৎ ড্যাশবোর্ড, রসিদ, রিপোর্ট ও পাবলিক পেজে কার্যকর হবে।
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  প্রতিষ্ঠার সাল (ইংরেজি বা বাংলা):
                </label>
                <input
                  type="text"
                  value={formData.established_year}
                  onChange={(e) => handleInputChange('established_year', e.target.value)}
                  placeholder="২০১৪"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  প্রাথমিক / প্রারম্ভিক ব্যাংক ও ক্যাশ জের (৳):
                </label>
                <input
                  type="number"
                  value={formData.opening_balance}
                  onChange={(e) => handleInputChange('opening_balance', parseFloat(e.target.value) || 0)}
                  placeholder="15000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  প্রতিষ্ঠানের সংক্ষিপ্ত বিবরণ ও লক্ষ্য:
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Geographic Address */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>২. ভৌগোলিক অবস্থান ও পূর্ণাঙ্গ ঠিকানা</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">গ্রামের নাম:</label>
                <input
                  type="text"
                  value={formData.village_name}
                  onChange={(e) => handleInputChange('village_name', e.target.value)}
                  placeholder="যেমন: চর রাধানগর"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ইউনিয়ন:</label>
                <input
                  type="text"
                  value={formData.union_name}
                  onChange={(e) => handleInputChange('union_name', e.target.value)}
                  placeholder="যেমন: রায়পুরা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">উপজেলা:</label>
                <input
                  type="text"
                  value={formData.upazila}
                  onChange={(e) => handleInputChange('upazila', e.target.value)}
                  placeholder="যেমন: রায়পুরা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">জেলা:</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="যেমন: নরসিংদী"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-slate-700 font-semibold mb-1">সুনির্দিষ্ট ঠিকানা / ল্যান্ডমার্ক:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="যেমন: পূর্বপাড়া জামে মসজিদ সংলগ্ন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Committee Leadership */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>৩. পরিচালনা কমিটির দায়িত্বশীল ব্যক্তিবর্গ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">সভাপতি (Chairman) এর নাম:</label>
                <input
                  type="text"
                  value={formData.chairman_name}
                  onChange={(e) => handleInputChange('chairman_name', e.target.value)}
                  placeholder="হাজী মোঃ নুরুল ইসলাম"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">সভাপতির মোবাইল নম্বর:</label>
                <input
                  type="text"
                  value={formData.chairman_phone}
                  onChange={(e) => handleInputChange('chairman_phone', e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">হিসাবরক্ষক (Accountant) এর নাম:</label>
                <input
                  type="text"
                  value={formData.accountant_name}
                  onChange={(e) => handleInputChange('accountant_name', e.target.value)}
                  placeholder="মাওলানা মোঃ আব্দুর রহমান"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">হিসাবরক্ষকের মোবাইল নম্বর:</label>
                <input
                  type="text"
                  value={formData.accountant_phone}
                  onChange={(e) => handleInputChange('accountant_phone', e.target.value)}
                  placeholder="০১৮২২-XXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">সাধারণ সম্পাদক (Secretary) এর নাম:</label>
                <input
                  type="text"
                  value={formData.secretary_name}
                  onChange={(e) => handleInputChange('secretary_name', e.target.value)}
                  placeholder="মোঃ হাফিজুল হক"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Public Numbers */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>৪. হটলাইন ও সার্বজনীন যোগাযোগের নম্বর</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">প্রধান হটলাইন ফোন (Phone 1):</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="০১৭১১-২২৩৩৪৪"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">বিকল্প ফোন (Phone 2):</label>
                <input
                  type="text"
                  value={formData.phone2}
                  onChange={(e) => handleInputChange('phone2', e.target.value)}
                  placeholder="০১৮২২-৫৫৬৬৭৭"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">হোয়াটসঅ্যাপ নম্বর (WhatsApp):</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+8801711223344"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">অফিসিয়াল ইমেইল:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@nooranimaktab.org"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ফেসবুক পেজ লিংক:</label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>মক্তব পরিচিতি সংরক্ষণ করুন</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 2: PAYMENT & DONATION RECEIVING NUMBERS */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>অনলাইন অনুদান ও পেমেন্ট রিসিভিং নম্বর কনফিগারেশন</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              গ্রামবাসী ও শুভাকাঙ্ক্ষীদের অনুদান গ্রহণের জন্য মক্তবের নিজস্ব বিকাশ, নগদ, রকেট ও ব্যাংক একাউন্ট নম্বর এখানে যুক্ত করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                বিকাশ নম্বর (bKash Number):
              </label>
              <input
                type="text"
                value={formData.bkash_number || ''}
                onChange={(e) => handleInputChange('bkash_number', e.target.value)}
                placeholder="০১৭০০-০০০০০০ (মার্চেন্ট বা পার্সোনাল)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                নগদ নম্বর (Nagad Number):
              </label>
              <input
                type="text"
                value={formData.nagad_number || ''}
                onChange={(e) => handleInputChange('nagad_number', e.target.value)}
                placeholder="০১৮০০-০০০০০০ (পার্সোনাল)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                রকেট নম্বর (Rocket Number):
              </label>
              <input
                type="text"
                value={formData.rocket_number || ''}
                onChange={(e) => handleInputChange('rocket_number', e.target.value)}
                placeholder="০১৯০০-০০০০০০-৭"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ব্যাংকের নাম (Bank Name):
              </label>
              <input
                type="text"
                value={formData.bank_name || ''}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                placeholder="ইসলামী ব্যাংক বাংলাদেশ লিমিটেড"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ব্যাংক হিসাবের নাম (Account Name):
              </label>
              <input
                type="text"
                value={formData.bank_account_name || ''}
                onChange={(e) => handleInputChange('bank_account_name', e.target.value)}
                placeholder="নূরানী মক্তব ও মাদরাসা ফান্ড"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ব্যাংক একাউন্ট নম্বর (Account No):
              </label>
              <input
                type="text"
                value={formData.bank_account_no || ''}
                onChange={(e) => handleInputChange('bank_account_no', e.target.value)}
                placeholder="২০৫০১২৩৪৫৬৭৮৯০১২"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ব্যাংক শাখা (Branch):
              </label>
              <input
                type="text"
                value={formData.bank_branch || ''}
                onChange={(e) => handleInputChange('bank_branch', e.target.value)}
                placeholder="রায়পুরা শাখা, নরসিংদী"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                অনলাইন অনুদান সংক্রান্ত বিশেষ নির্দেশিকা:
              </label>
              <textarea
                rows={2}
                value={formData.payment_instructions || ''}
                onChange={(e) => handleInputChange('payment_instructions', e.target.value)}
                placeholder="টাকা পাঠানোর পর ট্রানজেকশন আইডি ও আপনার নাম লিখে হোয়াটসঅ্যাপে মেসেজ করুন।"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>পেমেন্ট নম্বরসমূহ সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: THEME & DISPLAY CUSTOMIZATION */}
      {activeTab === 'theme' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">থিম ও রঙ কাস্টমাইজেশন (Theme & Display)</h3>
              <p className="text-xs text-slate-500">আপনার ড্যাশবোর্ডের জন্য পছন্দসই কালার প্যালেট, ডার্ক মোড ও কোণার স্টাইল নির্বাচন করুন</p>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-slate-800 font-bold mb-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                <span>প্রধান কালার প্যালেটসমূহ</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                বর্তমানে সক্রিয়: {THEME_PRESETS.find(p => p.id === themeConfig.color)?.name}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = themeConfig.color === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateThemeConfig({ color: preset.id });
                      showToast(`${preset.name.split(' (')[0]} থিম সক্রিয় করা হয়েছে!`, 'success');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-4 h-4 rounded-full shadow-xs inline-block"
                          style={{ backgroundColor: preset.primaryHex }}
                        />
                        <span 
                          className="w-3 h-3 rounded-full opacity-80 inline-block"
                          style={{ backgroundColor: preset.accentHex }}
                        />
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>

                    <div className="font-bold text-xs text-slate-900 truncate">
                      {preset.name.split(' (')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-slate-800 font-bold mb-3 text-xs">
              ডিসপ্লে মোড (Light & Dark Mode)
            </label>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  updateThemeConfig({ mode: 'light' });
                  showToast('লাইট মোড সক্রিয় করা হয়েছে', 'info');
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  themeConfig.mode === 'light'
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/50 text-emerald-950 font-bold'
                    : 'border-slate-200 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div>লাইট মোড (স্বাভাবিক)</div>
                    <div className="text-[10px] text-slate-500 font-normal">উজ্জ্বল ও স্পষ্ট ইন্টারফেস</div>
                  </div>
                </div>
                {themeConfig.mode === 'light' && <Check className="w-4 h-4 text-emerald-700" />}
              </button>

              <button
                onClick={() => {
                  updateThemeConfig({ mode: 'dark' });
                  showToast('ডার্ক মোড সক্রিয় করা হয়েছে', 'info');
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  themeConfig.mode === 'dark'
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-950/20 text-emerald-950 font-bold'
                    : 'border-slate-200 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div>ডার্ক মোড (রাত্রিকালীন)</div>
                    <div className="text-[10px] text-slate-500 font-normal">চোখের আরামদায়ক ডার্ক থিম</div>
                  </div>
                </div>
                {themeConfig.mode === 'dark' && <Check className="w-4 h-4 text-emerald-700" />}
              </button>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-slate-800 font-bold mb-2 text-xs">
              কার্ড ও বাটনের কোণা (Border Radius)
            </label>

            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { id: 'rounded', label: 'সফট রাউন্ডেড', sub: 'গোলাকার কোণা' },
                { id: 'modern', label: 'আধুনিক স্ট্যান্ডার্ড', sub: 'ভারসাম্যপূর্ণ' },
                { id: 'sharp', label: 'ক্লাসিক শার্প', sub: 'সুনির্দিষ্ট রেখা' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => updateThemeConfig({ radius: r.id as ThemeRadius })}
                  className={`p-3 border rounded-xl text-center cursor-pointer transition ${
                    themeConfig.radius === r.id
                      ? 'border-emerald-600 font-bold text-emerald-800 bg-emerald-50/50'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-medium text-xs">{r.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PUBLIC VISIBILITY TOGGLES */}
      {activeTab === 'public' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>জনসাধারণের জন্য তথ্য প্রদর্শনের অনুমতি (Public Transparency Controls)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              সাধারণ দর্শক ও গ্রামবাসী পাবলিক পোর্টাল ভিজিট করার সময় কোন কোন তথ্য দেখতে পারবে তা এখান থেকে নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">সভাপতির নাম ও মোবাইল প্রদর্শন</div>
                <div className="text-[11px] text-slate-500">পাবলিক পেজে সম্মানিত সভাপতির তথ্য দৃশ্যমান থাকবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_chairman}
                onChange={() => handlePublicToggle('show_chairman')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">হিসাবরক্ষকের নাম ও যোগাযোগ প্রদর্শন</div>
                <div className="text-[11px] text-slate-500">হিসাব সংক্রান্ত তথ্যের স্বচ্ছতার জন্য প্রদর্শন</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_accountant}
                onChange={() => handlePublicToggle('show_accountant')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">বর্তমান মোট তহবিল স্থিতি প্রকাশ</div>
                <div className="text-[11px] text-slate-500">মক্তবের মোট ব্যালেন্স সর্বসাধারণের জন্য দৃশ্যমান থাকবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_total_balance}
                onChange={() => handlePublicToggle('show_total_balance')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">অনলাইন পেমেন্ট ও ব্যাংক তথ্য প্রদর্শন</div>
                <div className="text-[11px] text-slate-500">পাবলিক পেজে বিকাশ, নগদ ও ব্যাংক একাউন্ট নম্বর দেখতে পারবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_payment_numbers ?? true}
                onChange={() => handlePublicToggle('show_payment_numbers')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">সাম্প্রতিক ব্যয়ের খতিয়ান প্রকাশ</div>
                <div className="text-[11px] text-slate-500">মক্তবের পরিশোধিত ব্যয়ের ভাউচার স্বচ্ছভাবে দেখতে পাবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_expenses}
                onChange={() => handlePublicToggle('show_expenses')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">সম্মানিত সদস্যদের তালিকা প্রদর্শন</div>
                <div className="text-[11px] text-slate-500">পাবলিক পেজে নিবন্ধিত সদস্যদের নাম দেখানো হবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_member_names}
                onChange={() => handlePublicToggle('show_member_names')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">সরাসরি কল ও যোগাযোগ বাটন প্রদর্শন</div>
                <div className="text-[11px] text-slate-500">মোবাইল থেকে সরাসরি "কল করুন" এবং "হোয়াটসঅ্যাপ" বাটন চালু থাকবে</div>
              </div>
              <input
                type="checkbox"
                checked={publicData.show_contact_buttons}
                onChange={() => handlePublicToggle('show_contact_buttons')}
                className="w-5 h-5 text-emerald-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE & BACKUP CONTROLS */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          
          {/* Supabase Connection */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">সুপাবেস (Supabase PostgreSQL) সংযোগ</h3>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                  isSupabaseConnected ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSupabaseConnected ? 'সুপাবেস সংযুক্ত (Live Cloud)' : 'অফলাইন লোকাল স্টোরেজে সচল (Local)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              আপনার তৈরি করা Supabase প্রজেক্ট থেকে <strong>Project URL</strong> এবং <strong>Anon Key</strong> এখানে পেস্ট করে রিয়েলটাইম ক্লাউড পোস্টগ্রেস ডাটাবেজের সাথে অ্যাপটি এক ক্লিকে যুক্ত করুন।
            </p>

            <form onSubmit={handleConnectSupabase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Supabase Project URL:
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Supabase Anon Public API Key:
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isConnecting ? 'সংযোগ স্থাপন করা হচ্ছে...' : 'সুপাবেস টেস্ট ও সংযোগ সংরক্ষণ'}</span>
              </button>
            </form>
          </div>

          {/* Backup & Restore Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-700" />
              <span>ডাটাবেজ সম্পূর্ণ ব্যাকআপ ও রিস্টোর (JSON Export/Import)</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              যেকোনো মুহূর্তে মক্তবের সকল সদস্য, হিসাব খাতা, আয়-ব্যয়, ভাউচার ও সেটিংস সম্পূর্ণ অফলাইনে নিরাপদ JSON ব্যাকআপ হিসেবে ডাউনলোড করে সংরক্ষণ করুন।
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadBackup}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>সম্পূর্ণ ব্যাকআপ ডাউনলোড করুন</span>
              </button>

              <label className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>ব্যাকআপ ফাইল রিস্টোর করুন</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: SQL SCHEMA & TABLE FIELD DICTIONARY */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          
          {/* Table Fields Summary Dictionary */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Table className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">সুপাবেস ডাটাবেজের টেবিল ও প্রয়োজনীয় ফিল্ডের তালিকা</h3>
                <p className="text-xs text-slate-500">আপনার ডাটাবেজে কি কি টেবিল ও ফিল্ড তৈরি হবে তার বিস্তারিত বিবরণ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">১. maktab_settings (মক্তব তথ্য ও পেমেন্ট)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> maktab_name, address, village_name, phone, whatsapp, chairman_name, chairman_phone, accountant_name, accountant_phone, bkash_number, nagad_number, rocket_number, bank_account_no ইত্যাদি।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">২. members (সদস্য তালিকা)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> member_id (ইউনিক আইডি), name, mobile, address, monthly_contribution_amount (মাসিক অবদান), status (active/inactive)।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৩. contributions (সদস্যদের অবদান/অনুদান)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> member_id, donor_name, donor_mobile, amount, contribution_month (মাস), payment_method, receipt_number (রসিদ নং)।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৪. expenses (খরচ ও ভাউচার)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> expense_category (খাত), description, amount, voucher_number (ভাউচার নং), payment_method, payee_name, approved_by।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৫. income (অন্যান্য আয়)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> title, category, amount, date, payment_method, receipt_number, donor_name।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৬. transactions (কেন্দ্রীয় হিসাব খাতা)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> type (contribution/income/expense), amount, date, payment_method, title, category, receipt_voucher_no।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৭. projects (উন্নয়ন প্রকল্প)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> name, description, budget, current_expense, status, responsible_person।
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-900 text-sm">৮. notices ও meetings (নোটিশ ও মিটিং)</div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  <strong>ফিল্ডসমূহ:</strong> title, content, priority, publish_date, meeting_date, agenda, decisions, presided_by।
                </div>
              </div>
            </div>
          </div>

          {/* Raw SQL Script for Supabase SQL Editor */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">এক ক্লিকে রান করার জন্য পূর্ণাঙ্গ SQL স্ক্রিপ্ট</h3>
                <p className="text-xs text-slate-500">Supabase ড্যাশবোর্ডের "SQL Editor" এ গিয়ে এই কোডটি পেস্ট করে Run করুন</p>
              </div>
              <button
                onClick={copySchemaToClipboard}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                {copiedSchema ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSchema ? 'কপি সম্পন্ন হয়েছে!' : 'সম্পূর্ণ SQL কপি করুন'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed select-all">
              {fullSchemaSqlText}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
};
