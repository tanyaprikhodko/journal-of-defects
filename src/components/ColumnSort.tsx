import React, { useState } from 'react';
import { ColumnSortProps, SortByOption, SortOrder } from '../types/components';
import { SORT_OPTIONS } from '../constants/tableColumns'; // Assuming you have a constants file for sort options

const ColumnSort: React.FC<ColumnSortProps> = ({
    onChange,
}) => {
    const [sortBy, setSortBy] = useState<SortByOption>('date');
    const [order, setOrder] = useState<SortOrder>('asc');

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortByOption;
        setSortBy(value);
        onChange?.(value, order);
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortOrder;
        setOrder(value);
        onChange?.(sortBy, value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 'bold' }}>Сортування:</span>
            <select
                value={sortBy}
                onChange={handleSortByChange}
                style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginRight: 8,
                }}
            >
                {SORT_OPTIONS.map((option: { value: string; label: string }) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <select
                value={order}
                onChange={handleOrderChange}
                style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                }}
            >
                <option value="asc">За зростанням</option>
                <option value="desc">За спаданням</option>
            </select>
        </div>
    );
};

export default ColumnSort;