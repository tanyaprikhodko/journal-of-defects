import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { TableRow } from '../store-zustand';

interface TableProps {
  columns: string[];
  data: TableRow[];
  click?: (row: TableRow) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, click }) => {
  // Build column definitions for TanStack Table
  const columnDefs = React.useMemo<ColumnDef<TableRow>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: col,
        header: col,
        cell: info => info.getValue(),
      })),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: '#f2f2f2',
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
              Даних не знайдено
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, colIndex) => (
                <td
                  key={cell.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    cursor: colIndex === 0 && click ? 'pointer' : undefined,
                    color: colIndex === 0 && click ? '#007BFF' : undefined,
                    textDecoration: colIndex === 0 && click ? 'underline' : undefined,
                  }}
                  onClick={colIndex === 0 && click ? () => click(row.original) : undefined}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;