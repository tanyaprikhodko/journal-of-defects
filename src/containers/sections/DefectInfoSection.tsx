import React from 'react';
import { TableRow, Person, Substation } from '../../types';
import { TABLE_COLUMNS } from '../../constants/tableColumns';

interface DefectInfoSectionProps {
    form: TableRow;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => void;
    canEdit: boolean;
    isCreateMode: boolean;
    currentUserRole: string;
    objectTypes: Array<{ id: number; type: string }>;
    substations: Substation[] | undefined;
    lookupPlaces: Array<{ id: number; name: string }> | undefined;
    userOptions: Record<string, Person[]> | undefined;
    departmentId: string | null;
    currentUserId: string | null;
}

const DefectInfoSection: React.FC<DefectInfoSectionProps> = ({
    form,
    handleChange,
    canEdit,
    isCreateMode,
    currentUserRole,
    objectTypes,
    substations,
    lookupPlaces,
    userOptions,
    departmentId,
    currentUserId,
}) => {
    return (
        <>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.DEFECT_STATE}</label>
                <input type="text" name="condition" value={form.condition || ''} style={{ flex: 1 }} disabled />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.NUMBER}</label>
                <input
                    type="number"
                    name="number"
                    disabled={canEdit || (isCreateMode && !currentUserRole.includes('Адміністратор'))}
                    value={form.order ?? ''}
                    onChange={e => handleChange(e, 'order')}
                    style={{ flex: 1 }}
                />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.CREATED_AT}</label>
                <input
                    type="date"
                    name="createdAt"
                    value={form.registrationDate ? new Date(form.registrationDate).toISOString().slice(0, 10) : ''}
                    disabled={canEdit}
                    onChange={e => handleChange(
                        { ...e, target: { ...e.target, value: new Date(e.target.value).toISOString().slice(0, 10) } },
                        'registrationDate'
                    )}
                    style={{ flex: 1 }}
                />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.OBJECT_EDIT}</label>
                <select name="object" disabled={canEdit} onChange={e => handleChange(e, 'object')} style={{ flex: 1 }}>
                    <option value={form.objectType || ''}>{form.objectType || "Оберіть об'єкт"}</option>
                    {objectTypes.map(option => (
                        <option key={option.id} value={option.id}>{option.type}</option>
                    ))}
                </select>
                <input type="number" name="objectNumber" disabled={canEdit} value={form.objectNumber || ''} onChange={e => handleChange(e, 'objectNumber')} />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.SUBSTATION_EDIT}</label>
                <select name="substationRegionId" disabled={canEdit} value={form.substationRegionId || ''} onChange={e => handleChange(e, 'substationRegionId')} style={{ flex: 1 }}>
                    <option value={form.substationRegionId || ''}>{substations?.find(option => option.id === form.substationRegionId)?.name || 'Оберіть Регіон'}</option>
                    {substations?.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </select>
                <select name="substationId" disabled={canEdit} value={form.substationId || ''} onChange={e => handleChange(e, 'substationId')} style={{ flex: 1 }}>
                    <option value={form.substationId || ''}>{form.substation || 'Оберіть Підстанцію'}</option>
                    {(substations?.find(option => option.id === form.substationRegionId)?.substations || []).map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.PLACE_OF_DEFECT}</label>
                <select name="place" disabled={canEdit} value={form.place} onChange={e => handleChange(e, 'place')} style={{ flex: 1 }}>
                    <option value={form.place}>{form.place || 'Оберіть місце'}</option>
                    {lookupPlaces?.map(option => (
                        <option key={option.id} value={option.name}>{option.name}</option>
                    ))}
                </select>
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.CONNECTION}</label>
                <input type="text" name="connection" disabled={canEdit} value={form.connection || ''} onChange={e => handleChange(e, 'connection')} style={{ flex: 1 }} />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.ESSENCE_OF_DEFECT}</label>
                <input type="text" name="description" disabled={canEdit} value={form.description || ''} onChange={e => handleChange(e, 'description')} style={{ flex: 1 }} />
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.AUTHOR}</label>
                <select name="author" disabled={canEdit} onChange={e => handleChange(e, 'author')} style={{ flex: 1 }}>
                    <option value={form.messageAuthor?.id || ''}>{form.messageAuthor?.name || 'Оберіть автора'}</option>
                    {(departmentId && userOptions?.[departmentId])
                        ? userOptions[departmentId].filter(user => user.id == currentUserId).map(option => (
                            <option key={option.id} value={option.id || ''}>{option.name}</option>
                        ))
                        : null
                    }
                </select>
            </div>
        </>
    );
};

export default DefectInfoSection;
