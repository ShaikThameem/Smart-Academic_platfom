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
  ExternalLink,
  User,
  Building,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const handleDownloadIdCard = () => {
    toast.success('Digital Student Identity Card (UG-B.Tech) downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
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
              <Badge variant="teal">Semester 5 (UG)</Badge>
              <Badge variant="success">Active Status</Badge>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              USN: <span className="font-mono font-semibold text-teal-300">1CS23CS001</span> • B.Tech Computer Science & Engineering
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              University Academic Enrollment: 2023–2027 • Section 5-A
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={handleDownloadIdCard}>
            <Download className="w-4 h-4 mr-2" />
            Download Digital ID
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Contact */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact & Personal Info" subtitle="Official registered contact particulars" />
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>College Email</span>
                </div>
                <span className="font-medium text-slate-800">{user.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>Mobile Contact</span>
                </div>
                <span className="font-medium text-slate-800 font-mono">+1 (555) 234-8971</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Date of Birth</span>
                </div>
                <span className="font-medium text-slate-800">14 August 2004</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Hostel / Residence</span>
                </div>
                <span className="font-medium text-slate-800">Hostel Block C, Room 312</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Emergency Contact</span>
                </div>
                <span className="font-medium text-slate-800">+1 (555) 902-3341 (Guardian)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Faculty Mentor / Proctor" subtitle="Assigned Academic Guide" />
            <CardContent>
              <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-100 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    RC
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Dr. Robert Chen</h4>
                    <p className="text-xs text-teal-700">Associate Professor • Computer Science</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-teal-100/60 text-xs text-slate-600 space-y-1">
                  <p>Room: Faculty Cabin C-204</p>
                  <p>Email: r.chen@smartacademic.edu</p>
                  <p>Office Hours: Mon, Wed 02:00 PM - 04:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right: Academic Pedigree */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Undergraduate Academic Track" subtitle="University degree curriculum progress" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Program</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">B.Tech (Honors)</div>
                  <div className="text-[10px] text-teal-600 font-medium">CSE Core</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Cumulative GPA</div>
                  <div className="text-sm font-bold text-teal-700 mt-1">8.72 / 10.0</div>
                  <div className="text-[10px] text-slate-500 font-medium">First Class Distinction</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Credits Earned</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">112 / 160</div>
                  <div className="text-[10px] text-emerald-600 font-medium">70.0% Complete</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Academic Standing</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">Exemplary</div>
                  <div className="text-[10px] text-slate-500 font-medium">Zero Backlogs</div>
                </div>
              </div>

              {/* Semester Summary Table */}
              <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 border-b border-slate-200">
                  Semester Progression & Performance Record
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-5 px-4 py-2 font-medium text-slate-500 bg-slate-50">
                    <span>Semester</span>
                    <span>Term</span>
                    <span>Credits</span>
                    <span>SGPA</span>
                    <span>Result</span>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-2.5 items-center">
                    <span className="font-semibold text-slate-900">Semester 1</span>
                    <span className="text-slate-600">Autumn 2022</span>
                    <span className="text-slate-700">22.0</span>
                    <span className="font-mono font-semibold text-teal-700">8.45</span>
                    <span><Badge variant="success">Passed</Badge></span>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-2.5 items-center">
                    <span className="font-semibold text-slate-900">Semester 2</span>
                    <span className="text-slate-600">Spring 2023</span>
                    <span className="text-slate-700">22.0</span>
                    <span className="font-mono font-semibold text-teal-700">8.60</span>
                    <span><Badge variant="success">Passed</Badge></span>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-2.5 items-center">
                    <span className="font-semibold text-slate-900">Semester 3</span>
                    <span className="text-slate-600">Autumn 2023</span>
                    <span className="text-slate-700">24.0</span>
                    <span className="font-mono font-semibold text-teal-700">8.75</span>
                    <span><Badge variant="success">Passed</Badge></span>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-2.5 items-center">
                    <span className="font-semibold text-slate-900">Semester 4</span>
                    <span className="text-slate-600">Spring 2024</span>
                    <span className="text-slate-700">24.0</span>
                    <span className="font-mono font-semibold text-teal-700">8.84</span>
                    <span><Badge variant="success">Passed</Badge></span>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-2.5 items-center bg-teal-50/30">
                    <span className="font-semibold text-teal-900">Semester 5 (Ongoing)</span>
                    <span className="text-teal-700">Autumn 2024</span>
                    <span className="text-slate-700">20.0</span>
                    <span className="font-mono text-slate-400">In Progress</span>
                    <span><Badge variant="warning">Ongoing</Badge></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Enrolled Electives & Specialization" subtitle="Approved tracks by Academic Dean" />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">Elective 1: Cloud Architecture</span>
                    <Badge variant="teal">3 Credits</Badge>
                  </div>
                  <p className="text-slate-500">CS504E • Specialization in Distributed Systems</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">Open Elective: Tech Entrepreneurship</span>
                    <Badge variant="info">2 Credits</Badge>
                  </div>
                  <p className="text-slate-500">OE501 • Dept. of Management Studies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
