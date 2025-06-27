import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { TableRow } from '../store-zustand';

interface TableProps {
  columns: Array<{key: string; label: string}>;
  data: TableRow[];
  click?: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, click }) => {
  const columnDefs = React.useMemo<ColumnDef<TableRow>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: String(col.key),
        header: col.label,
        cell: info => info.getValue(),
        enableResizing: true,
      })),
    [columns]
  );

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  return (
    <table style={{borderCollapse: 'collapse', width: '100%'}}>
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
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  minWidth: 40,
                  maxWidth: 600,
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: header.getSize(),
                    minWidth: 40,
                    maxWidth: 600,
                    position: 'relative',
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                      cursor: 'col-resize',
                      userSelect: 'none',
                      width: 6,
                      height: 24,
                      background: header.column.getIsResizing() ? '#007BFF' : '#ccc',
                      marginLeft: 4,
                      borderRadius: 3,
                      flexShrink: 0,
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      }}
                    />
                    )}
                </div>
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
            <tr
              key={row.id}
              style={click ? { cursor: 'pointer' } : {}}
              onClick={click ? () => click(row.original.id) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                  }}
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