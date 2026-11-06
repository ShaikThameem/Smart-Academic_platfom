import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Shield,
  FileQuestion,
  Filter,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Complaint } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentComplaints: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab & Infrastructure' as Complaint['category'],
    priority: 'medium' as Complaint['priority'],
    description: '',
    isAnonymous: false,
  });

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await academicService.getComplaints(user.id);
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in both title and description.');
      return;
    }

    try {
      await academicService.submitComplaint({
        studentId: user.id,
        studentName: formData.isAnonymous ? 'Anonymous Student' : user.name,
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        isAnonymous: formData.isAnonymous,
      });

      toast.success('Complaint / Grievance ticket submitted to Department Dean.');
      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'Lab & Infrastructure',
        priority: 'medium',
        description: '',
        isAnonymous: false,
      });
      loadComplaints();
    } catch (err) {
      toast.error('Failed to submit ticket. Please try again.');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="warning">Submitted / Open</Badge>;
      case 'in_progress':
        return <Badge variant="info">Under Investigation</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved & Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="info">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Grievance & Complaint Box</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit confidential feedback, academic discrepancies, or campus infrastructure grievances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <span className="text-slate-500 font-medium px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['all', 'open', 'in_progress', 'resolved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize cursor-pointer transition-colors ${
                  filterStatus === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Button variant="teal" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            File Grievance
          </Button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading grievance tickets...</div>
        ) : filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800">No grievance tickets found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You have not filed any grievances or none match the selected filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map(complaint => (
            <Card key={complaint.id} className="hover:border-slate-300 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">#{complaint.id}</span>
                      <h3 className="text-base font-semibold text-slate-900">{complaint.title}</h3>
                      {getStatusBadge(complaint.status)}
                      {getPriorityBadge(complaint.priority)}
                      <Badge variant="teal">{complaint.category}</Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {complaint.description}
                    </p>

                    {complaint.resolutionNote && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Administrative Resolution Note</span>
                        </div>
                        <p className="text-emerald-700">{complaint.resolutionNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0 text-xs text-slate-400 flex flex-col md:items-end justify-between">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> Filed: {complaint.createdAt}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-2">
                      {complaint.isAnonymous ? '🛡️ Anonymous Ticket' : `By: ${complaint.studentName}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Complaint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File a Confidential Grievance / Complaint"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject / Ticket Title"
            placeholder="e.g., Computer Systems Lab 3 terminal mouse malfunction"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              >
                <option value="Lab & Infrastructure">Lab & Infrastructure</option>
                <option value="Evaluation & Marks">Evaluation & Marks</option>
                <option value="Attendance Discrepancy">Attendance Discrepancy</option>
                <option value="Timetable Clash">Timetable Clash</option>
                <option value="Hostel & Facilities">Hostel & Facilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="low">Low (General Query)</option>
                <option value="medium">Medium (Standard Issue)</option>
                <option value="high">High (Academic Impact)</option>
                <option value="urgent">Urgent (Immediate Attention)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              className="w-full text-xs rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Provide exact room number, dates, courses or equipment details..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={e => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" /> Submit Anonymously
              </span>
              <p className="text-[11px] text-slate-500">Your name and USN will be hidden from the faculty review committee.</p>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Submit Grievance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
