import { Plus, Search, Filter, Download, Upload, FileText, CreditCard, AlertCircle, TrendingUp, DollarSign, Receipt, Clock, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

const invoices = [
  { id: '1', flat: 'A-101', period: '2026-11', amount: 3303, dueDate: '2026-12-10', status: 'PENDING', pdfUrl: null },
  { id: '2', flat: 'A-102', period: '2026-11', amount: 2701, dueDate: '2026-12-10', status: 'PENDING', pdfUrl: null },
  { id: '3', flat: 'B-201', period: '2026-11', amount: 3367, dueDate: '2026-12-10', status: 'PENDING', pdfUrl: null },
  { id: '4', flat: 'B-202', period: '2026-11', amount: 2500, dueDate: '2026-12-10', status: 'PAID', pdfUrl: '/pdf/invoice-4.pdf' },
  { id: '5', flat: 'C-301', period: '2026-11', amount: 3100, dueDate: '2026-12-10', status: 'OVERDUE', pdfUrl: '/pdf/invoice-5.pdf' },
];

const payments = [
  { id: '1', invoiceId: '4', flat: 'B-202', amount: 2500, method: 'UPI', date: '2026-11-20', status: 'SUCCESS', transactionId: 'TXN-20261120-001' },
  { id: '2', invoiceId: '2', flat: 'A-102', amount: 2701, method: 'CARD', date: '2026-11-22', status: 'SUCCESS', transactionId: 'TXN-20261122-003' },
  { id: '3', invoiceId: '1', flat: 'A-101', amount: 3303, method: 'NETBANKING', date: '2026-11-23', status: 'PENDING', transactionId: 'TXN-20261123-002' },
];

const statusConfig = {
  PENDING: { label: 'PENDING', class: 'badge-warning' },
  PAID: { label: 'PAID', class: 'badge-primary' },
  OVERDUE: { label: 'OVERDUE', class: 'badge-danger' },
  PARTIAL: { label: 'PARTIAL', class: 'badge-info' },
  SUCCESS: { label: 'SUCCESS', class: 'badge-primary' },
  FAILED: { label: 'FAILED', class: 'badge-danger' },
  REFUNDED: { label: 'REFUNDED', class: 'badge-secondary' },
};

export function Billing() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'dues'>('invoices');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Billing & Payments</h1>
          <p className="text-ink/60 font-body mt-1">Manage invoices, payments, and dues</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>Export Report</Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            {activeTab === 'invoices' ? 'Generate Invoice' : activeTab === 'payments' ? 'Record Payment' : 'Send Reminder'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-mint/10 border-mint">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Invoices</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">247</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-mint flex items-center justify-center">
              <FileText className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-sky/10 border-sky">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Total Collected</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">₹12.4L</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-sky flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-rose/10 border-rose">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Overdue</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">₹8.7K</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-rose flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
        <Card className="bg-butter/10 border-butter">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-body text-ink/70">Pending</p>
              <p className="text-3xl font-bold font-heading text-ink mt-1">23</p>
            </div>
            <div className="w-12 h-12 rounded-[12px] border-3 border-ink bg-butter flex items-center justify-center">
              <Clock className="w-6 h-6 text-ink" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex border-b-3 border-ink mb-6">
        {['invoices', 'payments', 'dues'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'invoices' | 'payments' | 'dues')}
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

      {activeTab === 'invoices' && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <Input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          </div>

          <DataTable
            columns={[
              { key: 'id', header: 'Invoice ID', width: 'w-32' },
              { key: 'flat', header: 'Flat', width: 'w-24' },
              { key: 'period', header: 'Period', width: 'w-24' },
              { key: 'amount', header: 'Amount', width: 'w-28', align: 'right' },
              { key: 'dueDate', header: 'Due Date', width: 'w-28' },
              { key: 'status', header: 'Status', width: 'w-24' },
            ]}
            data={invoices}
            renderCell={(row, column) => {
              if (column.key === 'amount') return <span className="font-mono text-sm text-ink/80 text-right">₹{row.amount}</span>;
              if (column.key === 'status') {
                const config = statusConfig[row.status as keyof typeof statusConfig];
                return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
              }
              return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
            }}
          />
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <Input
                type="text"
                placeholder="Search payments..."
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          </div>

          <DataTable
            columns={[
              { key: 'transactionId', header: 'Transaction ID', width: 'w-40' },
              { key: 'flat', header: 'Flat', width: 'w-24' },
              { key: 'amount', header: 'Amount', width: 'w-28', align: 'right' },
              { key: 'method', header: 'Method', width: 'w-28' },
              { key: 'date', header: 'Date', width: 'w-28' },
              { key: 'status', header: 'Status', width: 'w-24' },
            ]}
            data={payments}
            renderCell={(row, column) => {
              if (column.key === 'amount') return <span className="font-mono text-sm text-ink/80 text-right">₹{row.amount}</span>;
              if (column.key === 'status') {
                const config = statusConfig[row.status as keyof typeof statusConfig];
                return <Badge variant="ghost" className={config?.class}>{config?.label}</Badge>;
              }
              return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
            }}
          />
        </Card>
      )}

      {activeTab === 'dues' && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <Input
                type="text"
                placeholder="Search dues..."
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="md" leftIcon={<Filter className="w-4 h-4" />}>Filters</Button>
          </div>

          <div className="bg-rose/10 border-2 border-rose rounded-[12px] p-6 mb-6">
            <h3 className="text-lg font-bold font-heading text-rose mb-2">Overdue Reminders</h3>
            <p className="text-ink/70 mb-4">3 flats have overdue payments. Send automated reminders via SMS/WhatsApp.</p>
            <div className="flex gap-3">
              <Button variant="danger" size="md" leftIcon={<AlertCircle className="w-4 h-4" />}>Send SMS Reminders</Button>
              <Button variant="secondary" size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>Send WhatsApp</Button>
              <Button variant="ghost" size="md" borderColor="lilac" textColor="lilac" hoverBg="lilac/10" leftIcon={<FileText className="w-4 h-4" />}>Download Report</Button>
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'flat', header: 'Flat', width: 'w-24' },
              { key: 'period', header: 'Period', width: 'w-24' },
              { key: 'amount', header: 'Amount Due', width: 'w-32', align: 'right' },
              { key: 'dueDate', header: 'Due Date', width: 'w-28' },
              { key: 'daysOverdue', header: 'Days Overdue', width: 'w-28', align: 'center' },
            ]}
            data={invoices.filter(i => i.status === 'OVERDUE').map(i => ({ ...i, daysOverdue: 5 }))}
            renderCell={(row, column) => {
              if (column.key === 'amount') return <span className="font-mono text-sm text-ink/80 text-right">₹{row.amount}</span>;
              if (column.key === 'daysOverdue') return <Badge variant="danger">{row.daysOverdue} days</Badge>;
              return <span className="text-ink/80">{row[column.key as keyof typeof row]}</span>;
            }}
          />
        </Card>
      )}
    </div>
  );
}