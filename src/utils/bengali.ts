/**
 * Bengali language and numeral formatting utilities
 */

const englishToBengaliDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const toBengaliNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '০';
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => englishToBengaliDigits[digit] || digit);
};

export const formatTaka = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '৳ ০';
  const formattedEnglish = Math.abs(amount).toLocaleString('en-IN');
  const bNum = toBengaliNumber(formattedEnglish);
  return amount < 0 ? `-৳ ${bNum}` : `৳ ${bNum}`;
};

export const formatBengaliDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = toBengaliNumber(date.getDate());
    const year = toBengaliNumber(date.getFullYear());
    
    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const month = banglaMonths[date.getMonth()];
    
    return `${day} ${month}, ${year}`;
  } catch {
    return dateString;
  }
};

export const getPaymentMethodName = (method: string): string => {
  switch (method) {
    case 'cash':
      return 'ক্যাশ / নগদ হাতে';
    case 'bank':
      return 'ব্যাংক হিসাব';
    case 'bkash':
      return 'বিকাশ (bKash)';
    case 'nagad':
      return 'নগদ (Nagad)';
    default:
      return 'অন্যান্য';
  }
};

export const getPriorityBadge = (priority: string): { label: string; color: string } => {
  switch (priority) {
    case 'urgent':
      return { label: 'জরুরি নোটিশ', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    case 'high':
      return { label: 'গুরুত্বপূর্ণ', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    default:
      return { label: 'সাধারণ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  }
};

export const getProjectStatusBadge = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'running':
      return { label: 'চলমান', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'completed':
      return { label: 'সম্পন্ন', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    case 'on_hold':
      return { label: 'স্থগিত', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    default:
      return { label: status, color: 'text-slate-600 bg-slate-50 border-slate-200' };
  }
};

export const numberToBengaliWords = (num: number): string => {
  // Simple word generator for receipts
  if (num === 0) return 'শূন্য টাকা মাত্র';
  return `${toBengaliNumber(num)} টাকা মাত্র`;
};
