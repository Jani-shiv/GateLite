import { Search, Filter, Calendar, Download, UserCheck, Package, Car } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useState } from 'react';

const visitors = [
  { id: '1', time: '09:15', visitor: 'Amit Shah', flat: 'A-101', type: 'visitor', status: 'approved', guard: 'Guard A' },
  { id: '2', time: '09:08', visitor: 'Zomato Delivery', flat: 'B-205', type: 'delivery', status: 'left_at_gate', guard: 'Guard A' },
  { id: '3', time: '08:52', visitor: 'Rohit Verma', flat: 'C-312', type: 'visitor', status: 'denied', guard: 'Guard B' },
  { id: '4', time: '08:45', visitor: 'Uber Cab', flat: 'A-150', type: 'cab', status: 'approved', guard: 'Guard A' },
  { id: '5', time: '08:30', visitor: 'Pre-approved: Dr. Mehta', flat: 'B-201', type: 'visitor', status: 'entered', guard: 'System' },
  { id: '6', time: '08:15', visitor: 'Amazon Delivery', flat: 'C-305', type: 'delivery', status: 'approved', guard: 'Guard B' },
];

const typeConfig = {
  visitor: { label: 'VISITOR', icon: UserCheck, color: 'sky' },
  delivery: { label: 'DELIVERY', icon: Package, color: 'peach' },
  cab: { label: 'CAB', icon: Car, color: 'lilac' },
};

const statusConfig = {
  approved: { label: 'APPROVED', class: 'status-approved' },
  denied: { label: 'DENIED', class: 'status-denied' },
  entered: { label: 'ENTERED', class: 'status-entered' },
  exited: { label: 'EXITED', class: 'status-exited' },
  pending: { label: 'PENDING', class: 'status-pending' },
  left_at_gate: { label: 'LEFT AT GATE', class: 'status-stamp bg-butter text-ink' },
};

export function Visitors() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Visitor Logs</h1>
          <p className="text-ink/60 font-body mt-1">Track all visitor entries, deliveries, and cabs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost btn-md flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input pl-10 w-40"
            />
          </div>
        </div>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search visitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button className="btn btn-ghost btn-md flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        <DataTable
          columns={[
            { key: 'time', header: 'Time', width: 'w-20' },
            { key: 'visitor', header: 'Visitor' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'type', header: 'Type', width: 'w-28' },
            { key: 'status', header: 'Status', width: 'w-32' },
            { key: 'guard', header: 'Guard', width: 'w-24' },
          ]}
          data={visitors}
          renderCell={(row, column) => {
            if (column.key === 'type') {
              const config = typeConfig[row.type as keyof typeof typeConfig];
              const Icon = config.icon;
              return (
                <span className={`chip chip-${config.color} inline-flex items-center gap-1`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
              );
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return <span className={`${config.class} inline-flex items-center gap-1`}>{config.label}</span>;
            }
            if (column.key === 'visitor') {
              return <span className="font-medium font-body text-ink">{row.visitor}</span>;
            }
            if (column.key === 'time') {
              return <span className="font-mono text-sm text-ink/80">{row.time}</span>;
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}