import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  // Student Icons
  LayoutDashboard,
  Award,
  BookOpen,
  Calendar,
  CheckCheck,
  FileCheck2,
  Users2,
  Bell,
  LineChart,
  UserCheck,
  Settings,
  HelpCircle,
  Compass,
  MessageSquareHeart,
  Bot,
  // Faculty Icons
  ClipboardCheck,
  FileSpreadsheet,
  CalendarRange,
  Inbox,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  // HOD Icons
  Layers,
  Cpu,
  FileText,
  CalendarDays,
  Activity,
  Percent,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { role, user } = useAuth();

  // Strict role modules as requested
  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/student', label: '1. Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
          { to: '/student/marks', label: '2. My Marks', icon: <Award className="w-4 h-4" /> },
          { to: '/student/subjects', label: '3. My Subjects', icon: <BookOpen className="w-4 h-4" /> },
          { to: '/student/timetable', label: '4. My Timetable', icon: <Calendar className="w-4 h-4" /> },
          { to: '/student/attendance', label: '5. Attendance', icon: <CheckCheck className="w-4 h-4" />, badge: '69.2%!' },
          { to: '/student/assessments', label: '6. Assessment & PYQ', icon: <FileCheck2 className="w-4 h-4" /> },
          { to: '/student/clubs', label: '7. Clubs', icon: <Users2 className="w-4 h-4" /> },
          { to: '/student/announcements', label: '8. Announcements', icon: <Bell className="w-4 h-4" /> },
          { to: '/student/performance', label: '9. Performance', icon: <LineChart className="w-4 h-4" /> },
          { to: '/student/profile', label: '10. My Profile', icon: <UserCheck className="w-4 h-4" /> },
          { to: '/student/settings', label: '11. Settings', icon: <Settings className="w-4 h-4" /> },
          { to: '/student/complaints', label: '12. Complaint Box', icon: <HelpCircle className="w-4 h-4" /> },
          { to: '/student/alumni', label: '13. Alumni Directory', icon: <Compass className="w-4 h-4" /> },
          { to: '/student/feedback', label: '14. Faculty Feedback', icon: <MessageSquareHeart className="w-4 h-4" /> },
          { to: '/student/ai-assistant', label: '15. AI Academic Assistant', icon: <Bot className="w-4 h-4 text-teal-400" />, highlight: true },
        ];

      case 'faculty':
        return [
          { to: '/faculty', label: '1. Overview', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
          { to: '/faculty/attendance', label: '2. Attendance Management', icon: <ClipboardCheck className="w-4 h-4" />, badge: 'Pending' },
          { to: '/faculty/assessments', label: '3. Assessment Management', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { to: '/faculty/schedule', label: '4. My Schedule', icon: <CalendarRange className="w-4 h-4" /> },
          { to: '/faculty/notifications', label: '5. Notifications', icon: <Bell className="w-4 h-4" /> },
          { to: '/faculty/performance', label: '6. Student Performance', icon: <LineChart className="w-4 h-4" /> },
          { to: '/faculty/submissions', label: '7. Submissions', icon: <Inbox className="w-4 h-4" /> },
          { to: '/faculty/courses', label: '8. Courses', icon: <BookOpen className="w-4 h-4" /> },
          { to: '/faculty/profile', label: '9. My Profile', icon: <UserCheck className="w-4 h-4" /> },
          { to: '/faculty/settings', label: '10. Settings', icon: <Settings className="w-4 h-4" /> },
          { to: '/faculty/ai-assistant', label: '11. AI Assistant', icon: <Bot className="w-4 h-4 text-teal-400" />, highlight: true },
        ];

      case 'hod':
        return [
          { to: '/hod', label: '1. Overview', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
          { to: '/hod/academic-setup', label: '2. Academic Setup', icon: <Layers className="w-4 h-4" /> },
          { to: '/hod/intelligent-generator', label: '3. Intelligent Generator', icon: <Cpu className="w-4 h-4 text-teal-400" /> },
          { to: '/hod/reports', label: '4. Academic Reports', icon: <FileText className="w-4 h-4" /> },
          { to: '/hod/events', label: '5. Upcoming Events', icon: <CalendarDays className="w-4 h-4" /> },
          { to: '/hod/performance', label: '6. Student Performance', icon: <LineChart className="w-4 h-4" /> },
          { to: '/hod/analytics', label: '7. Department Analytics', icon: <LineChart className="w-4 h-4" /> },
          { to: '/hod/courses', label: '8. Courses Offered', icon: <BookOpen className="w-4 h-4" /> },
          { to: '/hod/activities', label: '9. Department Activities', icon: <Activity className="w-4 h-4" /> },
          { to: '/hod/pass-percentage', label: '10. Pass Percentage', icon: <Percent className="w-4 h-4" /> },
          { to: '/hod/profile', label: '11. My Profile', icon: <UserCheck className="w-4 h-4" /> },
          { to: '/hod/settings', label: '12. Settings', icon: <Settings className="w-4 h-4" /> },
          { to: '/hod/ai-assistant', label: '13. AI Assistant', icon: <Bot className="w-4 h-4 text-teal-400" />, highlight: true },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0A0F1D]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-white text-sm tracking-tight truncate">Smart Academic</span>
                <span className="text-[10px] text-teal-400 font-medium tracking-wide uppercase">University ERP</span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Role Tag */}
        <div className={`px-4 py-2.5 bg-slate-800/40 border-b border-slate-800/60 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Undergraduate Portal</span>
                <span className="text-xs font-semibold text-teal-400 capitalize">{role} Workspace</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-teal-400 ring-4 ring-teal-500/20" />
            </>
          ) : (
            <span className="w-2 h-2 rounded-full bg-teal-400 ring-4 ring-teal-500/20" title={`${role} Portal`} />
          )}
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${link.highlight && !isActive ? 'bg-teal-950/40 border border-teal-800/40 text-teal-300' : ''} ${
                  isCollapsed ? 'justify-center px-0' : ''
                }`
              }
              title={isCollapsed ? link.label : undefined}
            >
              <div className="shrink-0">{link.icon}</div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        link.badge.includes('!')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800 bg-[#0A0F1D]">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30 shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-teal-400 truncate font-mono">{user.codeNumber}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
