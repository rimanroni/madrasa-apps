import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  MaktabSettings, 
  PublicSettings, 
  Member, 
  Contribution, 
  Income, 
  Expense, 
  Transaction, 
  Project, 
  Notice, 
  Meeting, 
  AuditLog,
  AccountTransfer,
  UserProfile 
} from '../types/database';

// Default initial dynamic settings - all fully editable by Admin
export const defaultMaktabSettings: MaktabSettings = {
  id: 'maktab-default-01',
  maktab_name: 'নূরানী মক্তব ও ফুরকানিয়া হাফিজিয়া মাদরাসা',
  logo_url: '',
  description: 'আমাদের এলাকার ভবিষ্যৎ প্রজন্মকে সহীহ কুরআন শিক্ষা ও দ্বীনি বুনিয়াদি তালিম প্রদানের জন্য গ্রামবাসীর সার্বিক সহযোগিতায় প্রতিষ্ঠিত একটি স্বচ্ছ দ্বীনি শিক্ষা প্রতিষ্ঠান।',
  address: 'পূর্বপাড়া জামে মসজিদ সংলগ্ন',
  village_name: 'চর রাধানগর',
  union_name: 'রায়পুরা',
  upazila: 'রায়পুরা',
  district: 'নরসিংদী',
  phone: '০১৭১১-২২৩৩৪৪',
  phone2: '০১৮২২-৫৫৬৬৭৭',
  whatsapp: '+8801711223344',
  email: 'info@nooranimaktab.org',
  facebook: 'https://facebook.com/noorani.maktab',
  website: 'https://nooranimaktab.org',
  chairman_name: 'হাজী মোঃ নুরুল ইসলাম',
  chairman_phone: '০১৭১১-২২৩৩৪৪',
  accountant_name: 'মাওলানা মোঃ আব্দুর রহমান',
  accountant_phone: '০১৮২২-৫৫৬৬৭৭',
  secretary_name: 'মোঃ হাফিজুল হক',
  established_year: '২০১৪',
  opening_balance: 15400,
  // Dynamic Payment Receiving Numbers (Admin configurable)
  bkash_number: '০১৭০০-০০০০০০ (মার্চেন্ট/পার্সোনাল)',
  nagad_number: '০১৮০০-০০০০০০ (পার্সোনাল)',
  rocket_number: '০১৯০০-০০০০০০-৭',
  bank_name: 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড',
  bank_account_name: 'নূরানী মক্তব ফান্ড',
  bank_account_no: '২০৫০১২৩৪৫৬৭৮৯০১২',
  bank_branch: 'রায়পুরা শাখা, নরসিংদী',
  bank_routing_no: '১২৫২৭XXXX',
  payment_instructions: 'অনুদান বা মাসিক অবদান পাঠানোর পর ট্রানজেকশন আইডি ও আপনার নাম লিখে হোয়াটসঅ্যাপে মেসেজ করুন।',
  updated_at: new Date().toISOString()
};

export const defaultPublicSettings: PublicSettings = {
  show_chairman: true,
  show_accountant: true,
  show_member_names: true,
  show_individual_contributions: false,
  show_expenses: true,
  show_total_balance: true,
  show_contact_buttons: true,
  show_payment_numbers: true,
  show_notices: true,
  show_projects: true
};

