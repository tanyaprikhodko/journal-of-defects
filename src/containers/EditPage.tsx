import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './styles/edit.scss';
import { ToastContainer } from 'react-toastify';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from "../store-auth";
import { TableRow, CommentRequest, createJournalPayload } from '../types';
import 'react-toastify/dist/ReactToastify.css';
import { INITIAL_ROW_DATA } from '../constants/tableColumns';
import { parseJwt } from '../utils';
import { ROLES, CONDITIONS } from '../constants/roles';
import DefectInfoSection from './sections/DefectInfoSection';
import TechnicalLeadSection from './sections/TechnicalLeadSection';
import AcceptanceSection from './sections/AcceptanceSection';
import EliminationSection from './sections/EliminationSection';
import ExploitationSection from './sections/ExploitationSection';
import MoveAndCommentsSection from './sections/MoveAndCommentsSection';

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

    const isObserver = () => { return currentUserRole.includes(ROLES.OBSERVER); }

    const isTechnicianOnly = () =>
        currentUserRole.includes(ROLES.EXECUTOR) &&
        !currentUserRole.includes(ROLES.ADMIN) &&
        !currentUserRole.includes(ROLES.TECH_LEAD);

    const canEditResponsible = () => {
        if (isObserver()) return false;
        return (
            currentUserRole.includes(ROLES.ADMIN) ||
            currentUserRole.includes(ROLES.TECH_LEAD) ||
            isTechnicianOnly()
        ) && fetched?.condition === CONDITIONS.REGISTERED;
    }

    const canFillAccepted = () => {
        if (isObserver()) return false;
        if (fetched?.condition === CONDITIONS.REVIEWED_BY_TECH_LEAD && (currentUserRole.includes(ROLES.ADMIN) || currentUserRole.includes(ROLES.EXECUTOR))) {
            return true;
        }
        if (fetched?.condition === CONDITIONS.ACCEPTED_FOR_EXECUTION && currentUserRole.includes(ROLES.EXECUTOR)) {
            return true;
        }
        return false;
    }

    const canFillTechnicalLead = () => {
        if (isObserver()) return false;
        return (fetched?.condition === CONDITIONS.REGISTERED) && (currentUserRole.includes(ROLES.ADMIN) || currentUserRole.includes(ROLES.TECH_LEAD));
    }

    const canFillEliminated = () => {
        if (isObserver()) return false;
        return (fetched?.condition === CONDITIONS.ACCEPTED_FOR_EXECUTION) && (currentUserRole.includes(ROLES.ADMIN) || currentUserRole.includes(ROLES.EXECUTOR) || currentUserRole.includes(ROLES.SENIOR_DISPATCHER) || currentUserRole.includes(ROLES.DISPATCHER));
    }

    const requiresAcceptComment = () =>
        fetched?.condition === CONDITIONS.ACCEPTED_FOR_EXECUTION &&
        currentUserRole.includes(ROLES.EXECUTOR) &&
        !currentUserRole.includes(ROLES.ADMIN);

    const canFillDone = () => {
        if (isObserver()) return false;
        return fetched?.condition === CONDITIONS.ELIMINATED && (currentUserRole.includes(ROLES.ADMIN) || currentUserRole.includes(ROLES.SENIOR_DISPATCHER) || currentUserRole.includes(ROLES.DISPATCHER));
    }

    const canEdit = () => {
        if (isEditMode) {
            return !currentUserRole.includes(ROLES.ADMIN) && isObserver();
        }
        return false;
    }

    const [form, setForm] = React.useState<TableRow>({} as TableRow);
    const [commentsToAdd, setCommentsToAdd] = React.useState<CommentRequest[]>([]);
    const [changedFields, setChangedFields] = React.useState<string[]>([]);
    const [fetched, setFetched] = React.useState<TableRow>(useTableStore.getState().getTableDataById(Number(id)));
    const [redirectRegionId, setRedirectRegionId] = React.useState<string>('');
    const [acceptanceChangeReason, setAcceptanceChangeReason] = React.useState<string>('');
    const [acceptanceChangeReasonError, setAcceptanceChangeReasonError] = React.useState<string>('');
    const [inlineReason, setInlineReason] = React.useState<string>('');
    const [inlineReasonError, setInlineReasonError] = React.useState<string>('');
    const [responsibleChangeReason, setResponsibleChangeReason] = React.useState<string>('');
    const [responsibleChangeReasonError, setResponsibleChangeReasonError] = React.useState<string>('');

    React.useEffect(() => {
        async function fetchData() {
            if (id) {
                await fetchTableDataById(Number(id));
                setFetched(useTableStore.getState().getTableDataById(Number(id)));
            }
            if (isObserver()) return;
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
        if (isEditMode) {
            addComment(comment);
        } else {
            setChangedFields(prev => [...prev, 'comments']);
            setCommentsToAdd(prev => [...prev, comment]);
        }
    };

    React.useEffect(() => {
        setForm(
            fetched ??
            ({ ...INITIAL_ROW_DATA } as TableRow)
        );
    }, [id, fetched]);

    React.useEffect(() => {
        if (!id) return;
        getCommentsById(Number(id));
    }, [getCommentsById, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isTechnicianOnly() && changedFields.includes('responsible') && !responsibleChangeReason.trim()) {
            setResponsibleChangeReasonError('Вкажіть причину зміни відповідального');
            return;
        }
        const acceptanceChanged = changedFields.includes('acceptionDate') || changedFields.includes('acceptedBy');
        if (requiresAcceptComment() && acceptanceChanged && !inlineReason.trim()) {
            setInlineReasonError('Вкажіть причину прийняття дефекту');
            return;
        }
        const isChangingAcceptanceExisting =
            (changedFields.includes('acceptionDate') && !!fetched?.acceptionDate) ||
            (changedFields.includes('acceptedBy') && !!fetched?.acceptedBy?.id);
        if (isChangingAcceptanceExisting && !acceptanceChangeReason.trim() && !requiresAcceptComment()) {
            setAcceptanceChangeReasonError('Вкажіть причину зміни');
            return;
        }
        const payload: createJournalPayload = {
            ...changedFields.includes('order') && { order: Number(form.order) || null },
            ...changedFields.includes('objectNumber') && { objectNumber: Number(form.objectNumber) || null },
            ...changedFields.includes('place') && { placeId: Number(form.placeId) || null },
            ...changedFields.includes('responsible') && { responsibleId: Number(form.responsibleId) || null },
            ...changedFields.includes('completionTerm') && { completionTerm: form.completionTerm ? new Date(form.completionTerm).toISOString().slice(0, 10) : null },
            ...changedFields.includes('technicalManager') && { technicalManagerId: Number(form.technicalManagerId) || null },
            ...changedFields.includes('acceptionDate') && { acceptionDate: form.acceptionDate ? new Date(form.acceptionDate).toISOString().slice(0, 10) : null },
            ...changedFields.includes('acceptedBy') && { acceptedById: Number(form.acceptedById) || null },
            ...changedFields.includes('completionDate') && { completionDate: form.completionDate ? new Date(form.completionDate).toISOString().slice(0, 10) : null },
            ...changedFields.includes('completedBy') && { completedById: Number(form.completedById) || null },
            ...changedFields.includes('confirmationDate') && { confirmationDate: form.confirmationDate ? new Date(form.confirmationDate).toISOString().slice(0, 10) : null },
            ...changedFields.includes('confirmedBy') && { confirmedById: Number(form.confirmedById) || null },
            ...changedFields.includes('registrationDate') && { registrationDate: form.registrationDate ? new Date(form.registrationDate).toISOString().slice(0, 10) : null },
            ...changedFields.includes('object') && { objectTypeId: Number(form.objectTypeId) || null },
            ...changedFields.includes('connection') && { connection: form.connection || null },
            ...changedFields.includes('description') && { description: form.description || null },
            ...changedFields.includes('author') && { messageAuthorId: Number(form.messageAuthorId) || null },
            ...changedFields.includes('redirectRegion') && { redirectRegionId: Number(form.redirectRegionId) || null },
            ...changedFields.includes('substationId') && { substationId: Number(form.substationId) || null },
            redirectRegionId: redirectRegionId || null,
            ...isEditMode && changedFields.includes('comments') ? { comments: commentsToAdd || [] } : {},
            ...(isTechnicianOnly() && changedFields.includes('responsible') && responsibleChangeReason.trim())
                ? { responsibleChangeReason: responsibleChangeReason.trim() }
                : {},
            ...(acceptanceChangeReason.trim()
                ? { acceptanceChangeReason: acceptanceChangeReason.trim() }
                : (requiresAcceptComment() && inlineReason.trim() ? { acceptanceChangeReason: inlineReason.trim() } : {})),
        };
        if (requiresAcceptComment() && acceptanceChanged && inlineReason.trim()) {
            const userName = (departmentId && userOptions?.[departmentId]
                ? userOptions[departmentId].find(u => String(u.id) === String(currentUserId))?.name
                : null) || '';
            const dateStr = new Date().toLocaleDateString('uk-UA');
            await addComment({
                body: `Причина прийняття: ${inlineReason.trim()}\nЗмінив: ${userName}\nДата зміни: ${dateStr}`,
                authorId: 1,
                journalId: form.id as number,
            });
        }
        try {
            await createJournal(payload, isEditMode, id ? Number(id) : null);
            navigate('/main-view');
        } catch (err) {
            console.error('[handleSubmit] createJournal threw:', err);
            // error toast is handled by the store
        }
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
            ...field === 'acceptedBy' && { acceptedById: Number(e.target.value) },
            ...field === 'substationId' && { substation: substations?.find(reg => reg.id === form?.substationRegionId)?.substations.find(sub => String(sub.id) === String(e.target.value))?.name || '' },
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
                    <DefectInfoSection
                        form={form}
                        handleChange={handleChange}
                        canEdit={canEdit()}
                        isCreateMode={isCreateMode}
                        currentUserRole={currentUserRole}
                        objectTypes={objectTypes}
                        substations={substations}
                        lookupPlaces={lookupPlaces}
                        userOptions={userOptions}
                        departmentId={departmentId}
                        currentUserId={currentUserId}
                    />
                    <div className="edit-divider" />
                    <TechnicalLeadSection
                        form={form}
                        handleChange={handleChange}
                        canFillTechnicalLead={canFillTechnicalLead()}
                        canEditResponsible={canEditResponsible()}
                        isTechnicianOnly={isTechnicianOnly()}
                        changedFields={changedFields}
                        responsibleChangeReason={responsibleChangeReason}
                        setResponsibleChangeReason={setResponsibleChangeReason}
                        responsibleChangeReasonError={responsibleChangeReasonError}
                        setResponsibleChangeReasonError={setResponsibleChangeReasonError}
                        userOptions={userOptions}
                        departmentId={departmentId}
                        currentUserId={currentUserId}
                    />
                    <div className="edit-divider" />
                    <AcceptanceSection
                        form={form}
                        handleChange={handleChange}
                        canFillAccepted={canFillAccepted()}
                        userOptions={userOptions}
                        departmentId={departmentId}
                        isChangingExisting={
                            (changedFields.includes('acceptionDate') && !!fetched?.acceptionDate) ||
                            (changedFields.includes('acceptedBy') && !!fetched?.acceptedBy?.id)
                        }
                        acceptanceChangeReason={acceptanceChangeReason}
                        setAcceptanceChangeReason={v => { setAcceptanceChangeReason(v); if (v.trim()) setAcceptanceChangeReasonError(''); }}
                        acceptanceChangeReasonError={acceptanceChangeReasonError}
                    />
                    {requiresAcceptComment() && (changedFields.includes('acceptionDate') || changedFields.includes('acceptedBy')) && (
                        <div className="edit-acceptance-comment">
                            <div className="edit-acceptance-comment__header">
                                <span role="img" aria-label="warning" style={{ marginRight: 6 }}>⚠️</span>
                                Необхідно вказати причину прийняття дефекту
                            </div>
                            <div className="edit-acceptance-comment__body">
                                <div className="edit-row">
                                    <label className="edit-label">Причина прийняття <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <textarea
                                            value={inlineReason}
                                            rows={2}
                                            placeholder="Вкажіть причину прийняття дефекту..."
                                            onChange={e => { setInlineReason(e.target.value); if (e.target.value.trim()) setInlineReasonError(''); }}
                                            style={{ flex: 1, resize: 'vertical' }}
                                        />
                                        {inlineReasonError && <span className="edit-field-error">{inlineReasonError}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="edit-divider" />
                    <EliminationSection
                        form={form}
                        handleChange={handleChange}
                        canFillEliminated={canFillEliminated()}
                        userOptions={userOptions}
                        departmentId={departmentId}
                    />
                    <div className="edit-divider" />
                    <ExploitationSection
                        form={form}
                        handleChange={handleChange}
                        canFillDone={canFillDone()}
                        userOptions={userOptions}
                        departmentId={departmentId}
                    />
                    <div className="edit-divider" />
                    <MoveAndCommentsSection
                        redirectRegionId={redirectRegionId}
                        setRedirectRegionId={setRedirectRegionId}
                        isCreateMode={isCreateMode}
                        isObserver={isObserver()}
                        departments={departments}
                        showCommentsModal={showCommentsModal}
                        setShowCommentsModal={setShowCommentsModal}
                        onAddComment={handleAddComment}
                        requiresAcceptComment={false}
                        journalId={form.id}
                        existingComments={fetched?.comments}
                    />
                    {!isObserver() && (<button type="submit" className="edit-save-btn">
                        <span role="img" aria-label="save" style={{ marginRight: 6 }}>💾</span>
                        Зберегти
                    </button>)}
                </form>
            </div>
            <ToastContainer position="top-center" />
        </>
    );
};

export default EditPage;