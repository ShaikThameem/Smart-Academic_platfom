import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  CalendarDays,
  Plus,
  MapPin,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { DepartmentEvent } from '../../types/academic';
import { useToast } from '../../context/ToastContext';

export const HodUpcomingEvents: React.FC = () => {
  const toast = useToast();
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 01:00 PM',
    venue: 'Main Auditorium / Lab 3',
    category: 'hackathon' as DepartmentEvent['category'],
    description: '',
  });

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await academicService.getDepartmentEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please complete title and description.');
      return;
    }

    try {
      await academicService.createDepartmentEvent(formData);
      toast.success('Department event scheduled and published to student portals!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM - 01:00 PM',
        venue: 'Main Auditorium / Lab 3',
        category: 'hackathon',
        description: '',
      });
      loadEvents();
    } catch (err) {
      toast.error('Failed to create event.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Department Events</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conferences, national hackathons, faculty development programs, and guest lectures.
          </p>
        </div>

        <Button variant="teal" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <Card key={event.id} className="hover:border-teal-200 transition-all">
            <CardHeader
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm line-clamp-1">{event.title}</span>
                  <Badge variant="teal" className="capitalize">{event.category}</Badge>
                </div>
              }
              subtitle={
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> {event.date} • {event.time}
                </span>
              }
            />
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {event.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span className="truncate max-w-[130px]">{event.venue}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>{event.participantsCount} Registered</span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Department Academic / Tech Event"
        maxWidth="md"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <Input
            label="Event Title"
            placeholder="e.g. National Hackathon: AI for Sustainability"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg bg-white"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-lg bg-white capitalize"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              >
                <option value="hackathon">Hackathon</option>
                <option value="guest_lecture">Guest Lecture</option>
                <option value="workshop">Technical Workshop</option>
                <option value="symposium">Research Symposium</option>
                <option value="cultural">Department Meet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Time Range"
              placeholder="10:00 AM - 01:00 PM"
              value={formData.time}
              onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
            <Input
              label="Venue"
              placeholder="e.g. Seminar Hall C"
              value={formData.venue}
              onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Description & Eligibility</label>
            <textarea
              rows={3}
              required
              className="w-full p-2 border rounded-lg text-slate-800"
              placeholder="Provide event itinerary, speaker details, and registration deadline..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
