import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPriorityBadge } from '../utils/bengali';
import { getThemeClasses } from '../types/theme';
import { 
  Building, 
  Wallet, 
  HandCoins, 
  TrendingDown, 
  Users, 
  FolderKanban, 
  Bell, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Calendar,
  ExternalLink,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

interface PublicPortalViewProps {
  onOpenReportModal?: () => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = () => {
  const {
    maktabSettings,
    publicSettings,
    totalContributions,
    totalIncome,
    totalExpenses,
    currentBalance,
    members,
    projects,
    notices,
    expenses,
    meetings,
    setActiveTab,
    setIsPublicView,
    themeConfig
  } = useMaktab();

  const themeClasses = getThemeClasses(themeConfig?.color);

  const activeNotices = notices.filter((n) => n.is_published);
  const runningProjects = projects.filter((p) => p.status === 'running');
  const recentExpenses = expenses.slice(0, 6);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* 1. Hero / Header Banner */}
      <div className={`bg-linear-to-br ${themeClasses.gradientBg} rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden text-center sm:text-left transition-all duration-300`}>
        
        {/* Subtle Decorative Arch Glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-white/90 border border-white/20 mb-3 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>গ্রামবাসীর সামনে উন্মুক্ত স্বচ্ছ আর্থিক হিসাব</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {maktabSettings.maktab_name}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 mt-3 leading-relaxed">
            {maktabSettings.description || 'গ্রামবাসীর সার্বিক আর্থিক সাহায্য ও ঐকান্তিক প্রচেষ্টায় পরিচালিত একটি নির্ভরযোগ্য ও স্বচ্ছ দ্বীনি শিক্ষা প্রতিষ্ঠান।'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/80 mt-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white/90" />
              <span>
                {maktabSettings.village_name ? `গ্রাম: ${maktabSettings.village_name}, ` : ''}
                {maktabSettings.union_name ? `${maktabSettings.union_name}, ` : ''}
                {maktabSettings.upazila ? `${maktabSettings.upazila}` : ''}
              </span>
            </span>
            {maktabSettings.established_year && (
              <span>· স্থাপিত: {maktabSettings.established_year} ইং</span>
            )}
          </div>

          {/* Dynamic Call / WhatsApp CTA buttons */}
          {publicSettings.show_contact_buttons && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
              {maktabSettings.phone && (
                <a
                  href={`tel:${maktabSettings.phone.replace(/[^0-9]/g, '')}`}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>সরাসরি কল করুন (Call Now)</span>
                </a>
              )}

              {maktabSettings.whatsapp && (
                <a
                  href={`https://wa.me/${maktabSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95 border border-white/20 backdrop-blur-sm"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Public Verified Financial Summary (স্বচ্ছ আর্থিক চিত্র) */}
      {publicSettings.show_total_balance && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-800" />
              <span>উন্মুক্ত আর্থিক তহবিল ও স্থিতি (Transparency Summary)</span>
            </h2>
            <span className="text-[11px] text-slate-500">স্বয়ংক্রিয় হিসাব</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500">বর্তমান নীট তহবিল</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-950 mt-1">
                {formatTaka(currentBalance)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">ব্যাংক ও ক্যাশ রিজার্ভ</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500">মোট সংগৃহীত অবদান</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                {formatTaka(totalContributions)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">সদস্য ও শুভাকাঙ্ক্ষী অনুদান</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500">অন্যান্য বিবিধ আয়</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-sky-900 mt-1">
                {formatTaka(totalIncome)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">জুমার দান, ইজারা ও ফিতরা</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="text-[11px] text-slate-500">সর্বমোট অনুমোদিত ব্যয়</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-900 mt-1">
                {formatTaka(totalExpenses)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">শিক্ষক ভাতা ও সংস্কার বিল</div>
            </div>

          </div>
        </section>
      )}

      {/* 3. Leadership & Responsibility Profile */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>মক্তব পরিচালনা কমিটি ও দায়িত্বশীলবৃন্দ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Chairman */}
          {publicSettings.show_chairman && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                সভাপতি (Chairman)
              </div>
              <div className="font-bold text-sm text-slate-900 mt-1">
                {maktabSettings.chairman_name || 'নির্ধারিত হয়নি'}
              </div>
              {maktabSettings.chairman_phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-mono">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span>{maktabSettings.chairman_phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Accountant */}
          {publicSettings.show_accountant && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-sky-800 font-semibold uppercase tracking-wider">
                হিসাবরক্ষক (Accountant)
              </div>
              <div className="font-bold text-sm text-slate-900 mt-1">
                {maktabSettings.accountant_name || 'নির্ধারিত হয়নি'}
              </div>
              {maktabSettings.accountant_phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-mono">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span>{maktabSettings.accountant_phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Secretary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] text-teal-800 font-semibold uppercase tracking-wider">
              সাধারণ সম্পাদক (Secretary)
            </div>
            <div className="font-bold text-sm text-slate-900 mt-1">
              {maktabSettings.secretary_name || 'নির্ধারিত হয়নি'}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              সার্বিক সমন্বয় ও প্রশাসনিক দায়িত্ব
            </div>
          </div>

        </div>
      </section>

      {/* 4. Running Infrastructure Projects */}
      {publicSettings.show_projects && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-emerald-800" />
              <span>চলমান উন্নয়ন ও সংস্কার প্রকল্পসমূহ</span>
            </h2>
            <span className="text-xs text-slate-500">কাজের অগ্রগতি</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runningProjects.map((p) => {
              const progress = p.budget > 0 
                ? Math.min(100, Math.round((p.current_expense / p.budget) * 100))
                : 0;

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>অগ্রগতি</span>
                      <span className="font-mono text-emerald-800">{toBengaliNumber(progress)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                      <span>বাজেট: {formatTaka(p.budget)}</span>
                      <span>ব্যয়: {formatTaka(p.current_expense)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Public Notices Board */}
      {publicSettings.show_notices && activeNotices.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-800" />
            <span>জরুরি নোটিশ ও এলাকাবাসীর জ্ঞাতার্থে ঘোষণা</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNotices.map((n) => {
              const badge = getPriorityBadge(n.priority);
              return (
                <div key={n.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatBengaliDate(n.publish_date)}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                    {n.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Transparent Recent Expenses (জনসাধারণের স্বচ্ছতার জন্য সাম্প্রতিক খরচ) */}
      {publicSettings.show_expenses && recentExpenses.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">সাম্প্রতিক ব্যয়ের হিসাব (পাবলিক ভাউচার)</h2>
              <p className="text-xs text-slate-500">অনুমোদিত প্রতিটি ব্যয়ের স্বচ্ছ তালিকা</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">
              ১০০% স্বচ্ছ
            </span>
          </div>

          <div className="space-y-2">
            {recentExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{exp.expense_category}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {exp.description} · {formatBengaliDate(exp.date)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-rose-800">
                    -{formatTaka(exp.amount)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {exp.voucher_number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Registered Members List (if enabled) */}
      {publicSettings.show_member_names && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">সম্মানিত সহযোগী সদস্যবৃন্দ</h2>
              <p className="text-xs text-slate-500">মক্তবের নিয়মিত দ্বীনি সহযোগী সদস্যগণের তালিকা</p>
            </div>
            <span className="text-xs font-semibold text-slate-700">
              মোট: {toBengaliNumber(members.length)} জন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {members.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {m.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{m.address || 'চর রাধানগর'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Online Donation & Payment Receiving Numbers (Dynamic from Maktab Settings) */}
      {publicSettings.show_payment_numbers && (
        <section className={`bg-linear-to-r ${themeClasses.gradientBg} rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
                <span>মক্তব ফান্ডে অনুদান ও অবদান পাঠাবার মাধ্যম</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">অনলাইন পেমেন্ট ও ব্যাংক হিসাব</h2>
            </div>
            <p className="text-xs text-emerald-200/80 max-w-sm">
              {maktabSettings.payment_instructions || 'অনুদান বা মাসিক অবদান পাঠানোর পর ট্রানজেকশন আইডি সহ যোগাযোগ করুন।'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* bKash */}
            {maktabSettings.bkash_number && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-pink-300 uppercase tracking-wide">বিকাশ (bKash)</div>
                <div className="font-mono font-bold text-base sm:text-lg text-white mt-1 select-all">
                  {maktabSettings.bkash_number}
                </div>
                <div className="text-[11px] text-emerald-200/70 mt-1">ব্যক্তিগত / মার্চেন্ট একাউন্ট</div>
              </div>
            )}

            {/* Nagad */}
            {maktabSettings.nagad_number && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">নগদ (Nagad)</div>
                <div className="font-mono font-bold text-base sm:text-lg text-white mt-1 select-all">
                  {maktabSettings.nagad_number}
                </div>
                <div className="text-[11px] text-emerald-200/70 mt-1">ব্যক্তিগত একাউন্ট</div>
              </div>
            )}

            {/* Rocket */}
            {maktabSettings.rocket_number && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wide">রকেট (Rocket)</div>
                <div className="font-mono font-bold text-base sm:text-lg text-white mt-1 select-all">
                  {maktabSettings.rocket_number}
                </div>
                <div className="text-[11px] text-emerald-200/70 mt-1">ডাচ-বাংলা মোবাইল ব্যাংকিং</div>
              </div>
            )}

            {/* Bank Account */}
            {maktabSettings.bank_account_no && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide">{maktabSettings.bank_name || 'ব্যাংক হিসাব'}</div>
                <div className="font-mono font-bold text-sm text-white mt-1 select-all">
                  {maktabSettings.bank_account_no}
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-0.5 truncate">
                  হিসাব নাম: {maktabSettings.bank_account_name || maktabSettings.maktab_name}
                </div>
                {maktabSettings.bank_branch && (
                  <div className="text-[10px] text-emerald-200/70 truncate">
                    শাখা: {maktabSettings.bank_branch}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9. Footer & Permanent Creator Branding */}
      <footer className="text-center pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-4">
        <div className="font-semibold text-emerald-950 text-sm">
          {maktabSettings.maktab_name} · একটি উন্মুক্ত ও স্বচ্ছ ডিজিটাল হিসাব ব্যবস্থাপনা
        </div>
        
        <div className="text-[11px] text-slate-400">
          যেকোনো আর্থিক জিজ্ঞাসা বা অনুদানের বিষয়ে সরাসরি সভাপতি অথবা হিসাবরক্ষক সাহেবের সাথে যোগাযোগ করুন।
        </div>

        {/* Permanent Creator Branding (Hardcoded) */}
        <div className="pt-4 border-t border-slate-200/60 max-w-sm mx-auto">
          <div className="text-[11px] text-slate-400 font-medium">এই অ্যাপটি তৈরি করেছেন</div>
          <div className="text-emerald-900 font-bold text-sm mt-0.5">Roni Riman</div>
          <a 
            href="tel:01326552304" 
            className="inline-flex items-center gap-1.5 font-mono font-bold text-slate-700 hover:text-emerald-700 mt-1 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>01326552304</span>
          </a>
        </div>
      </footer>

    </div>
  );
};
