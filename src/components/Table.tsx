import React from 'react';

interface TableProps {
    columns: string[];
    data: { [key: string]: string }[];
}
const Table: React.FC<TableProps> = ({ columns, data }) => {
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
                    {columns.map((column) => (
                        <td
                            key={column}
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                            }}
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