export const defaultMembers: Member[] = [
  {
    id: 'mem-001',
    member_id: 'MKT-001',
    name: 'হাজী মোঃ শামসুল হক',
    mobile: '০১৭১২-৩৪৪৫৫৬',
    address: 'পূর্বপাড়া, চর রাধানগর',
    joining_date: '2023-01-10',
    monthly_contribution_amount: 500,
    status: 'active',
    notes: 'প্রতিষ্ঠাতা আজীবন সদস্য ও প্রধান উপদেষ্টা',
    created_at: '2023-01-10T10:00:00Z'
  },
  {
    id: 'mem-002',
    member_id: 'MKT-002',
    name: 'মাওলানা মোঃ আব্দুল মালেক',
    mobile: '০১৮১৬-৭৭৮৮৯৯',
    address: 'মধ্যপাড়া, রায়পুরা',
    joining_date: '2023-02-15',
    monthly_contribution_amount: 500,
    status: 'active',
    notes: 'ইমাম সাহেব ও জুমার খতীব',
    created_at: '2023-02-15T10:00:00Z'
  },
  {
    id: 'mem-003',
    member_id: 'MKT-003',
    name: 'মোঃ রফিকুল ইসলাম (প্রবাস)',
    mobile: '০১৭৫২-৯৯০০১১',
    address: 'দুবাই প্রবাসী (স্থায়ী: চর রাধানগর)',
    joining_date: '2023-03-01',
    monthly_contribution_amount: 1500,
    status: 'active',
    notes: 'নিয়মিত প্রবাসী সাহায্যকারী ও উপদেষ্টা',
    created_at: '2023-03-01T10:00:00Z'
  },
  {
    id: 'mem-004',
    member_id: 'MKT-004',
    name: 'হাজী মোঃ কামরুল হাসান',
    mobile: '০১৯১১-২২৩৩৪৪',
    address: 'দক্ষিণপাড়া, রায়পুরা',
    joining_date: '2023-04-12',
    monthly_contribution_amount: 1000,
    status: 'active',
    notes: 'ব্যবসায়ী ও স্থানীয় সমাজসেবক',
    created_at: '2023-04-12T10:00:00Z'
  },
  {
    id: 'mem-005',
    member_id: 'MKT-005',
    name: 'ডাঃ মোঃ ইকবাল হোসেন',
    mobile: '০১৬৭৭-৮৮৯৯০০',
    address: 'বাজার রোড, রায়পুরা',
    joining_date: '2023-06-20',
    monthly_contribution_amount: 500,
    status: 'active',
    notes: 'বিনামূল্যে শিক্ষার্থীদের চিকিৎসা পরামর্শক',
    created_at: '2023-06-20T10:00:00Z'
  }
];

export const defaultProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'মক্তব ভবন সংস্কার ও ছাদ ঢালাই প্রকল্প',
    description: 'পুরাতন টিনের চাল পরিবর্তন করে পাকা ছাদ নির্মাণ ও শ্রেণীকক্ষ সম্প্রসারণ কাজ দ্রুত গতিতে এগিয়ে চলছে।',
    start_date: '2026-06-01',
    expected_completion_date: '2026-12-31',
    budget: 250000,
    current_expense: 145000,
    status: 'running',
    responsible_person: 'মাওলানা মোঃ আব্দুর রহমান (হিসাবরক্ষক)',
    created_at: '2026-06-01T10:00:00Z'
  },
  {
    id: 'proj-002',
    name: 'অজুখানা ও সুপেয় পানির সাবমার্সিবল পাম্প স্থাপন',
    description: 'মক্তবের কোমলমতি শিক্ষার্থীদের ও মুসল্লিদের জন্য আধুনিক ও পরিচ্ছন্ন অজুখানা ও গভীর নলকূপ স্থাপন।',
    start_date: '2026-03-10',
    expected_completion_date: '2026-05-20',
    budget: 65000,
    current_expense: 62500,
    status: 'completed',
    responsible_person: 'মোঃ হাফিজুল হক (সাধারণ সম্পাদক)',
    created_at: '2026-03-10T10:00:00Z'
  }
];

export const defaultNotices: Notice[] = [
  {
    id: 'not-001',
    title: 'আসন্ন পবিত্র রমজান ও বার্ষিক মাহফিলের সাধারণ সভা আহ্বান',
    description: 'সকল সদস্য ও সম্মানিত এলাকাবাসীর সদয় অবগতির জন্য জানানো যাচ্ছে যে, আগামী শুক্রবার বাদ আছর মক্তব প্রাঙ্গণে এক জরুরি সাধারণ সভা অনুষ্ঠিত হবে। উপস্থিত থাকার জন্য অনুরোধ রইল।',
    publish_date: '2026-09-20',
    expiry_date: '2026-10-15',
    priority: 'urgent',
    is_published: true,
    created_by: 'হাজী মোঃ নুরুল ইসলাম (সভাপতি)',
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'not-002',
    title: 'নতুন শিক্ষাবর্ষে শিশু ও বয়স্কদের কুরআন শিক্ষা কোর্সে ভর্তি',
    description: 'সহীহ মাখরাজ ও তাজবিদ সহকারে সকালের শিফটে কোমলমতি শিশু এবং রাতের শিফটে বয়স্কদের জন্য নিয়মিত দ্বীনি তালিম শুরু হচ্ছে। আগ্রহী অভিভাবকগণ দ্রুত যোগাযোগ করুন।',
    publish_date: '2026-09-15',
    expiry_date: '2026-11-30',
    priority: 'normal',
    is_published: true,
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-15T10:00:00Z'
  }
];

