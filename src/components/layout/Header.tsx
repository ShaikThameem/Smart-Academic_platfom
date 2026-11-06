import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { NotificationsModal } from './NotificationsModal';
import { CommandPalette } from './CommandPalette';
import { Role } from '../../types/academic';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { role, user, switchRole, firebaseUser, loginWithGoogle, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs and title from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/timetable-generator')) return { title: 'Intelligent Timetable Generator', category: 'HOD Admin' };
    if (path.includes('/academic-setup')) return { title: 'Academic Setup & Resource Mapping', category: 'HOD Admin' };
    if (path.includes('/faculty-review')) return { title: 'Faculty Timetable Feedback & Review', category: 'HOD Admin' };
    if (path.includes('/publication')) return { title: 'Timetable Approval & Publication', category: 'HOD Admin' };
    if (path.includes('/reports')) return { title: 'Academic Reports & Attendance Audits', category: 'HOD Admin' };
    if (path.includes('/attendance')) return { title: role === 'faculty' ? 'Classroom Attendance Management' : 'My Attendance & Deficit Analysis', category: 'Academic Logs' };
    if (path.includes('/assessments/take')) return { title: 'Continuous Internal Evaluation (Live Test)', category: 'Assessments' };
    if (path.includes('/assessments')) return { title: role === 'faculty' ? 'Assessment Management & Grading' : 'Assessments & Previous Year Papers', category: 'Evaluations' };
    if (path.includes('/timetable')) return { title: role === 'faculty' ? 'Faculty Teaching Schedule' : 'Published Weekly Timetable', category: 'Schedules' };
    if (path.includes('/performance')) return { title: 'Performance Trends & Leaderboard', category: 'Analytics' };
    if (path.includes('/ai-assistant')) return { title: 'AI Academic Assistant', category: 'Support & Guidance' };
    return { title: `${role.toUpperCase()} Academic Dashboard`, category: 'Overview' };
  };

  const { title, category } = getPageInfo();

  const handleRoleSwitch = (newRole: Role) => {
    switchRole(newRole);
    setIsProfileOpen(false);
    navigate(`/${newRole}`);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>{role.toUpperCase()}</span>
              <span>/</span>
              <span>{category}</span>
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight truncate max-w-[200px] sm:max-w-md">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-colors text-xs cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Search courses, slots, roster...</span>
            <span className="md:hidden">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="View Academic Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              aria-label="User menu"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-400 block capitalize">{role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200/90 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <p className="text-[11px] font-mono text-blue-600 mt-1">{user.codeNumber}</p>
                  {user.sectionName && (
                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Section: {user.sectionName}
                    </span>
                  )}
                </div>

                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Preview Other Dashboards
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleRoleSwitch('student')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                        role === 'student' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Student View (Aarav)</span>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('faculty')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                        role === 'faculty' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Faculty View (Dr. Rajesh)</span>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('hod')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                        role === 'hod' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>HOD View (Dr. Meenakshi)</span>
                    </button>
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsNotificationsOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>View Academic Notices</span>
                  </button>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    {firebaseUser ? (
                      <div className="px-3 py-2 bg-emerald-50/70 rounded-md">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Google Account Synced</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 truncate mt-0.5">{firebaseUser.email}</p>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="mt-2 w-full text-center py-1 text-[11px] font-semibold text-rose-600 bg-white border border-rose-200 rounded hover:bg-rose-50 cursor-pointer"
                        >
                          Sign Out of Firebase
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          loginWithGoogle();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md cursor-pointer transition-colors shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Quick Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};
