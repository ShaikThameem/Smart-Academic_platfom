import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Users2, Calendar, MapPin, CheckCircle2, Plus, Clock, ExternalLink } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { CollegeClub } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const StudentClubs: React.FC = () => {
  const toast = useToast();
  const [clubs, setClubs] = useState<CollegeClub[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClubs() {
      try {
        setIsLoading(true);
        const data = await academicService.getClubs();
        setClubs(data);
      } catch (err) {
        console.error('Failed to load clubs', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadClubs();
  }, []);

  const handleToggleJoin = async (club: CollegeClub) => {
    try {
      const updated = await academicService.toggleClubJoin(club.id);
      setClubs(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      if (updated.isJoined) {
        toast.success(`You have joined ${updated.name}! Meeting invites will appear on your schedule.`);
      } else {
        toast.info(`Left ${updated.name}.`);
      }
    } catch (err) {
      toast.error('Failed to update club membership');
    }
  };

  const filtered = clubs.filter(c => selectedCategory === 'all' || c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Student Life & Technical Societies
            </span>
            <Badge variant="info" size="sm">
              College Activities Hub
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Clubs & Professional Chapters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Join collegiate technical societies, cultural clubs, coding chapters, and robotics societies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-800 focus:outline-none"
          >
            <option value="all">All Categories ({clubs.length})</option>
            <option value="Coding">Coding & Hackathons</option>
            <option value="Technical">Technical & Research</option>
            <option value="Robotics">Robotics & Hardware</option>
            <option value="Cultural">Cultural & Arts</option>
            <option value="Social">Social & Community</option>
          </select>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(club => (
          <Card key={club.id} className="flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                <div>
                  <Badge variant={club.category === 'Coding' ? 'purple' : club.category === 'Technical' ? 'info' : 'success'} size="sm">
                    {club.category}
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{club.name}</h3>
                </div>
                {club.isJoined && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" /> Joined
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed min-h-[48px]">{club.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Student Lead:</span>
                    <strong className="text-slate-800">{club.leadName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Faculty Advisor:</span>
                    <strong className="text-slate-800">{club.facultyAdvisor}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Members:</span>
                    <strong className="text-slate-800">{club.memberCount} Students</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{club.meetingSchedule}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Semester 5 Activity Credit</span>
              <Button
                size="sm"
                variant={club.isJoined ? 'outline' : 'primary'}
                className={club.isJoined ? 'text-rose-600 border-rose-200 hover:bg-rose-50' : 'bg-teal-600 hover:bg-teal-700'}
                onClick={() => handleToggleJoin(club)}
              >
                {club.isJoined ? 'Leave Club' : 'Request to Join'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