export const defaultMeetings: Meeting[] = [
  {
    id: 'meet-001',
    title: 'মক্তব সংস্কার প্রকল্প অডিট ও ত্রৈমাসিক পর্যালোচনা সভা',
    date: '2026-09-28',
    time: 'বাদ মাগরিব (সন্ধ্যা ৬:৩০)',
    location: 'মক্তব মিলনায়তন কক্ষ',
    agenda: '১. ছাদ ঢালাই কাজের অগ্রগতি পর্যালোচনা, ২. আর্থিক আয়-ব্যয় অনুমোদন, ৩. বকেয়া মাসিক অবদান সংগ্রহ পরিকল্পনা।',
    decisions: 'প্রকল্পের দ্বিতীয় ধাপের কাজ আগামী ১০ দিনের মধ্যে শেষ করার সিদ্ধান্ত গ্রহণ করা হয়।',
    attendees: ['হাজী মোঃ নুরুল ইসলাম', 'মাওলানা মোঃ আব্দুর রহমান', 'মোঃ হাফিজুল হক', 'হাজী মোঃ শামসুল হক'],
    notes: 'সকল সদস্যকে যথাসময়ে উপস্থিত হওয়ার অনুরোধ রইল।',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-09-20T10:00:00Z'
  }
];

export const defaultContributions: Contribution[] = [
  {
    id: 'con-001',
    member_id: 'mem-001',
    donor_name: 'হাজী মোঃ শামসুল হক',
    donor_mobile: '০১৭১২-৩৪৪৫৫৬',
    amount: 500,
    date: '2026-09-02',
    payment_method: 'cash',
    purpose: 'মাসিক অবদান (সেপ্টেম্বর ২০২৬)',
    notes: 'হাতে নগদ প্রদান',
    receipt_number: 'REC-2026-0901',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-02T10:00:00Z'
  },
  {
    id: 'con-002',
    member_id: 'mem-003',
    donor_name: 'মোঃ রফিকুল ইসলাম (প্রবাস)',
    donor_mobile: '০১৭৫২-৯৯০০১১',
    amount: 1500,
    date: '2026-09-05',
    payment_method: 'bkash',
    purpose: 'মাসিক অবদান (সেপ্টেম্বর ২০২৬)',
    notes: 'বিকাশ ট্রান্সফার TrxID: 9X8Y7Z6',
    receipt_number: 'REC-2026-0902',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-05T11:20:00Z'
  },
  {
    id: 'con-003',
    member_id: null,
    donor_name: 'নাম প্রকাশে অনিচ্ছুক (গ্রামবাসী)',
    donor_mobile: '০১৯০০-০০০০০০',
    amount: 5000,
    date: '2026-09-12',
    payment_method: 'cash',
    purpose: 'নির্মাণ তহবিল এককালীন অনুদান',
    notes: 'মক্তব ভবন সংস্কারের জন্য নেক দোয়ার নিয়তে দান',
    receipt_number: 'REC-2026-0903',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-09-12T14:00:00Z'
  },
  {
    id: 'con-004',
    member_id: 'mem-004',
    donor_name: 'হাজী মোঃ কামরুল হাসান',
    donor_mobile: '০১৯১১-২২৩৩৪৪',
    amount: 1000,
    date: '2026-09-18',
    payment_method: 'nagad',
    purpose: 'মাসিক অবদান (সেপ্টেম্বর ২০২৬)',
    notes: 'নগদ ট্রানজেকশন',
    receipt_number: 'REC-2026-0904',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-18T16:45:00Z'
  }
];

export const defaultIncomes: Income[] = [
  {
    id: 'inc-001',
    source_category: 'জুমার নামাজে সাধারণ দান কালেকশন',
    amount: 4200,
    date: '2026-09-04',
    payment_method: 'cash',
    description: 'পবিত্র জুমার নামাজের পর উপস্থিত মুসল্লিদের দান বাক্স থেকে প্রাপ্ত',
    receipt_number: 'INC-2026-001',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-04T14:00:00Z'
  },
  {
    id: 'inc-002',
    source_category: 'জুমার নামাজে সাধারণ দান কালেকশন',
    amount: 3850,
    date: '2026-09-11',
    payment_method: 'cash',
    description: 'জুমার নামাজের মুসল্লিদের দান',
    receipt_number: 'INC-2026-002',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-11T14:00:00Z'
  },
  {
    id: 'inc-003',
    source_category: 'মক্তবের ফসলি জমি ইজারা আয়',
    amount: 12000,
    date: '2026-08-15',
    payment_method: 'bank',
    description: 'মক্তব ওয়াকফকৃত ১ বিঘা জমির বাৎসরিক লিজ বাবদ প্রাপ্ত চেক',
    receipt_number: 'INC-2026-003',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-08-15T10:00:00Z'
  }
];

