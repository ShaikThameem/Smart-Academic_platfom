import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Bell, Calendar, Pin, Search } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { Announcement } from '../../types/academic';

export const StudentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await academicService.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = announcements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Official College Circulars
            </span>
            <Badge variant="info" size="sm">
              Live Feed
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Department & College Announcements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified circulars from Examination Division, Department Head, and Placement Cell.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-800 focus:outline-none"
          >
            <option value="all">All Circulars</option>
            <option value="Examination">Examination & Timetables</option>
            <option value="Academic">Academic Schedules</option>
            <option value="Placement">Campus Placements</option>
            <option value="Events">Hackathons & Events</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map(item => (
          <Card key={item.id} className={item.isImportant ? 'border-amber-200 bg-amber-50/20' : ''}>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant={item.category === 'Examination' ? 'danger' : item.category === 'Placement' ? 'success' : 'info'} size="sm">
                    {item.category}
                  </Badge>
                  {item.isImportant && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-600" /> High Priority Circular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">{item.content}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Issued by: <strong className="text-slate-800">{item.author}</strong></span>
                <span className="text-[11px] text-teal-600 font-medium">Official College Notification</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
