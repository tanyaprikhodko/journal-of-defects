import React from 'react';
import { TableRow, Person } from '../../types';
import { TABLE_COLUMNS } from '../../constants/tableColumns';

interface AcceptanceSectionProps {
    form: TableRow;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => void;
    canFillAccepted: boolean;
    userOptions: Record<string, Person[]> | undefined;
    departmentId: string | null;
    isChangingExisting: boolean;
    acceptanceChangeReason: string;
    setAcceptanceChangeReason: (value: string) => void;
    acceptanceChangeReasonError: string;
}

const AcceptanceSection: React.FC<AcceptanceSectionProps> = ({
    form,
    handleChange,
    canFillAccepted,
    userOptions,
    departmentId,
}) => {
    return (
        <>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ACCEPTING}</label>
                <input
                    type="date"
                    disabled={!canFillAccepted}
                    name="acceptionDate"
                    value={form.acceptionDate ? new Date(form.acceptionDate).toISOString().slice(0, 10) : ''}
                    onChange={e => handleChange(
                        { ...e, target: { ...e.target, value: new Date(e.target.value).toISOString().slice(0, 10) } },
                        'acceptionDate'
                    )}
                    style={{ flex: 1 }}
                />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.ACCEPTED_PERSON}</label>
                <select name="acceptedBy" disabled={!canFillAccepted} onChange={e => handleChange(e, 'acceptedBy')} style={{ flex: 1 }}>
                    <option value={form.acceptedBy?.name || ''}>{form.acceptedBy?.name || 'Оберіть особу'}</option>
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

export default AcceptanceSection;
