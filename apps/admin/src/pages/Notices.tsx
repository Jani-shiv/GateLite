import { Plus, Search, Filter, Download, Upload, FileText, Pin, Eye, Calendar, Edit, Trash2, Megaphone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const notices = [
  { id: '1', title: 'Welcome to Green Valley Society!', body: 'We are excited to have you on board...', pinned: true, publishedAt: '2026-11-24', createdBy: 'Admin User', readCount: 150 },
  { id: '2', title: 'Water Supply Maintenance', body: 'Water supply will be shut down on Sunday...', pinned: false, publishedAt: '2026-11-23', createdBy: 'Admin User', readCount: 89 },
  { id: '3', title: 'Diwali Celebration Notice', body: 'Society Diwali celebration on Nov 12...', pinned: true, publishedAt: '2026-11-01', createdBy: 'Admin User', readCount: 200 },
  { id: '4', title: 'Parking Rules Update', body: 'New parking rules effective from Dec 1...', pinned: false, publishedAt: '2026-11-20', createdBy: 'Admin User', readCount: 67 },
];

const statusConfig = {
  pinned: { label: 'PINNED', class: 'badge-primary' },
  published: { label: 'PUBLISHED', class: 'badge-info' },
  draft: { label: 'DRAFT', class: 'badge-warning' },
  archived: { label: 'ARCHIVED', class: 'badge-secondary' },
};

export function Notices() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Notice Board</h1>
          <p className="text-ink/60 font-body mt-1">Manage society notices and announcements</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>New Notice</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <Input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
        </div>

        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'pinned', header: 'Pinned', width: 'w-24', align: 'center' },
            { key: 'publishedAt', header: 'Published', width: 'w-28' },
            { key: 'createdBy', header: 'Author', width: 'w-28' },
            { key: 'readCount', header: 'Reads', width: 'w-20', align: 'center' },
          ]}
          data={notices}
          renderCell={(row, column) => {
            if (column.key === 'pinned') {
              return row.pinned ? (
                <Badge variant="primary" leftIcon={<Pin className="w-3 h-3" />}>Pinned</Badge>
              ) : (
                <span className="text-ink/40">—</span>
              );
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>

      <Card>
        <h2 className="text-xl font-bold font-heading text-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="md" leftIcon={<Megaphone className="w-4 h-4" />}>Publish Notice</Button>
          <Button variant="secondary" size="md" leftIcon={<Pin className="w-4 h-4" />}>Pin Notice</Button>
          <Button variant="ghost" size="md" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<Calendar className="w-4 h-4" />}>Schedule</Button>
          <Button variant="ghost" size="md" borderColor="butter" textColor="butter" hoverBg="butter/10" leftIcon={<Eye className="w-4 h-4" />}>View Analytics</Button>
        </div>
      </Card>
    </div>
  );
}