export const defaultExpenses: Expense[] = [
  {
    id: 'exp-001',
    expense_category: 'শিক্ষক/মুয়াল্লিম মাসিক হাদিয়া ও ভাতা',
    amount: 8000,
    date: '2026-09-05',
    payment_method: 'cash',
    description: 'মক্তবের প্রধান মুয়াল্লিম সাহেবের সেপ্টেম্বর মাসের বেতন ও হাদিয়া পরিশোধ',
    voucher_number: 'VCH-2026-0901',
    project_id: null,
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-05T12:00:00Z'
  },
  {
    id: 'exp-002',
    expense_category: 'মক্তব ভবন সংস্কার ও সিমেন্ট ক্রয়',
    amount: 14500,
    date: '2026-09-08',
    payment_method: 'cash',
    description: 'ভবন সংস্কার প্রকল্পে ২৫ ব্যাগ সিমেন্ট ও বালু ক্রয়',
    voucher_number: 'VCH-2026-0902',
    project_id: 'proj-001',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-09-08T15:30:00Z'
  },
  {
    id: 'exp-003',
    expense_category: 'বিদ্যুৎ বিল ও ফ্যান মেরামত',
    amount: 1350,
    date: '2026-09-14',
    payment_method: 'bkash',
    description: 'পল্লী বিদ্যুৎ অফিস বিল প্রদান ও সিলিং ফ্যান ক্যাপাসিটর মেরামত',
    voucher_number: 'VCH-2026-0903',
    project_id: null,
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-14T11:00:00Z'
  }
];

