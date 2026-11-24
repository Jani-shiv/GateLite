import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useState } from 'react';

const societies = [
  { id: '1', name: 'Green Valley Society', address: 'Ahmedabad, Gujarat', blocks: 3, flats: 150, status: 'active', plan: 'Pro' },
  { id: '2', name: 'Sunrise Apartments', address: 'Surat, Gujarat', blocks: 2, flats: 80, status: 'active', plan: 'Standard' },
  { id: '3', name: 'Royal Heights', address: 'Vadodara, Gujarat', blocks: 4, flats: 200, status: 'trial', plan: 'Starter' },
  { id: '4', name: 'Garden City', address: 'Rajkot, Gujarat', blocks: 1, flats: 45, status: 'active', plan: 'Standard' },
];

const statusConfig = {
  active: { label: 'ACTIVE', class: 'status-approved' },
  trial: { label: 'TRIAL', class: 'status-pending' },
  inactive: { label: 'INACTIVE', class: 'status-denied' },
};

const planConfig = {
  Starter: { class: 'chip-ghost' },
  Standard: { class: 'chip-secondary' },
  Pro: { class: 'chip-primary' },
};

export function Societies() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Societies</h1>
          <p className="text-ink/60 font-body mt-1">Manage all societies and their configurations</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Society
        </button>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search societies..."
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
            { key: 'name', header: 'Society' },
            { key: 'address', header: 'Location' },
            { key: 'blocks', header: 'Blocks', width: 'w-16', align: 'center' },
            { key: 'flats', header: 'Flats', width: 'w-16', align: 'center' },
            { key: 'plan', header: 'Plan', width: 'w-24' },
            { key: 'status', header: 'Status', width: 'w-24' },
          ]}
          data={societies}
          renderCell={(row, column) => {
            if (column.key === 'name') {
              return (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-mint/20 border-2 border-mint flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <p className="font-medium font-body text-ink">{row.name}</p>
                    <p className="text-xs font-body text-ink/50">ID: {row.id}</p>
                  </div>
                </div>
              );
            }
            if (column.key === 'plan') {
              const config = planConfig[row.plan as keyof typeof planConfig];
              return <span className={`${config.class}`}>{row.plan}</span>;
            }
            if (column.key === 'status') {
              const config = statusConfig[row.status as keyof typeof statusConfig];
              return <span className={`${config.class}`}>{config.label}</span>;
            }
            if (column.key === 'blocks' || column.key === 'flats') {
              return <span className="font-medium font-mono text-ink">{row[column.key as keyof typeof row]}</span>;
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}