import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, UserCheck, GraduationCap, Briefcase, Building2, X } from 'lucide-react';
import { Role } from '../../types/academic';
import { useNavigate } from 'react-router-dom';

export const RolePreviewBanner: React.FC = () => {
  const { role, switchRole, previewNoticeDismissed, dismissPreviewNotice } = useAuth();
  const navigate = useNavigate();

  if (previewNoticeDismissed) return null;

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    navigate(`/${newRole}`);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white px-3 sm:px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs z-30">
      <div className="flex items-center gap-2 font-medium flex-wrap">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-100" />
        <span>
          <span className="font-bold tracking-wide uppercase text-[10px] bg-black/20 px-1.5 py-0.5 rounded mr-1.5 border border-white/20">
            Dev Preview Mode
          </span>
          Simulating role: <strong className="capitalize underline decoration-white/40">{role}</strong>
        </span>
        <span className="inline-flex items-center gap-1 bg-black/20 text-white text-[11px] px-2 py-0.5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Firebase Connected</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-[11px] text-amber-100 hidden md:inline">Quick switch:</span>
        <button
          onClick={() => handleRoleChange('student')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
            role === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'bg-black/20 text-white hover:bg-black/30'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student</span>
        </button>

        <button
          onClick={() => handleRoleChange('faculty')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
            role === 'faculty' ? 'bg-white text-slate-900 shadow-xs' : 'bg-black/20 text-white hover:bg-black/30'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Faculty</span>
        </button>

        <button
          onClick={() => handleRoleChange('hod')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
            role === 'hod' ? 'bg-white text-slate-900 shadow-xs' : 'bg-black/20 text-white hover:bg-black/30'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>HOD / Admin</span>
        </button>

        <button
          onClick={dismissPreviewNotice}
          className="p-1 hover:bg-black/20 rounded ml-1 text-amber-100 hover:text-white cursor-pointer"
          title="Dismiss warning banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
