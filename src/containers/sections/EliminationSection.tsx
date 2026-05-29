import React from 'react';
import { TableRow, Person } from '../../types';
import { TABLE_COLUMNS } from '../../constants/tableColumns';

interface EliminationSectionProps {
    form: TableRow;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => void;
    canFillEliminated: boolean;
    userOptions: Record<string, Person[]> | undefined;
    departmentId: string | null;
}

const EliminationSection: React.FC<EliminationSectionProps> = ({
    form,
    handleChange,
    canFillEliminated,
    userOptions,
    departmentId,
}) => {
    return (
        <>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ELIMINATION}</label>
                <input
                    type="date"
                    disabled={!canFillEliminated}
                    name="completionDate"
                    value={form.completionDate ? new Date(form.completionDate).toISOString().slice(0, 10) : ''}
                    onChange={e => handleChange(
                        { ...e, target: { ...e.target, value: new Date(e.target.value).toISOString().slice(0, 10) } },
                        'completionDate'
                    )}
                    style={{ flex: 1 }}
                />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.ELIMINATED}</label>
                <select name="completedBy" disabled={!canFillEliminated} onChange={e => handleChange(e, 'completedBy')} style={{ flex: 1 }}>
                    <option value={form.completedBy?.name || ''}>{form.completedBy?.name || 'Оберіть особу'}</option>
                    {(departmentId && userOptions?.[departmentId])
                        ? userOptions[departmentId].map(option => (
                            <option key={option.id} value={option.id || ''}>{option.name}</option>
                        ))
                        : null
                    }
                </select>
            </div>
        </>
    );
};

export default EliminationSection;
