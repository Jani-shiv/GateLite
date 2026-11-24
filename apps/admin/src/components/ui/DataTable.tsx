import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderCell?: (row: T, column: Column<T>) => ReactNode;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  renderCell,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-illustration">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <path d="M9 12h6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v6" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="empty-state-title">No Data</p>
        <p className="empty-state-description">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body" role="table">
        <thead>
          <tr className="border-b-3 border-ink bg-ink/5">
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-4 py-3 text-left font-bold font-body text-ink ${column.width || ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${striped && rowIndex % 2 === 1 ? 'bg-ink/3' : ''} ${hoverable ? 'hover:bg-ink/5' : ''} transition-colors duration-fast border-b-2 border-ink/20 last:border-b-0`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 ${column.width || ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                >
                  {renderCell ? renderCell(row, column) : String(row[column.key as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}