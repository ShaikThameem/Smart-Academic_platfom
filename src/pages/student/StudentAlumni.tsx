import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  Compass,
  Search,
  Briefcase,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Building2,
  Users,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { AlumniProfile } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentAlumni: React.FC = () => {
  const toast = useToast();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mentorship Modal state
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);
  const [mentorMessage, setMentorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await academicService.getAlumni();
        setAlumni(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAlumni = alumni.filter(item => {
    const company = item.company || item.currentCompany || '';
    const role = item.role || item.currentRole || '';
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || item.batch === selectedBatch || item.graduationYear?.toString() === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const batches = Array.from(new Set(alumni.map(a => a.batch))).sort().reverse();

  const handleSendMentorshipRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    toast.success(`Mentorship invitation sent to ${selectedMentor.name} at ${selectedMentor.company}!`);
    setSelectedMentor(null);
    setMentorMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">University Alumni & Mentorship Network</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect with B.Tech graduates working in global tech giants, startups, and research laboratories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="teal" className="py-1 px-3">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            {alumni.length} Verified Alumni
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, company (e.g. Google, Amazon), or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
          >
            <option value="all">All Graduating Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>
                Class of {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading alumni network...</div>
      ) : filteredAlumni.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
          No alumni found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlumni.map(person => (
            <Card key={person.id} className="hover:border-teal-200 transition-all hover:shadow-sm">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-teal-300 font-bold flex items-center justify-center text-sm shadow-xs">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{person.name}</h3>
                        <p className="text-[11px] text-slate-500">Class of {person.batch} • {person.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                        <span>{person.role}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 pl-5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-teal-700">{person.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px] px-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {person.location}
                      </span>
                      {person.isAvailableForMentorship && (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mentoring Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    variant="teal"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedMentor(person)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Request Advice
                  </Button>
                  <a
                    href={person.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mentorship Modal */}
      {selectedMentor && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMentor(null)}
          title={`Request Mentorship: ${selectedMentor.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSendMentorshipRequest} className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-slate-900">{selectedMentor.role} at {selectedMentor.company}</p>
              <p className="text-slate-500">Department: {selectedMentor.department} (Batch {selectedMentor.batch})</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message / Area you seek guidance on
              </label>
              <textarea
                rows={4}
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Hi! I am a 5th Sem student preparing for systems engineering interviews and would love 15 minutes of guidance on your experience..."
                value={mentorMessage}
                onChange={e => setMentorMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setSelectedMentor(null)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Send Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