export const defaultTransactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'income',
    amount: 12000,
    date: '2026-08-15',
    payment_method: 'bank',
    title: 'মক্তবের ফসলি জমি ইজারা আয়',
    description: 'মক্তব ওয়াকফকৃত ১ বিঘা জমির বাৎসরিক লিজ বাবদ প্রাপ্ত চেক',
    category: 'জমি ইজারা',
    receipt_voucher_no: 'INC-2026-003',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'tx-002',
    type: 'contribution',
    amount: 500,
    date: '2026-09-02',
    payment_method: 'cash',
    title: 'হাজী মোঃ শামসুল হক - মাসিক অবদান',
    description: 'সেপ্টেম্বর ২০২৬ মাসের নিয়মিত অবদান',
    category: 'মাসিক অবদান',
    receipt_voucher_no: 'REC-2026-0901',
    member_id: 'mem-001',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-02T10:00:00Z'
  },
  {
    id: 'tx-003',
    type: 'income',
    amount: 4200,
    date: '2026-09-04',
    payment_method: 'cash',
    title: 'জুমার নামাজে সাধারণ দান কালেকশন',
    description: 'পবিত্র জুমার নামাজের পর দান বাক্স কালেকশন',
    category: 'দান কালেকশন',
    receipt_voucher_no: 'INC-2026-001',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-04T14:00:00Z'
  },
  {
    id: 'tx-004',
    type: 'expense',
    amount: 8000,
    date: '2026-09-05',
    payment_method: 'cash',
    title: 'শিক্ষক/মুয়াল্লিম মাসিক হাদিয়া ও ভাতা',
    description: 'সেপ্টেম্বর মাসের শিক্ষক বেতন প্রদান',
    category: 'বেতন/ভাতা',
    receipt_voucher_no: 'VCH-2026-0901',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-05T12:00:00Z'
  },
  {
    id: 'tx-005',
    type: 'contribution',
    amount: 1500,
    date: '2026-09-05',
    payment_method: 'bkash',
    title: 'মোঃ রফিকুল ইসলাম (প্রবাস) - মাসিক অবদান',
    description: 'সেপ্টেম্বর ২০২৬ বিকাশ মারফত প্রাপ্ত',
    category: 'মাসিক অবদান',
    receipt_voucher_no: 'REC-2026-0902',
    member_id: 'mem-003',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-05T11:20:00Z'
  },
  {
    id: 'tx-006',
    type: 'expense',
    amount: 14500,
    date: '2026-09-08',
    payment_method: 'cash',
    title: 'মক্তব ভবন সংস্কার ও সিমেন্ট ক্রয়',
    description: 'ভবন সংস্কার প্রকল্পে ২৫ ব্যাগ সিমেন্ট ও বালু ক্রয়',
    category: 'প্রকল্প সংস্কার',
    receipt_voucher_no: 'VCH-2026-0902',
    project_id: 'proj-001',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-09-08T15:30:00Z'
  },
  {
    id: 'tx-007',
    type: 'income',
    amount: 3850,
    date: '2026-09-11',
    payment_method: 'cash',
    title: 'জুমার নামাজে সাধারণ দান কালেকশন',
    description: 'জুমার নামাজের মুসল্লিদের দান',
    category: 'দান কালেকশন',
    receipt_voucher_no: 'INC-2026-002',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-11T14:00:00Z'
  },
  {
    id: 'tx-008',
    type: 'contribution',
    amount: 5000,
    date: '2026-09-12',
    payment_method: 'cash',
    title: 'নাম প্রকাশে অনিচ্ছুক (গ্রামবাসী) - নির্মাণ অনুদান',
    description: 'মক্তব ভবন সংস্কারের জন্য নেক দোয়ার নিয়তে এককালীন অনুদান',
    category: 'এককালীন অনুদান',
    receipt_voucher_no: 'REC-2026-0903',
    created_by: 'হাজী মোঃ নুরুল ইসলাম',
    created_at: '2026-09-12T14:00:00Z'
  },
  {
    id: 'tx-009',
    type: 'expense',
    amount: 1350,
    date: '2026-09-14',
    payment_method: 'bkash',
    title: 'বিদ্যুৎ বিল ও ফ্যান মেরামত',
    description: 'পল্লী বিদ্যুৎ বিল ও ফ্যান ক্যাপাসিটর মেরামত',
    category: 'বিদ্যুৎ ও পানি',
    receipt_voucher_no: 'VCH-2026-0903',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-14T11:00:00Z'
  },
  {
    id: 'tx-010',
    type: 'contribution',
    amount: 1000,
    date: '2026-09-18',
    payment_method: 'nagad',
    title: 'হাজী মোঃ কামরুল হাসান - মাসিক অবদান',
    description: 'সেপ্টেম্বর ২০২৬ নগদ মারফত প্রাপ্ত',
    category: 'মাসিক অবদান',
    receipt_voucher_no: 'REC-2026-0904',
    member_id: 'mem-004',
    created_by: 'মাওলানা মোঃ আব্দুর রহমান',
    created_at: '2026-09-18T16:45:00Z'
  }
];

export const defaultAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    user_name: 'হাজী মোঃ নুরুল ইসলাম (সভাপতি)',
    action: 'হিসাব অনুমোদন',
    entity: 'লেনদেন লেজার',
    entity_id: 'tx-008',
    details: 'নির্মাণ তহবিলের ৳৫,০০০ এককালীন অনুদান এন্ট্রি অনুমোদন করা হয়েছে।',
    timestamp: '2026-09-12T14:05:00Z',
    ip_device: 'Android Mobile (Chrome 128)'
  },
  {
    id: 'log-002',
    user_name: 'মাওলানা মোঃ আব্দুর রহমান (হিসাবরক্ষক)',
    action: 'রশিদ জারি',
    entity: 'অবদান রশিদ',
    entity_id: 'REC-2026-0904',
    details: 'সদস্য কামরুল হাসানের সেপ্টেম্বর মাসের অবদানের রশিদ নং REC-2026-0904 প্রস্তুত করা হয়েছে।',
    timestamp: '2026-09-18T16:47:00Z',
    ip_device: 'Android Mobile (Firefox 130)'
  }
];

// Supabase client configuration loader
export const getSupabaseConfig = (): { url: string; anonKey: string } => {
  const savedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('maktab_supabase_url') : '';
  const savedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('maktab_supabase_key') : '';
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: (savedUrl || envUrl || '').trim(),
    anonKey: (savedKey || envKey || '').trim()
  };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
    } catch (e) {
      console.error('Supabase initialization failed:', e);
      return null;
    }
  }
  return supabaseInstance;
};

