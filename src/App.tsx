/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Page
import { Login } from './pages/auth/Login';

// Student Pages (All 15 in exact requested order)
import { StudentOverview } from './pages/student/StudentOverview';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentSubjects } from './pages/student/StudentSubjects';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentAssessments } from './pages/student/StudentAssessments';
import { StudentTestTaking } from './pages/student/StudentTestTaking';
import { StudentClubs } from './pages/student/StudentClubs';
import { StudentAnnouncements } from './pages/student/StudentAnnouncements';
import { StudentPerformance } from './pages/student/StudentPerformance';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentSettings } from './pages/student/StudentSettings';
import { StudentComplaints } from './pages/student/StudentComplaints';
import { StudentAlumni } from './pages/student/StudentAlumni';
import { StudentFeedback } from './pages/student/StudentFeedback';
import { StudentAiAssistant } from './pages/student/StudentAiAssistant';

// Faculty Pages (All 11 in exact requested order)
import { FacultyOverview } from './pages/faculty/FacultyOverview';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyAssessments } from './pages/faculty/FacultyAssessments';
import { FacultySchedule } from './pages/faculty/FacultySchedule';
import { FacultyNotifications } from './pages/faculty/FacultyNotifications';
import { FacultyPerformance } from './pages/faculty/FacultyPerformance';
import { FacultySubmissions } from './pages/faculty/FacultySubmissions';
import { FacultyCourses } from './pages/faculty/FacultyCourses';
import { FacultyProfile } from './pages/faculty/FacultyProfile';
import { FacultySettings } from './pages/faculty/FacultySettings';
import { FacultyAiAssistant } from './pages/faculty/FacultyAiAssistant';

// HOD / Administrator Pages (All 13 in exact requested order)
import { HodOverview } from './pages/hod/HodOverview';
import { HodAcademicSetup } from './pages/hod/HodAcademicSetup';
import { HodIntelligentGenerator } from './pages/hod/HodIntelligentGenerator';
import { HodReports } from './pages/hod/HodReports';
import { HodUpcomingEvents } from './pages/hod/HodUpcomingEvents';
import { HodStudentPerformance } from './pages/hod/HodStudentPerformance';
import { HodDepartmentAnalytics } from './pages/hod/HodDepartmentAnalytics';
import { HodCoursesOffered } from './pages/hod/HodCoursesOffered';
import { HodDepartmentActivities } from './pages/hod/HodDepartmentActivities';
import { HodPassPercentage } from './pages/hod/HodPassPercentage';
import { HodProfile } from './pages/hod/HodProfile';
import { HodSettings } from './pages/hod/HodSettings';
import { HodAiAssistant } from './pages/hod/HodAiAssistant';

// Shared
import { NotFound } from './pages/shared/NotFound';

// Root redirect component based on active role
const RootRedirect: React.FC = () => {
  const { role } = useAuth();
  return <Navigate to={`/${role}`} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Standalone Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Main Application with Dashboard Layout */}
            <Route path="/" element={<DashboardLayout />}>
              {/* Home redirect */}
              <Route index element={<RootRedirect />} />

              {/* Student Routes (15 Modules) */}
              <Route path="student">
                <Route index element={<StudentOverview />} />
                <Route path="marks" element={<StudentMarks />} />
                <Route path="subjects" element={<StudentSubjects />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="assessments" element={<StudentAssessments />} />
                <Route path="assessments/take/:id" element={<StudentTestTaking />} />
                <Route path="clubs" element={<StudentClubs />} />
                <Route path="announcements" element={<StudentAnnouncements />} />
                <Route path="performance" element={<StudentPerformance />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route path="complaints" element={<StudentComplaints />} />
                <Route path="alumni" element={<StudentAlumni />} />
                <Route path="feedback" element={<StudentFeedback />} />
                <Route path="ai-assistant" element={<StudentAiAssistant />} />
              </Route>

              {/* Faculty Routes (11 Modules) */}
              <Route path="faculty">
                <Route index element={<FacultyOverview />} />
                <Route path="attendance" element={<FacultyAttendance />} />
                <Route path="assessments" element={<FacultyAssessments />} />
                <Route path="schedule" element={<FacultySchedule />} />
                <Route path="notifications" element={<FacultyNotifications />} />
                <Route path="performance" element={<FacultyPerformance />} />
                <Route path="submissions" element={<FacultySubmissions />} />
                <Route path="courses" element={<FacultyCourses />} />
                <Route path="profile" element={<FacultyProfile />} />
                <Route path="settings" element={<FacultySettings />} />
                <Route path="ai-assistant" element={<FacultyAiAssistant />} />
              </Route>

              {/* HOD / Administrator Routes (13 Modules) */}
              <Route path="hod">
                <Route index element={<HodOverview />} />
                <Route path="academic-setup" element={<HodAcademicSetup />} />
                <Route path="intelligent-generator" element={<HodIntelligentGenerator />} />
                <Route path="reports" element={<HodReports />} />
                <Route path="events" element={<HodUpcomingEvents />} />
                <Route path="performance" element={<HodStudentPerformance />} />
                <Route path="analytics" element={<HodDepartmentAnalytics />} />
                <Route path="courses" element={<HodCoursesOffered />} />
                <Route path="activities" element={<HodDepartmentActivities />} />
                <Route path="pass-percentage" element={<HodPassPercentage />} />
                <Route path="profile" element={<HodProfile />} />
                <Route path="settings" element={<HodSettings />} />
                <Route path="ai-assistant" element={<HodAiAssistant />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
