import { Plus, Search, Filter, Calendar, Clock, Users, CreditCard, Settings, Building2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const amenities = [
  { id: '1', name: 'Gym', fee: 500, rules: { maxHours: 2, advanceBookingDays: 7 }, status: 'ACTIVE', bookingsToday: 8 },
  { id: '2', name: 'Clubhouse', fee: 2000, rules: { maxHours: 4, advanceBookingDays: 30, maxGuests: 50 }, status: 'ACTIVE', bookingsToday: 3 },
  { id: '3', name: 'Tennis Court', fee: 300, rules: { maxHours: 1, advanceBookingDays: 7 }, status: 'MAINTENANCE', bookingsToday: 0 },
  { id: '4', name: 'Swimming Pool', fee: 400, rules: { maxHours: 2, advanceBookingDays: 14 }, status: 'ACTIVE', bookingsToday: 5 },
];

const bookings = [
  { id: '1', amenity: 'Clubhouse', flat: 'A-101', date: '2026-11-25', time: '18:00-22:00', status: 'CONFIRMED', guests: 25 },
  { id: '2', amenity: 'Gym', flat: 'B-205', date: '2026-11-25', time: '07:00-08:30', status: 'PENDING', guests: 1 },
  { id: '3', amenity: 'Tennis Court', flat: 'C-301', date: '2026-11-26', time: '10:00-11:00', status: 'CONFIRMED', guests: 2 },
  { id: '4', amenity: 'Swimming Pool', flat: 'A-202', date: '2026-11-26', time: '16:00-18:00', status: 'CANCELLED', guests: 4 },
];

const statusConfig = {
  ACTIVE: { label: 'ACTIVE', class: 'badge-primary' },
  MAINTENANCE: { label: 'MAINTENANCE', class: 'badge-warning' },
  INACTIVE: { label: 'INACTIVE', class: 'badge-danger' },
  CONFIRMED: { label: 'CONFIRMED', class: 'badge-primary' },
  PENDING: { label: 'PENDING', class: 'badge-warning' },
  CANCELLED: { label: 'CANCELLED', class: 'badge-danger' },
};

export function Amenities() {
  const [activeTab, setActiveTab] = useState<'amenities' | 'bookings'>('amenities');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Amenities & Bookings</h1>
          <p className="text-ink/60 font-body mt-1">Manage amenities and view bookings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Calendar className="w-4 h-4" />}>View Calendar</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>{activeTab === 'amenities' ? 'Add Amenity' : 'New Booking'}</Button>
        </div>
      </div>

      <div className="flex border-b-3 border-ink mb-6">
        {['amenities', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'amenities' | 'bookings')}
            className={`px-6 py-3 font-body font-medium border-b-3 border-ink -mb-px transition-all duration-fast ${
              activeTab === tab
                ? 'text-ink border-ink'
                : 'text-ink/50 hover:text-ink'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'amenities' && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <Input
                type="text"
                placeholder="Search amenities..."
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          </div>

          <DataTable
            columns={[
              { key: 'name', header: 'Amenity' },
              { key: 'fee', header: 'Fee (₹)', width: 'w-24', align: 'center' },
              { key: 'rules', header: 'Rules' },
              { key: 'status', header: 'Status', width: 'w-24' },
              { key: 'bookingsToday', header: 'Bookings Today', width: 'w-32', align: 'center' },
            ]}
            data={amenities}
            renderCell={(row, column) => {
              if (column.key === 'fee') return <span className="font-mono text-sm text-ink/80">₹{row.fee}</span>;
              if (column.key === 'rules') return (
                <span className="text-sm text-ink/70">
                  Max {row.rules.maxHours}h, {row.rules.advanceBookingDays} days advance
                  {row.rules.maxGuests ? `, Max {row.rules.maxGuests} guests` : ''}
                </span>
              );
              if (column.key === 'status') {
                const config = statusConfig[row.status as keyof typeof statusConfig];
                return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
              }
              if (column.key === 'bookingsToday') return (
                <span className="font-mono text-sm text-ink/80">{row.bookingsToday}</span>
              );
              return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
            }}
          />
        </Card>
      )}

      {activeTab === 'bookings' && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <Input
                type="text"
                placeholder="Search bookings..."
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          </div>

          <DataTable
            columns={[
              { key: 'amenity', header: 'Amenity' },
              { key: 'flat', header: 'Flat', width: 'w-24' },
              { key: 'date', header: 'Date', width: 'w-28' },
              { key: 'time', header: 'Time', width: 'w-32' },
              { key: 'status', header: 'Status', width: 'w-24' },
              { key: 'guests', header: 'Guests', width: 'w-20', align: 'center' },
            ]}
            data={bookings}
            renderCell={(row, column) => {
              if (column.key === 'status') {
                const config = statusConfig[row.status as keyof typeof statusConfig];
                return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
              }
              if (column.key === 'guests') return <span className="font-mono text-sm text-ink/80 text-center">{row.guests}</span>;
              return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
            }}
          />
        </Card>
      )}
    </div>
  );
}