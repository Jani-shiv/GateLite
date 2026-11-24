import { Search, Filter, Plus, Ticket, AlertTriangle, Clock, CheckCircle, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useState } from 'react';

const tickets = [
  { id: '#124', title: 'Water leakage in bathroom', flat: 'A-401', category: 'maintenance', priority: 'high', status: 'open', assignee: 'Unassigned', created: '2 hours ago' },
  { id: '#123', title: 'Noise complaint - loud music', flat: 'B-205', category: 'noise', priority: 'medium', status: 'in_progress', assignee: 'Security Team', created: '5 hours ago' },
  { id: '#122', title: 'Lift not working', flat: 'C-312', category: 'maintenance', priority: 'critical', status: 'open', assignee: 'Maintenance', created: '1 day ago' },
  { id: '#121', title: 'Parking space dispute', flat: 'A-102', category: 'other', priority: 'low', status: 'resolved', assignee: 'Admin', created: '2 days ago' },
  { id: '#120', title: 'Security guard rude behavior', flat: 'B-201', category: 'security', priority: 'medium', status: 'in_progress', assignee: 'Security Head', created: '3 days ago' },
];

const categoryConfig = {
  maintenance: { label: 'MAINTENANCE', color: 'sky', icon: AlertTriangle },
  noise: { label: 'NOISE', color: 'butter', icon: AlertTriangle },
  security: { label: 'SECURITY', color: 'rose', icon: User },
  other: { label: 'OTHER', color: 'lilac', icon: Ticket },
};

const priorityConfig = {
  critical: { label: 'CRITICAL', class: 'badge-danger' },
  high: { label: 'HIGH', class: 'badge-warning' },
  medium: { label: 'MEDIUM', class: 'badge-info' },
  low: { label: 'LOW', class: 'badge-secondary' },
};

const statusConfig = {
  open: { label: 'OPEN', class: 'status-pending', icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: 'IN PROGRESS', class: 'status-stamp bg-lilac text-ink', icon: <Ticket className="w-3 h-3" /> },
  resolved: { label: 'RESOLVED', class: 'status-approved', icon: <CheckCircle className="w-3 h-3" /> },
  closed: { label: 'CLOSED', class: 'status-stamp bg-sky text-ink', icon: <CheckCircle className="w-3 h-3" /> },
};

export function Tickets() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Tickets & Complaints</h1>
          <p className="text-ink/60 font-body mt-1">Track and manage all resident complaints and tickets</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </button>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button className="btn btn-ghost btn-md flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
        
        <DataTable
          columns={[
            { key: 'id', header: 'ID', width: 'w-20' },
            { key: 'title', header: 'Title' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'category', header: 'Category', width: 'w-32' },
            { key: 'priority', header: 'Priority', width: 'w-24' },
            { key: 'status', header: 'Status', width: 'w-32' },
            { key: 'assignee', header: 'Assignee', width: 'w-28' },
            { key: 'created', header: 'Created', width: 'w-28' },
          ]}
          data={tickets}
          renderCell={(row, column) => {
            if (column.key === 'category') {
              const config = categoryConfig[row.category as keyof typeof categoryConfig];
              const Icon = config.icon;
              return (
                <span className={`chip chip-${config.color} inline-flex items-center gap-1`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              );
            }
            if (column.key === 'priority') {
              const config = priorityConfig[row.priority as keyof typeof priorityConfig];
              return <span className={`${config.class}`}>{config.label}</span>;
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return (
                <span className={`${config.class} inline-flex items-center gap-1`}>
                  {config.icon}
                  {config.label}
                </span>
              );
            }
            if (column.key === 'id') {
              return <span className="font-mono font-medium text-ink">{row.id}</span>;
            }
            if (column.key === 'title') {
              return <span className="font-medium font-body text-ink max-w-xs truncate block">{row.title}</span>;
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}