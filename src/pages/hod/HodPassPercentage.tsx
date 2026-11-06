import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Percent,
  Award,
  TrendingUp,
  AlertTriangle,
  Download,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SubjectPassStat {
  code: string;
  name: string;
  semester: number;
  appeared: number;
  passed: number;
  passPercentage: number;
  facultyName: string;
}

const SUBJECT_PASS_STATS: SubjectPassStat[] = [
  { code: 'CS501', name: 'Database Management Systems', semester: 5, appeared: 64, passed: 62, passPercentage: 96.8, facultyName: 'Dr. Robert Chen' },
  { code: 'CS502', name: 'Design & Analysis of Algorithms', semester: 5, appeared: 64, passed: 60, passPercentage: 93.7, facultyName: 'Prof. David Wilson' },
  { code: 'CS503', name: 'Computer Networks', semester: 5, appeared: 64, passed: 61, passPercentage: 95.3, facultyName: 'Dr. Rajesh Kumar' },
  { code: 'CS504', name: 'Operating Systems', semester: 5, appeared: 64, passed: 58, passPercentage: 90.6, facultyName: 'Dr. Sarah Jenkins' },
  { code: 'CS505', name: 'Theory of Computation', semester: 5, appeared: 64, passed: 56, passPercentage: 87.5, facultyName: 'Prof. Michael Brown' },
  { code: 'CS506L', name: 'Database Systems Laboratory', semester: 5, appeared: 64, passed: 64, passPercentage: 100.0, facultyName: 'Dr. Robert Chen' },
];

export const HodPassPercentage: React.FC = () => {
  const toast = useToast();
  const [selectedSem, setSelectedSem] = useState('5');

  const overallAppeared = SUBJECT_PASS_STATS.reduce((a, b) => a + b.appeared, 0);
  const overallPassed = SUBJECT_PASS_STATS.reduce((a, b) => a + b.passed, 0);
  const overallPercentage = ((overallPassed / overallAppeared) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Pass Percentage & Examination Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise and semester-wise pass rate analysis, grade distribution, and remedial triggers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Controller of Examinations (CoE) Report exported.')}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export CoE Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Overall Dept Pass Rate"
          value={`${overallPercentage}%`}
          subtitle="Semester 5 Regular Exams"
          icon={<Percent className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Distinction Honors Rate"
          value="42.5%"
          subtitle="CGPA >= 8.5"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="100% Pass Courses"
          value="1 Course"
          subtitle="CS506L Systems Lab"
          icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Remedial Target Courses"
          value="1 Course"
          subtitle="Pass Rate < 90% (CS505)"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Subject-Wise Pass Audit Table */}
      <Card className="overflow-x-auto">
        <CardHeader
          title="Subject-Wise Pass Audit (Semester 5)"
          subtitle="Detailed performance metrics per curriculum course"
        />
        <CardContent className="p-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3">Course Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Course Faculty</th>
                <th className="p-3">Students Appeared</th>
                <th className="p-3">Students Passed</th>
                <th className="p-3">Pass Percentage</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SUBJECT_PASS_STATS.map(stat => (
                <tr key={stat.code} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-teal-900">{stat.code}</td>
                  <td className="p-3 font-medium text-slate-900">{stat.name}</td>
                  <td className="p-3 text-slate-600">{stat.facultyName}</td>
                  <td className="p-3 font-mono text-slate-700">{stat.appeared}</td>
                  <td className="p-3 font-mono font-semibold text-slate-800">{stat.passed}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold font-mono text-xs ${
                        stat.passPercentage >= 95
                          ? 'text-emerald-700'
                          : stat.passPercentage >= 90
                          ? 'text-teal-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {stat.passPercentage}%
                    </span>
                  </td>
                  <td className="p-3">
                    {stat.passPercentage >= 95 ? (
                      <Badge variant="success">Excellent</Badge>
                    ) : stat.passPercentage >= 90 ? (
                      <Badge variant="teal">Normal</Badge>
                    ) : (
                      <Badge variant="danger">Remedial Flag</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {stat.passPercentage < 90 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] py-1 border-amber-300 text-amber-800"
                        onClick={() => toast.success(`Remedial coaching ordered for ${stat.code}.`)}
                      >
                        Order Remedial Classes
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Compliant</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
