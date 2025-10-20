import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  onSort,
  sortBy,
  sortOrder,
  rowActions,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll
}) => {
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {selectable && (
                <th className="w-12 py-4 px-6">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="text-left py-4 px-6 font-semibold text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onSort?.(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {sortBy === column.key && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="w-20 py-4 px-6"></th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border animate-pulse">
                  {selectable && (
                    <td className="py-4 px-6">
                      <div className="h-4 bg-muted rounded w-4"></div>
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="py-4 px-6">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                  ))}
                  {rowActions && (
                    <td className="py-4 px-6">
                      <div className="h-4 bg-muted rounded w-8"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} 
                  className="py-12 text-center"
                >
                  <div className="text-muted-foreground">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={row.id || index}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {selectable && (
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => onSelectRow?.(row.id, e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="py-4 px-6">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;