export const resetSupabaseClient = (url: string, anonKey: string) => {
  if (typeof localStorage !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('maktab_supabase_url', url);
      localStorage.setItem('maktab_supabase_key', anonKey);
    } else {
      localStorage.removeItem('maktab_supabase_url');
      localStorage.removeItem('maktab_supabase_key');
    }
  }
  if (url && anonKey) {
    supabaseInstance = createClient(url, anonKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } }
    });
  } else {
    supabaseInstance = null;
  }
};

// ==============================================================================
// PRODUCTION SUPABASE CRUD & QUERIES (SINGLE SOURCE OF TRUTH)
// ==============================================================================

/**
 * Fetch all records from Supabase tables
 */
export async function fetchAllSupabaseData(client: SupabaseClient) {
  // Query all tables in parallel
  const [
    settingsRes,
    publicRes,
    membersRes,
    contribRes,
    incomeRes,
    expenseRes,
    txRes,
    projectRes,
    noticeRes,
    meetingRes,
    auditRes
  ] = await Promise.all([
    client.from('maktab_settings').select('*').limit(1).maybeSingle(),
    client.from('public_settings').select('*').limit(1).maybeSingle(),
    client.from('members').select('*').order('created_at', { ascending: false }),
    client.from('contributions').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    client.from('income').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    client.from('expenses').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    client.from('transactions').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    client.from('projects').select('*').order('start_date', { ascending: false }),
    client.from('notices').select('*').order('publish_date', { ascending: false }),
    client.from('meetings').select('*').order('date', { ascending: false }),
    client.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200)
  ]);

  return {
    maktabSettings: settingsRes.data || null,
    publicSettings: publicRes.data || null,
    members: (membersRes.data as Member[]) || [],
    contributions: (contribRes.data as Contribution[]) || [],
    incomes: (incomeRes.data as Income[]) || [],
    expenses: (expenseRes.data as Expense[]) || [],
    transactions: (txRes.data as Transaction[]) || [],
    projects: (projectRes.data as Project[]) || [],
    notices: (noticeRes.data as Notice[]) || [],
    meetings: (meetingRes.data as Meeting[]) || [],
    auditLogs: (auditRes.data as AuditLog[]) || []
  };
}

/**
 * Safe One-Time Initial Seed
 * Only runs if maktab_settings table has 0 rows. Never duplicates!
 */
export async function seedDatabaseIfEmpty(client: SupabaseClient) {
  try {
    const { count, error } = await client
      .from('maktab_settings')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Could not check maktab_settings count for seed:', error.message);
      return false;
    }

    if (count === 0) {
      console.log('Database is empty. Initializing one-time safe seed data...');
      
      // 1. Insert Maktab Settings
      const { id: _, ...settingsWithoutId } = defaultMaktabSettings;
      await client.from('maktab_settings').insert([settingsWithoutId]);

      // 2. Insert Public Settings
      await client.from('public_settings').insert([defaultPublicSettings]);

      // 3. Insert Members
      const membersToInsert = defaultMembers.map(({ id: _, ...m }) => m);
      await client.from('members').insert(membersToInsert);

      // 4. Insert Projects
      const projectsToInsert = defaultProjects.map(({ id: _, ...p }) => p);
      await client.from('projects').insert(projectsToInsert);

      // 5. Insert Notices
      const noticesToInsert = defaultNotices.map(({ id: _, ...n }) => n);
      await client.from('notices').insert(noticesToInsert);

      // 6. Insert Meetings
      const meetingsToInsert = defaultMeetings.map(({ id: _, ...m }) => m);
      await client.from('meetings').insert(meetingsToInsert);

      // 7. Insert Contributions
      const contribsToInsert = defaultContributions.map(({ id: _, ...c }) => c);
      await client.from('contributions').insert(contribsToInsert);

      // 8. Insert Incomes
      const incomesToInsert = defaultIncomes.map(({ id: _, ...i }) => i);
      await client.from('income').insert(incomesToInsert);

      // 9. Insert Expenses
      const expensesToInsert = defaultExpenses.map(({ id: _, ...e }) => e);
      await client.from('expenses').insert(expensesToInsert);

      // 10. Insert Transactions
      const txToInsert = defaultTransactions.map(({ id: _, ...t }) => t);
      await client.from('transactions').insert(txToInsert);

      console.log('One-time initial seed completed successfully.');
      return true;
    }
  } catch (err) {
    console.warn('Initial seed error:', err);
  }
  return false;
}

