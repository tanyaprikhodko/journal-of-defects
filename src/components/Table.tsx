import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { TableRowDisplay } from '../types/table';
import { TableProps } from '../types/components';
import { TABLE_ITEM_CONDITIONS } from '../constants/tableColumns';

const Table: React.FC<TableProps> = ({ columns, data, click, activeRowId }) => {
  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);

  const columnDefs = React.useMemo<ColumnDef<TableRowDisplay>[]>(
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
    <div style={{ 
      width: '100%', 
      height: '100%',
    }}>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        marginLeft: '32px',
      }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  border: '1px solid #000',
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
                    minWidth: header.getSize(),
                    position: 'relative',
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              </th>
            ))}
          </tr>
        ))}
        </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px', color: '#000' }}>
              Даних не знайдено
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map(row => {
            const isHovered = hoveredRowId === row.original.id;
            const backgroundColor = TABLE_ITEM_CONDITIONS[row?.original?.condition as keyof typeof TABLE_ITEM_CONDITIONS] || '#d4dde2ff';
            
            return (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.original.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{
                  cursor: click ? 'pointer' : 'default',
                  backgroundColor: backgroundColor,
                  filter: isHovered ? 'brightness(1.5)' : 'none',
                  transition: 'filter 0.15s ease',
                }}
                onClick={click ? () => click(row.original.id) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      border: '1px solid #000',
                      padding: '4px 8px',
                      textAlign: 'left',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      color: activeRowId === row.original.id ? '#888888' : '#000',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
  );
};

export default Table;