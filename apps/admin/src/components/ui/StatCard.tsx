import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  color: 'mint' | 'sky' | 'butter' | 'rose' | 'lilac' | 'peach';
}

const colorClasses = {
  mint: 'bg-mint/10 border-mint',
  sky: 'bg-sky/10 border-sky',
  butter: 'bg-butter/10 border-butter',
  rose: 'bg-rose/10 border-rose',
  lilac: 'bg-lilac/10 border-lilac',
  peach: 'bg-peach/10 border-peach',
};

const iconColorClasses = {
  mint: 'text-mint',
  sky: 'text-sky',
  butter: 'text-butter',
  rose: 'text-rose',
  lilac: 'text-lilac',
  peach: 'text-peach',
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, color }: StatCardProps) {
  return (
    <Card className={`${colorClasses[color]} border-2`} hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium font-body text-ink/70">{label}</p>
          <p className="text-3xl font-bold font-heading text-ink mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-sm font-medium font-mono ${trendUp ? 'text-mint' : 'text-rose'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-xs font-body text-ink/50">vs last week</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-[12px] border-3 border-ink flex items-center justify-center ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}