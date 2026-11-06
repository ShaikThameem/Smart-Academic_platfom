import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  UserCheck,
  Mail,
  Phone,
  Building,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HodProfile: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleDownloadId = () => {
    toast.success('HOD Official Administrative Credential Card downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-sm border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-1 flex items-center justify-center shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center font-bold text-2xl text-teal-300">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <Badge variant="teal">Head of Department (HOD)</Badge>
              <Badge variant="success">Senior Professor</Badge>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Department of Computer Science & Engineering • Faculty ID: <span className="font-mono text-teal-300">HOD-CSE-001</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              HOD Secretariat: Room B-101, Main Admin Block • Intercom: Ext. 4001
            </p>
          </div>
        </div>

        <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={handleDownloadId}>
          <Download className="w-4 h-4 mr-2" />
          Download Admin ID
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <Card>
          <CardHeader title="Office & Contact" subtitle="Official Department Secretariat" />
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-teal-600" />
                <span>Department Email</span>
              </div>
              <span className="font-medium text-slate-800">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Building className="w-4 h-4 text-teal-600" />
                <span>Office Location</span>
              </div>
              <span className="font-medium text-slate-800">Admin Block, Room B-101</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Intercom</span>
              </div>
              <span className="font-mono font-medium text-slate-800">Ext. 4001 / 4002</span>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Mandate */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Department Leadership & Administration" subtitle="Current governance portfolios" />
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Department Size</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">480 Students</div>
                  <div className="text-[10px] text-teal-700">32 Full-time Faculty</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Degree Programs</div>
                  <div className="text-sm font-bold text-teal-700 mt-1">B.Tech & M.Tech</div>
                  <div className="text-[10px] text-slate-500">NBA Tier-1 Accredited</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Tenure as HOD</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">3rd Year</div>
                  <div className="text-[10px] text-slate-500">2022 – 2025 Mandate</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-700">
                <h4 className="font-semibold text-slate-900">Key Administrative Portfolios:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Chairman, Board of Studies (BoS) for Computer Science Curriculum</li>
                  <li>Chief Authority for Semester Timetable Approval & Direct Publication</li>
                  <li>Academic Performance Audit & Grievance Redressal Committee Head</li>
                  <li>Supervision of Annual NBA and NAAC Self-Assessment Reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
