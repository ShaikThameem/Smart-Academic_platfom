import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Smartphone,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StudentSettings: React.FC = () => {
  const toast = useToast();

  const [notifications, setNotifications] = useState({
    attendanceDeficitAlerts: true,
    newAnnouncements: true,
    assessmentReminders: true,
    marksPublication: true,
    smsAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    showInAlumniDirectory: true,
    shareProjectsWithRecruiters: true,
    allowClassmateMentorship: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Notification preferences updated successfully.');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please complete all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    toast.success('University ERP portal password updated securely.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure security credentials, academic alerts, and privacy preferences for your student account.
        </p>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader
          title="Academic Alerts & Notifications"
          subtitle="Real-time alerts for attendance, assessments, and university circulars"
        />
        <CardContent>
          <form onSubmit={handleSaveNotifications} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Attendance Deficit Warning (&lt;75%)</span>
                  <span className="text-[11px] text-slate-500">Immediate push & email alert when any subject attendance drops below 75%</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.attendanceDeficitAlerts}
                  onChange={e => setNotifications(prev => ({ ...prev, attendanceDeficitAlerts: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Department & University Circulars</span>
                  <span className="text-[11px] text-slate-500">Instant notification when HOD or Registrar publishes an announcement</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.newAnnouncements}
                  onChange={e => setNotifications(prev => ({ ...prev, newAnnouncements: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Assessment & Deadline Reminders</span>
                  <span className="text-[11px] text-slate-500">Reminders 24 hours and 2 hours before online test or assignment submission</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.assessmentReminders}
                  onChange={e => setNotifications(prev => ({ ...prev, assessmentReminders: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Marks & Grade Publication</span>
                  <span className="text-[11px] text-slate-500">Notification as soon as CIE internal marks or SEE final grades are published</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marksPublication}
                  onChange={e => setNotifications(prev => ({ ...prev, marksPublication: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                <Save className="w-4 h-4 mr-1.5" />
                Save Notification Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card>
        <CardHeader
          title="Security & Password"
          subtitle="Update your student portal login password"
        />
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Password must contain at least 8 characters, including a capital letter and a number.</span>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <Lock className="w-4 h-4 mr-1.5" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader
          title="Placement & Privacy Settings"
          subtitle="Manage visibility in university directories and placement cell portal"
        />
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Show Profile to University Alumni Network</span>
              <span className="text-[11px] text-slate-500">Enable alumni working in tech to view your resume for mentorship</span>
            </div>
            <input
              type="checkbox"
              checked={privacy.showInAlumniDirectory}
              onChange={e => {
                setPrivacy(prev => ({ ...prev, showInAlumniDirectory: e.target.checked }));
                toast.success('Privacy preference saved');
              }}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Campus Placement Cell Resume Sharing</span>
              <span className="text-[11px] text-slate-500">Allow department placement coordinators to submit academic records to visiting recruiters</span>
            </div>
            <input
              type="checkbox"
              checked={privacy.shareProjectsWithRecruiters}
              onChange={e => {
                setPrivacy(prev => ({ ...prev, shareProjectsWithRecruiters: e.target.checked }));
                toast.success('Placement preference saved');
              }}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
};
