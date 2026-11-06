import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Settings,
  Bell,
  Lock,
  Save,
  Shield,
  Clock,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FacultySettings: React.FC = () => {
  const toast = useToast();

  const [notifications, setNotifications] = useState({
    submissionAlerts: true,
    attendanceDeadlineReminders: true,
    departmentCirculars: true,
    feedbackPublished: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Faculty notification preferences saved.');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please enter all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    toast.success('Faculty portal password updated securely.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure grading reminders, notification preferences, and portal security credentials.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Teaching & Grading Notifications"
          subtitle="Alerts for student submissions, attendance logging, and circulars"
        />
        <CardContent>
          <form onSubmit={handleSaveNotifications} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Student Submission Alerts</span>
                  <span className="text-[11px] text-slate-500">Email summary when students submit assignments or quizzes</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.submissionAlerts}
                  onChange={e => setNotifications(prev => ({ ...prev, submissionAlerts: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Daily Attendance Logging Reminder</span>
                  <span className="text-[11px] text-slate-500">Prompt at 04:30 PM if scheduled lecture attendance has not been registered</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.attendanceDeadlineReminders}
                  onChange={e => setNotifications(prev => ({ ...prev, attendanceDeadlineReminders: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Dean & HOD Office Circulars</span>
                  <span className="text-[11px] text-slate-500">Immediate push alerts when administrative notices are released</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.departmentCirculars}
                  onChange={e => setNotifications(prev => ({ ...prev, departmentCirculars: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                <Save className="w-4 h-4 mr-1.5" />
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Security & Password"
          subtitle="Change your faculty portal login password"
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

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                <Lock className="w-4 h-4 mr-1.5" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
