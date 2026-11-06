import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  LineChart,
  BarChart,
  Users,
  Award,
  BookOpen,
  Building,
  GraduationCap,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HodDepartmentAnalytics: React.FC = () => {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Department Analytics & Institutional KPIs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            NIRF / NBA accreditation metrics, faculty-student ratios, lab utilization, and research benchmarks.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('NBA Accreditation Dossier (PDF) exported.')}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export NBA Dossier
        </Button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Student-to-Faculty Ratio"
          value="14.8 : 1"
          subtitle="NBA Compliance benchmark: 15:1"
          icon={<Users className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Overall Placement Rate"
          value="94.2%"
          subtitle="Average CTC: $92,000 / annum"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Lab Space Utilization"
          value="88.5%"
          subtitle="12 Research & Teaching Labs"
          icon={<Building className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          title="Sponsored Grants (FY 24)"
          value="$620,000"
          subtitle="4 Funded National Projects"
          icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
        />
      </div>

      {/* Analytical Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Curriculum Outcome (CO-PO) Attainment"
            subtitle="Semester-wise course outcome attainment percentages"
          />
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>PO1: Engineering Knowledge & Systems</span>
                  <span className="text-teal-700">86.4% Attainment</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '86.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>PO2: Problem Analysis & Algorithmic Complexity</span>
                  <span className="text-teal-700">82.1% Attainment</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '82.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>PO3: Design & Development of Scalable Solutions</span>
                  <span className="text-teal-700">79.5% Attainment</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '79.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>PO4: Modern Tool Usage (Cloud, Docker, AI)</span>
                  <span className="text-emerald-700">91.0% Attainment</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '91.0%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Faculty Research & Intellectual Property"
            subtitle="Scopus/WoS indexed research and patents filed"
          />
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Journals Published</span>
                <p className="text-xl font-bold text-slate-900 mt-1">42 Papers</p>
                <span className="text-[10px] text-teal-600">Calendar Year 2024</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Patents Granted</span>
                <p className="text-xl font-bold text-teal-700 mt-1">6 Patents</p>
                <span className="text-[10px] text-slate-500">Autonomous Computing</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-slate-800 space-y-1">
              <p className="font-semibold text-teal-900">NBA Accreditation Status:</p>
              <p className="text-[11px] text-slate-600">
                Tier-1 Accredited through 2026. Self-Assessment Report (SAR) scheduled for revision in Q3 2025.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
