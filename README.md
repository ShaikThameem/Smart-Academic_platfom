# Smart Academic Platform

A modern, responsive full-stack-ready frontend for a university academic management web application connecting three distinct roles:
- **Student** (Attendance deficit tracking, published timetable, live test-taking, performance leaderboard, AI tutor)
- **Faculty** (Attendance roster marking, assessment creator & grading, timetable concern reporting)
- **HOD / Administrator** (Curriculum & resource mapping, intelligent conflict-free timetable generator, faculty concern resolution, draft vs published release management, attendance audit compliance)

---

## 🛠 Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with professional university dashboard design system
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **AI SDK**: `@google/genai` (with intelligent syllabus & timetable knowledge engine fallback)
- **Architecture**: Modular services layer (`src/services/`) designed for seamless replacement with PostgreSQL / Supabase / REST backend.

---

## 🚀 Key Features

### 1. Student Portal
- **Dashboard Overview**: Welcome banner with active course status, today's schedule timeline, attendance health gauge, and active evaluations.
- **My Timetable**: Weekly calendar grid and daily list views. Strict display of published schedules (v2.1) starting at 8:30 AM with 10-minute break indicators.
- **Attendance & 75% Recovery Calculator**: Dynamic attendance calculations. Automatically computes exact consecutive classes a student must attend to cross the mandatory 75% examination threshold, plus allowable cushion absences.
- **Continuous Assessments & PYQ Archive**: View tests, download official Previous Year Question Papers (2023-2025), and inspect graded submissions.
- **Live Test-Taking Engine**: Interactive test interface with real-time countdown timer, question palette, auto-graded MCQs, and instant result breakdown with faculty explanations.
- **Performance Analytics**: Subject-wise CIE projections and Section CSE-5A batch leaderboard.
- **AI Academic Assistant**: Real-time academic query assistant powered by Gemini 2.5 Flash and collegiate knowledge engine.

### 2. Faculty Portal
- **Overview**: Teaching load metrics, assigned sections, and pending attendance reminders.
- **Attendance Management**: Enrolled student roster with search, individual or bulk Present/Absent/Late marking, and live percentage updates with confirmation dialogs.
- **Assessment Management**: Create continuous assessments, attach question papers, set deadlines, and grade student submissions.
- **Timetable Review**: View teaching allocations and formally raise scheduling concerns to the HOD.

### 3. HOD / Administrator Portal
- **Department Overview**: Student and faculty counts, section health, live publication status, and pending feedback counter.
- **Academic Setup**: Complete CRUD for subjects (theory 1h vs lab 2.5h), faculty qualifications, rooms & computing laboratories with availability toggles, and teaching allocations.
- **Intelligent Timetable Generator**: Rule-based scheduler enforcing 8:30 AM starts, 1h theory lectures, 2.5h lab blocks, 10-minute breaks, Friday dedicated lab policies, and zero faculty/room/section clashes.
- **Faculty Review**: List and resolve slot adjustment concerns raised by teachers with formal administrative notes.
- **Approval & Publication**: Strict isolation between draft schedules and live published schedules. Version release workflow (`v2.1` -> `v2.2`).
- **Academic Reports**: Attendance shortage audit list (<75%) with filter by section/subject and CSV export.

### 4. Development Role Preview
- Development role switcher located at the top banner and header menu allowing prototype review between Student, Faculty, and HOD without mock authentication claims.

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🔒 Security & Backend Integration Notes

- **Replaceable Service Layer**: All data operations reside in `src/services/` (`academicService`, `timetableService`, `attendanceService`, `assessmentService`, `aiService`).
- **No Secrets in Frontend**: Does not hardcode secrets or private keys in the client bundle.
- **Ready for PostgreSQL**: Models strictly conform to relational database schemas for students, faculty, rooms, courses, allocations, slots, attendance logs, and submissions.
