import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './styles/edit.scss';
import { ToastContainer } from 'react-toastify';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from "../store-auth";
import { TableRow, CommentRequest, createJournalPayload } from '../types';
import 'react-toastify/dist/ReactToastify.css';
import CommentsModal from '../components/CommentsModal';
import { TABLE_COLUMNS, INITIAL_ROW_DATA } from '../constants/tableColumns';
import { parseJwt } from '../utils';


const EditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = window.location.pathname.includes('edit');
    const isCopyMode = window.location.pathname.includes('create-copy');
    const isCreateMode = window.location.pathname === '/create';
    const fetchTableDataById = useTableStore(state => state.fetchTableDataById);
    const fetchDepartments = useAuthStore(state => state.fetchDepartments);
    const departmentId = localStorage.getItem('departmentId');
    const userOptions = useTableStore(state => state.usersByRegionId);
    const objectTypes = useTableStore(state => state.objectTypes);
    const lookupPlaces = useTableStore(state => state.lookupPlaces);
    const substations = useTableStore(state => state.substations);
    const [showCommentsModal, setShowCommentsModal] = React.useState(false);
    const getCommentsById = useTableStore(state => state.getCommentsById);
    const navigate = useNavigate();
    const addComment = useTableStore(state => state.addComment);
    const fetchObjectTypes = useTableStore(state => state.fetchObjectTypes);
    const fetchLookupPlaces = useTableStore(state => state.fetchLookupPlaces);
    const createJournal = useTableStore(state => state.createJournal);
    const fetchUsers = useTableStore(state => state.fetchUsersByRegionId);
    const fetchSubstations = useTableStore(state => state.fetchSubstations);
    const jwt = localStorage.getItem('accessToken');
    const currentUserRole = jwt ? parseJwt(jwt)?.role : '';
    const currentUserId = jwt ? parseJwt(jwt)?.nameidentifier : null;
    const departments = useAuthStore(state => state.departments).filter(dept => dept.id !== departmentId);

    const [form, setForm] = React.useState<TableRow>({} as TableRow);
    const [commentsToAdd, setCommentsToAdd] = React.useState<CommentRequest[]>([]);
    const [changedFields, setChangedFields] = React.useState<string[]>([]);
    const [fetched, setFetched] = React.useState<TableRow>(useTableStore.getState().getTableDataById(Number(id)));
    const [redirectRegionId, setRedirectRegionId] = React.useState<string>('');
   
    React.useEffect(() => {
        async function fetchData() {
            if (id) {
                await fetchTableDataById(Number(id));
                setFetched(useTableStore.getState().getTableDataById(Number(id)));
            }
            fetchObjectTypes();
            fetchLookupPlaces();
            fetchUsers();
            fetchSubstations();
            fetchDepartments();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddComment = (comment: CommentRequest) => {
        if(isEditMode) {
            addComment(comment);
        } else {
            setChangedFields(prev => [...prev, 'comments']);
            setCommentsToAdd(prev => [...prev, comment]);
        }
    };

    React.useEffect(() => {
        setForm(
            fetched ??
            ({...INITIAL_ROW_DATA} as TableRow)
        );
    }, [id, fetched]);

    React.useEffect(() => {
        if (!id) return;
        getCommentsById(Number(id));
    }, [getCommentsById, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: createJournalPayload = {
            ...changedFields.includes('order') && { order: Number(form.order) || null },
            ...changedFields.includes('objectNumber') && { objectNumber: Number(form.objectNumber) || null },
            ...changedFields.includes('place') && { placeId: Number(form.placeId) || null },
            ...changedFields.includes('responsible') && { responsibleId: Number(form.responsibleId) || null },
            ...changedFields.includes('completionTerm') && { completionTerm: form.completionTerm ? new Date(form.completionTerm).toISOString().slice(0, 10)  : null },
            ...changedFields.includes('technicalManager') && { technicalManagerId: Number(form.technicalManagerId) || null },
            ...changedFields.includes('acceptionDate') && { acceptionDate: form.acceptionDate ? new Date(form.acceptionDate).toISOString().slice(0, 10)  : null },
            ...changedFields.includes('acceptedBy') && { acceptedById: Number(form.acceptedById) || null },
            ...changedFields.includes('completionDate') && { completionDate: form.completionDate ? new Date(form.completionDate).toISOString().slice(0, 10)  : null },
            ...changedFields.includes('completedBy') && { completedById: Number(form.completedById) || null },
            ...changedFields.includes('confirmationDate') && { confirmationDate: form.confirmationDate ? new Date(form.confirmationDate).toISOString().slice(0, 10)  : null },
            ...changedFields.includes('confirmedBy') && { confirmedById: Number(form.confirmedById) || null },
            ...changedFields.includes('registrationDate') && { registrationDate: form.registrationDate ? new Date(form.registrationDate).toISOString().slice(0, 10)  : null },
            ...changedFields.includes('object') && { objectTypeId: Number(form.objectTypeId) || null },
            ...changedFields.includes('connection') && { connection: form.connection || null },
            ...changedFields.includes('description') && { description: form.description || null },
            ...changedFields.includes('author') && { messageAuthorId: Number(form.messageAuthorId) || null },
            ...changedFields.includes('redirectRegion') && { redirectRegionId: Number(form.redirectRegionId) || null },
            ...changedFields.includes('substationId') && { substationId: Number(form.substationId) || null },
            redirectRegionId,
            ...isEditMode && changedFields.includes('comments') ? { comments: commentsToAdd || [] } : {},
        };
        await createJournal(payload, isEditMode, id ? Number(id) : null);
        navigate('/main-view');
    };

    const handleClose = () => {
        navigate('/main-view');
    };

    const preparedTitle = () => {
        if (isCreateMode) return 'Створення нового запису';
        if (isCopyMode) return 'Копіювання запису';
        return 'Редагування запису';
    };

     function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: string
    ): void {
        setChangedFields(prev => [...prev, field]);
        setForm(prev => ({
            ...prev,
            [field]: e.target.value,
            ...field === 'place' && { placeId: lookupPlaces?.find(option => option.name === e.target.value)?.id || null },
            ...field === 'object' && { objectTypeId: Number(e.target.value) },
            ...field === 'author' && { messageAuthorId: Number(e.target.value) },
            ...field === 'technicalManager' && { technicalManagerId: Number(e.target.value) },
            ...field === 'responsible' && { responsibleId: Number(e.target.value) },
            ...field === 'confirmedBy' && { confirmedById: Number(e.target.value) },
            ...field === 'completedBy' && { completedById: Number(e.target.value) },
            ...field === 'substation' && { substationId: Number(e.target.value) },
            ...field === 'acceptedBy' && { acceptedById: Number(e.target.value) }
        }));
    }

    return (
        <>
            <div className="edit-header">
                <div className="edit-header__left">
                    <span className="edit-header__icon" role="img" aria-label="edit">✏️</span>
                    <span className="edit-header__title">{preparedTitle()}</span>
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
                {/* condition: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DEFECT_STATE}</label>
                    <input type="text" name="condition" value={form.condition || ''} style={{ flex: 1 }} disabled />
                </div>
                {/* order: number input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.NUMBER}</label>
                    <input type="number" name="number" value={form.order ?? ''} onChange={e => handleChange(e, 'order')} style={{ flex: 1 }} />
                </div>
                {/* registrationDate: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.CREATED_AT}</label>
                    <input
                        type="date"
                        name="createdAt"
                        value={form.registrationDate ? new Date(form.registrationDate).toISOString().slice(0, 10) : ''}
                        onChange={e => handleChange(
                            {
                                ...e,
                                target: {
                                    ...e.target,
                                    value: new Date(e.target.value).toISOString().slice(0, 10) 
                                }
                            },
                            'registrationDate'
                        )}
                        style={{ flex: 1 }}
                    />
                </div>
                {/* object: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.OBJECT_EDIT}</label>
                    <select name="object" onChange={e => handleChange(e, 'object')} style={{ flex: 1 }}>
                        <option value={form.objectType || ''} >{form.objectType || 'Оберіть об\'єкт'}</option>
                        {objectTypes.map(option => (
                            <option key={option.id} value={option.id}>{option.type}</option>
                        ))}
                    </select>
                    <input type="number" name="objectNumber" value={form.objectNumber || ''} onChange={e => handleChange(e, 'objectNumber')} />
                </div>
                {/* substation: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.SUBSTATION_EDIT}</label>
                    <select name="substationRegionId" value={form.substationRegionId} onChange={e => handleChange(e, 'substationRegionId')} style={{ flex: 1 }}>
                        {substations?.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                    <select name="substationId" value={form.substationId || ''} onChange={e => handleChange(e, 'substationId')} style={{ flex: 1 }}>
                        {(substations
                            ?.find(option => option.id === form.substationRegionId)?.substations || [])
                            .map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.name}</option>
                            ))
                        }
                    </select>
                </div>
                {/* place: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.PLACE_OF_DEFECT}</label>
                    <select name="place" value={form.place} onChange={e => handleChange(e, 'place')} style={{ flex: 1 }}>
                       <option value={form.place} >{form.place || 'Оберіть місце'}</option>
                        {lookupPlaces?.map(option => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* connection: text input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.CONNECTION}</label>
                    <input type="text" name="connection" value={form.connection || ''} onChange={e => handleChange(e, 'connection')} style={{ flex: 1 }} />
                </div>
                {/* description: text input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ESSENCE_OF_DEFECT}</label>
                    <input type="text" name="description" value={form.description || ''} onChange={e => handleChange(e, 'description')} style={{ flex: 1 }} />
                </div>
                {/* author: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.AUTHOR}</label>
                    <select name="author" onChange={e => handleChange(e, 'author')} style={{ flex: 1 }}>
                        <option value={form.messageAuthor?.id} >{form.messageAuthor?.name || 'Оберіть автора'}</option>
                        {(departmentId && userOptions?.[departmentId])
                            ? userOptions[departmentId].map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                            : null
                        }
                    </select>
                </div>
                {/* technicalManager: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.TECH_LEAD}</label>
                    <select name="technicalManager" onChange={e => handleChange(e, 'technicalManager')} style={{ flex: 1 }}>
                        <option value={form.technicalManager?.id || ''}>{form.technicalManager?.name || 'Оберіть керівника'}</option>
                        {(departmentId && userOptions?.[departmentId])
                            ? userOptions[departmentId].map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                            : null
                        }
                    </select>
                </div>
                {/* responsible: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION}</label>
                    <select name="responsible" value={form.responsible?.id || ''} onChange={e => handleChange(e, 'responsible')} style={{ flex: 1 }}>
                        <option value={form.responsible?.id || ''}>{form.responsible?.name || 'Оберіть відповідального'}</option>
                         {(departmentId && userOptions?.[departmentId])
                            ? userOptions[departmentId].map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                            : null
                        }
                    </select>
                </div>
                {/* completionTerm: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.TIME_OF_ELIMINATION}</label>
                    <input type="date" name="completionTerm" value={form.completionTerm ? new Date(form.completionTerm).toISOString().slice(0, 10) .slice(0, 10) : ''} onChange={e => handleChange(
                          {
                                ...e,
                                target: {
                                    ...e.target,
                                    value: new Date(e.target.value).toISOString().slice(0, 10) 
                                }
                            }, 'completionTerm')} style={{ flex: 1 }} />
                </div>
                {/* acceptionDate: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ACCEPTING}</label>
                    <input type="date" name="acceptionDate" value={form.acceptionDate ? new Date(form.acceptionDate).toISOString().slice(0, 10) : ''} onChange={e => handleChange(
                        {
                            ...e,
                            target: {
                                ...e.target,
                                value: new Date(e.target.value).toISOString().slice(0, 10) 
                            }
                        }, 'acceptionDate')} style={{ flex: 1 }} />
                </div>
                {/* confirmedBy: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ACCEPTED_PERSON}</label>
                    <select name="confirmedBy" onChange={e => handleChange(e, 'confirmedBy')} style={{ flex: 1 }}>
                        {!currentUserRole.includes('Адміністратор') && (
                            <option value={form.confirmedBy?.id || currentUserId || ''}>
                                {form.confirmedBy?.name ||
                                    (departmentId && userOptions?.[departmentId]
                                        ? userOptions[departmentId].filter(user => user.id == currentUserId).map(user => user.name)
                                        : 'Оберіть особу')}
                            </option>
                        )}
                        {currentUserRole.includes('Адміністратор') && departmentId && userOptions?.[departmentId]
                            ? userOptions[departmentId].map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                            : null
                        }
                    </select>
                </div>
                {/* completionDate: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ELIMINATION}</label>
                    <input type="date" name="completionDate" value={form.completionDate ? new Date(form.completionDate).toISOString().slice(0, 10) : ''} onChange={e => handleChange(
                        {
                            ...e,
                            target: {
                                ...e.target,
                                value: new Date(e.target.value).toISOString().slice(0, 10) .slice(0, 10) 
                            }
                        }, 'completionDate')} style={{ flex: 1 }} />
                </div>
                {/* completedBy: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ELIMINATED}</label>
                    <select name="completedBy"  onChange={e => handleChange(e, 'completedBy')} style={{ flex: 1 }}>
                        {!currentUserRole.includes('Адміністратор') && (
                            <option value={form.completedBy?.id || currentUserId || ''}>
                                {form.completedBy?.name ||
                                    (departmentId && userOptions && userOptions[departmentId]
                                        ? userOptions[departmentId].filter(user => user.id == currentUserId).map(user => user.name)
                                        : 'Оберіть особу'
                                    ) ||
                                    'Оберіть особу'
                                }
                            </option>
                        )}
                        {currentUserRole.includes('Адміністратор') && departmentId && userOptions &&
                            userOptions[departmentId]?.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                        }
                    </select>
                </div>
                {/* confirmationDate: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_START_EXPLOITATION}</label>
                    <input type="date" name="confirmationDate" value={form.confirmationDate ? new Date(form.confirmationDate).toISOString().slice(0, 10) : ''} onChange={e => handleChange(
                        {
                            ...e,
                            target: {
                                ...e.target,
                                value: new Date(e.target.value).toISOString().slice(0, 10) 
                            }
                        }, 'confirmationDate')} style={{ flex: 1 }} />
                </div>
                {/* acceptedBy: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON}</label>
                    <select name="acceptedBy" onChange={e => handleChange(e, 'acceptedBy')} style={{ flex: 1 }}>
                        <option value={form.acceptedBy?.name || ''}>{form.acceptedBy?.name || 'Оберіть особу'}</option>
                        {(departmentId && userOptions?.[departmentId])
                            ? userOptions[departmentId].map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))
                            : null
                        }
                    </select>
                </div>
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.MOVE_TO}</label>
                    <select name="moveTo" value={redirectRegionId} onChange={e => setRedirectRegionId(e.target.value)} style={{ flex: 1 }}>
                        <option value="">Оберіть</option>
                        {departments.map(department => (
                            <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                    </select>
                </div>
                {/* comments: button with icon, opens modal */}
                <div className="edit-row">
                     <label className="edit-label">{TABLE_COLUMNS.COMMENTS}</label>
                    <button type="button" onClick={() => setShowCommentsModal(true)} className="edit-comments-btn">
                        <span role="img" aria-label="comments">💬</span>
                        <span>Коментарі</span>
                    </button>
                </div>
                {showCommentsModal && (
                    <CommentsModal
                        journalId={form.id}
                        onAddComment={(comment) => handleAddComment(comment)}
                        onClose={() => setShowCommentsModal(false)}
                    />
                )}
                <button type="submit" className="edit-save-btn">
                    <span role="img" aria-label="save" style={{ marginRight: 6 }}>💾</span>
                    Зберегти
                </button>
            </form>
            </div>
            <ToastContainer position="top-center" />
        </>
    );
};

export default EditPage;