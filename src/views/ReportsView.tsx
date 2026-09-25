import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber } from '../utils/bengali';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Filter, 
  CheckCircle, 
  Calendar, 
  Building,
  ShieldCheck
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { 
    maktabSettings, 
    totalIncome, 
    totalContributions, 
    totalExpenses, 
    currentBalance, 
    cashBalance, 
    bankBalance, 
    mobileWalletBalance,
    contributions, 
    incomes, 
    expenses, 
    members,
    projects 
  } = useMaktab();

  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'yearly' | 'all'>('monthly');

  const handlePrint = () => {
    window.print();
  };

  // Group expenses by category
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseByCategory[e.expense_category] = (expenseByCategory[e.expense_category] || 0) + e.amount;
  });

  // Group contributions by purpose
  const contributionByPurpose: Record<string, number> = {};
  contributions.forEach((c) => {
    contributionByPurpose[c.purpose] = (contributionByPurpose[c.purpose] || 0) + c.amount;
  });

  return (
    <div className="space-y-6">
      
      {/* Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>অফিশিয়াল অডিট ও আর্থিক প্রতিবেদন</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            হিসাব বিবরণী ও অডিট রিপোর্ট
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রামবাসীর সামনে উপস্থাপনযোগ্য স্বচ্ছ আয়-ব্যয় বিবরণী ও ব্যালেন্স শিট
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>অফিসিয়াল রিপোর্ট প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print-container">
        
        {/* Formal Institutional Header */}
        <div className="text-center border-b-2 border-emerald-900 pb-5 mb-6">
          <div className="text-xs text-emerald-900 font-semibold tracking-wider mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {maktabSettings.maktab_name}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {maktabSettings.address ? `${maktabSettings.address}, ` : ''}
            {maktabSettings.village_name ? `গ্রাম: ${maktabSettings.village_name}, ` : ''}
            {maktabSettings.union_name ? `ইউনিয়ন: ${maktabSettings.union_name}, ` : ''}
            {maktabSettings.upazila ? `উপজেলা: ${maktabSettings.upazila}, ` : ''}
            {maktabSettings.district ? `জেলা: ${maktabSettings.district}` : ''}
          </p>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-4">
            <span>মোবাইল: {maktabSettings.phone}</span>
            {maktabSettings.email && <span>ইমেইল: {maktabSettings.email}</span>}
          </div>
          <div className="inline-block mt-3 px-4 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs uppercase tracking-wider">
            সার্বিক আর্থিক হিসাব ও নিরীক্ষা প্রতিবেদন (ব্যালেন্স শিট)
          </div>
        </div>

        {/* Executive Summary Financial Statement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] text-slate-500">প্রারম্ভিক ব্যালেন্স (Opening)</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {formatTaka(maktabSettings.opening_balance)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] text-emerald-800">সর্বমোট অবদান ও আয়</div>
            <div className="text-base font-bold font-mono text-emerald-900 mt-0.5">
              {formatTaka(totalContributions + totalIncome)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] text-rose-700">সর্বমোট ব্যয় (Expenditure)</div>
            <div className="text-base font-bold font-mono text-rose-900 mt-0.5">
              {formatTaka(totalExpenses)}
            </div>
          </div>

          <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl">
            <div className="text-[11px] text-emerald-950 font-semibold">বর্তমান নীট তহবিল স্থিতি</div>
            <div className="text-lg font-bold font-mono text-emerald-950 mt-0.5">
              {formatTaka(currentBalance)}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: Category Income vs Expense */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Income Side */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">
              আয়ের খাতসমূহ (Incomes & Contributions)
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-600">প্রারম্ভিক ব্যাংক ও ক্যাশ জের</span>
                <span className="font-mono font-semibold text-slate-900">{formatTaka(maktabSettings.opening_balance)}</span>
              </div>

              {Object.entries(contributionByPurpose).map(([purpose, amount]) => (
                <div key={purpose} className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">{purpose}</span>
                  <span className="font-mono font-semibold text-emerald-800">{formatTaka(amount)}</span>
                </div>
              ))}

              {incomes.map((inc) => (
                <div key={inc.id} className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">{inc.source_category}</span>
                  <span className="font-mono font-semibold text-sky-800">{formatTaka(inc.amount)}</span>
                </div>
              ))}

              <div className="flex justify-between pt-2 font-bold text-emerald-950 text-sm border-t border-slate-300">
                <span>মোট প্রাপ্তি / জমা:</span>
                <span className="font-mono">{formatTaka(maktabSettings.opening_balance + totalContributions + totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Expense Side */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-xs text-rose-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">
              ব্যয়ের খাতসমূহ (Approved Expenditures)
            </h3>

            <div className="space-y-2 text-xs">
              {Object.entries(expenseByCategory).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between py-1 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">{cat}</span>
                  <span className="font-mono font-semibold text-rose-800">{formatTaka(amount)}</span>
                </div>
              ))}

              <div className="flex justify-between pt-2 font-bold text-rose-950 text-sm border-t border-slate-300">
                <span>সর্বমোট পরিশোধিত ব্যয়:</span>
                <span className="font-mono">{formatTaka(totalExpenses)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Fund Location Breakdown (ক্যাশ, ব্যাংক, মোবাইল ব্যাংকিং) */}
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-2">
            তহবিলের বর্তমান অবস্থান ও ব্যাংক হিসাব খতিয়ান
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500">ক্যাশ ইন হ্যান্ড (নগদ): </span>
              <span className="font-mono font-bold text-slate-900">{formatTaka(cashBalance)}</span>
            </div>
            <div>
              <span className="text-slate-500">ব্যাংক ব্যালেন্স: </span>
              <span className="font-mono font-bold text-slate-900">{formatTaka(bankBalance)}</span>
            </div>
            <div>
              <span className="text-slate-500">বিকাশ / নগদ ওয়ালেট: </span>
              <span className="font-mono font-bold text-slate-900">{formatTaka(mobileWalletBalance)}</span>
            </div>
          </div>
        </div>

        {/* Certification and Signature Seals */}
        <div className="mt-14 pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="w-36 mx-auto border-t border-slate-500 pt-1.5 font-bold text-slate-900">
              {maktabSettings.accountant_name || 'হিসাবরক্ষক'}
            </div>
            <span className="text-[11px] text-slate-500">হিসাবরক্ষক</span>
          </div>

          <div>
            <div className="w-36 mx-auto border-t border-slate-500 pt-1.5 font-bold text-slate-900">
              {maktabSettings.secretary_name || 'সাধারণ সম্পাদক'}
            </div>
            <span className="text-[11px] text-slate-500">সাধারণ সম্পাদক</span>
          </div>

          <div>
            <div className="w-36 mx-auto border-t border-slate-500 pt-1.5 font-bold text-slate-900">
              {maktabSettings.chairman_name || 'সভাপতি'}
            </div>
            <span className="text-[11px] text-slate-500">মক্তব পরিচালনা কমিটি সভাপতি</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400">
          প্রতিবেদন প্রস্তুতের তারিখ: {formatBengaliDate(new Date().toISOString())} · এই আর্থিক বিবরণী সর্বসম্মতিক্রমে অনুমোদিত ও সংরক্ষিত।
        </div>

      </div>

    </div>
  );
};
