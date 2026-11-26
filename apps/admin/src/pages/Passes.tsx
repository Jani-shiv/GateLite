import { Plus, Search, Filter, Download, Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const passes = [
  { id: '1', code: 'PASS-A1B2', flat: 'A-101', visitor: 'Amit Shah', type: 'VISITOR', validFrom: '2026-11-25 09:00', validTo: '2026-11-25 18:00', status: 'ACTIVE', usesLeft: 1 },
  { id: '2', code: 'PASS-C3D4', flat: 'B-205', visitor: 'Zomato Delivery', type: 'DELIVERY', validFrom: '2026-11-24 10:00', validTo: '2026-11-30 22:00', status: 'ACTIVE', usesLeft: 5 },
  { id: '3', code: 'PASS-E5F6', flat: 'C-301', visitor: 'Priya Sharma', type: 'VISITOR', validFrom: '2026-11-20 09:00', validTo: '2026-11-20 18:00', status: 'EXPIRED', usesLeft: 0 },
  { id: '4', code: 'PASS-G7H8', flat: 'A-202', visitor: 'Cab Driver', type: 'CAB', validFrom: '2026-11-26 08:00', validTo: '2026-11-26 20:00', status: 'PENDING', usesLeft: 1 },
];

const statusConfig = {
  ACTIVE: { label: 'ACTIVE', class: 'badge-primary' },
  EXPIRED: { label: 'EXPIRED', class: 'badge-danger' },
  PENDING: { label: 'PENDING', class: 'badge-warning' },
  USED: { label: 'USED', class: 'badge-secondary' },
};

const typeConfig = {
  VISITOR: { label: 'VISITOR', color: 'bg-sky/10 text-sky border-sky' },
  DELIVERY: { label: 'DELIVERY', color: 'bg-peach/10 text-peach border-peach' },
  CAB: { label: 'CAB', color: 'bg-lilac/10 text-lilac border-lilac' },
};

export function Passes() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Pre-Approval Passes</h1>
          <p className="text-ink/60 font-body mt-1">Create and manage visitor passes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="ghost" size="md" leftIcon={<Upload className="w-4 h-4" />}>Import CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Create Pass</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <Input
              type="text"
              placeholder="Search passes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'code', header: 'Pass Code', width: 'w-32' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'visitor', header: 'Visitor' },
            { key: 'type', header: 'Type', width: 'w-24' },
            { key: 'validFrom', header: 'Valid From', width: 'w-36' },
            { key: 'validTo', header: 'Valid To', width: 'w-36' },
            { key: 'status', header: 'Status', width: 'w-24' },
            { key: 'usesLeft', header: 'Uses', width: 'w-20', align: 'center' },
          ]}
          data={passes}
          renderCell={(row, column) => {
            if (column.key === 'type') {
              const config = typeConfig[row.type as keyof typeof typeConfig];
              return (
                <Badge variant="ghost" className={config?.color}>
                  {config?.label}
                </Badge>
              );
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
            }
            if (column.key === 'usesLeft') {
              return <span className="font-mono text-sm text-ink/80">{row.usesLeft}</span>;
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}