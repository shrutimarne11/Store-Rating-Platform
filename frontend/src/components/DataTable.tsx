interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (key: string) => void;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable && onSort ? (
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span>{sortOrder === 'ASC' ? ' ↑' : ' ↓'}</span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={(row.id as string) || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as React.ReactNode) ?? '-'}
                  </td>
                ))}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
