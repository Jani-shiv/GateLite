import { Plus, Search, Filter, User, Download, Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

const CSV_TEMPLATE = `flatId,phone,name,role
A-101,+919876543210,Rajesh Patel,OWNER
A-102,+919876543211,Priya Sharma,OWNER
B-201,+919876543212,Amit Kumar,TENANT`;

export function Residents() {
  const [search, setSearch] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'confirm'>('upload');
  const [csvText, setCsvText] = useState(CSV_TEMPLATE);
  const [previewData, setPreviewData] = useState<Array<Record<string, string>>>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target?.result as string ?? '');
      setImportStep('preview');
    };
    reader.readAsText(file);
  };

  const handlePreview = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setImportErrors(['CSV must have at least a header row and one data row']);
      return;
    }
    const headers = lines[0]!.split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['flatid', 'phone', 'name'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      setImportErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
      return;
    }
    const preview = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => obj[h] = values[i] || '');
      return obj;
    });
    setPreviewData(preview);
    setImportErrors([]);
    setImportStep('preview');
  };

  const handleConfirmImport = async () => {
    setImporting(true);
    try {
      const response = await fetch('/api/v1/residents/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Import failed');
      setImportResult({ imported: result.imported, errors: result.errors });
      setImportStep('confirm');
    } catch (error) {
      setImportErrors([error instanceof Error ? error.message : 'Import failed']);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resident_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeImportModal = () => {
    setImportModalOpen(false);
    setImportStep('upload');
    setCsvText(CSV_TEMPLATE);
    setPreviewData([]);
    setImportErrors([]);
    setImportResult(null);
  };

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
          <button className="btn btn-ghost btn-md flex items-center gap-2" onClick={() => { setImportStep('upload'); setImportModalOpen(true); }}>
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

      {/* Import CSV Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="bg-white border-3 border-ink rounded-[12px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-butter border-b-3 border-ink p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky/20 border-2 border-sky rounded-[12px] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-sky" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-ink">Import Residents from CSV</h2>
                  <p className="text-sm text-ink/60">Upload a CSV file to bulk import residents</p>
                </div>
              </div>
              <button onClick={closeImportModal} className="p-2 hover:bg-ink/5 rounded-[8px] transition-colors">
                <X className="w-5 h-5 text-ink" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="border-b-2 border-ink px-6 py-4">
              <div className="flex items-center justify-between">
                {['upload', 'preview', 'confirm'].map((step, idx) => {
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-3 border-ink text-sm font-bold font-mono ${
                        (importStep === step || ['upload', 'preview', 'confirm'].indexOf(importStep) > idx) ? 'bg-mint border-mint text-ink' : 'bg-white border-ink text-ink/40'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`mt-1 text-xs font-medium ${
                        (importStep === step || ['upload', 'preview', 'confirm'].indexOf(importStep) > idx) ? 'text-mint' : 'text-ink/40'
                      }`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                      {idx < 2 && (
                        <div className={`w-16 h-1 border-2 ${
                          ['upload', 'preview', 'confirm'].indexOf(importStep) > idx ? 'bg-mint' : 'bg-ink/20'
                        } rounded`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 space-y-6">
              {/* Step 1: Upload */}
              {importStep === 'upload' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold font-heading text-ink mb-2">Upload CSV File</h3>
                    <p className="text-ink/60 mb-4">Upload a CSV file with resident data or use our template</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center p-8 border-3 border-ink border-dashed rounded-[12px] cursor-pointer hover:bg-ink/3 transition-colors">
                      <Upload className="w-12 h-12 text-ink/40 mb-2" />
                      <span className="font-medium text-ink">Drag & drop CSV file here</span>
                      <span className="text-sm text-ink/50 mt-1">or click to browse</span>
                      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        className="btn btn-secondary btn-md flex items-center gap-2"
                        onClick={handleDownloadTemplate}
                      >
                        <FileText className="w-4 h-4" />
                        Download Template
                      </button>
                      <a
                        href="/api/v1/residents/import/template"
                        className="btn btn-ghost btn-md flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Sample
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Preview */}
              {importStep === 'preview' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold font-heading text-ink mb-2">Preview Import</h3>
                    <p className="text-ink/60">Review the data before importing. {previewData.length} residents will be imported.</p>
                  </div>

                  {importErrors.length > 0 && (
                    <div className="bg-rose/10 border-2 border-rose rounded-[8px] p-4">
                      <h4 className="font-medium text-rose mb-2">Validation Errors:</h4>
                      <ul className="list-disc list-inside text-sm text-rose space-y-1">
                        {importErrors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}

                  {previewData.length > 0 && (
                    <div className="bg-white border-3 border-ink rounded-[8px] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-ink text-white">
                            <tr>
                              <th className="p-3 text-left font-bold font-body">Flat ID</th>
                              <th className="p-3 text-left font-bold font-body">Phone</th>
                              <th className="p-3 text-left font-bold font-body">Name</th>
                              <th className="p-3 text-left font-bold font-body">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.slice(0, 10).map((row, idx) => (
                              <tr key={idx} className={`border-b-2 border-ink ${idx % 2 === 0 ? 'bg-ink/3' : 'bg-white'}`}>
                                <td className="p-3 font-mono text-sm">{row['flatid'] || ''}</td>
                                <td className="p-3 font-mono text-sm">{row['phone'] || ''}</td>
                                <td className="p-3">{row['name'] || ''}</td>
                                <td className="p-3">
                                  <span className={`badge ${row['role'] === 'OWNER' ? 'badge-primary' : row['role'] === 'TENANT' ? 'badge-secondary' : 'badge-info'}`}>
                                    {row['role'] || 'OWNER'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {previewData.length > 10 && (
                        <p className="text-center text-sm text-ink/50 mt-2">Showing 10 of {previewData.length} rows</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t-2 border-ink">
                    <button className="btn btn-ghost btn-md" onClick={() => setImportStep('upload')}>
                      Back
                    </button>
                    <button className="btn btn-primary btn-md" onClick={handleConfirmImport} disabled={importing || importErrors.length > 0}>
                      {importing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Importing...
                        </>
                      ) : 'Import Residents'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {importStep === 'confirm' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 mx-auto bg-mint/20 border-3 border-mint rounded-[999px] flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-mint" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-ink">Import Complete!</h3>
                    <p className="text-ink/60 mt-2">Successfully imported <span className="font-bold text-mint">{importResult?.imported}</span> residents</p>
                    {importResult && importResult.errors.length > 0 && (
                      <p className="text-rose mt-2 text-sm"><span className="font-bold">{importResult.errors.length}</span> rows had errors</p>
                    )}
                  </div>
                  {importResult && importResult.errors.length > 0 && (
                    <div className="bg-rose/10 border-2 border-rose rounded-[8px] p-4 text-left max-h-40 overflow-y-auto">
                      <h4 className="font-medium text-rose mb-2">Errors:</h4>
                      <ul className="list-disc list-inside text-sm text-rose space-y-1 max-h-24 overflow-y-auto">
                        {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-center gap-3 pt-4">
                    <button className="btn btn-ghost btn-md" onClick={() => { setImportStep('upload'); setImportResult(null); }}>
                      Import More
                    </button>
                    <button className="btn btn-primary btn-md" onClick={closeImportModal}>
                      Done
                    </button>
                  </div>
      </div>
    )}
    </div>
  </div>
  </div>
)}
</div>
);
  }