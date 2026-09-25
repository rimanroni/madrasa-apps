import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { Member } from '../types/database';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPaymentMethodName } from '../utils/bengali';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  HandCoins, 
  Receipt, 
  Printer, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onAddContributionForMember: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onAddContributionForMember
}) => {
  const { contributions, setViewingReceipt, maktabSettings, currentUser } = useMaktab();

  if (!member) return null;

  // Filter contributions by this member
  const memberContributions = contributions.filter(
    (c) => c.member_id === member.id || c.donor_name.trim().toLowerCase() === member.name.trim().toLowerCase()
  );

  const totalContributed = memberContributions.reduce((sum, c) => sum + (c.amount || 0), 0);

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white no-print">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-300" />
            <span className="font-semibold text-sm">সদস্য প্রোফাইল ও অবদানের বিবরণী</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintStatement}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              স্টেটমেন্ট প্রিন্ট
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Profile Content */}
        <div className="p-6 space-y-6 print-container">
          
          {/* Institution Header for Print */}
          <div className="hidden print:block text-center border-b border-slate-300 pb-3 mb-4">
            <h2 className="text-xl font-bold text-slate-900">{maktabSettings.maktab_name}</h2>
            <p className="text-xs text-slate-600">{maktabSettings.address}, {maktabSettings.village_name}</p>
            <p className="text-xs font-semibold text-emerald-800 mt-1">সদস্য ব্যক্তিগত অবদান স্টেটমেন্ট</p>
          </div>

          {/* Member Identity Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                {member.name.charAt(0) || 'স'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono">
                    {member.member_id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{member.mobile}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.address || 'ঠিকানা নেই'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button for Admin */}
            {currentUser.role !== 'normal_user' && (
              <button
                onClick={() => {
                  onClose();
                  onAddContributionForMember(member);
                }}
                className="no-print w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <HandCoins className="w-4 h-4" />
                অবদান জমা করুন
              </button>
            )}
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">মাসিক অবদানের হার</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {formatTaka(member.monthly_contribution_amount)}/মাস
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="text-[11px] text-emerald-800 font-medium">সর্বমোট জমা অবদান</div>
              <div className="text-base font-bold text-emerald-950 mt-0.5">
                {formatTaka(totalContributed)}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-500 font-medium">মোট রশিদের সংখ্যা</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {toBengaliNumber(memberContributions.length)} টি
              </div>
            </div>
          </div>

          {/* Contribution History Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>পূর্বে জমাকৃত অবদানের খতিয়ান</span>
              <span className="text-[11px] font-normal text-slate-500">
                মোট {toBengaliNumber(memberContributions.length)} টি এন্ট্রি
              </span>
            </h4>

            {memberContributions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                এই সদস্যের এখনও কোনো অবদানের রেকর্ড যুক্ত করা হয়নি।
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5">তারিখ</th>
                        <th className="px-3 py-2.5">রশিদ নং</th>
                        <th className="px-3 py-2.5">খাত / বিবরণ</th>
                        <th className="px-3 py-2.5">মাধ্যম</th>
                        <th className="px-3 py-2.5 text-right">পরিমাণ</th>
                        <th className="px-3 py-2.5 text-center no-print">রশিদ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {memberContributions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                            {formatBengaliDate(c.date)}
                          </td>
                          <td className="px-3 py-2 font-mono font-medium text-emerald-800 whitespace-nowrap">
                            {c.receipt_number}
                          </td>
                          <td className="px-3 py-2 text-slate-800 font-medium">
                            {c.purpose}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {getPaymentMethodName(c.payment_method)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {formatTaka(c.amount)}
                          </td>
                          <td className="px-3 py-2 text-center no-print">
                            <button
                              onClick={() => setViewingReceipt(c)}
                              className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-semibold transition cursor-pointer"
                              title="অফিশিয়াল রশিদ দেখুন"
                            >
                              রশিদ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {member.notes && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl">
              <span className="font-semibold">বিশেষ মন্তব্য: </span>{member.notes}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
