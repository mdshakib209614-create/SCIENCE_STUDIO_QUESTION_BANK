-- ==============================================================================
-- 🚀 SCIENCE STUDIO - COMPLETE PRODUCTION SUPABASE BACKEND & DATABASE SCHEMA
-- ==============================================================================
-- This complete SQL script sets up:
-- 1. Extensions (pgcrypto, uuid-ossp)
-- 2. Authentication & Admin Profiles (linked to auth.users)
-- 3. Institution Profile, Signatures, Seals, & Watermark Settings
-- 4. Students Database (Personal, Academic, Financial)
-- 5. Teachers & Staff Database
-- 6. Question Bank (MCQ, CQ Stimulus + Sub-questions, Short Grammar & Board Questions)
-- 7. Saved Question Papers Archive (Full Booklet/Portrait Exam Papers)
-- 8. Saved Admit Cards Archive (Landscape Admit Cards)
-- 9. Saved Certificates & Testimonials Archive (Transcripts, Character, Testimonials)
-- 10. Exam Routines & Schedules
-- 11. Student Results & Marksheets
-- 12. Fee Management & Transactions
-- 13. Institutional Notice Board & Emergency Announcements
-- 14. Supabase Storage Buckets (Logos, Signatures, Photos, PDF Archives)
-- 15. Complete Row Level Security (RLS) Policies & Auto-Updated Timestamp Triggers
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. USER PROFILES & AUTHENTICATION (Linked to Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Sakib Ahmed',
  email TEXT,
  phone TEXT DEFAULT '01700-000000',
  role TEXT NOT NULL DEFAULT 'Founder & Director',
  avatar_url TEXT DEFAULT '/src/assets/images/admin_avatar_1791955080118.jpg',
  bio TEXT DEFAULT 'Founder of Science Studio & Educational Academic Administrator',
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatic trigger to create a public.profiles row when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Admin User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Admin'),
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 3. INSTITUTION PROFILE, LOGO, SIGNATURES & WATERMARK SETTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn TEXT NOT NULL DEFAULT 'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
  name_en TEXT NOT NULL DEFAULT 'Kolabaria Model Academy & Coaching Center',
  slogan TEXT DEFAULT 'জ্ঞানেই শক্তি, শিক্ষাই মুক্তি',
  established TEXT DEFAULT '১৯৯৮',
  village TEXT DEFAULT 'কলাবাড়িয়া',
  post_office TEXT DEFAULT 'কলাবাড়িয়া',
  upazila TEXT DEFAULT 'সেনবাগ',
  district TEXT DEFAULT 'নোয়াখালী',
  emis_no TEXT DEFAULT '১৩৪৫৮৯',
  ipemis_code TEXT DEFAULT 'IP-৮৮৯২',
  eiin TEXT DEFAULT '১৩৪৫৮৯',
  phone TEXT DEFAULT '০১৮১২-৩৪৫৬৭৮',
  email TEXT DEFAULT 'info@sciencestudio.edu.bd',
  website TEXT DEFAULT 'www.sciencestudio.edu.bd',
  board_name TEXT DEFAULT 'কুমিল্লা শিক্ষা বোর্ড',
  headmaster_name TEXT DEFAULT 'সাকিব আহমেদ',
  headmaster_title TEXT DEFAULT 'প্রধান শিক্ষক ও পরিচালক',
  
  -- Digital Files & Images (URLs from Supabase Storage)
  logo_url TEXT,
  seal_url TEXT,
  principal_signature_url TEXT,
  controller_signature_url TEXT,
  class_teacher_signature_url TEXT,

  -- Picture Watermark Settings
  watermark_enabled BOOLEAN DEFAULT TRUE,
  watermark_type TEXT DEFAULT 'image',
  watermark_image_url TEXT,
  watermark_opacity NUMERIC(4,2) DEFAULT 0.08,
  watermark_size INTEGER DEFAULT 160,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Institution Row if none exists
INSERT INTO public.institutions (
  id, name_bn, name_en, slogan, established, village, upazila, district, eiin, phone, email, headmaster_name, headmaster_title
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'কলাবাড়িয়া মডেল একাডেমি ও কোচিং সেন্টার',
  'Kolabaria Model Academy & Coaching Center',
  'জ্ঞানেই শক্তি, শিক্ষাই মুক্তি',
  '১৯৯৮',
  'কলাবাড়িয়া',
  'সেনবাগ',
  'নোয়াখালী',
  '১৩৪৫৮৯',
  '০১৮১২-৩৪৫৬৭৮',
  'info@sciencestudio.edu.bd',
  'সাকিব আহমেদ',
  'প্রধান শিক্ষক ও পরিচালক'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 4. STUDENTS DATABASE (Personal, Academic, Financial)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  roll TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  class TEXT NOT NULL,
  section TEXT DEFAULT 'ক',
  shift TEXT DEFAULT 'সকাল',
  gender TEXT DEFAULT 'ছেলে',
  father_name TEXT,
  mother_name TEXT,
  phone TEXT,
  birth_date TEXT,
  birth_date_words TEXT,
  nid_or_birth_reg TEXT,
  blood_group TEXT,
  address TEXT,
  village TEXT,
  post_office TEXT,
  upazila TEXT,
  district TEXT,
  admission_date TEXT,
  previous_school TEXT,
  status TEXT DEFAULT 'সক্রিয়', -- 'সক্রিয়' | 'উত্তীর্ণ' | 'ছাড়পত্রপ্রাপ্ত'
  photo_url TEXT,
  monthly_fee NUMERIC(10,2) DEFAULT 800.00,
  fee_status TEXT DEFAULT 'পরিশোধিত', -- 'পরিশোধিত' | 'বকেয়া'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class);
CREATE INDEX IF NOT EXISTS idx_students_roll ON public.students(roll);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);