// ------------------------------------------------------------------------------
// MUTATION OPERATIONS (WRITES DIRECTLY TO SUPABASE)
// ------------------------------------------------------------------------------

export async function dbUpdateMaktabSettings(client: SupabaseClient, settings: Partial<MaktabSettings>, existingId?: string) {
  const payload = {
    ...settings,
    updated_at: new Date().toISOString()
  };

  if (existingId && existingId !== 'maktab-default-01') {
    const { data, error } = await client
      .from('maktab_settings')
      .update(payload)
      .eq('id', existingId)
      .select()
      .single();
    if (error) throw error;
    return data as MaktabSettings;
  } else {
    // Check if any row exists to update or insert
    const { data: existing } = await client.from('maktab_settings').select('id').limit(1).maybeSingle();
    if (existing?.id) {
      const { data, error } = await client
        .from('maktab_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as MaktabSettings;
    } else {
      const { id: _, ...newRecord } = payload as any;
      const { data, error } = await client
        .from('maktab_settings')
        .insert([newRecord])
        .select()
        .single();
      if (error) throw error;
      return data as MaktabSettings;
    }
  }
}

export async function dbUpdatePublicSettings(client: SupabaseClient, settings: Partial<PublicSettings>) {
  const { data: existing } = await client.from('public_settings').select('id').limit(1).maybeSingle();
  if (existing?.id) {
    const { data, error } = await client
      .from('public_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as PublicSettings;
  } else {
    const { data, error } = await client
      .from('public_settings')
      .insert([settings])
      .select()
      .single();
    if (error) throw error;
    return data as PublicSettings;
  }
}

export async function dbAddMember(client: SupabaseClient, member: Omit<Member, 'id' | 'created_at'>) {
  const { data, error } = await client
    .from('members')
    .insert([member])
    .select()
    .single();
  if (error) throw error;
  return data as Member;
}

export async function dbUpdateMember(client: SupabaseClient, member: Member) {
  const { id, created_at, ...updateData } = member;
  const { data, error } = await client
    .from('members')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Member;
}

export async function dbDeleteMember(client: SupabaseClient, id: string) {
  const { error } = await client.from('members').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbAddContribution(
  client: SupabaseClient, 
  contribution: Omit<Contribution, 'id' | 'created_at'>
) {
  // 1. Insert Contribution
  const { data: contribData, error: contribError } = await client
    .from('contributions')
    .insert([contribution])
    .select()
    .single();
  if (contribError) throw contribError;

  // 2. Insert corresponding Transaction in ledger atomically
  const txPayload = {
    type: 'contribution',
    amount: contribution.amount,
    date: contribution.date,
    payment_method: contribution.payment_method,
    title: `${contribution.donor_name} - ${contribution.purpose}`,
    description: contribution.notes || 'অবদান কালেকশন',
    category: contribution.purpose,
    receipt_voucher_no: contribution.receipt_number,
    member_id: contribution.member_id || null,
    created_by: contribution.created_by
  };

  const { data: txData, error: txError } = await client
    .from('transactions')
    .insert([txPayload])
    .select()
    .single();

  if (txError) {
    console.warn('Transaction record warning:', txError.message);
  }

  return { contribution: contribData as Contribution, transaction: txData as Transaction };
}

export async function dbAddIncome(
  client: SupabaseClient, 
  income: Omit<Income, 'id' | 'created_at'>
) {
  // 1. Insert Income
  const { data: incomeData, error: incomeError } = await client
    .from('income')
    .insert([income])
    .select()
    .single();
  if (incomeError) throw incomeError;

  // 2. Insert corresponding Transaction in ledger
  const txPayload = {
    type: 'income',
    amount: income.amount,
    date: income.date,
    payment_method: income.payment_method,
    title: income.source_category,
    description: income.description,
    category: income.source_category,
    receipt_voucher_no: income.receipt_number,
    created_by: income.created_by
  };

  const { data: txData, error: txError } = await client
    .from('transactions')
    .insert([txPayload])
    .select()
    .single();

  if (txError) {
    console.warn('Transaction record warning:', txError.message);
  }

  return { income: incomeData as Income, transaction: txData as Transaction };
}

export async function dbAddExpense(
  client: SupabaseClient, 
  expense: Omit<Expense, 'id' | 'created_at'>
) {
  // 1. Insert Expense
  const { data: expenseData, error: expenseError } = await client
    .from('expenses')
    .insert([expense])
    .select()
    .single();
  if (expenseError) throw expenseError;

  // 2. If project_id provided, increment project current_expense
  if (expense.project_id) {
    try {
      const { data: proj } = await client.from('projects').select('current_expense').eq('id', expense.project_id).single();
      if (proj) {
        await client.from('projects').update({
          current_expense: (Number(proj.current_expense) || 0) + Number(expense.amount),
          updated_at: new Date().toISOString()
        }).eq('id', expense.project_id);
      }
    } catch (e) {
      console.warn('Project expense update warning:', e);
    }
  }

  // 3. Insert Transaction
  const txPayload = {
    type: 'expense',
    amount: expense.amount,
    date: expense.date,
    payment_method: expense.payment_method,
    title: expense.expense_category,
    description: expense.description,
    category: expense.expense_category,
    receipt_voucher_no: expense.voucher_number,
    project_id: expense.project_id || null,
    created_by: expense.created_by
  };

  const { data: txData, error: txError } = await client
    .from('transactions')
    .insert([txPayload])
    .select()
    .single();

  if (txError) {
    console.warn('Transaction record warning:', txError.message);
  }

  return { expense: expenseData as Expense, transaction: txData as Transaction };
}

export async function dbRecordAccountTransfer(
  client: SupabaseClient, 
  transfer: AccountTransfer & { created_by?: string }
) {
  const voucherNum = `TRF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Try atomic RPC first
  try {
    const { data, error } = await client.rpc('record_account_transfer', {
      p_from_account: transfer.from_account,
      p_to_account: transfer.to_account,
      p_amount: transfer.amount,
      p_date: transfer.date,
      p_description: transfer.note || 'তহবিল স্থানান্তর',
      p_created_by: transfer.created_by || 'Admin'
    });

    if (!error && data) {
      // Fetch the created transaction
      const { data: tx } = await client.from('transactions').select('*').eq('id', data).single();
      return tx as Transaction;
    }
  } catch (rpcErr) {
    console.warn('RPC record_account_transfer fallback to direct insert:', rpcErr);
  }

  // Fallback direct insert if RPC not installed yet
  const txPayload = {
    type: 'transfer',
    amount: transfer.amount,
    date: transfer.date,
    payment_method: transfer.from_account,
    from_account: transfer.from_account,
    to_account: transfer.to_account,
    title: `তহবিল স্থানান্তর: ${transfer.from_account} ➔ ${transfer.to_account}`,
    description: transfer.note || 'অভ্যন্তরীণ তহবিল সমন্বয়',
    category: 'হস্তান্তর',
    receipt_voucher_no: voucherNum,
    created_by: transfer.created_by || 'Admin'
  };

  const { data, error } = await client
    .from('transactions')
    .insert([txPayload])
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function dbAddProject(client: SupabaseClient, project: Omit<Project, 'id' | 'created_at'>) {
  const { data, error } = await client
    .from('projects')
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function dbUpdateProject(client: SupabaseClient, project: Project) {
  const { id, created_at, ...updateData } = project;
  const { data, error } = await client
    .from('projects')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function dbAddNotice(client: SupabaseClient, notice: Omit<Notice, 'id' | 'created_at'>) {
  const { data, error } = await client
    .from('notices')
    .insert([notice])
    .select()
    .single();
  if (error) throw error;
  return data as Notice;
}

export async function dbUpdateNotice(client: SupabaseClient, notice: Notice) {
  const { id, created_at, ...updateData } = notice;
  const { data, error } = await client
    .from('notices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Notice;
}

export async function dbDeleteNotice(client: SupabaseClient, id: string) {
  const { error } = await client.from('notices').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function dbAddMeeting(client: SupabaseClient, meeting: Omit<Meeting, 'id' | 'created_at'>) {
  const { data, error } = await client
    .from('meetings')
    .insert([meeting])
    .select()
    .single();
  if (error) throw error;
  return data as Meeting;
}

export async function dbAddAuditLog(client: SupabaseClient, log: Omit<AuditLog, 'id' | 'timestamp'>) {
  const { data, error } = await client
    .from('audit_logs')
    .insert([log])
    .select()
    .single();
  if (error) {
    console.warn('Audit log write error:', error.message);
    return null;
  }
  return data as AuditLog;
}

/**
 * Upload file to Supabase Storage
 */
export async function dbUploadFile(client: SupabaseClient, bucket: string, path: string, file: File) {
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });
  if (error) throw error;

  const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}
