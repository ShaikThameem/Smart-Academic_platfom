import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  badge,
  trend,
}) => {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className="text-xs mt-1.5 flex items-center gap-1 font-medium">
              <span className={trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
};
