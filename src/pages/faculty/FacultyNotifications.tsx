import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Bell,
  Calendar,
  CheckCheck,
  AlertCircle,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FacultyNotice {
  id: string;
  title: string;
  category: 'Examination' | 'Academic' | 'Dean Office' | 'Research';
  date: string;
  urgent: boolean;
  content: string;
  actionRequired?: string;
  read: boolean;
}

const INITIAL_FACULTY_NOTICES: FacultyNotice[] = [
  {
    id: 'fn-01',
    title: 'Submission of Continuous Internal Evaluation (CIE-1) Marks',
    category: 'Examination',
    date: '2024-10-24',
    urgent: true,
    content:
      'All CSE faculty members are required to upload CIE-1 marks on the University ERP portal by Friday, 5:00 PM. Hard copy of signed marksheets to be submitted to the HOD office.',
    actionRequired: 'Upload Marks before 28th Oct',
    read: false,
  },
  {
    id: 'fn-02',
    title: 'Semester End Practical / Lab Exam Invigilation Roster',
    category: 'Examination',
    date: '2024-10-22',
    urgent: false,
    content:
      'The preliminary external examiner and invigilator duties roster for UG Semester 5 & 7 has been published. Please review your scheduled sessions in Academic Setup.',
    actionRequired: 'Verify Exam Schedule',
    read: false,
  },
  {
    id: 'fn-03',
    title: 'Department Curriculum Advisory Committee Meeting',
    category: 'Academic',
    date: '2024-10-18',
    urgent: false,
    content:
      'All professors and course coordinators are invited to the CSE Board of Studies curriculum review meeting on Wednesday at 03:00 PM in Seminar Hall B.',
    read: true,
  },
  {
    id: 'fn-04',
    title: 'Call for Proposals: Sponsored Academic Research & Travel Grants',
    category: 'Research',
    date: '2024-10-15',
    urgent: false,
    content:
      'The University R&D Cell is accepting proposals for IEEE/ACM conference travel grants and student co-research funding for the Spring 2025 semester.',
    read: true,
  },
];

export const FacultyNotifications: React.FC = () => {
  const toast = useToast();
  const [notices, setNotices] = useState<FacultyNotice[]>(INITIAL_FACULTY_NOTICES);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleMarkAllRead = () => {
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All department notifications marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const filtered = notices.filter(n => categoryFilter === 'all' || n.category === categoryFilter);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Circulars & Notices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional memorandums, examination invigilation orders, and department updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['all', 'Examination', 'Academic', 'Dean Office', 'Research'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(notice => (
          <Card
            key={notice.id}
            className={`transition-all ${
              !notice.read ? 'border-l-4 border-l-teal-600 bg-white' : 'bg-slate-50/50 opacity-90'
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
                    {notice.urgent && <Badge variant="danger">Urgent Action</Badge>}
                    <Badge variant="teal">{notice.category}</Badge>
                    {!notice.read && <Badge variant="warning">Unread</Badge>}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{notice.content}</p>

                  {notice.actionRequired && (
                    <div className="mt-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Action: {notice.actionRequired}</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" /> {notice.date}
                  </span>
                  <button
                    onClick={() => handleToggleRead(notice.id)}
                    className="text-xs font-medium text-teal-700 hover:text-teal-900 cursor-pointer underline"
                  >
                    {notice.read ? 'Mark unread' : 'Dismiss'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
