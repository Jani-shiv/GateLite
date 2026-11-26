import { Users, UserCheck, Ticket, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle, Calendar, Building2, DollarSign, FileText, Bell, Shield, Package, Car, Megaphone, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';

const stats = [
  { label: 'Total Residents', value: '1,247', icon: Users, trend: '+12%', trendUp: true, color: 'mint' as const },
  { label: 'Visits Today', value: '89', icon: UserCheck, trend: '+5%', trendUp: true, color: 'sky' as const },
  { label: 'Open Tickets', value: '7', icon: Ticket, trend: '-2', trendUp: false, color: 'butter' as const },
  { label: 'Active Alerts', value: '0', icon: AlertTriangle, trend: '—', trendUp: true, color: 'rose' as const },
];

const recentActivity = [
  { time: '09:15', type: 'visitor', description: 'Visitor approved for Flat 101', status: 'approved', user: 'Guard A' },
  { time: '09:08', type: 'delivery', description: 'Delivery left at gate for Flat 205', status: 'left_at_gate', user: 'Guard A' },
  { time: '08:52', type: 'visitor', description: 'Visitor denied for Flat 312', status: 'denied', user: 'Guard B' },
  { time: '08:45', type: 'ticket', description: 'New complaint: Water leakage Flat 401', status: 'open', user: 'Resident' },
  { time: '08:30', type: 'visitor', description: 'Pre-approved guest entered Flat 150', status: 'entered', user: 'System' },
  { time: '08:15', type: 'notice', description: 'Notice published: Maintenance Schedule', status: 'published', user: 'Admin' },
];

const statusConfig = {
  approved: { label: 'APPROVED', class: 'status-approved', icon: CheckCircle },
  denied: { label: 'DENIED', class: 'status-denied', icon: XCircle },
  entered: { label: 'ENTERED', class: 'status-entered', icon: CheckCircle },
  left_at_gate: { label: 'LEFT AT GATE', class: 'status-pending', icon: Clock },
  open: { label: 'OPEN', class: 'status-pending', icon: AlertTriangle },
  published: { label: 'PUBLISHED', class: 'bg-lilac/10 text-lilac border-lilac', icon: Megaphone },
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Dashboard</h1>
          <p className="text-ink/60 font-body mt-1">Welcome back! Here's what's happening at the gate today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<TrendingUpIcon className="w-4 h-4" />}>Reports</Button>
          <Button variant="primary" size="sm" leftIcon={<Users className="w-4 h-4" />}>Add Resident</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading text-ink">Recent Activity</h2>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <DataTable
              columns={[
                { key: 'time', header: 'Time', width: 'w-20' },
                { key: 'type', header: 'Type', width: 'w-24' },
                { key: 'description', header: 'Description' },
                { key: 'status', header: 'Status', width: 'w-32' },
                { key: 'user', header: 'By', width: 'w-24' },
              ]}
              data={recentActivity}
              renderCell={(row, column) => {
                if (column.key === 'type') {
                  const typeIcons: Record<string, React.ReactNode> = {
                    visitor: <UserCheck className="w-4 h-4 text-sky" />,
                    delivery: <Package className="w-4 h-4 text-peach" />,
                    ticket: <Ticket className="w-4 h-4 text-butter" />,
                    notice: <Megaphone className="w-4 h-4 text-lilac" />,
                  };
                  return (
                    <span className="inline-flex items-center gap-1 text-sm font-body">
                      {typeIcons[row.type] || null}
                      {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                    </span>
                  );
                }
                if (column.key === 'status') {
                  const config = statusConfig[row.status as keyof typeof statusConfig];
                  if (!config) return <span className="text-ink/80">{row.status}</span>;
                  return (
                    <span className={`${config.class} inline-flex items-center gap-1`}>
                      {config.icon && <config.icon className="w-3 h-3" />}
                      {config.label}
                    </span>
                  );
                }
                return <span className="text-sm font-body text-ink/80">{row[column.key as keyof typeof row]}</span>;
              }}
            />
          </Card>
        </section>

        <section className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full" justify="start" leftIcon={<UserCheck className="w-5 h-5" />}>
                Create Visitor Pass
              </Button>
              <Button variant="secondary" size="lg" className="w-full" justify="start" leftIcon={<Megaphone className="w-5 h-5" />}>
                Publish Notice
              </Button>
              <Button variant="ghost" size="lg" className="w-full" justify="start" borderColor="butter" textColor="butter" hoverBg="butter/10" leftIcon={<Ticket className="w-5 h-5" />}>
                View All Tickets
              </Button>
              <Button variant="ghost" size="lg" className="w-full" justify="start" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<Users className="w-5 h-5" />}>
                Manage Residents
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-mint/10 border-2 border-mint rounded-[8px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-mint" />
                  <span className="font-medium font-body">Gate Connection</span>
                </div>
                <span className="bg-mint border-3 border-mint text-ink text-xs font-bold font-mono px-2.5 py-0.5 rounded-[999px]">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-sky/10 border-2 border-sky rounded-[8px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-sky" />
                  <span className="font-medium font-body">Push Service</span>
                </div>
                <span className="bg-sky border-3 border-sky text-ink text-xs font-bold font-mono px-2.5 py-0.5 rounded-[999px]">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-lilac/10 border-2 border-lilac rounded-[8px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-lilac" />
                  <span className="font-medium font-body">SMS Gateway</span>
                </div>
                <span className="bg-lilac border-3 border-lilac text-ink text-xs font-bold font-mono px-2.5 py-0.5 rounded-[999px]">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-butter/10 border-2 border-butter rounded-[8px]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-butter" />
                  <span className="font-medium font-body">Storage</span>
                </div>
                <span className="bg-butter border-3 border-butter text-ink text-xs font-bold font-mono px-2.5 py-0.5 rounded-[999px]">67% Used</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}