import React, { useState, useMemo } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPaymentMethodName } from '../utils/bengali';
import { 
  HandCoins, 
  Search, 
  Receipt, 
  Plus, 
  Printer, 
  CheckCircle,
  Calendar,
  Building
} from 'lucide-react';

interface ContributionsViewProps {
  onOpenContributionModal: () => void;
}

export const ContributionsView: React.FC<ContributionsViewProps> = ({ onOpenContributionModal }) => {
  const { 
    contributions, 
    setViewingReceipt, 
    totalContributions, 
    currentUser,
    members 
  } = useMaktab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      if (selectedPurpose !== 'all' && c.purpose !== selectedPurpose) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.donor_name?.toLowerCase().includes(query);
        const matchesMobile = c.donor_mobile?.toLowerCase().includes(query);
        const matchesReceipt = c.receipt_number?.toLowerCase().includes(query);
        const matchesNotes = c.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesMobile && !matchesReceipt && !matchesNotes) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contributions, selectedPurpose, searchQuery]);

  // Breakdown by purpose
  const monthlySum = contributions.filter(c => c.purpose.includes('মাসিক')).reduce((s, c) => s + c.amount, 0);
  const projectSum = contributions.filter(c => c.purpose.includes('নির্মাণ')).reduce((s, c) => s + c.amount, 0);
  const oneTimeSum = contributions.filter(c => c.purpose.includes('এককালীন') || c.purpose.includes('সাধারণ')).reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <HandCoins className="w-4 h-4 text-emerald-700" />
            <span>অবদান ও অনুদান কালেকশন ব্যবস্থাপনা</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            মাসিক অবদান ও উন্নয়ন অনুদানসমূহ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            সদস্য ও শুভাকাঙ্ক্ষীদের জমাকৃত অবদানের খতিয়ান ও রসিদ ব্যবস্থাপনা
          </p>
        </div>

        {currentUser.role !== 'normal_user' && (
          <button
            onClick={onOpenContributionModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অবদান গ্রহণ ও রশিদ</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="text-[11px] text-emerald-800 font-semibold">সর্বমোট গৃহীত অবদান</div>
          <div className="text-lg font-bold font-mono text-emerald-950 mt-0.5">
            {formatTaka(totalContributions)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">নিয়মিত মাসিক অবদান</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {formatTaka(monthlySum)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">নির্মাণ ও সংস্কার তহবিল</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {formatTaka(projectSum)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">এককালীন সাধারণ অনুদান</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {formatTaka(oneTimeSum)}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="দাতা, মোবাইল বা রশিদ নং দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">সব ধরনের অনুদান / অবদান</option>
            <option value="মাসিক অবদান">মাসিক অবদান</option>
            <option value="নির্মাণ তহবিল অনুদান">নির্মাণ তহবিল অনুদান</option>
            <option value="এককালীন অনুদান">এককালীন অনুদান</option>
            <option value="সাধারণ দান">সাধারণ দান</option>
          </select>
        </div>

      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">তারিখ</th>
                <th className="px-4 py-3">রশিদ নং</th>
                <th className="px-4 py-3">দাতা / সদস্যের নাম</th>
                <th className="px-4 py-3">উদ্দেশ্য / খাত</th>
                <th className="px-4 py-3">পরিশোধ মাধ্যম</th>
                <th className="px-4 py-3 text-right">পরিমাণ (টাকা)</th>
                <th className="px-4 py-3 text-center">রশিদ প্রিন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    কোনো অবদানের রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredContributions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatBengaliDate(item.date)}
                    </td>

                    <td className="px-4 py-3 font-mono font-medium text-emerald-900 whitespace-nowrap">
                      {item.receipt_number}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{item.donor_name}</div>
                      {item.donor_mobile && (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {item.donor_mobile}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {item.purpose}
                      {item.notes && (
                        <div className="text-[11px] text-slate-400 font-normal italic mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {getPaymentMethodName(item.payment_method)}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-sm text-emerald-900 whitespace-nowrap">
                      {formatTaka(item.amount)}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setViewingReceipt(item)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 mx-auto transition cursor-pointer"
                        title="অফিশিয়াল রশিদ দেখুন"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>রশিদ</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
