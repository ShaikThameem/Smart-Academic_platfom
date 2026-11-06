import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Download,
  Building,
  Briefcase,
  FileText,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FacultyProfile: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleDownloadId = () => {
    toast.success('Digital Faculty Staff Identification Card downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
              <Badge variant="teal">{user.designation || 'Associate Professor'}</Badge>
              <Badge variant="success">Tenured Faculty</Badge>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Staff ID: <span className="font-mono font-semibold text-teal-300">FAC-CSE-101</span> • Dept. of Computer Science & Engineering
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Cabin: C-204, Academic Block 3 • Office Hours: Mon, Wed 02:00 PM - 04:00 PM
            </p>
          </div>
        </div>

        <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={handleDownloadId}>
          <Download className="w-4 h-4 mr-2" />
          Download Staff ID
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Official Contact Particulars" subtitle="University faculty directory details" />
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>University Email</span>
                </div>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>Intercom / Ext</span>
                </div>
                <span className="font-mono font-medium text-slate-800">Ext. 4082</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>Cabin / Laboratory</span>
                </div>
                <span className="font-medium text-slate-800">Room C-204 (Systems Lab)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Date of Joining</span>
                </div>
                <span className="font-medium text-slate-800">12 July 2018</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic & Research Credentials */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Academic Qualifications & Pedigree" subtitle="Degrees, fellowships and research expertise" />
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Highest Degree</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Ph.D. in CS</div>
                  <div className="text-[10px] text-teal-700">Specialization in DB & Dist Systems</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Publications</div>
                  <div className="text-sm font-bold text-teal-700 mt-1">24 Papers</div>
                  <div className="text-[10px] text-slate-500">IEEE & ACM Transactions</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Research Grants</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">$140,000+</div>
                  <div className="text-[10px] text-slate-500">Sponsored Industry Projects</div>
                </div>
              </div>

              <div className="mt-4 border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <h4 className="font-semibold text-slate-900">Current Academic Responsibilities:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Course Coordinator: CS501 Database Management Systems</li>
                  <li>Instructor: CS504 Operating Systems (Sec 5-B)</li>
                  <li>Head: Department Distributed Systems Laboratory</li>
                  <li>Academic Proctor for Batch 2023–2027 Section A (30 Students)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
