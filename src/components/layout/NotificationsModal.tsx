import React from 'react';
import { Modal } from '../common/Modal';
import { Bell, Calendar, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Timetable Published: Fall Semester 2026 (v2.1)',
      desc: 'HOD CSE has officially approved and published timetable version 2.1. Theory begins at 8:30 AM with standard 10m breaks.',
      time: '2 hours ago',
      type: 'timetable',
      unread: true,
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'notif-2',
      title: 'Low Attendance Alert: CS303 Computer Networks',
      desc: 'Your cumulative attendance has fallen below 70% (currently 69.2%). Attend next 6 sessions to prevent exam debarment.',
      time: 'Yesterday',
      type: 'alert',
      unread: true,
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
    },
    {
      id: 'notif-3',
      title: 'Continuous Assessment: Quiz 2 Live',
      desc: 'Dr. Rajesh Kumar has posted Quiz 2 on Tree Traversals and Dijkstra Algorithms. Deadline is Oct 31, 23:59 IST.',
      time: '2 days ago',
      type: 'test',
      unread: false,
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'notif-4',
      title: 'Operating Systems Lab Rescheduled to Room 301',
      desc: 'Friday afternoon lab session relocated to Systems & Networking Lab 301 due to terminal software updates.',
      time: '3 days ago',
      type: 'timetable',
      unread: false,
      icon: <CheckCircle2 className="w-4 h-4 text-slate-500" />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <span>Academic Notifications</span>
        </div>
      }
      subtitle="Official notices, timetable publications, and attendance alerts"
      maxWidth="md"
    >
      <div className="divide-y divide-slate-100 -my-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`py-3.5 px-2 flex items-start gap-3 rounded-lg transition-colors ${
              n.unread ? 'bg-blue-50/40' : 'hover:bg-slate-50'
            }`}
          >
            <div className="p-2 rounded-lg bg-white border border-slate-200/80 shrink-0 shadow-2xs">
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-semibold text-slate-900 truncate">{n.title}</h4>
                {n.unread && (
                  <Badge variant="info" size="sm" dot={false}>
                    New
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
              <span className="text-[10px] text-slate-400 mt-1.5 block">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
