import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Settings,
  Cpu,
  Lock,
  Save,
  Shield,
  Clock,
  Layers,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HodSettings: React.FC = () => {
  const toast = useToast();

  const [timetablePolicy, setTimetablePolicy] = useState({
    dailyStartTime: '08:30',
    lectureDurationMinutes: 60,
    labDurationMinutes: 150,
    fridayLabOnly: true,
    maxConsecutiveLectures: 2,
    minimumAttendanceThreshold: 75,
    directPublishNotifyFaculty: true,
    directPublishNotifyStudents: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Department Academic & Timetable policies updated successfully.');
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
    toast.success('HOD administrative password updated securely.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Department Administrative Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure timetable constraint parameters, attendance rules, and administrative credentials.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Intelligent Timetable Generation Policies"
          subtitle="Global parameters governing schedule generation and direct live publishing"
        />
        <CardContent>
          <form onSubmit={handleSavePolicies} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Daily Start Time</label>
                <input
                  type="time"
                  value={timetablePolicy.dailyStartTime}
                  onChange={e => setTimetablePolicy(p => ({ ...p, dailyStartTime: e.target.value }))}
                  className="w-full p-2 border rounded-lg font-mono bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Attendance Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={timetablePolicy.minimumAttendanceThreshold}
                  onChange={e => setTimetablePolicy(p => ({ ...p, minimumAttendanceThreshold: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-lg font-mono bg-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Dedicated Friday Lab Day Policy</span>
                  <span className="text-[11px] text-slate-500">Dedicate Fridays exclusively to 2.5-hour immersion laboratories</span>
                </div>
                <input
                  type="checkbox"
                  checked={timetablePolicy.fridayLabOnly}
                  onChange={e => setTimetablePolicy(p => ({ ...p, fridayLabOnly: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Direct Publishing Automatic Broadcast</span>
                  <span className="text-[11px] text-slate-500">Broadcast instant push notifications upon timetable direct publication</span>
                </div>
                <input
                  type="checkbox"
                  checked={timetablePolicy.directPublishNotifyFaculty}
                  onChange={e => setTimetablePolicy(p => ({ ...p, directPublishNotifyFaculty: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="teal" size="sm">
                <Save className="w-4 h-4 mr-1.5" />
                Save Policy Parameters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Administrative Security"
          subtitle="Change HOD portal authentication credentials"
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
                Update Credentials
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
