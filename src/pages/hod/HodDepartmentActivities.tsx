import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Activity,
  Award,
  Building,
  GraduationCap,
  Calendar,
  Users,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ActivityItem {
  id: string;
  title: string;
  category: 'Faculty Development' | 'Industry MoU' | 'Research Grant' | 'Student Chapter';
  date: string;
  leadFaculty: string;
  status: 'active' | 'completed' | 'in_progress';
  description: string;
  impactMetrics: string;
}

const ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'AWS Cloud Academy Institutional Accreditation & Training',
    category: 'Industry MoU',
    date: 'August 2024 - Ongoing',
    leadFaculty: 'Dr. Rajesh Kumar',
    status: 'active',
    description:
      'Official partnership signed with Amazon Web Services providing 300 students with $100 AWS credits each and certified Cloud Practitioner curriculum.',
    impactMetrics: '300 Students Enrolled • 24 Faculty Certified',
  },
  {
    id: 'act-2',
    title: '5-Day National FDP on Generative AI & Foundation Models',
    category: 'Faculty Development',
    date: '10–14 September 2024',
    leadFaculty: 'Dr. Sarah Jenkins',
    status: 'completed',
    description:
      'Hands-on workshop funded by AICTE covering transformer architectures, prompt engineering, and LLM fine-tuning techniques.',
    impactMetrics: '65 External Faculty Attendees • 4 Keynote Speakers',
  },
  {
    id: 'act-3',
    title: 'DST-SERB Sponsored Research Grant: Autonomous Edge Systems',
    category: 'Research Grant',
    date: 'July 2024 – June 2027',
    leadFaculty: 'Dr. Robert Chen',
    status: 'active',
    description:
      'Three-year federally sponsored research grant investigating energy-efficient federated learning on edge microcontrollers.',
    impactMetrics: '$120,000 Funding • 2 Full-time Ph.D. Fellows',
  },
  {
    id: 'act-4',
    title: 'ACM Student Chapter Annual 36-Hour Hackathon (CodeCraft)',
    category: 'Student Chapter',
    date: '02–03 October 2024',
    leadFaculty: 'Prof. David Wilson',
    status: 'completed',
    description:
      'Department-wide hackathon with tracks in FinTech, Healthcare, and Sustainable Campus Infrastructure.',
    impactMetrics: '48 Teams • $3,000 in Prize Grants',
  },
];

export const HodDepartmentActivities: React.FC = () => {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Department Activities & Initiatives</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty development programs, industry MoUs, student chapters, and sponsored grants.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Annual Departmental Activities Compendium exported.')}
        >
          <Award className="w-4 h-4 mr-1.5" />
          Export Compendium
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACTIVITIES_LIST.map(item => (
          <Card key={item.id} className="hover:border-teal-200 transition-all">
            <CardHeader
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</span>
                  <Badge variant={item.status === 'active' ? 'teal' : 'success'}>
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
              }
              subtitle={
                <span className="text-[11px] text-teal-700 font-semibold">
                  {item.category} • Lead: {item.leadFaculty}
                </span>
              }
            />
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Outcome & Impact:</span>
                <span className="font-bold text-slate-900">{item.impactMetrics}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Dean
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
