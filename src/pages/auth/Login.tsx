import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Role } from '../../types/academic';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole, resetPassword } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<Role>('student');
  const [email, setEmail] = useState('alex.johnson@smartacademic.edu');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    if (role === 'student') {
      setEmail('alex.johnson@smartacademic.edu');
    } else if (role === 'faculty') {
      setEmail('r.chen@smartacademic.edu');
    } else if (role === 'hod') {
      setEmail('e.davis@smartacademic.edu');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, activeTab);
      switchRole(activeTab);
      toast.success(`Welcome to Smart Academic Platform (${activeTab.toUpperCase()})!`);
      navigate(`/${activeTab}`);
    } catch (err) {
      toast.error('Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      await resetPassword(forgotEmail);
      setIsResetSent(true);
      toast.success('Password reset link sent to your registered institutional email.');
    } catch (err) {
      toast.error('Failed to process reset request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-xl mb-3">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-teal-400">
              <GraduationCap className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Academic Platform</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Academic & Timetable ERP for Higher Education
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl mb-6">
            {(['student', 'faculty', 'hod'] as const).map(role => (
              <button
                key={role}
                onClick={() => handleTabChange(role)}
                className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  activeTab === role
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'hod' ? 'HOD / Dean' : role}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email or USN
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="name@smartacademic.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setIsResetSent(false);
                  }}
                  className="text-[11px] text-teal-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="teal"
              className="w-full py-2.5 text-xs font-bold justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : `Sign in as ${activeTab.toUpperCase()}`}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Fill Notice */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Full PostgreSQL & Supabase RLS Schema Configured</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Select any role tab above to instant test with prefilled college credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsForgotModalOpen(false)}
          title="Reset Portal Password"
          maxWidth="md"
        >
          {isResetSent ? (
            <div className="p-4 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Reset Email Dispatched</h3>
              <p className="text-xs text-slate-500">
                A password reset token has been dispatched to <strong>{forgotEmail}</strong>. Follow the instructions to recover access.
              </p>
              <Button variant="teal" size="sm" onClick={() => setIsForgotModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Enter your registered college email or USN. We will send a secure password reset link.
              </p>
              <Input
                label="Registered College Email"
                placeholder="e.g. alex.johnson@smartacademic.edu"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" type="button" onClick={() => setIsForgotModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="teal" type="submit">
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
