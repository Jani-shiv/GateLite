import { Plus, Search, Filter, Calendar, Pin, Eye, Edit, Trash2, Megaphone, Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { useState } from 'react';

const notices = [
  { id: '1', title: 'Water Supply Maintenance', body: 'Water supply will be shut down on Sunday 10 AM - 2 PM for maintenance.', pinned: true, published: true, readCount: 142, totalResidents: 150, createdBy: 'Admin', createdAt: '2 hours ago' },
  { id: '2', title: 'Diwali Celebration', body: 'Join us for Diwali celebration at the clubhouse on Nov 12th, 7 PM onwards.', pinned: false, published: true, readCount: 98, totalResidents: 150, createdBy: 'Admin', createdAt: '1 day ago' },
  { id: '3', title: 'New Security Guidelines', body: 'Please ensure all visitors are pre-approved. Walk-ins will require ID verification.', pinned: true, published: true, readCount: 135, totalResidents: 150, createdBy: 'Admin', createdAt: '3 days ago' },
  { id: '4', title: 'Gym Renovation Notice', body: 'Gym will be closed for renovation from Nov 15-30. Alternative arrangements at partner gym.', pinned: false, published: false, readCount: 0, totalResidents: 150, createdBy: 'Admin', createdAt: '5 days ago' },
];

export function Notices() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Notice Board</h1>
          <p className="text-ink/60 font-body mt-1">Publish and manage society notices and announcements</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus className="w-4 h-4 mr-2" />
          Create Notice
        </button>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select w-40"
          >
            <option value="all">All Notices</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="pinned">Pinned</option>
          </select>
        </div>
        
        <DataTable
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'body', header: 'Preview', width: 'w-64' },
            { key: 'pinned', header: 'Pinned', width: 'w-20', align: 'center' },
            { key: 'published', header: 'Status', width: 'w-24' },
            { key: 'readCount', header: 'Reads', width: 'w-28' },
            { key: 'createdBy', header: 'Author', width: 'w-24' },
            { key: 'createdAt', header: 'Created', width: 'w-28' },
          ]}
          data={notices}
          renderCell={(row, column) => {
            if (column.key === 'title') {
              return (
                <div className="flex items-start gap-2">
                  {row.pinned && <Pin className="w-4 h-4 text-mint mt-0.5 flex-shrink-0" />}
                  <span className="font-medium font-body text-ink">{row.title}</span>
                </div>
              );
            }
            if (column.key === 'body') {
              return <span className="text-ink/60 text-sm line-clamp-2">{row.body}</span>;
            }
            if (column.key === 'pinned') {
              return row.pinned ? (
                <span className="badge badge-primary">PINNED</span>
              ) : (
                <span className="badge badge-ghost">—</span>
              );
            }
            if (column.key === 'published') {
              return row.published ? (
                <span className="badge badge-primary">PUBLISHED</span>
              ) : (
                <span className="badge badge-warning">DRAFT</span>
              );
            }
            if (column.key === 'readCount') {
              const percentage = Math.round((row.readCount / row.totalResidents) * 100);
              return (
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-ink">{row.readCount}/{row.totalResidents}</span>
                  <div className="w-24 h-2 bg-ink/10 rounded-full overflow-hidden">
                    <div className="h-full bg-mint rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            }
            return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
          }}
        />
      </Card>
    </div>
  );
}