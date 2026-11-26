import { Plus, Search, Filter, Download, Upload, UserCheck, Shield, Truck, Wrench, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const staff = [
  { id: '1', name: 'Ramesh Cleaning', role: 'CLEANING', qrCode: 'staff_qr_001', status: 'ACTIVE', lastCheckIn: '2026-11-24 08:00', lastCheckOut: '2026-11-24 17:00' },
  { id: '2', name: 'Suresh Security', role: 'SECURITY', qrCode: 'staff_qr_002', status: 'ACTIVE', lastCheckIn: '2026-11-24 06:00', lastCheckOut: '2026-11-24 14:00' },
  { id: '3', name: 'Mahesh Gardening', role: 'GARDENING', qrCode: 'staff_qr_003', status: 'INACTIVE', lastCheckIn: '2026-11-20 09:00', lastCheckOut: '2026-11-20 13:00' },
];

const roleConfig = {
  CLEANING: { label: 'CLEANING', icon: Sparkles, color: 'bg-sky/10 text-sky border-sky' },
  SECURITY: { label: 'SECURITY', icon: Shield, color: 'bg-mint/10 text-mint border-mint' },
  GARDENING: { label: 'GARDENING', icon: Truck, color: 'bg-peach/10 text-peach border-peach' },
  MAINTENANCE: { label: 'MAINTENANCE', icon: Wrench, color: 'bg-butter/10 text-butter border-butter' },
};

const statusConfig = {
  ACTIVE: { label: 'ACTIVE', class: 'badge-primary' },
  INACTIVE: { label: 'INACTIVE', class: 'badge-danger' },
  ON_BREAK: { label: 'ON BREAK', class: 'badge-warning' },
};

export function Staff() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Staff Management</h1>
          <p className="text-ink/60 font-body mt-1">Manage staff members and attendance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="ghost" size="md" leftIcon={<Upload className="w-4 h-4" />}>Import CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Add Staff</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-mint/10 border-mint">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Staff</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">12</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-mint flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-sky/10 border-sky">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">On Duty</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">8</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-sky flex items-center justify-center">
              <Shield className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-butter/10 border-butter">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">On Break</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">2</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-butter flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-rose/10 border-rose">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Off Duty</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">2</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-rose flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-ink" />
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
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'name', header: 'Staff Member', width: 'w-40' },
            { key: 'role', header: 'Role', width: 'w-28' },
            { key: 'qrCode', header: 'QR Code', width: 'w-32' },
            { key: 'status', header: 'Status', width: 'w-24' },
            { key: 'lastCheckIn', header: 'Last Check-in', width: 'w-36' },
            { key: 'lastCheckOut', header: 'Last Check-out', width: 'w-36' },
          ]}
          data={staff}
          renderCell={(row, column) => {
            if (column.key === 'role') {
              const config = roleConfig[row.role as keyof typeof roleConfig];
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
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>

      <Card>
        <h2 className="text-xl font-bold font-heading text-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg" leftIcon={<Shield className="w-5 h-5" />}>Assign Shift</Button>
          <Button variant="secondary" size="lg" leftIcon={<UserCheck className="w-5 h-5" />}>Check In</Button>
          <Button variant="ghost" size="lg" borderColor="butter" textColor="butter" hoverBg="butter/10" leftIcon={<Sparkles className="w-5 h-5" />}>End Break</Button>
          <Button variant="ghost" size="lg" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<Wrench className="w-5 h-5" />}>Create Task</Button>
        </div>
      </Card>
    </div>
  );
}