import React, { useState, useMemo } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, formatBengaliDate, toBengaliNumber, getPaymentMethodName } from '../utils/bengali';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  HandCoins, 
  Receipt,
  Calendar,
  Wallet,
  ArrowLeftRight
} from 'lucide-react';
import { AccountTransferModal } from '../components/QuickActionModals';

interface LedgerViewProps {
  onOpenContributionModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenExpenseModal: () => void;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  onOpenContributionModal,
  onOpenIncomeModal,
  onOpenExpenseModal
}) => {
  const { 
    transactions, 
    contributions, 
    setViewingReceipt, 
    currentBalance, 
    totalContributions, 
    totalIncome, 
    totalExpenses, 
    maktabSettings,
    currentUser 
  } = useMaktab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (selectedType !== 'all' && tx.type !== selectedType) return false;
      // Method match
      if (selectedMethod !== 'all' && tx.payment_method !== selectedMethod) return false;
      // Date range match
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title?.toLowerCase().includes(query);
        const matchesCategory = tx.category?.toLowerCase().includes(query);
        const matchesVoucher = tx.receipt_voucher_no?.toLowerCase().includes(query);
        const matchesDesc = tx.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesVoucher && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedType, selectedMethod, startDate, endDate, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['তারিখ', 'ভাউচার/রশিদ', 'ধরন', 'খাত/শিরোনাম', 'মাধ্যম', 'পরিমাণ (টাকা)', 'বর্ণনা'];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.receipt_voucher_no,
      tx.type === 'contribution' ? 'অবদান' : tx.type === 'income' ? 'আয়' : 'ব্যয়',
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.payment_method,
      tx.type === 'expense' ? -tx.amount : tx.amount,
      `"${(tx.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maktab_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReceipt = (receiptNo: string) => {
    const found = contributions.find((c) => c.receipt_number === receiptNo);
    if (found) {
      setViewingReceipt(found);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Totals */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>সমন্বিত কেন্দ্রীয় হিসাব লেজার খাতা</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            আয়, অবদান ও ব্যয় বিবরণী
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            মক্তবের প্রতিটি আর্থিক লেনদেনের স্বচ্ছ খতিয়ান ও রসিদ রেকর্ড
          </p>
        </div>

        {/* Action Buttons for Admin */}
        {currentUser.role !== 'normal_user' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenContributionModal}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <HandCoins className="w-3.5 h-3.5" />
              <span>অবদান যোগ</span>
            </button>
            <button
              onClick={onOpenIncomeModal}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-sky-800 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>আয় যোগ</span>
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>ব্যয় ভাউচার</span>
            </button>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-300" />
              <span>তহবিল স্থানান্তর</span>
            </button>
          </div>
        )}
      </div>

      {/* Mini Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
          <div className="text-[11px] text-emerald-800 font-semibold">বর্তমান সামগ্রিক স্থিতি</div>
          <div className="text-lg font-bold font-mono text-emerald-950 mt-0.5">
            {formatTaka(currentBalance)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">মোট গৃহীত অবদান</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {formatTaka(totalContributions)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">মোট বিবিধ আয়</div>
          <div className="text-lg font-bold font-mono text-sky-900 mt-0.5">
            {formatTaka(totalIncome)}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-600 font-medium">মোট অনুমোদিত ব্যয়</div>
          <div className="text-lg font-bold font-mono text-rose-900 mt-0.5">
            {formatTaka(totalExpenses)}
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        
        {/* Search & Export Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খাত, বিবরণ বা ভাউচার নম্বর দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition w-full sm:w-auto justify-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>এক্সেল / CSV ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          
          {/* Type Segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব লেনদেন ({toBengaliNumber(transactions.length)})
            </button>
            <button
              onClick={() => setSelectedType('contribution')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'contribution' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              অবদান ও অনুদান
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'income' ? 'bg-white text-sky-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বিবিধ আয়
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'expense' ? 'bg-white text-rose-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ব্যয়সমূহ
            </button>
            <button
              onClick={() => setSelectedType('transfer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'transfer' ? 'bg-white text-amber-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              তহবিল স্থানান্তর
            </button>
          </div>

          {/* Payment Method filter */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">সব মাধ্যম (ক্যাশ/ব্যাংক/মোবাইল)</option>
            <option value="cash">ক্যাশ / নগদ</option>
            <option value="bank">ব্যাংক</option>
            <option value="bkash">বিকাশ</option>
            <option value="nagad">নগদ</option>
          </select>

          {/* Date range */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>হতে:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
            <span>পর্যন্ত:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">তারিখ</th>
                <th className="px-4 py-3">ভাউচার / রশিদ</th>
                <th className="px-4 py-3">খাত / বিবরণ</th>
                <th className="px-4 py-3">পরিশোধের মাধ্যম</th>
                <th className="px-4 py-3">রেকর্ডকারী</th>
                <th className="px-4 py-3 text-right">টাকার পরিমাণ</th>
                <th className="px-4 py-3 text-center">রশিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    কোনো লেনদেনের রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isExpense = tx.type === 'expense';
                  const isContribution = tx.type === 'contribution';
                  const isTransfer = tx.type === 'transfer';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {formatBengaliDate(tx.date)}
                      </td>

                      {/* Voucher / Receipt */}
                      <td className="px-4 py-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                        {tx.receipt_voucher_no}
                      </td>

                      {/* Title & Desc */}
                      <td className="px-4 py-3 min-w-[200px]">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {isTransfer && <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600 inline" />}
                          <span>{tx.title}</span>
                        </div>
                        {tx.description && (
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {tx.description}
                          </div>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {getPaymentMethodName(tx.payment_method)}
                      </td>

                      {/* Created By */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {tx.created_by || 'হিসাব শাখা'}
                      </td>

                      {/* Amount with tabular numbers */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isExpense 
                              ? 'text-rose-700' 
                              : isContribution 
                              ? 'text-emerald-800' 
                              : isTransfer
                              ? 'text-amber-700'
                              : 'text-sky-800'
                          }`}
                        >
                          {isExpense ? `-${formatTaka(tx.amount)}` : isTransfer ? `⇄${formatTaka(tx.amount)}` : `+${formatTaka(tx.amount)}`}
                        </span>
                      </td>

                      {/* Receipt Action */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {isContribution ? (
                          <button
                            onClick={() => handleOpenReceipt(tx.receipt_voucher_no)}
                            className="p-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded hover:bg-emerald-100 transition cursor-pointer"
                            title="রশিদ দেখুন"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300 font-mono text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Transfer Modal */}
      <AccountTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

    </div>
  );
};
