export type UserRole = 'super_admin' | 'chairman' | 'accountant' | 'normal_user';

export type PaymentMethod = 'cash' | 'bank' | 'bkash' | 'nagad' | 'other';

export interface MaktabSettings {
  id: string;
  maktab_name: string;
  logo_url: string;
  description: string;
  address: string;
  village_name: string;
  union_name: string;
  upazila: string;
  district: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  facebook: string;
  website: string;
  chairman_name: string;
  chairman_phone: string;
  accountant_name: string;
  accountant_phone: string;
  secretary_name: string;
  established_year: string;
  opening_balance: number;
  // Dynamic Payment Receiving Numbers (Different from Creator phone)
  bkash_number: string;
  nagad_number: string;
  rocket_number: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_no: string;
  bank_branch: string;
  bank_routing_no: string;
  payment_instructions: string;
  updated_at: string;
}

export interface PublicSettings {
  show_chairman: boolean;
  show_accountant: boolean;
  show_member_names: boolean;
  show_individual_contributions: boolean;
  show_expenses: boolean;
  show_total_balance: boolean;
  show_contact_buttons: boolean;
  show_payment_numbers: boolean;
  show_notices: boolean;
  show_projects: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Member {
  id: string;
  member_id: string;
  name: string;
  photo_url?: string;
  mobile: string;
  address: string;
  joining_date: string;
  monthly_contribution_amount: number;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
}

export interface Contribution {
  id: string;
  member_id?: string | null;
  donor_name: string;
  donor_mobile: string;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  purpose: string;
  notes?: string;
  receipt_number: string;
  created_by: string;
  created_at: string;
}

export interface Income {
  id: string;
  source_category: string;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  description: string;
  receipt_number: string;
  created_by: string;
  created_at: string;
}

export interface Expense {
  id: string;
  expense_category: string;
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  description: string;
  voucher_number: string;
  project_id?: string | null;
  attachment_url?: string;
  created_by: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: 'contribution' | 'income' | 'expense' | 'transfer';
  amount: number;
  date: string;
  payment_method: PaymentMethod;
  from_account?: PaymentMethod;
  to_account?: PaymentMethod;
  reference_id?: string;
  title: string;
  description: string;
  category: string;
  receipt_voucher_no: string;
  member_id?: string | null;
  project_id?: string | null;
  created_by: string;
  created_at: string;
}

export interface AccountTransfer {
  from_account: PaymentMethod;
  to_account: PaymentMethod;
  amount: number;
  date: string;
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  expected_completion_date: string;
  budget: number;
  current_expense: number;
  status: 'running' | 'completed' | 'on_hold';
  responsible_person: string;
  cover_image?: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  publish_date: string;
  expiry_date?: string;
  priority: 'urgent' | 'high' | 'normal';
  is_published: boolean;
  attachment_url?: string;
  created_by: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
  decisions: string;
  attendees: string[];
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_name: string;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  timestamp: string;
  ip_device?: string;
}
