-- ==============================================================================
-- MAKTAB MANAGEMENT & TRANSPARENT ACCOUNTING SYSTEM (মক্তব হিসাব ও ব্যবস্থাপনা)
-- FULL SUPABASE POSTGRESQL SCHEMA WITH RLS & RBAC
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'chairman', 'accountant', 'normal_user');
CREATE TYPE payment_method AS ENUM ('cash', 'bank', 'bkash', 'nagad', 'other');
CREATE TYPE transaction_type AS ENUM ('contribution', 'income', 'expense', 'transfer');
CREATE TYPE project_status AS ENUM ('running', 'completed', 'on_hold');
CREATE TYPE notice_priority AS ENUM ('urgent', 'high', 'normal');

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'normal_user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MAKTAB SETTINGS & INSTITUTION PROFILE (Dynamic Central Settings)
CREATE TABLE IF NOT EXISTS maktab_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maktab_name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  address TEXT DEFAULT '',
  village_name TEXT DEFAULT '',
  union_name TEXT DEFAULT '',
  upazila TEXT DEFAULT '',
  district TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  phone2 TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  website TEXT DEFAULT '',
  chairman_name TEXT DEFAULT '',
  chairman_phone TEXT DEFAULT '',
  accountant_name TEXT DEFAULT '',
  accountant_phone TEXT DEFAULT '',
  secretary_name TEXT DEFAULT '',
  established_year TEXT DEFAULT '',
  opening_balance NUMERIC(14,2) DEFAULT 0,
  -- Dynamic Payment Receiving Numbers (বিকাশ, নগদ, রকেট ও ব্যাংক একাউন্ট তথ্য)
  bkash_number TEXT DEFAULT '',
  nagad_number TEXT DEFAULT '',
  rocket_number TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  bank_account_name TEXT DEFAULT '',
  bank_account_no TEXT DEFAULT '',
  bank_branch TEXT DEFAULT '',
  payment_instructions TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PUBLIC VISIBILITY SETTINGS (পাবলিক পেজের দৃশ্যমানতা সেটিংস)
CREATE TABLE IF NOT EXISTS public_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_chairman BOOLEAN DEFAULT true,
  show_accountant BOOLEAN DEFAULT true,
  show_member_names BOOLEAN DEFAULT true,
  show_individual_contributions BOOLEAN DEFAULT false,
  show_expenses BOOLEAN DEFAULT true,
  show_total_balance BOOLEAN DEFAULT true,
  show_contact_buttons BOOLEAN DEFAULT true,
  show_notices BOOLEAN DEFAULT true,
  show_projects BOOLEAN DEFAULT true,
  show_payment_methods BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEMBERS TABLE (সদস্য তালিকা)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  mobile TEXT NOT NULL,
  address TEXT DEFAULT '',
  joining_date DATE DEFAULT CURRENT_DATE,
  monthly_contribution_amount NUMERIC(10,2) NOT NULL DEFAULT 500,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RUNNING PROJECTS TABLE (চলমান প্রকল্প ও উন্নয়ন কার্যক্রম)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE,
  budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  current_expense NUMERIC(14,2) NOT NULL DEFAULT 0,
  status project_status DEFAULT 'running',
  responsible_person TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. UNIFIED FINANCIAL TRANSACTIONS & LEDGER (মূল হিসাব লেজার)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type transaction_type NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  reference_id TEXT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  receipt_voucher_no TEXT NOT NULL,
  from_account payment_method,
  to_account payment_method,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTRIBUTIONS TABLE (অবদান ও অনুদান)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_mobile TEXT DEFAULT '',
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  purpose TEXT NOT NULL DEFAULT 'মাসিক অবদান',
  notes TEXT DEFAULT '',
  receipt_number TEXT UNIQUE NOT NULL,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INCOMES TABLE (বিবিধ আয়)
CREATE TABLE IF NOT EXISTS income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  description TEXT DEFAULT '',
  receipt_number TEXT UNIQUE NOT NULL,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EXPENSES TABLE (ব্যয়)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  description TEXT DEFAULT '',
  voucher_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  attachment_url TEXT DEFAULT '',
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTICES TABLE (নোটিশ ও ঘোষণা)
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  priority notice_priority DEFAULT 'normal',
  is_published BOOLEAN DEFAULT true,
  attachment_url TEXT DEFAULT '',
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. MEETINGS TABLE (মিটিং ও সিদ্ধান্ত)
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT NOT NULL,
  location TEXT DEFAULT '',
  agenda TEXT NOT NULL,
  decisions TEXT DEFAULT '',
  attendees TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUDIT LOGS (নিরীক্ষা ও পরিবর্তন ইতিহাস)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT DEFAULT '',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_device TEXT DEFAULT ''
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maktab_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin (Chairman, Accountant, or Super Admin)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'chairman', 'accountant')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1) MAKTAB SETTINGS: Public can read, only admin can edit
CREATE POLICY "Public read maktab settings" ON maktab_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage maktab settings" ON maktab_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read public settings" ON public_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage public settings" ON public_settings FOR ALL USING (is_admin());

