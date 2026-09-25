import React, { useState, useEffect } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { Member, PaymentMethod, Project } from '../types/database';
import { X, HandCoins, TrendingUp, TrendingDown, UserPlus, FolderPlus, BellRing } from 'lucide-react';

// ==========================================
// 1. ADD CONTRIBUTION / DONATION MODAL
// ==========================================
interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedMember?: Member | null;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  preSelectedMember
}) => {
  const { members, addContribution, showToast } = useMaktab();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorMobile, setDonorMobile] = useState<string>('');
  const [amount, setAmount] = useState<string>('500');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [purpose, setPurpose] = useState<string>('মাসিক অবদান');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (preSelectedMember) {
      setSelectedMemberId(preSelectedMember.id);
      setDonorName(preSelectedMember.name);
      setDonorMobile(preSelectedMember.mobile);
      setAmount(preSelectedMember.monthly_contribution_amount.toString());
    } else {
      setSelectedMemberId('');
      setDonorName('');
      setDonorMobile('');
      setAmount('500');
    }
  }, [preSelectedMember, isOpen]);

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memId = e.target.value;
    setSelectedMemberId(memId);
    if (memId) {
      const found = members.find((m) => m.id === memId);
      if (found) {
        setDonorName(found.name);
        setDonorMobile(found.mobile);
        setAmount(found.monthly_contribution_amount.toString());
      }
    } else {
      setDonorName('');
      setDonorMobile('');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন', 'error');
      return;
    }
    if (!donorName.trim()) {
      showToast('দাতা বা সদস্যের নাম উল্লেখ করুন', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await addContribution({
      member_id: selectedMemberId || null,
      donor_name: donorName.trim(),
      donor_mobile: donorMobile.trim(),
      amount: numAmount,
      date,
      payment_method: paymentMethod,
      purpose,
      notes: notes.trim()
    });
    setIsSubmitting(false);

    if (res) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">নতুন অবদান / অনুদান গ্রহণ ও রশিদ তৈরি</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Member select */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              সদস্য নির্বাচন করুন (ঐচ্ছিক):
            </label>
            <select
              value={selectedMemberId}
              onChange={handleMemberChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
            >
              <option value="">-- সাধারণ গ্রামবাসী / বহিরাগত শুভাকাঙ্ক্ষী --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.member_id} - {m.name} ({m.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                দাতা / সদস্যের নাম <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="যেমন: হাজী মোঃ আব্দুর রহিম"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                মোবাইল নম্বর:
              </label>
              <input
                type="text"
                value={donorMobile}
                onChange={(e) => setDonorMobile(e.target.value)}
                placeholder="০১৭১১-XXXXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                টাকার পরিমাণ (৳) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-bold font-mono text-emerald-950"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                তারিখ <span className="text-rose-500">*</span>:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Purpose & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                অবদানের খাত / উদ্দেশ্য:
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              >
                <option value="মাসিক অবদান">মাসিক অবদান</option>
                <option value="নির্মাণ তহবিল অনুদান">নির্মাণ তহবিল অনুদান</option>
                <option value="এককালীন অনুদান">এককালীন অনুদান</option>
                <option value="এতিম ও মিসকিন তহবিল">এতিম ও মিসকিন তহবিল</option>
                <option value="রমজান ও ইফতার তহবিল">রমজান ও ইফতার তহবিল</option>
                <option value="সাধারণ দান">সাধারণ দান</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                পরিশোধের মাধ্যম:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              >
                <option value="cash">ক্যাশ / নগদ টাকা</option>
                <option value="bank">ব্যাংক একাউন্ট</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              মন্তব্য বা ট্রানজেকশন আইডি (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: TrxID বা বিশেষ দোয়ার অনুরোধ..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
            >
              জমা করুন ও রশিদ প্রিন্ট করুন
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// ==========================================
// 2. ADD INCOME MODAL
// ==========================================
interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose }) => {
  const { addIncome, showToast } = useMaktab();

  const [sourceCategory, setSourceCategory] = useState<string>('জুমার নামাজে সাধারণ দান কালেকশন');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [description, setDescription] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন', 'error');
      return;
    }

    const finalCategory = sourceCategory === 'অন্যান্য' && customCategory.trim() 
      ? customCategory.trim() 
      : sourceCategory;

    setIsSubmitting(true);
    const res = await addIncome({
      source_category: finalCategory,
      amount: numAmount,
      date,
      payment_method: paymentMethod,
      description: description.trim() || finalCategory
    });
    setIsSubmitting(false);

    if (res) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 bg-sky-900 text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-300" />
            <h3 className="font-bold text-sm">নতুন সাধারণ আয় এন্ট্রি</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              আয়ের খাত / উৎস <span className="text-rose-500">*</span>:
            </label>
            <select
              value={sourceCategory}
              onChange={(e) => setSourceCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600 font-medium"
            >
              <option value="জুমার নামাজে সাধারণ দান কালেকশন">জুমার নামাজে সাধারণ দান কালেকশন</option>
              <option value="মক্তবের ফসলি জমি ইজারা আয়">মক্তবের ফসলি জমি ইজারা আয়</option>
              <option value="বাৎসরিক ওয়াজ মাহফিল কালেকশন">বাৎসরিক ওয়াজ মাহফিল কালেকশন</option>
              <option value="সদকা ও ফিতরা তহবিল">সদকা ও ফিতরা তহবিল</option>
              <option value="কুরবানি পশুর চামড়া বিক্রয়">কুরবানি পশুর চামড়া বিক্রয়</option>
              <option value="অন্যান্য">অন্যান্য (নিজে লিখুন)</option>
            </select>
          </div>

          {sourceCategory === 'অন্যান্য' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                খাতের নাম লিখুন:
              </label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="যেমন: পুকুর লিজের আয়"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                টাকার পরিমাণ (৳) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="১০০০"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600 font-bold font-mono text-sky-950"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                তারিখ <span className="text-rose-500">*</span>:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              পরিশোধের মাধ্যম:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600 font-medium"
            >
              <option value="cash">ক্যাশ / নগদ টাকা</option>
              <option value="bank">ব্যাংক একাউন্ট</option>
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              বিস্তারিত বিবরণ (ঐচ্ছিক):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="আয়ের বিস্তারিত বিবরণ বা রেফারেন্স..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-sky-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-800 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
            >
              আয় সংরক্ষণ করুন
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// ==========================================
// 3. ADD EXPENSE MODAL
// ==========================================
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { projects, addExpense, showToast } = useMaktab();

  const [category, setCategory] = useState<string>('শিক্ষক/মুয়াল্লিম মাসিক হাদিয়া ও ভাতা');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [projectId, setProjectId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন', 'error');
      return;
    }

    const finalCategory = category === 'অন্যান্য' && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    setIsSubmitting(true);
    const res = await addExpense({
      expense_category: finalCategory,
      amount: numAmount,
      date,
      payment_method: paymentMethod,
      description: description.trim() || finalCategory,
      project_id: projectId || null
    });
    setIsSubmitting(false);

    if (res) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 bg-rose-900 text-white">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-300" />
            <h3 className="font-bold text-sm">নতুন ব্যয় ভাউচার তৈরি</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              ব্যয়ের খাত / ক্যাটাগরি <span className="text-rose-500">*</span>:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600 font-medium"
            >
              <option value="শিক্ষক/মুয়াল্লিম মাসিক হাদিয়া ও ভাতা">শিক্ষক/মুয়াল্লিম মাসিক হাদিয়া ও ভাতা</option>
              <option value="বিদ্যুৎ বিল ও ইলেকট্রিক মেরামত">বিদ্যুৎ বিল ও ইলেকট্রিক মেরামত</option>
              <option value="মক্তব সংস্কার ও মেরামত">মক্তব সংস্কার ও মেরামত</option>
              <option value="কিতাব, খাতা ও শিক্ষা উপকরণ ক্রয়">কিতাব, খাতা ও শিক্ষা উপকরণ ক্রয়</option>
              <option value="মিটিং ও আপ্যায়ন খরচ">মিটিং ও আপ্যায়ন খরচ</option>
              <option value="ইন্টারনেট ও যোগাযোগ খরচ">ইন্টারনেট ও যোগাযোগ খরচ</option>
              <option value="অন্যান্য">অন্যান্য (নিজে লিখুন)</option>
            </select>
          </div>

          {category === 'অন্যান্য' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                খাতের নাম লিখুন:
              </label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="যেমন: অজুখনা পরিস্কার সামগ্রী"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ব্যয়ের পরিমাণ (৳) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="১৫০০"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600 font-bold font-mono text-rose-950"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                তারিখ <span className="text-rose-500">*</span>:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                পরিশোধের মাধ্যম:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600 font-medium"
              >
                <option value="cash">ক্যাশ / নগদ টাকা</option>
                <option value="bank">ব্যাংক একাউন্ট</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                সংশ্লিষ্ট উন্নয়ন প্রকল্প (যদি থাকে):
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600 font-medium"
              >
                <option value="">-- সাধারণ নিয়মিত ব্যয় --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              বিস্তারিত বিবরণ / বিলের বর্ণনা:
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="যেমন: মেসার্স আলম ব্রাদার্স হতে ৫ বস্তা সিমেন্ট ক্রয়"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-rose-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
            >
              ভাউচার সংরক্ষণ করুন
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// ==========================================
// 4. ADD / EDIT MEMBER MODAL
// ==========================================
interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const { members, addMember, updateMember, showToast } = useMaktab();

  const [name, setName] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500');
  const [joiningDate, setJoiningDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setMemberId(memberToEdit.member_id);
      setMobile(memberToEdit.mobile);
      setAddress(memberToEdit.address);
      setMonthlyContribution(memberToEdit.monthly_contribution_amount.toString());
      setJoiningDate(memberToEdit.joining_date);
      setStatus(memberToEdit.status);
      setNotes(memberToEdit.notes || '');
    } else {
      setName('');
      setMemberId(`MKT-${String(members.length + 1).padStart(3, '0')}`);
      setMobile('');
      setAddress('');
      setMonthlyContribution('500');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setStatus('active');
      setNotes('');
    }
  }, [memberToEdit, isOpen, members.length]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('সদস্যের নাম আবশ্যক', 'error');
      return;
    }
    const numMonthly = parseFloat(monthlyContribution) || 0;

    setIsSubmitting(true);
    let success = false;
    if (memberToEdit) {
      success = await updateMember({
        ...memberToEdit,
        name: name.trim(),
        member_id: memberId.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        monthly_contribution_amount: numMonthly,
        joining_date: joiningDate,
        status,
        notes: notes.trim()
      });
    } else {
      const res = await addMember({
        name: name.trim(),
        member_id: memberId.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        monthly_contribution_amount: numMonthly,
        joining_date: joiningDate,
        status,
        notes: notes.trim()
      });
      success = !!res;
    }
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">
              {memberToEdit ? 'সদস্যের তথ্য সম্পাদনা' : 'নতুন সদস্য নিবন্ধন'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                সদস্যের নাম <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: হাজী মোঃ শামসুল হক"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                সদস্য নম্বর / আইডি <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="MKT-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                মোবাইল নম্বর:
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="০১৭১১-XXXXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                মাসিক অবদানের হার (৳):
              </label>
              <input
                type="number"
                min="0"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-bold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              গ্রাম / ঠিকানা:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="যেমন: পূর্বপাড়া, চর রাধানগর"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                যোগদানের তারিখ:
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                স্ট্যাটাস:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              >
                <option value="active">সক্রিয় (Active)</option>
                <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              বিশেষ নোট / মন্তব্য:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: প্রতিষ্ঠাতা সদস্য বা উপদেষ্টা"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : (memberToEdit ? 'হালনাগাদ করুন' : 'নিবন্ধন সম্পন্ন করুন')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// ==========================================
// 5. ACCOUNT TRANSFER MODAL (তহবিল স্থানান্তর)
// ==========================================
export interface AccountTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountTransferModal: React.FC<AccountTransferModalProps> = ({ isOpen, onClose }) => {
  const { transferFunds, showToast, cashBalance, bankBalance, mobileWalletBalance } = useMaktab();

  const [fromAccount, setFromAccount] = useState<PaymentMethod>('cash');
  const [toAccount, setToAccount] = useState<PaymentMethod>('bank');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন', 'error');
      return;
    }
    if (fromAccount === toAccount) {
      showToast('উৎস হিসাব এবং গন্তব্য হিসাব ভিন্ন হতে হবে', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await transferFunds({
      from_account: fromAccount,
      to_account: toAccount,
      amount: numAmount,
      date,
      note: note.trim()
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">অভ্যন্তরীণ তহবিল স্থানান্তর (Account Transfer)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
            <div className="font-semibold mb-1">বর্তমান হিসাব স্থিতি:</div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div>ক্যাশ: ৳{cashBalance.toLocaleString()}</div>
              <div>ব্যাংক: ৳{bankBalance.toLocaleString()}</div>
              <div>মোবাইল: ৳{mobileWalletBalance.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                উৎস হিসাব (From):
              </label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              >
                <option value="cash">হাতে নগদ (Cash)</option>
                <option value="bank">ব্যাংক (Bank)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                গন্তব্য হিসাব (To):
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              >
                <option value="bank">ব্যাংক (Bank)</option>
                <option value="cash">হাতে নগদ (Cash)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                স্থানান্তরের পরিমাণ (৳) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="যেমন: 5000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                তারিখ:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              বিবরণ / কারণ (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: ক্যাশ টাকা ব্যাংকে জমা বা বিকাশ ক্যাশআউট"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'স্থানান্তর হচ্ছে...' : 'স্থানান্তর সম্পন্ন করুন'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

