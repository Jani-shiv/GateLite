import { Plus, Search, Filter, Download, Upload, UserCheck, Clock, Package, Car, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const visitors = [
  { id: '1', name: 'Amit Shah', phone: '+91 99887 76655', type: 'VISITOR', flat: 'A-101', status: 'APPROVED', purpose: 'Personal visit', time: '2026-11-24 10:30' },
  { id: '2', name: 'Zomato Delivery', phone: '+91 99887 76656', type: 'DELIVERY', flat: 'B-205', status: 'LEFT_AT_GATE', purpose: 'Food delivery', time: '2026-11-24 12:15' },
  { id: '3', name: 'Priya Sharma', phone: '+91 99887 76657', type: 'VISITOR', flat: 'C-301', status: 'ENTERED', purpose: 'Family visit', time: '2026-11-24 14:00' },
  { id: '4', name: 'Cab Driver', phone: '+91 99887 76658', type: 'CAB', flat: 'A-202', status: 'PENDING', purpose: 'Drop guest', time: '2026-11-24 15:30' },
  { id: '5', name: 'Amazon Delivery', phone: '+91 99887 76659', type: 'DELIVERY', flat: 'B-101', status: 'DENIED', purpose: 'Package delivery', time: '2026-11-24 16:45' },
];

const typeConfig = {
  VISITOR: { label: 'VISITOR', icon: 'user', color: 'bg-sky/10 text-sky border-sky' },
  DELIVERY: { label: 'DELIVERY', icon: 'package', color: 'bg-peach/10 text-peach border-peach' },
  CAB: { label: 'CAB', icon: 'car', color: 'bg-lilac/10 text-lilac border-lilac' },
};

const statusConfig = {
  APPROVED: { label: 'APPROVED', class: 'badge-primary', icon: CheckCircle },
  DENIED: { label: 'DENIED', class: 'badge-danger', icon: XCircle },
  ENTERED: { label: 'ENTERED', class: 'badge-info', icon: CheckCircle },
  LEFT_AT_GATE: { label: 'LEFT AT GATE', class: 'badge-warning', icon: Clock },
  PENDING: { label: 'PENDING', class: 'badge-warning', icon: AlertTriangle },
};

export function Visitors() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Visitor Log</h1>
          <p className="text-ink/60 font-body mt-1">View and manage all visitor activity</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>New Entry</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <Input
              type="text"
              placeholder="Search visitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'time', header: 'Time', width: 'w-32' },
            { key: 'type', header: 'Type', width: 'w-24' },
            { key: 'name', header: 'Visitor' },
            { key: 'phone', header: 'Phone' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'status', header: 'Status', width: 'w-32' },
            { key: 'purpose', header: 'Purpose' },
          ]}
          data={visitors}
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
          <Button variant="primary" size="md" leftIcon={<UserCheck className="w-4 h-4" />}>New Visitor</Button>
          <Button variant="secondary" size="md" leftIcon={<Package className="w-4 h-4" />}>New Delivery</Button>
          <Button variant="secondary" size="md" leftIcon={<Car className="w-4 h-4" />}>New Cab</Button>
          <Button variant="ghost" size="md" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<Shield className="w-4 h-4" />}>Create Pass</Button>
        </div>
      </Card>
    </div>
  );
}