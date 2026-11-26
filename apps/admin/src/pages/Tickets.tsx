import { Plus, Search, Filter, Download, Upload, AlertTriangle, MessageSquare, Clock, TrendingUp, CheckCircle, XCircle, AlertTriangle as AlertTriangleIcon, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const tickets = [
  { id: 'TKT-001', category: 'MAINTENANCE', priority: 'HIGH', status: 'OPEN', title: 'Water leakage in bathroom', flat: 'A-101', reporter: 'Rajesh Patel', createdAt: '2026-11-24 08:45', assignee: null },
  { id: 'TKT-002', category: 'NOISE', priority: 'MEDIUM', status: 'IN_PROGRESS', title: 'Loud music from neighbor', flat: 'B-205', reporter: 'Priya Sharma', createdAt: '2026-11-24 09:15', assignee: 'Admin' },
  { id: 'TKT-003', category: 'CLEANLINESS', priority: 'LOW', status: 'RESOLVED', title: 'Garbage not collected', flat: 'C-301', reporter: 'Amit Kumar', createdAt: '2026-11-23 14:20', assignee: 'Admin' },
  { id: 'TKT-004', category: 'SECURITY', priority: 'HIGH', status: 'OPEN', title: 'Broken gate lock', flat: 'A-202', reporter: 'Sunita Devi', createdAt: '2026-11-24 11:30', assignee: null },
];

const categoryConfig = {
  MAINTENANCE: { label: 'MAINTENANCE', color: 'bg-butter/10 text-butter border-butter' },
  NOISE: { label: 'NOISE', color: 'bg-rose/10 text-rose border-rose' },
  CLEANLINESS: { label: 'CLEANLINESS', color: 'bg-sky/10 text-sky border-sky' },
  SECURITY: { label: 'SECURITY', color: 'bg-rose/10 text-rose border-rose' },
  COMPLAINT: { label: 'COMPLAINT', color: 'bg-butter/10 text-butter border-butter' },
  OTHER: { label: 'OTHER', color: 'bg-lilac/10 text-lilac border-lilac' },
};

const priorityConfig = {
  HIGH: { label: 'HIGH', class: 'badge-danger' },
  MEDIUM: { label: 'MEDIUM', class: 'badge-warning' },
  LOW: { label: 'LOW', class: 'badge-info' },
};

const statusConfig = {
  OPEN: { label: 'OPEN', class: 'badge-warning', icon: AlertTriangleIcon },
  IN_PROGRESS: { label: 'IN PROGRESS', class: 'badge-info', icon: Clock },
  RESOLVED: { label: 'RESOLVED', class: 'badge-primary', icon: CheckCircle },
  CLOSED: { label: 'CLOSED', class: 'badge-secondary', icon: CheckCircle },
};

export function Tickets() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Complaints & Tickets</h1>
          <p className="text-ink/60 font-body mt-1">Manage and track resident complaints</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>New Ticket</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-mint/10 border-mint">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Tickets</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">247</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-mint flex items-center justify-center">
              <FileText className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-rose/10 border-rose">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Open</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">12</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-rose flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-sky/10 border-sky">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">In Progress</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">8</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-sky flex items-center justify-center">
              <Clock className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-butter/10 border-butter">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Resolved Today</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">5</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-butter flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <Input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'id', header: 'Ticket ID', width: 'w-28' },
            { key: 'category', header: 'Category', width: 'w-28' },
            { key: 'priority', header: 'Priority', width: 'w-24' },
            { key: 'status', header: 'Status', width: 'w-32' },
            { key: 'title', header: 'Title' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'reporter', header: 'Reporter', width: 'w-32' },
            { key: 'createdAt', header: 'Created', width: 'w-36' },
            { key: 'assignee', header: 'Assignee', width: 'w-28' },
          ]}
          data={tickets}
          renderCell={(row, column) => {
            if (column.key === 'category') {
              const config = categoryConfig[row.category as keyof typeof categoryConfig];
              return <Badge variant="ghost" className={config?.color}>{config?.label}</Badge>;
            }
            if (column.key === 'priority') {
              const config = priorityConfig[row.priority as keyof typeof priorityConfig];
              return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return (
                <Badge variant="ghost" className={config?.class} leftIcon={<config.icon className="w-3 h-3" />}>
                  {config?.label}
                </Badge>
              );
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>

      <Card>
        <h2 className="text-xl font-bold font-heading text-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Create Ticket</Button>
          <Button variant="secondary" size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>Add Comment</Button>
          <Button variant="ghost" size="md" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<TrendingUp className="w-4 h-4" />}>View Analytics</Button>
          <Button variant="ghost" size="md" borderColor="butter" textColor="butter" hoverBg="butter/10" leftIcon={<AlertTriangle className="w-4 h-4" />}>Escalate</Button>
        </div>
      </Card>
    </div>
  );
}