-- ==============================================================================
-- 5. TEACHERS & STAFF DATABASE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  designation TEXT NOT NULL,
  qualification TEXT,
  subject TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  join_date TEXT,
  blood_group TEXT,
  address TEXT,
  status TEXT DEFAULT 'কর্মরত', -- 'কর্মরত' | 'ছুটিতে'
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. QUESTION BANK (MCQ, CQ Stimulus + Subquestions, Short Grammar & Board Questions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'cq', 'short')),
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  topic TEXT,
  grammar_topic TEXT,
  target_class TEXT,
  part TEXT, -- 'Part A: Grammar' | 'Part B: Composition' | 'Part A: Reading' | 'Part B: Writing'
  item_number TEXT,
  marks NUMERIC(5,2) DEFAULT 1.0,
  marks_distribution TEXT,
  board_info TEXT,
  importance TEXT DEFAULT 'standard', -- 'standard' | 'high' | 'very_high'

  -- MCQ Specific
  question TEXT,
  options JSONB, -- Array of 4 strings: ["ক অপশন", "খ অপশন", "গ অপশন", "ঘ অপশন"]
  correct_option INTEGER, -- 0, 1, 2, 3
  explanation TEXT,

  -- CQ (Creative) Specific
  stimulus TEXT, -- উদ্দীপক অনুচ্ছেদ / গাণিতিক পরিস্থিতি
  sub_questions JSONB, -- Array of objects: [{"label": "ক", "question": "...", "marks": 1}, ...]

  -- Short / Grammar Specific
  answer TEXT, -- মডেল উত্তর বা সমাধান
  clues_box JSONB, -- Array of clue words: ["take", "walk", "pollute"]

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_subject_chapter ON public.questions(subject, chapter);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_target_class ON public.questions(target_class);

