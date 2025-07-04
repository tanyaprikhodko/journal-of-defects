import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './styles/edit.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthStore } from '../store-auth';
import { useTableStore, TableRow } from '../store-zustand';
import 'react-toastify/dist/ReactToastify.css';
import CommentsModal from '../components/CommentsModal';
import { TABLE_COLUMNS } from '../constants/tableColumns';


const EditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const fetchTableDataById = useTableStore(state => state.fetchTableDataById);
    const departmentOptions = useAuthStore(state => state.departments);
    const userOptions = useAuthStore(state => state.users);
    const [showCommentsModal, setShowCommentsModal] = React.useState(false);
    const navigate = useNavigate();

    const [form, setForm] = React.useState<TableRow>({} as TableRow);

    React.useEffect(() => {
        if (id) fetchTableDataById(Number(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const tableDataById = useTableStore.getState().tableDataById;

    React.useEffect(() => {
        // Update local form state when data is fetched
        const fetched = tableDataById[Number(id)];
        console.log('Fetched data for ID:', id, fetched);
        setForm(fetched ?? ({} as TableRow));
    }, [id, tableDataById]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Збережено успішно!', { autoClose: 100 });
        setTimeout(() => navigate('/main-view'), 110);
    };

    const handleClose = () => {
       navigate('/main-view')
    }

    // Helper to format date values for input fields
    const formatDate = (val: string | Date | undefined) => {
        if (!val) return '';
        if (typeof val === 'string' && val.length >= 10) return val.slice(0, 10);
        if (val instanceof Date && !isNaN(val.getTime())) return val.toISOString().slice(0, 10);
        return '';
    };

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: string
    ): void {
        const value = e.target.type === 'number'
            ? (e.target.value === '' ? '' : Number(e.target.value))
            : e.target.value;
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    }
    return (
        <>
            <div className="edit-header">
                <div className="edit-header__left">
                    <span className="edit-header__icon" role="img" aria-label="edit">✏️</span>
                    <span className="edit-header__title">Редагування запису</span>
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
                {/* defectState: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DEFECT_STATE}</label>
                    <select name="defectState" value={form.condition || ''} onChange={e => handleChange(e, 'defectState')} style={{ flex: 1 }}>
                        <option value="">Оберіть стан</option>
                        <option value="open">Відкрито</option>
                        <option value="in_progress">В роботі</option>
                        <option value="closed">Закрито</option>
                    </select>
                </div>
                {/* number: number input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.NUMBER}</label>
                    <input type="number" name="number" value={form.order ?? ''} onChange={e => handleChange(e, 'number')} style={{ flex: 1 }} />
                </div>
                {/* createdAt: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.CREATED_AT}</label>
                    <input type="date" name="createdAt" value={formatDate(form.registrationDate)} onChange={e => handleChange(e, 'createdAt')} style={{ flex: 1 }} />
                </div>
                {/* object: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.OBJECT}</label>
                    <select name="object" value={form.objectType || ''} onChange={e => handleChange(e, 'object')} style={{ flex: 1 }}>
                        <option value="">Оберіть об'єкт</option>
                        {departmentOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* substation: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.SUBSTATION}</label>
                    <select name="substation" value={form.substation || ''} onChange={e => handleChange(e, 'substation')} style={{ flex: 1 }}>
                        <option value="">Оберіть підстанцію</option>
                        <option value="ps1">ПС 1</option>
                        <option value="ps2">ПС 2</option>
                    </select>
                </div>
                {/* placeOfDefect: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.PLACE_OF_DEFECT}</label>
                    <select name="placeOfDefect" value={form.place || ''} onChange={e => handleChange(e, 'placeOfDefect')} style={{ flex: 1 }}>
                        <option value="">Оберіть місце</option>
                        <option value="place1">Місце 1</option>
                        <option value="place2">Місце 2</option>
                    </select>
                </div>
                {/* connection: text input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.CONNECTION}</label>
                    <input type="text" name="connection" value={form.connection || ''} onChange={e => handleChange(e, 'connection')} style={{ flex: 1 }} />
                </div>
                {/* essenceOfDefect: text input */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ESSENCE_OF_DEFECT}</label>
                    <input type="text" name="essenceOfDefect" value={form.description || ''} onChange={e => handleChange(e, 'essenceOfDefect')} style={{ flex: 1 }} />
                </div>
                {/* author: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.AUTHOR}</label>
                    <select name="author" value={form.messageAuthor?.name || ''} onChange={e => handleChange(e, 'author')} style={{ flex: 1 }}>
                        <option value="">Оберіть автора</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* techLead: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.TECH_LEAD}</label>
                    <select name="techLead" value={form.technicalManager?.name || ''} onChange={e => handleChange(e, 'techLead')} style={{ flex: 1 }}>
                        <option value="">Оберіть керівника</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* responsibleRorElimination: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION}</label>
                    <select name="responsibleRorElimination" value={form.responsible?.name || ''} onChange={e => handleChange(e, 'responsibleRorElimination')} style={{ flex: 1 }}>
                        <option value="">Оберіть відповідального</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* timeOfElimination: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.TIME_OF_ELIMINATION}</label>
                    <input type="date" name="timeOfElimination" value={formatDate(form.completionDate)} onChange={e => handleChange(e, 'timeOfElimination')} style={{ flex: 1 }} />
                </div>
                {/* dateOfAccepting: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ACCEPTING}</label>
                    <input type="date" name="dateOfAccepting" value={formatDate(form.acceptionDate)} onChange={e => handleChange(e, 'dateOfAccepting')} style={{ flex: 1 }} />
                </div>
                {/* acceptedPerson: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ACCEPTED_PERSON}</label>
                    <select name="acceptedPerson" value={form.acceptedBy?.name || ''} onChange={e => handleChange(e, 'acceptedPerson')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* dateOfElimination: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_ELIMINATION}</label>
                    <input type="date" name="dateOfElimination" value={formatDate(form.completionDate)} onChange={e => handleChange(e, 'dateOfElimination')} style={{ flex: 1 }} />
                </div>
                {/* eliminated: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ELIMINATED}</label>
                    <select name="eliminated" value={form.completedBy?.name || ''} onChange={e => handleChange(e, 'eliminated')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* dateOfStartExploitation: date picker */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DATE_OF_START_EXPLOITATION}</label>
                    <input type="date" name="dateOfStartExploitation" value={formatDate(form.confirmationDate)} onChange={e => handleChange(e, 'dateOfStartExploitation')} style={{ flex: 1 }} />
                </div>
                {/* acceptedExploitationPerson: select */}
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON}</label>
                    <select name="acceptedExploitationPerson" value={form.acceptedBy?.name || ''} onChange={e => handleChange(e, 'acceptedExploitationPerson')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                {/* moveTo: select
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.MOVE_TO}</label>
                    <select name="moveTo" value={form. || ''} onChange={e => handleChange(e, 'moveTo')} style={{ flex: 1 }}>
                        <option value="">Оберіть</option>
                        <option value="move1">Варіант 1</option>
                        <option value="move2">Варіант 2</option>
                    </select>
                </div> */}
                {/* comments: button with icon, opens modal */}
                <div className="edit-row">
                     <label className="edit-label">{TABLE_COLUMNS.COMMENTS}</label>
                    <button type="button" onClick={() => setShowCommentsModal(true)} className="edit-comments-btn">
                        <span role="img" aria-label="comments">💬</span>
                        <span>Коментарі</span>
                    </button>
                </div>
                {/* {showCommentsModal && (
                    <CommentsModal
                        comments={form.comments || []}
                        onAddComment={comment => setForm((prev: any) => ({
                            ...prev,
                            comments: [...(prev.comments || []), comment]
                        }))}
                        onClose={() => setShowCommentsModal(false)}
                    />
                )} */}
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