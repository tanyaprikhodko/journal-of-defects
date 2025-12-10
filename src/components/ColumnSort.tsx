import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ColumnSortProps, SortByOption, SortOrder } from '../types/components';
import { SORT_OPTIONS } from '../constants/tableColumns'; // Assuming you have a constants file for sort options

const ColumnSort: React.FC<ColumnSortProps> = ({
    onChange,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState<SortByOption>(() => {
        return (searchParams.get('sortBy') as SortByOption) || 'condition';
    });
    const [order, setOrder] = useState<SortOrder>(() => {
        return (searchParams.get('order') as SortOrder) || 'asc';
    });

    // Update local state when URL changes
    useEffect(() => {
        const urlSortBy = searchParams.get('sortBy') as SortByOption;
        const urlOrder = searchParams.get('order') as SortOrder;
        
        if (urlSortBy && urlSortBy !== sortBy) {
            setSortBy(urlSortBy);
        }
        if (urlOrder && urlOrder !== order) {
            setOrder(urlOrder);
        }
    }, [searchParams, sortBy, order]);

    const updateUrlParams = (newSortBy: SortByOption, newOrder: SortOrder) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('sortBy', newSortBy);
        newSearchParams.set('order', newOrder);
        setSearchParams(newSearchParams);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortByOption;
        setSortBy(value);
        updateUrlParams(value, order);
        onChange?.();
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortOrder;
        setOrder(value);
        updateUrlParams(sortBy, value);
        onChange?.();
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