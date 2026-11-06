import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCheck, FileText, Bot, User, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { role, switchRole } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allItems = [
    // Navigation
    { title: 'My Timetable', subtitle: 'View published weekly schedule & rooms', path: `/${role}/timetable`, icon: <Calendar className="w-4 h-4 text-blue-600" />, category: 'Navigation' },
    { title: 'Attendance Log', subtitle: 'Check percentages, deficit, and logs', path: `/${role}/attendance`, icon: <CheckCheck className="w-4 h-4 text-emerald-600" />, category: 'Navigation' },
    { title: 'Assessments & Tests', subtitle: 'Active quizzes, PYQs, and test taking', path: `/${role}/assessments`, icon: <FileText className="w-4 h-4 text-amber-600" />, category: 'Navigation' },
    { title: 'AI Academic Assistant', subtitle: 'Ask algorithms, study plans, policies', path: '/student/ai-assistant', icon: <Bot className="w-4 h-4 text-sky-600" />, category: 'Navigation' },
    { title: 'Intelligent Timetable Generator', subtitle: 'Configure constraints, draft schedules', path: '/hod/timetable-generator', icon: <Calendar className="w-4 h-4 text-purple-600" />, category: 'HOD Admin' },
    { title: 'Academic Setup & Rooms', subtitle: 'Manage subjects, rooms, faculty allocations', path: '/hod/academic-setup', icon: <FileText className="w-4 h-4 text-slate-600" />, category: 'HOD Admin' },

    // Role switcher shortcuts
    { title: 'Switch to Student View (Aarav Sharma)', subtitle: 'Simulate student dashboard & test taker', roleChange: 'student', icon: <User className="w-4 h-4 text-blue-500" />, category: 'Role Switch' },
    { title: 'Switch to Faculty View (Dr. Rajesh Kumar)', subtitle: 'Simulate attendance taking & grading', roleChange: 'faculty', icon: <User className="w-4 h-4 text-emerald-500" />, category: 'Role Switch' },
    { title: 'Switch to HOD View (Dr. Meenakshi)', subtitle: 'Simulate timetable generation & approval', roleChange: 'hod', icon: <User className="w-4 h-4 text-purple-500" />, category: 'Role Switch' },
  ];

  const filtered = allItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: (typeof allItems)[0]) => {
    if (item.roleChange) {
      switchRole(item.roleChange as any);
      navigate(`/${item.roleChange}`);
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative mx-auto max-w-xl transform rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all overflow-hidden border border-slate-200">
        <div className="flex items-center px-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, subject, page or role (e.g. 'attendance', 'faculty')..."
            className="h-13 w-full border-0 bg-transparent pl-3 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500">No matching commands or pages found.</p>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs hover:bg-slate-100 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-white border border-slate-200/80 shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal border border-slate-200 px-1 py-0.2 rounded bg-slate-50">
                        {item.category}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">Esc</kbd> to close</span>
          <span>Smart Academic Search</span>
        </div>
      </div>
    </div>
  );
};
