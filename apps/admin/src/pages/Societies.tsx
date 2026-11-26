import { Plus, Search, Filter, Download, Upload, Building2, Users, MapPin, Shield, CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const societies = [
  { id: '1', name: 'Green Valley Society', address: 'SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', plan: 'pro', status: 'active', blocks: 3, flats: 150, residents: 320 },
  { id: '2', name: 'Sunrise Heights', address: 'Bopal Cross Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380058', plan: 'free', status: 'active', blocks: 2, flats: 80, residents: 180 },
  { id: '3', name: 'Riverfront Residency', address: 'Ashram Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', plan: 'enterprise', status: 'pending', blocks: 4, flats: 200, residents: 450 },
];

const planConfig = {
  free: { label: 'FREE', class: 'badge-secondary' },
  pro: { label: 'PRO', class: 'badge-primary' },
  enterprise: { label: 'ENTERPRISE', class: 'badge-info' },
};

const statusConfig = {
  active: { label: 'ACTIVE', class: 'badge-primary' },
  pending: { label: 'PENDING', class: 'badge-warning' },
  suspended: { label: 'SUSPENDED', class: 'badge-danger' },
};

export function Societies() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Societies</h1>
          <p className="text-ink/60 font-body mt-1">Manage all societies in your portfolio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Add Society</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-mint/10 border-mint">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Societies</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">12</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-mint flex items-center justify-center">
              <Building2 className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-sky/10 border-sky">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Flats</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">2,450</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-sky flex items-center justify-center">
              <MapPin className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-butter/10 border-butter">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Residents</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">8,750</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-butter flex items-center justify-center">
              <Users className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-rose/10 border-rose">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Pending Approvals</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">3</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-rose flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-ink" />
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
              placeholder="Search societies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'name', header: 'Society' },
            { key: 'address', header: 'Address' },
            { key: 'city', header: 'City', width: 'w-28' },
            { key: 'plan', header: 'Plan', width: 'w-28' },
            { key: 'status', header: 'Status', width: 'w-24' },
            { key: 'blocks', header: 'Blocks', width: 'w-20', align: 'center' },
            { key: 'flats', header: 'Flats', width: 'w-20', align: 'center' },
            { key: 'residents', header: 'Residents', width: 'w-24', align: 'center' },
          ]}
          data={societies}
          renderCell={(row, column) => {
            if (column.key === 'plan') {
              const config = planConfig[row.plan as keyof typeof planConfig];
              return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
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
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Add New Society</Button>
          <Button variant="secondary" size="md" leftIcon={<Edit className="w-4 h-4" />}>Bulk Edit</Button>
          <Button variant="ghost" size="md" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<Shield className="w-4 h-4" />}>Compliance Check</Button>
          <Button variant="ghost" size="md" borderColor="butter" textColor="butter" hoverBg="butter/10" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
        </div>
      </Card>
    </div>
  );
}