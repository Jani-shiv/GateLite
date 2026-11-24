import { Plus, Search, Filter, User, Download, Upload } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useState } from 'react';

const residents = [
  { id: '1', name: 'Rajesh Patel', flat: 'A-101', block: 'A', phone: '+91 98765 43210', role: 'OWNER', status: 'active', email: 'rajesh@example.com' },
  { id: '2', name: 'Priya Sharma', flat: 'A-102', block: 'A', phone: '+91 98765 43211', role: 'OWNER', status: 'active', email: 'priya@example.com' },
  { id: '3', name: 'Amit Kumar', flat: 'B-201', block: 'B', phone: '+91 98765 43212', role: 'TENANT', status: 'active', email: 'amit@example.com' },
  { id: '4', name: 'Sunita Devi', flat: 'B-202', block: 'B', phone: '+91 98765 43213', role: 'FAMILY', status: 'active', email: 'sunita@example.com' },
  { id: '5', name: 'Vikram Singh', flat: 'C-301', block: 'C', phone: '+91 98765 43214', role: 'OWNER', status: 'pending', email: 'vikram@example.com' },
];

const roleConfig = {
  OWNER: { label: 'OWNER', class: 'badge-primary' },
  TENANT: { label: 'TENANT', class: 'badge-secondary' },
  FAMILY: { label: 'FAMILY', class: 'badge-info' },
};

const statusConfig = {
  active: { label: 'ACTIVE', class: 'status-approved' },
  pending: { label: 'PENDING', class: 'status-pending' },
  inactive: { label: 'INACTIVE', class: 'status-denied' },
};

export function Residents() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Residents</h1>
          <p className="text-ink/60 font-body mt-1">Manage residents, tenants, and family members</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost btn-md flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="btn btn-ghost btn-md flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="btn btn-primary btn-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Resident
          </button>
        </div>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search residents..."
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
            { key: 'name', header: 'Resident' },
            { key: 'flat', header: 'Flat', width: 'w-24' },
            { key: 'block', header: 'Block', width: 'w-20', align: 'center' },
            { key: 'phone', header: 'Phone' },
            { key: 'role', header: 'Role', width: 'w-24' },
            { key: 'status', header: 'Status', width: 'w-24' },
          ]}
          data={residents}
          renderCell={(row, column) => {
            if (column.key === 'name') {
              return (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[999px] bg-sky/20 border-2 border-sky flex items-center justify-center">
                    <User className="w-5 h-5 text-sky" />
                  </div>
                  <div>
                    <p className="font-medium font-body text-ink">{row.name}</p>
                    <p className="text-xs font-body text-ink/50">{row.email}</p>
                  </div>
                </div>
              );
            }
            if (column.key === 'role') {
              const config = roleConfig[row.role as keyof typeof roleConfig];
              return <span className={`${config.class}`}>{config.label}</span>;
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return <span className={`${config.class}`}>{config.label}</span>;
            }
            if (column.key === 'phone') {
              return <span className="font-mono text-sm text-ink/80">{row.phone}</span>;
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}