import React, { forwardRef, ReactNode, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T, column: Column<T>) => ReactNode;
  sticky?: 'left' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderCell?: (row: T, column: Column<T>) => ReactNode;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  getRowId?: (row: T) => string | number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  loading?: boolean;
  rowActions?: (row: T) => ReactNode;
  className?: string;
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (direction === 'asc') return <ChevronUp className="w-4 h-4" aria-hidden="true" />;
  if (direction === 'desc') return <ChevronDown className="w-4 h-4" aria-hidden="true" />;
  return <span className="w-4 h-4 text-ink/30"><ChevronUp className="w-4 h-4" aria-hidden="true" /></span>;
}

export const DataTable = forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      renderCell,
      emptyMessage = 'No data available',
      striped = true,
      hoverable = true,
      sortable = false,
      selectable = false,
      selectedRows = new Set(),
      onSelectionChange,
      getRowId = (row) => (row as any).id,
      pagination,
      loading = false,
      rowActions,
      className = '',
    },
    ref,
  ) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = useMemo(() => {
      if (!sortConfig) return data;
      return [...data].sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
      if (!sortable) return;
      setSortConfig((current) => {
        if (current?.key === key) {
          return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
      });
    };

    const handleSelectAll = (checked: boolean) => {
      if (!onSelectionChange) return;
      const newSelection = new Set(selectedRows);
      if (checked) {
        sortedData.forEach((row) => newSelection.add(getRowId(row)));
      } else {
        sortedData.forEach((row) => newSelection.delete(getRowId(row)));
      }
      onSelectionChange(newSelection);
    };

    const isRowSelected = (row: any) => selectedRows.has(getRowId(row));

    const allSelected = sortedData.length > 0 && sortedData.every((row) => isRowSelected(row));
    const someSelected = sortedData.some((row) => isRowSelected(row));

    if (loading) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body" role="table" ref={ref}>
            <thead>
              <tr className="border-b-3 border-ink bg-ink/5">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={clsx(
                      'px-4 py-3 text-left font-bold font-body text-ink',
                      column.width && `w-[${column.width}]`,
                      column.minWidth && `min-w-[${column.minWidth}]`,
                      column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : '',
                      column.sticky === 'left' && 'sticky left-0 bg-white z-10',
                      column.sticky === 'right' && 'sticky right-0 bg-white z-10',
                    )}
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b-2 border-ink/20 animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-ink/10 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="empty-state py-12">
          <div className="empty-state-illustration w-24 h-24 text-ink/30 mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <path d="M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 9v6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="empty-state-title text-xl font-bold font-heading text-ink">No Data</p>
          <p className="empty-state-description text-base font-body text-ink/60 max-w-xs mt-2">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={clsx('overflow-x-auto', className)} ref={ref}>
        <table className="w-full text-sm font-body" role="table">
          <thead>
            <tr className="border-b-3 border-ink bg-ink/5">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={clsx(
                    'px-4 py-3 text-left font-bold font-body text-ink',
                    column.width && `w-[${column.width}]`,
                    column.minWidth && `min-w-[${column.minWidth}]`,
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : '',
                    column.sortable && sortable && 'cursor-pointer select-none hover:bg-ink/5',
                    column.sticky === 'left' && 'sticky left-0 bg-white z-10',
                    column.sticky === 'right' && 'sticky right-0 bg-white z-10',
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && sortable && <SortIcon direction={sortConfig?.key === column.key ? sortConfig.direction : null} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => {
              const rowId = getRowId(row);
              const selected = isRowSelected(row);
              return (
                <tr
                  key={rowId}
                  className={clsx(
                    striped && rowIndex % 2 === 1 && 'bg-ink/3',
                    hoverable && 'hover:bg-ink/5',
                    'transition-colors duration-fast border-b-2 border-ink/20 last:border-b-0',
                    selected && 'bg-mint/20',
                  )}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={clsx(
                        'px-4 py-3',
                        column.width && `w-[${column.width}]`,
                        column.minWidth && `min-w-[${column.minWidth}]`,
                        column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : '',
                      )}
                      style={{ width: column.width, minWidth: column.minWidth }}
                    >
                      {renderCell ? renderCell(row, column) : String((row as any)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {pagination && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 p-4 bg-white border-3 border-ink rounded-[12px]">
            <div className="flex items-center gap-2">
              <label className="text-sm font-body text-ink/70">Rows per page:</label>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="input w-auto min-w-0 py-2 px-3 text-sm"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-body text-ink/70">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-ghost btn-sm p-2"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                className="btn btn-ghost btn-sm p-2"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="text-sm font-body text-ink/60">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </div>
          </div>
        )}
      </div>
    );
  },
);

DataTable.displayName = 'DataTable';