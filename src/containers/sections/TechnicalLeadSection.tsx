import React from 'react';
import { TableRow, Person } from '../../types';
import { TABLE_COLUMNS } from '../../constants/tableColumns';

interface TechnicalLeadSectionProps {
    form: TableRow;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => void;
    canFillTechnicalLead: boolean;
    canEditResponsible: boolean;
    isTechnicianOnly: boolean;
    changedFields: string[];
    responsibleChangeReason: string;
    setResponsibleChangeReason: (value: string) => void;
    responsibleChangeReasonError: string;
    setResponsibleChangeReasonError: (value: string) => void;
    userOptions: Record<string, Person[]> | undefined;
    departmentId: string | null;
    currentUserId: string | null;
}

const TechnicalLeadSection: React.FC<TechnicalLeadSectionProps> = ({
    form,
    handleChange,
    canFillTechnicalLead,
    canEditResponsible,
    userOptions,
    departmentId,
    currentUserId,
}) => {
    return (
        <>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.TECH_LEAD}</label>
                <select name="technicalManager" disabled={!canFillTechnicalLead} onChange={e => handleChange(e, 'technicalManager')} style={{ flex: 1 }}>
                    <option value={form.technicalManager?.id || ''}>{form.technicalManager?.name || 'Оберіть керівника'}</option>
                    {(departmentId && userOptions?.[departmentId])
                        ? userOptions[departmentId].filter(user => user.id == currentUserId).map(option => (
                            <option key={option.id} value={option.id || ''}>{option.name}</option>
                        ))
                        : null
                    }
                </select>
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION}</label>
                <select name="responsible" disabled={!canEditResponsible} onChange={e => handleChange(e, 'responsible')} style={{ flex: 1 }}>
                    <option value={form.responsible?.id || ''}>{form.responsible?.name || 'Оберіть відповідального'}</option>
                    {(departmentId && userOptions?.[departmentId])
                        ? userOptions[departmentId].filter(user => user.roleIds?.includes(2)).map(option => (
                            <option key={option.id} value={option.id || ''}>{option.name}</option>
                        ))
                        : null
                    }
                </select>
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.TIME_OF_ELIMINATION}</label>
                <input
                    type="date"
                    disabled={!canFillTechnicalLead}
                    name="completionTerm"
                    value={form.completionTerm ? new Date(form.completionTerm).toISOString().slice(0, 10) : ''}
                    onChange={e => handleChange(
                        { ...e, target: { ...e.target, value: new Date(e.target.value).toISOString().slice(0, 10) } },
                        'completionTerm'
                    )}
                    style={{ flex: 1 }}
                />
            </div>
        </>
    );
};

export default TechnicalLeadSection;
