import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPriorityBadge } from '../utils/bengali';
import { CREATOR_BRANDING } from '../constants/branding';
import { getThemeClasses } from '../types/theme';
import { 
  Wallet, 
  HandCoins, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FolderKanban, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  Calendar, 
  Bell, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { FinancialAnalyticsChart } from '../components/FinancialAnalyticsChart';

interface DashboardViewProps {
  onOpenContributionModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenMemberModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenContributionModal,
  onOpenIncomeModal,
  onOpenExpenseModal,
  onOpenMemberModal
}) => {
  const {
    maktabSettings,
    totalContributions,
    totalIncome,
    totalExpenses,
    currentBalance,
    cashBalance,
    bankBalance,
    mobileWalletBalance,
    members,
    projects,
    contributions,
    expenses,
    notices,
    meetings,
    setActiveTab,
    setViewingReceipt,
    currentUser,
    themeConfig
  } = useMaktab();

  const themeClasses = getThemeClasses(themeConfig?.color);

  const runningProjects = projects.filter((p) => p.status === 'running');
  const activeMembers = members.filter((m) => m.status === 'active');
  const upcomingMeetings = meetings.slice(0, 2);
  const recentContributions = contributions.slice(0, 5);
  const recentExpenses = expenses.slice(0, 5);
  const recentNotices = notices.filter((n) => n.is_published).slice(0, 2);

  // Financial health ratios
  const totalAssets = currentBalance > 0 ? currentBalance : 1;
  const cashPercent = Math.min(100, Math.round((cashBalance / totalAssets) * 100));
  const bankPercent = Math.min(100, Math.round((bankBalance / totalAssets) * 100));
  const mobilePercent = Math.min(100, Math.max(0, 100 - (cashPercent + bankPercent)));

  return (
    <div className="space-y-6">
      
      {/* Dynamic Welcome Banner (Reactive to Theme) */}
      <div className={`bg-linear-to-r ${themeClasses.gradientBg} rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden transition-all duration-300`}>
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Building className="w-4 h-4 text-white/90" />
            <span>{maktabSettings.village_name ? `গ্রাম: ${maktabSettings.village_name}, ${maktabSettings.upazila}` : 'মক্তব ব্যবস্থাপনা'}</span>
            <span>·</span>
            <span>স্বচ্ছ হিসাব ও ব্যবস্থাপনা পোর্টাল</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{maktabSettings.maktab_name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/90 mt-2 line-clamp-2 leading-relaxed">
            {maktabSettings.description || 'আমাদের এলাকার ভবিষ্যৎ প্রজন্মকে সহীহ দ্বীনি শিক্ষা প্রদানে এলাকাবাসীর যৌথ প্রচেষ্টায় পরিচালিত।'}
          </p>

          {/* Quick Stats bar inside banner */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-3.5 border-t border-white/20 text-xs">
            <div>
              <span className="text-white/70">সভাপতি: </span>
              <span className="font-semibold text-white">{maktabSettings.chairman_name || 'নির্ধারিত হয়নি'}</span>
            </div>
            <div>
              <span className="text-white/70">হিসাবরক্ষক: </span>
              <span className="font-semibold text-white">{maktabSettings.accountant_name || 'নির্ধারিত হয়নি'}</span>
            </div>
            {maktabSettings.phone && (
              <div>
                <span className="text-white/70">হটলাইন: </span>
                <span className="font-mono text-white font-bold">{maktabSettings.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Financial Overview Cards (60-30-10 palette discipline) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: বর্তমান তহবিল স্থিতি */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>বর্তমান তহবিল স্থিতি</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-950 mt-1">
            {formatTaka(currentBalance)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span>প্রারম্ভিক জের:</span>
            <span className="font-mono">{formatTaka(maktabSettings.opening_balance)}</span>
          </div>
        </div>

        {/* Card 2: মোট সংগৃহীত অবদান */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>মোট সদস্য অবদান</span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <HandCoins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-teal-900 mt-1">
            {formatTaka(totalContributions)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span>সক্রিয় সদস্য:</span>
            <span className="font-mono font-semibold text-slate-700">{toBengaliNumber(activeMembers.length)} জন</span>
          </div>
        </div>

        {/* Card 3: মোট অন্যান্য আয় */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>মোট বিবিধ আয়</span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-900 mt-1">
            {formatTaka(totalIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            দান বাক্স, জমি লিজ ও উপহার
          </div>
        </div>

        {/* Card 4: সর্বমোট ব্যয় */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>সর্বমোট পরিশোধিত ব্যয়</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-900 mt-1">
            {formatTaka(totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            শিক্ষক ভাতা ও উন্নয়ন ব্যয়
          </div>
        </div>

      </div>

      {/* Account Balance Breakdown Strip (Cash, Bank, Mobile Wallet) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>হিসাব ও নগদ জমার বিবরণ (খাতওয়ারী ফান্ড)</span>
          <span className="text-[11px] font-normal text-slate-500">স্বচ্ছ হিসাবরক্ষণ</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">হাতে নগদ (Cash in Hand)</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {formatTaka(cashBalance)}
              </div>
            </div>
            <div className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">ক্যাশ</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">ব্যাংক স্থিতি (Bank Balance)</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {formatTaka(bankBalance)}
              </div>
            </div>
            <div className="text-xs px-2 py-1 bg-sky-50 text-sky-800 rounded-md font-medium">ব্যাংক</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500">মোবাইল ব্যাংকিং (bKash/Nagad)</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {formatTaka(mobileWalletBalance)}
              </div>
            </div>
            <div className="text-xs px-2 py-1 bg-pink-50 text-pink-800 rounded-md font-medium">মোবাইল</div>
          </div>
        </div>
      </div>

      {/* Admin Action Buttons (Desktop) */}
      {currentUser.role !== 'normal_user' && (
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenContributionModal}
            className={`flex-1 py-3 px-4 ${themeClasses.primaryBtn} rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-98`}
          >
            <Plus className="w-4 h-4" />
            অবদান ও অনুদান যোগ করুন
          </button>

          <button
            onClick={onOpenIncomeModal}
            className="flex-1 py-3 px-4 bg-sky-800 hover:bg-sky-700 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            বিবিধ আয় এন্ট্রি
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="flex-1 py-3 px-4 bg-rose-800 hover:bg-rose-700 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            ব্যয় ভাউচার তৈরি
          </button>

          <button
            onClick={onOpenMemberModal}
            className="flex-1 py-3 px-4 bg-amber-800 hover:bg-amber-700 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            নতুন সদস্য নিবন্ধন
          </button>
        </div>
      )}

      {/* Visual Analytics & Financial Trajectory Chart */}
      <FinancialAnalyticsChart />

      {/* Grid: Recent Contributions & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Contributions Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">সাম্প্রতিক সংগৃহীত অবদান</h3>
              <p className="text-[11px] text-slate-500">সদস্য ও শুভাকাঙ্ক্ষীদের নিয়মিত অনুদান</p>
            </div>
            <button
              onClick={() => setActiveTab('contributions')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>সকল দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentContributions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">কোনো অবদানের রেকর্ড নেই</div>
            ) : (
              recentContributions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-100 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-slate-900 truncate">
                      {item.donor_name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.purpose}</span>
                      <span>·</span>
                      <span>{formatBengaliDate(item.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-emerald-900">
                        {formatTaka(item.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.receipt_number}
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingReceipt(item)}
                      className="p-1.5 text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 rounded-lg shadow-2xs hover:bg-emerald-50 cursor-pointer"
                      title="রশিদ দেখুন"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Expenses Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">সাম্প্রতিক পরিশোধিত ব্যয়</h3>
              <p className="text-[11px] text-slate-500">অনুমোদিত ভাউচার ও উন্নয়ন ব্যয়</p>
            </div>
            <button
              onClick={() => setActiveTab('ledger')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>সকল খতিয়ান</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExpenses.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">কোনো ব্যয়ের রেকর্ড নেই</div>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-rose-50/40 border border-slate-100 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-slate-900 truncate">
                      {exp.expense_category}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {exp.description} · {formatBengaliDate(exp.date)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-rose-900">
                      -{formatTaka(exp.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {exp.voucher_number}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Running Projects & Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">চলমান উন্নয়ন ও সংস্কার প্রকল্প</h3>
              <p className="text-[11px] text-slate-500">মক্তবের অবকাঠামো উন্নয়ন কার্যক্রমের আর্থিক অগ্রগতি</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>বিস্তারিত প্রকল্প</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const progress = proj.budget > 0 
                ? Math.min(100, Math.round((proj.current_expense / proj.budget) * 100))
                : 0;

              return (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{proj.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{proj.description}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold whitespace-nowrap">
                      {proj.status === 'running' ? 'চলমান' : proj.status === 'completed' ? 'সম্পন্ন' : 'স্থগিত'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>অগ্রগতি: {toBengaliNumber(progress)}%</span>
                      <span className="font-mono">
                        ব্যয়: {formatTaka(proj.current_expense)} / বাজেট: {formatTaka(proj.budget)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60">
                    <span>দায়িত্বপ্রাপ্ত: {proj.responsible_person || 'কমিটি'}</span>
                    <span>মেয়াদ: {formatBengaliDate(proj.expected_completion_date)} পর্যন্ত</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notices & Meetings (1 column) */}
        <div className="space-y-6">
          
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">আসন্ন মিটিং ও সভা</h3>
              <Calendar className="w-4 h-4 text-emerald-700" />
            </div>

            {upcomingMeetings.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">আপাতত কোনো সভা নির্ধারিত নেই</div>
            ) : (
              upcomingMeetings.map((m) => (
                <div key={m.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                  <div className="font-bold text-xs text-emerald-950">{m.title}</div>
                  <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-2">
                    <span>তারিখ: {formatBengaliDate(m.date)}</span>
                    <span>·</span>
                    <span>সময়: {m.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                    স্থান: {m.location}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Latest Notices */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">জরুরি নোটিশ বোর্ড</h3>
              <Bell className="w-4 h-4 text-emerald-700" />
            </div>

            <div className="space-y-2.5">
              {recentNotices.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">কোনো নোটিশ নেই</div>
              ) : (
                recentNotices.map((n) => {
                  const badge = getPriorityBadge(n.priority);
                  return (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-500">{formatBengaliDate(n.publish_date)}</span>
                      </div>
                      <div className="font-semibold text-xs text-slate-900 mt-1.5">{n.title}</div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.description}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Permanent Creator Branding on Admin Dashboard (Discreet, professional) */}
      <footer className="mt-12 pt-6 pb-4 border-t border-slate-200/80 dark:border-slate-800 text-center no-print">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {CREATOR_BRANDING.banglaNotice} <span className="font-bold text-slate-800 dark:text-slate-200">{CREATOR_BRANDING.name}</span>
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          যোগাযোগ: <a href={`tel:${CREATOR_BRANDING.phone}`} className="font-mono text-emerald-700 dark:text-emerald-400 hover:underline font-bold">{CREATOR_BRANDING.phone}</a>
        </div>
      </footer>

    </div>
  );
};