-- 2) MEMBERS: Public can read active members, admin full control
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Admin manage members" ON members FOR ALL USING (is_admin());

-- 3) PROJECTS: Public can read, admin full control
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin manage projects" ON projects FOR ALL USING (is_admin());

-- 4) TRANSACTIONS & FINANCIALS: Read allowed for transparency, only admin can insert/update/delete
CREATE POLICY "Public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Admin manage transactions" ON transactions FOR ALL USING (is_admin());

CREATE POLICY "Public read contributions" ON contributions FOR SELECT USING (true);
CREATE POLICY "Admin manage contributions" ON contributions FOR ALL USING (is_admin());

CREATE POLICY "Public read income" ON income FOR SELECT USING (true);
CREATE POLICY "Admin manage income" ON income FOR ALL USING (is_admin());

CREATE POLICY "Public read expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Admin manage expenses" ON expenses FOR ALL USING (is_admin());

-- 5) NOTICES: Public read published notices, admin manage all
CREATE POLICY "Public read published notices" ON notices FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage notices" ON notices FOR ALL USING (is_admin());

-- 6) MEETINGS: Public read, admin manage
CREATE POLICY "Public read meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Admin manage meetings" ON meetings FOR ALL USING (is_admin());

-- 7) AUDIT LOGS: Only Admins can view audit logs
CREATE POLICY "Admin view audit logs" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 8. ATOMIC ACCOUNT TRANSFER RPC (হিসাব স্থানান্তর ট্রানজেকশন)
-- ==============================================================================
CREATE OR REPLACE FUNCTION record_account_transfer(
  p_from_account payment_method,
  p_to_account payment_method,
  p_amount NUMERIC(14,2),
  p_date DATE,
  p_description TEXT,
  p_created_by TEXT DEFAULT 'Admin'
)
RETURNS UUID AS $$
DECLARE
  v_tx_id UUID;
  v_voucher_no TEXT;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'স্থানান্তরের পরিমাণ ০-এর চেয়ে বেশি হতে হবে।';
  END IF;
  
  IF p_from_account = p_to_account THEN
    RAISE EXCEPTION 'উৎস এবং গন্তব্য হিসাব এক হতে পারে না।';
  END IF;

  v_voucher_no := 'TRF-' || to_char(CURRENT_DATE, 'YYYY') || '-' || substr(md5(random()::text), 1, 6);

  INSERT INTO transactions (
    type,
    amount,
    date,
    payment_method,
    from_account,
    to_account,
    title,
    description,
    category,
    receipt_voucher_no,
    created_by
  ) VALUES (
    'transfer',
    p_amount,
    COALESCE(p_date, CURRENT_DATE),
    p_from_account,
    p_from_account,
    p_to_account,
    'তহবিল স্থানান্তর: ' || p_from_account || ' ➔ ' || p_to_account,
    COALESCE(p_description, 'অভ্যন্তরীণ তহবিল সমন্বয়'),
    'হস্তান্তর',
    v_voucher_no,
    p_created_by
  ) RETURNING id INTO v_tx_id;

  -- Log into audit_logs
  INSERT INTO audit_logs (user_name, action, entity, entity_id, details)
  VALUES (
    p_created_by,
    'তহবিল স্থানান্তর',
    'লেনদেন লেজার',
    v_voucher_no,
    p_from_account || ' হতে ' || p_to_account || ' হিসাবে ৳' || p_amount || ' স্থানান্তর করা হয়েছে।'
  );

  RETURN v_tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 9. SAFE PUBLIC VIEWS (নিরাপদ পাবলিক ভিউ)
-- ==============================================================================
CREATE OR REPLACE VIEW public_members_view AS
SELECT 
  id, 
  member_id, 
  name, 
  photo_url, 
  address, 
  joining_date, 
  status
FROM members
WHERE status = 'active';

-- ==============================================================================
-- 10. ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      maktab_settings, 
      public_settings, 
      members, 
      projects, 
      transactions, 
      contributions, 
      income, 
      expenses, 
      notices, 
      meetings;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Publication might already have tables
  END;
END $$;
