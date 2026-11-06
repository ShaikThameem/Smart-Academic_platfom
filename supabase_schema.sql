-- ====================================================================
-- SMART ACADEMIC PLATFORM: Complete Relational Schema (PostgreSQL / Supabase)
-- Target: College & University Academic Management (UG Degree Programs)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'hod')),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  code_number VARCHAR(50) NOT NULL, -- USN for student, EmpID for faculty/HOD
  department_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- e.g. CSE, ECE, MECH
  name VARCHAR(150) NOT NULL,
  hod_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  building VARCHAR(100),
  established_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SECTIONS
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL, -- e.g. CSE-5A, CSE-5B
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
  academic_year VARCHAR(20) NOT NULL, -- e.g. 2026-2027
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENTS (UG Specific Details)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  usn VARCHAR(30) UNIQUE NOT NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  batch_year VARCHAR(20) NOT NULL, -- e.g. 2024-2028
  cgpa NUMERIC(4,2) DEFAULT 0.00,
  total_credits_earned INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended', 'leave'))
);

-- 5. FACULTY (College Professor & Lecturer Profiles)
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id VARCHAR(30) UNIQUE NOT NULL,
  designation VARCHAR(100) NOT NULL, -- Professor, Associate Professor, Assistant Professor
  specialization TEXT,
  qualification VARCHAR(100), -- Ph.D., M.Tech, M.S.
  max_weekly_hours INT DEFAULT 18,
  is_active BOOLEAN DEFAULT true
);

-- 6. ROOMS & LABORATORIES
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(30) UNIQUE NOT NULL, -- e.g. LH-201, LAB-301
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('classroom', 'lab', 'seminar')),
  capacity INT NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor INT DEFAULT 1,
  has_projector BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBJECTS (College Degree Courses)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- e.g. CS301
  name VARCHAR(150) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
  credits INT NOT NULL CHECK (credits BETWEEN 1 AND 6),
  weekly_sessions INT NOT NULL DEFAULT 4,
  type VARCHAR(20) NOT NULL CHECK (type IN ('theory', 'lab', 'elective')),
  duration_hours NUMERIC(3,1) NOT NULL DEFAULT 1.0, -- 1.0 for theory, 2.5 for lab
  syllabus_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FACULTY ASSIGNMENTS (Teaching Allotments)
CREATE TABLE IF NOT EXISTS public.faculty_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL,
  semester INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(faculty_id, subject_id, section_id, academic_year)
);

-- 9. TIMETABLE VERSIONS (Draft vs Published Isolation)
CREATE TABLE IF NOT EXISTS public.timetable_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_tag VARCHAR(20) UNIQUE NOT NULL, -- e.g. v2.1, v2.2
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT false,
  published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TIMETABLE SLOTS
CREATE TABLE IF NOT EXISTS public.timetable_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_id UUID REFERENCES public.timetable_versions(id) ON DELETE CASCADE,
  day VARCHAR(15) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time TIME NOT NULL, -- 08:30:00
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  is_lab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ATTENDANCE SESSIONS & RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  topic_covered TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  status VARCHAR(15) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 12. MARKS (Semester-wise & Subject-wise Examination Records)
CREATE TABLE IF NOT EXISTS public.marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  cie_1 NUMERIC(5,2), -- Continuous Internal Evaluation 1 (out of 50)
  cie_2 NUMERIC(5,2), -- Continuous Internal Evaluation 2 (out of 50)
  cie_avg NUMERIC(5,2),
  assignment_marks NUMERIC(5,2),
  lab_marks NUMERIC(5,2),
  see_marks NUMERIC(5,2), -- Semester End Examination (out of 100)
  total_marks NUMERIC(5,2),
  grade VARCHAR(5), -- O, A+, A, B+, B, C, P, F
  grade_point NUMERIC(3,1),
  is_pass BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ASSESSMENTS, QUESTIONS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('quiz', 'midterm', 'assignment', 'lab_test')),
  total_marks INT NOT NULL,
  duration_minutes INT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  instructions TEXT,
  question_paper_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'theory', 'code')),
  options JSONB, -- Array of string options for MCQ
  correct_answer INT, -- Index of correct option
  marks INT NOT NULL DEFAULT 5,
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  answers JSONB,
  score NUMERIC(5,2),
  total_marks NUMERIC(5,2),
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
  feedback TEXT,
  file_url TEXT
);

-- 14. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- Academic, Examination, Department, Placement, Holiday
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_role VARCHAR(20) DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'faculty', 'hod')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CLUBS & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL, -- Technical, Cultural, Sports, Social, Coding
  description TEXT,
  lead_name VARCHAR(100),
  faculty_advisor VARCHAR(100),
  member_count INT DEFAULT 0,
  logo_url TEXT,
  established_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.club_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  role VARCHAR(30) DEFAULT 'member', -- member, coordinator, lead
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. COMPLAINTS & GRIEVANCES
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL, -- Academic, Facility, Hostel, Examination, Fee, Other
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  is_anonymous BOOLEAN DEFAULT false,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 17. ALUMNI DIRECTORY
CREATE TABLE IF NOT EXISTS public.alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  degree VARCHAR(50) NOT NULL, -- B.Tech, M.Tech, Ph.D.
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  graduation_year INT NOT NULL,
  current_company VARCHAR(150),
  current_role VARCHAR(100),
  location VARCHAR(100),
  linkedin_url TEXT,
  email VARCHAR(150),
  is_mentor_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. FACULTY FEEDBACK (Student Evaluation of Teaching)
CREATE TABLE IF NOT EXISTS public.faculty_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL, -- Confidential/Anonymized
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  rating_clarity INT CHECK (rating_clarity BETWEEN 1 AND 5),
  rating_punctuality INT CHECK (rating_punctuality BETWEEN 1 AND 5),
  rating_knowledge INT CHECK (rating_knowledge BETWEEN 1 AND 5),
  rating_fairness INT CHECK (rating_fairness BETWEEN 1 AND 5),
  comments TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) NOT NULL, -- timetable, attendance, assessment, marks, announcement
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. DEPARTMENT EVENTS & ACTIVITIES
CREATE TABLE IF NOT EXISTS public.department_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- Workshop, Seminar, Hackathon, Guest Lecture, Industrial Visit
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  venue VARCHAR(100),
  coordinator_name VARCHAR(100),
  max_participants INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. CHAT HISTORY (AI Academic Assistant)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model VARCHAR(50) DEFAULT 'gemini-3.8-flash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users read all active profiles, write own
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Marks: Students read own; Faculty read assigned; HOD reads department
CREATE POLICY "Students can only read own marks" ON public.marks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = marks.student_id AND s.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('faculty', 'hod')
    )
  );

-- Complaints: Students read and submit own complaints
CREATE POLICY "Students manage own complaints" ON public.complaints
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = complaints.student_id AND s.profile_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'hod'
    )
  );