-- ==============================================================================
-- 7. SAVED QUESTION PAPERS ARCHIVE (Full Booklet/Portrait Exam Papers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_exam_papers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  paper_title TEXT,
  coaching_name TEXT NOT NULL,
  sub_title TEXT,
  exam_title TEXT NOT NULL,
  subject TEXT NOT NULL,
  subject_code TEXT,
  class TEXT NOT NULL,
  section TEXT,
  duration TEXT NOT NULL,
  total_marks NUMERIC(6,2) NOT NULL,
  format TEXT DEFAULT 'k_kh_g',
  pattern TEXT DEFAULT 'k_kh_g',
  page_layout TEXT DEFAULT 'two_column',
  paper_layout_mode TEXT DEFAULT 'landscape_booklet', -- 'landscape_booklet' | 'standard_portrait'
  instructions TEXT,
  watermark JSONB, -- {"enabled": true, "imageUrl": "...", "opacity": 0.08, "type": "image"}
  columns INTEGER DEFAULT 2,
  show_answers_in_print BOOLEAN DEFAULT FALSE,
  
  -- Structured Question Sets for Reprints
  selected_question_ids JSONB DEFAULT '[]'::JSONB,
  custom_questions JSONB DEFAULT '[]'::JSONB,
  section_k_questions JSONB DEFAULT '[]'::JSONB,
  section_kh_questions JSONB DEFAULT '[]'::JSONB,
  section_g_questions JSONB DEFAULT '[]'::JSONB,

  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_papers_subject_class ON public.saved_exam_papers(subject, class);

-- ==============================================================================
-- 8. SAVED ADMIT CARDS ARCHIVE (Landscape Admit Cards)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_admit_cards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  student_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
  student_name_bn TEXT NOT NULL,
  student_name_en TEXT,
  father_name TEXT,
  mother_name TEXT,
  student_class TEXT NOT NULL,
  section TEXT DEFAULT 'ক',
  roll TEXT NOT NULL,
  reg_no TEXT,
  group_name TEXT DEFAULT 'বিজ্ঞান (Science)',
  exam_center TEXT DEFAULT 'প্রধান ক্যাম্পাস, কেন্দ্র-০১',
  photo_url TEXT,
  exam_term TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admit_cards_class ON public.saved_admit_cards(student_class);
CREATE INDEX IF NOT EXISTS idx_admit_cards_roll ON public.saved_admit_cards(roll);

-- ==============================================================================
-- 9. SAVED CERTIFICATES & TESTIMONIALS ARCHIVE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_certificates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  cert_type TEXT NOT NULL, -- 'testimonial' | 'excellence' | 'promotion' | 'bonafide' | 'tc' | 'course'
  theme TEXT DEFAULT 'royal_gold',
  orientation TEXT DEFAULT 'landscape',
  cert_language TEXT DEFAULT 'bn',
  serial_no TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  student_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
  student_name_bn TEXT NOT NULL,
  student_name_en TEXT,
  father_name TEXT,
  mother_name TEXT,
  birth_date TEXT,
  birth_date_words TEXT,
  student_class TEXT,
  roll_no TEXT,
  reg_no TEXT,
  session_year TEXT,
  passing_year TEXT,
  board_name TEXT DEFAULT 'কুমিল্লা শিক্ষা বোর্ড',
  gpa_result TEXT,
  merit_position TEXT,
  achievement_title TEXT,
  conduct TEXT DEFAULT 'উত্তম ও প্রশংসনীয়',
  next_class TEXT,
  reason_for_leaving TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_certificates_type ON public.saved_certificates(cert_type);
CREATE INDEX IF NOT EXISTS idx_saved_certificates_serial ON public.saved_certificates(serial_no);

-- ==============================================================================
-- 10. EXAM ROUTINES & SCHEDULES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exam_routines (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  class TEXT NOT NULL,
  term TEXT NOT NULL,
  academic_year TEXT DEFAULT '২০২৬',
  date TEXT NOT NULL,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  time TEXT NOT NULL,
  shift TEXT DEFAULT 'সকাল',
  room_no TEXT DEFAULT '১০১',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. STUDENT RESULTS & MARKSHEETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  roll TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT DEFAULT 'ক',
  term TEXT NOT NULL,
  academic_year TEXT DEFAULT '২০২৬',
  attendance_days INTEGER DEFAULT 0,
  total_working_days INTEGER DEFAULT 0,
  subject_marks JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of SubjectMarks objects
  grand_total NUMERIC(7,2) DEFAULT 0,
  total_full_marks NUMERIC(7,2) DEFAULT 100,
  percentage NUMERIC(5,2) DEFAULT 0,
  overall_grade TEXT DEFAULT 'A+',
  overall_gpa NUMERIC(4,2) DEFAULT 5.0,
  position TEXT,
  teacher_remarks TEXT,
  passed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_student ON public.student_results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_class_term ON public.student_results(class, term);

-- ==============================================================================
-- 12. FEE MANAGEMENT & TRANSACTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.fee_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  roll TEXT NOT NULL,
  month TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  fee_type TEXT NOT NULL, -- 'মাসিক বেতন' | 'ভর্তি ফি' | 'পরীক্ষা ফি' | 'কোচিং শিট ফি'
  payment_date TEXT NOT NULL,
  payment_method TEXT DEFAULT 'নগদ', -- 'নগদ' | 'বিকাশ' | 'নগদ/রকেট' | 'ব্যাংক'
  status TEXT DEFAULT 'পরিশোধিত', -- 'পরিশোধিত' | 'বকেয়া'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fee_student ON public.fee_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_month ON public.fee_transactions(month);

-- ==============================================================================
-- 13. INSTITUTIONAL NOTICE BOARD & EMERGENCY ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  is_emergency BOOLEAN DEFAULT FALSE,
  published_by TEXT DEFAULT 'প্রধান শিক্ষক ও পরিচালক',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_emergency ON public.notices(is_emergency);

-- ==============================================================================
-- 14. SUPABASE STORAGE BUCKETS (Images, Logos, Signatures, PDF Archives)
-- ==============================================================================
-- Insert the 5 primary storage buckets required by Science Studio
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('institution-assets', 'institution-assets', true),
  ('student-photos', 'student-photos', true),
  ('staff-photos', 'staff-photos', true),
  ('question-assets', 'question-assets', true),
  ('document-archives', 'document-archives', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Allow public read access to all 5 buckets
DROP POLICY IF EXISTS "Public Read Access for Institution Assets" ON storage.objects;
CREATE POLICY "Public Read Access for Institution Assets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('institution-assets', 'student-photos', 'staff-photos', 'question-assets', 'document-archives'));

-- Storage Policy: Allow authenticated users full upload/update/delete access
DROP POLICY IF EXISTS "Authenticated User Full Access to Storage" ON storage.objects;
CREATE POLICY "Authenticated User Full Access to Storage"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id IN ('institution-assets', 'student-photos', 'staff-photos', 'question-assets', 'document-archives'))
WITH CHECK (bucket_id IN ('institution-assets', 'student-photos', 'staff-photos', 'question-assets', 'document-archives'));

-- Storage Policy: Allow public uploads for seamless demo / direct file upload
DROP POLICY IF EXISTS "Public Upload Access for Science Studio" ON storage.objects;
CREATE POLICY "Public Upload Access for Science Studio"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id IN ('institution-assets', 'student-photos', 'staff-photos', 'question-assets', 'document-archives'));

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_admit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Full Read/Write Policies for Public & Authenticated (Enables both client-side & admin operations)
CREATE POLICY "Public & Auth Full Access on Institutions" ON public.institutions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Questions" ON public.questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Saved Papers" ON public.saved_exam_papers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Saved Admit Cards" ON public.saved_admit_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Saved Certificates" ON public.saved_certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Routines" ON public.exam_routines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Results" ON public.student_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Fees" ON public.fee_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public & Auth Full Access on Notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 16. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_saved_exam_papers_updated_at BEFORE UPDATE ON public.saved_exam_papers FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_student_results_updated_at BEFORE UPDATE ON public.student_results FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==============================================================================
-- END OF SUPABASE SCHEMA
-- ==============================================================================
