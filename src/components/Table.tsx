import React from 'react';

interface TableProps {
    columns: string[];
    data: { [key: string]: string }[];
    click?: (row: { [key: string]: string }) => void;
}
const Table: React.FC<TableProps> = ({ columns, data, click }) => {
return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={column}
                        style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            textAlign: 'left',
                            backgroundColor: '#f2f2f2',
                        }}
                    >
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                        <td
                            key={column}
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                cursor: colIndex === 0 && click ? 'pointer' : undefined,
                                color: colIndex === 0 && click ? '#007BFF' : undefined,
                                textDecoration: colIndex === 0 && click ? 'underline' : undefined,
                            }}
                            onClick={colIndex === 0 && click ? () => click(row) : undefined}
                        >
                            {row[column]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)}

export default Table;