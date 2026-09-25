import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPaymentMethodName, numberToBengaliWords } from '../utils/bengali';
import { getThemeClasses } from '../types/theme';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { viewingReceipt, setViewingReceipt, maktabSettings, themeConfig } = useMaktab();

  if (!viewingReceipt) return null;

  const themeClasses = getThemeClasses(themeConfig?.color);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Toolbar - Hidden during print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 ${themeClasses.iconColor}`} />
            <span className="font-semibold text-sm">অর্থ প্রাপ্তি স্বীকারপত্র / অফিশিয়াল রশিদ</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${themeClasses.primaryBtn} rounded-xl text-xs font-semibold transition cursor-pointer`}
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট / PDF সংরক্ষণ
            </button>
            <button
              onClick={() => setViewingReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 print-container text-slate-800 bg-white">
          {/* Receipt Border & Islamic Architectural Aesthetic Header */}
          <div className="border-2 border-emerald-800 rounded-xl p-6 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-8xl font-black text-emerald-950 uppercase tracking-widest text-center">
                {maktabSettings.maktab_name}
              </span>
            </div>

            {/* Header Content */}
            <div className="text-center border-b border-emerald-700/30 pb-4 mb-4">
              <div className="text-xs text-emerald-800 font-semibold tracking-wider mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <h1 className="text-2xl font-bold text-emerald-950 tracking-tight">
                {maktabSettings.maktab_name}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                {maktabSettings.address ? `${maktabSettings.address}, ` : ''}
                {maktabSettings.village_name ? `গ্রাম: ${maktabSettings.village_name}, ` : ''}
                {maktabSettings.union_name ? `ইউনিয়ন: ${maktabSettings.union_name}, ` : ''}
                {maktabSettings.upazila ? `উপজেলা: ${maktabSettings.upazila}, ` : ''}
                {maktabSettings.district ? `জেলা: ${maktabSettings.district}` : ''}
              </p>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-4">
                <span>মোবাইল: {maktabSettings.phone}</span>
                {maktabSettings.established_year && (
                  <span>স্থাপিত: {maktabSettings.established_year} ইং</span>
                )}
              </div>
            </div>

            {/* Receipt Sub-header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60 mb-5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">রশিদ নং:</span>
                <span className="font-mono font-bold text-slate-900">{viewingReceipt.receipt_number}</span>
              </div>
              <div className="px-3 py-1 bg-emerald-800 text-white rounded-md font-semibold text-xs tracking-wider">
                অর্থ প্রাপ্তির পাকা রশিদ
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-900">তারিখ:</span>
                <span className="font-medium text-slate-800">{formatBengaliDate(viewingReceipt.date)}</span>
              </div>
            </div>

            {/* Main Receipt Details Body */}
            <div className="space-y-3.5 text-sm">
              <div className="flex flex-wrap items-baseline border-b border-dashed border-slate-300 pb-1.5">
                <span className="w-36 text-slate-600 font-medium shrink-0">দাতা / সদস্যের নাম:</span>
                <span className="font-bold text-slate-900 flex-1">{viewingReceipt.donor_name}</span>
                {viewingReceipt.donor_mobile && (
                  <span className="text-xs text-slate-500 font-mono">মোবাইল: {viewingReceipt.donor_mobile}</span>
                )}
              </div>

              <div className="flex flex-wrap items-baseline border-b border-dashed border-slate-300 pb-1.5">
                <span className="w-36 text-slate-600 font-medium shrink-0">অবদানের খাত / উদ্দেশ্য:</span>
                <span className="font-semibold text-emerald-900 flex-1">{viewingReceipt.purpose}</span>
              </div>

              <div className="flex flex-wrap items-baseline border-b border-dashed border-slate-300 pb-1.5">
                <span className="w-36 text-slate-600 font-medium shrink-0">পরিশোধের মাধ্যম:</span>
                <span className="font-medium text-slate-800 flex-1">{getPaymentMethodName(viewingReceipt.payment_method)}</span>
                {viewingReceipt.notes && (
                  <span className="text-xs text-slate-500 italic max-w-xs truncate">নোট: {viewingReceipt.notes}</span>
                )}
              </div>

              <div className="flex flex-wrap items-baseline border-b border-slate-300 pb-2 pt-1">
                <span className="w-36 text-slate-600 font-medium shrink-0">কথায় (টাকা):</span>
                <span className="font-semibold text-slate-900 italic flex-1">
                  {numberToBengaliWords(viewingReceipt.amount)}
                </span>
              </div>

              {/* Amount Highlight Box */}
              <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-300 p-3 rounded-lg mt-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <span className="text-xs font-semibold text-emerald-950 uppercase tracking-wider">
                    সর্বমোট গৃহীত অর্থ
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-950">
                  {formatTaka(viewingReceipt.amount)}
                </div>
              </div>
            </div>

            {/* Signatures & Verification Footnote */}
            <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="w-36 mx-auto border-t border-slate-400 pt-1.5 font-semibold text-slate-800">
                  {viewingReceipt.created_by || maktabSettings.accountant_name || 'হিসাবরক্ষক'}
                </div>
                <span className="text-[11px] text-slate-500">আদায়কারী / হিসাবরক্ষকের স্বাক্ষর</span>
              </div>
              <div>
                <div className="w-36 mx-auto border-t border-slate-400 pt-1.5 font-semibold text-slate-800">
                  {maktabSettings.chairman_name || 'সভাপতি'}
                </div>
                <span className="text-[11px] text-slate-500">মক্তব সভাপতির স্বাক্ষর ও সিল</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              আল্লাহ তাআলা আপনার এই দ্বীনি দান ও খেদমতকে কবুল ও বরকতময় করুন। আমীন। এটি একটি স্বচ্ছ ডিজিটাল হিসাব রশিদ।
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
