import React from "react";
import { useNavigate } from 'react-router-dom';
import './styles/edit.scss';
import { ToastContainer } from 'react-toastify';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from "../store-auth";
import { TableRow, createJournalPayload } from '../types';
import 'react-toastify/dist/ReactToastify.css';
import { TABLE_COLUMNS, INITIAL_ROW_DATA } from '../constants/tableColumns';
import { parseJwt } from '../utils';
import { ROLES } from '../constants/roles';

const CreatePage: React.FC = () => {
    const navigate = useNavigate();
    const fetchDepartments = useAuthStore(state => state.fetchDepartments);
    const departmentId = localStorage.getItem('departmentId');
    const objectTypes = useTableStore(state => state.objectTypes);
    const lookupPlaces = useTableStore(state => state.lookupPlaces);
    const substations = useTableStore(state => state.substations);
    const fetchObjectTypes = useTableStore(state => state.fetchObjectTypes);
    const fetchLookupPlaces = useTableStore(state => state.fetchLookupPlaces);
    const createJournal = useTableStore(state => state.createJournal);
    const fetchUsers = useTableStore(state => state.fetchUsersByRegionId);
    const fetchSubstations = useTableStore(state => state.fetchSubstations);
    const jwt = localStorage.getItem('accessToken');
    const currentUserRole = jwt ? parseJwt(jwt)?.role : '';
    const currentUserId = jwt ? parseJwt(jwt)?.nameidentifier : null;

    const isObserver = () => { return currentUserRole.includes(ROLES.OBSERVER); };

    const [form, setForm] = React.useState<TableRow>({
        ...INITIAL_ROW_DATA,
        condition: 'Внесений',
        registrationDate: new Date().toISOString(),
        messageAuthorId: Number(currentUserId)
    } as TableRow);

    React.useEffect(() => {
        async function fetchData() {
            if (isObserver()) return;
            fetchObjectTypes();
            fetchLookupPlaces();
            fetchUsers();
            fetchSubstations();
            fetchDepartments();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: createJournalPayload = {
                order: null,
                condition: 'Внесений',
                objectNumber: Number(form.objectNumber) || null,
                placeId: Number(form.placeId) || null,
                registrationDate: new Date().toISOString().slice(0, 10),
                objectTypeId: Number(form.objectTypeId) || null,
                connection: form.connection || null,
                description: form.description || null,
                messageAuthorId: Number(form.messageAuthorId) || Number(currentUserId),
                substationRegionId: Number(departmentId),
                substationId: Number(form.substationId) || null,
            };

            await createJournal(payload, false, null);
            navigate('/main-view');
        } catch (error) {
            console.error('Error creating journal:', error);
        }
    };

    const handleClose = () => {
        navigate('/main-view');
    };

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: string
    ): void {
        setForm(prev => ({
            ...prev,
            [field]: e.target.value,
            ...field === 'place' && { placeId: lookupPlaces?.find(option => option.name === e.target.value)?.id || null },
            ...field === 'object' && { objectTypeId: Number(e.target.value) },
            ...field === 'author' && { messageAuthorId: Number(e.target.value) },
            ...field === 'substationId' && { substation: substations?.find(reg => reg.id === form?.substationRegionId)?.substations.find(sub => String(sub.id) === String(e.target.value))?.name || '' },
        }));
    }

    return (
        <>
            <div className="edit-header">
                <div className="edit-header__left">
                    <span className="edit-header__icon" role="img" aria-label="create">➕</span>
                    <span className="edit-header__title">Створення нового запису</span>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="edit-header__close"
                    title="Закрити"
                >
                    <span role="img" aria-label="close">✖️</span>
                </button>
            </div>
            <div className="edit-form-container">
                <form className="edit-form" onSubmit={handleSubmit}>

                    {/* object: select */}
                    <div className="edit-row">
                        <label className="edit-label">{TABLE_COLUMNS.OBJECT_EDIT}</label>
                        <select name="object" onChange={e => handleChange(e, 'object')} style={{ flex: 1 }}>
                            <option value="">Оберіть об'єкт</option>
                            {objectTypes.map(option => (
                                <option key={option.id} value={option.id}>{option.type}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="objectNumber"
                            value={form.objectNumber || ''}
                            onChange={e => handleChange(e, 'objectNumber')}
                            placeholder="Номер об'єкту"
                        />
                    </div>

                    {/* substation: select */}
                    <div className="edit-row">
                        <label className="edit-label">{TABLE_COLUMNS.SUBSTATION_EDIT}</label>
                        <select
                            name="substationId"
                            value={form.substationId || ''}
                            onChange={e => handleChange(e, 'substationId')}
                            style={{ flex: 1 }}
                        >
                            <option value="">Оберіть підстанцію</option>
                            {(substations
                                ?.find(option => option.id === departmentId)?.substations || [])
                                .map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* place: select */}
                    <div className="edit-row">
                        <label className="edit-label">{TABLE_COLUMNS.PLACE_OF_DEFECT}</label>
                        <select name="place" value={form.place || ''} onChange={e => handleChange(e, 'place')} style={{ flex: 1 }}>
                            <option value="">Оберіть місце</option>
                            {lookupPlaces?.map(option => (
                                <option key={option.id} value={option.name}>{option.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* connection: text input */}
                    <div className="edit-row">
                        <label className="edit-label">{TABLE_COLUMNS.CONNECTION}</label>
                        <input
                            type="text"
                            name="connection"
                            value={form.connection || ''}
                            onChange={e => handleChange(e, 'connection')}
                            style={{ flex: 1 }}
                            placeholder="Введіть з'єднання"
                        />
                    </div>

                    {/* description: text input */}
                    <div className="edit-row">
                        <label className="edit-label">{TABLE_COLUMNS.ESSENCE_OF_DEFECT}</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description || ''}
                            onChange={e => handleChange(e, 'description')}
                            style={{ flex: 1 }}
                            placeholder="Опишіть суть дефекту"
                        />
                    </div>

                    <button type="submit" className="edit-save-btn">
                        <span role="img" aria-label="save" style={{ marginRight: 6 }}>💾</span>
                        Створити запис
                    </button>
                </form>
            </div>
            <ToastContainer position="top-center" />
        </>
    );
};

export default CreatePage;
