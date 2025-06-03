import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import './styles/edit.scss';
import { toast, ToastContainer } from 'react-toastify';
import { FormData, initialFormData } from '../editPageSlice';
import 'react-toastify/dist/ReactToastify.css';
import CommentsModal from '../components/CommentsModal';

const EditPage: React.FC = () => {
    const dispatch = useDispatch();
    const { name } = useParams<{ name: string }>();
    const form = useSelector((state: { editPage: { savedForms: { [key: string]: FormData } } }) => name ? state.editPage.savedForms[name] : initialFormData) ?? initialFormData;
    const departmentOptions: string[] = useSelector((state: { authorization: { departments: string[] } }) => state.authorization.departments);
    const userOptions: string[] = useSelector((state: { authorization: { users: string[] } }) => state.authorization.users);
    const [showCommentsModal, setShowCommentsModal] = React.useState(false);
    const navigate = useNavigate();

    // Use local state for the form to make it reactive
    const [localForm, setLocalForm] = React.useState<FormData>(form);

    // Keep localForm in sync with store form (when switching records)
    React.useEffect(() => {
        setLocalForm(form);
    }, [form]);

    // Update local state on change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, name: string) => {
        const { value } = e.target;
        setLocalForm(prev => {
            if (name === 'comments') {
                return { ...prev, comments: value.split('\n') };
            }
            if (name === 'number') {
                return { ...prev, number: value === '' ? null : Number(value) };
            }
            return { ...prev, [name]: value };
        });
    };

    // On submit, save localForm to store
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            await dispatch({ type: 'editPage/saveForm', payload: { name, form: localForm } });
            dispatch({ type: 'editPage/resetEditedForm'});
        }
        toast.success('Збережено успішно!', { autoClose: 100 });
        setTimeout(() => navigate('/main-view'), 110);
    };

    const handleClose = () => {
       navigate('/main-view')
    }

    // Helper to format date values for input fields
    const formatDate = (val: string | Date | undefined) => {
        if (!val) return '';
        if (typeof val === 'string') return val.slice(0, 10);
        if (val instanceof Date && !isNaN(val.getTime())) return val.toISOString().slice(0, 10);
        return '';
    };

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
                    <label className="edit-label">Стан дефекту</label>
                    <select name="defectState" value={localForm.defectState || ''} onChange={e => handleChange(e, 'defectState')} style={{ flex: 1 }}>
                        <option value="">Оберіть стан</option>
                        <option value="open">Відкрито</option>
                        <option value="in_progress">В роботі</option>
                        <option value="closed">Закрито</option>
                    </select>
                </div>
                {/* number: number input */}
                <div className="edit-row">
                    <label className="edit-label">Номер</label>
                    <input type="number" name="number" value={localForm.number ?? ''} onChange={e => handleChange(e, 'number')} style={{ flex: 1 }} />
                </div>
                {/* createdAt: date picker */}
                <div className="edit-row">
                    <label className="edit-label">Дата реєстрації</label>
                    <input type="date" name="createdAt" value={formatDate(localForm.createdAt)} onChange={e => handleChange(e, 'createdAt')} style={{ flex: 1 }} />
                </div>
                {/* object: select */}
                <div className="edit-row">
                    <label className="edit-label">Об'єкт</label>
                    <select name="object" value={localForm.object || ''} onChange={e => handleChange(e, 'object')} style={{ flex: 1 }}>
                        <option value="">Оберіть об'єкт</option>
                        {departmentOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* substation: select */}
                <div className="edit-row">
                    <label className="edit-label">Підстанція</label>
                    <select name="substation" value={localForm.substation || ''} onChange={e => handleChange(e, 'substation')} style={{ flex: 1 }}>
                        <option value="">Оберіть підстанцію</option>
                        <option value="ps1">ПС 1</option>
                        <option value="ps2">ПС 2</option>
                    </select>
                </div>
                {/* placeOfDefect: select */}
                <div className="edit-row">
                    <label className="edit-label">Місце дефекту</label>
                    <select name="placeOfDefect" value={localForm.placeOfDefect || ''} onChange={e => handleChange(e, 'placeOfDefect')} style={{ flex: 1 }}>
                        <option value="">Оберіть місце</option>
                        <option value="place1">Місце 1</option>
                        <option value="place2">Місце 2</option>
                    </select>
                </div>
                {/* connection: text input */}
                <div className="edit-row">
                    <label className="edit-label">Приєднання</label>
                    <input type="text" name="connection" value={localForm.connection || ''} onChange={e => handleChange(e, 'connection')} style={{ flex: 1 }} />
                </div>
                {/* essenceOfDefect: text input */}
                <div className="edit-row">
                    <label className="edit-label">Суть дефекту</label>
                    <input type="text" name="essenceOfDefect" value={localForm.essenceOfDefect || ''} onChange={e => handleChange(e, 'essenceOfDefect')} style={{ flex: 1 }} />
                </div>
                {/* author: select */}
                <div className="edit-row">
                    <label className="edit-label">Автор повідомлення</label>
                    <select name="author" value={localForm.author || ''} onChange={e => handleChange(e, 'author')} style={{ flex: 1 }}>
                        <option value="">Оберіть автора</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* techLead: select */}
                <div className="edit-row">
                    <label className="edit-label">Технічний керівник</label>
                    <select name="techLead" value={localForm.techLead || ''} onChange={e => handleChange(e, 'techLead')} style={{ flex: 1 }}>
                        <option value="">Оберіть керівника</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* responsibleRorElimination: select */}
                <div className="edit-row">
                    <label className="edit-label">Відповідальний за усунення</label>
                    <select name="responsibleRorElimination" value={localForm.responsibleRorElimination || ''} onChange={e => handleChange(e, 'responsibleRorElimination')} style={{ flex: 1 }}>
                        <option value="">Оберіть відповідального</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* timeOfElimination: date picker */}
                <div className="edit-row">
                    <label className="edit-label">Термін усунення</label>
                    <input type="date" name="timeOfElimination" value={formatDate(localForm.timeOfElimination)} onChange={e => handleChange(e, 'timeOfElimination')} style={{ flex: 1 }} />
                </div>
                {/* dateOfAccepting: date picker */}
                <div className="edit-row">
                    <label className="edit-label">Дата прийняття до виконання</label>
                    <input type="date" name="dateOfAccepting" value={formatDate(localForm.dateOfAccepting)} onChange={e => handleChange(e, 'dateOfAccepting')} style={{ flex: 1 }} />
                </div>
                {/* acceptedPerson: select */}
                <div className="edit-row">
                    <label className="edit-label">Прийняв до виконання</label>
                    <select name="acceptedPerson" value={localForm.acceptedPerson || ''} onChange={e => handleChange(e, 'acceptedPerson')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* dateOfElimination: date picker */}
                <div className="edit-row">
                    <label className="edit-label">Дата усунення</label>
                    <input type="date" name="dateOfElimination" value={formatDate(localForm.dateOfElimination)} onChange={e => handleChange(e, 'dateOfElimination')} style={{ flex: 1 }} />
                </div>
                {/* eliminated: select */}
                <div className="edit-row">
                    <label className="edit-label">Усунув</label>
                    <select name="eliminated" value={localForm.eliminated || ''} onChange={e => handleChange(e, 'eliminated')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* dateOfStartExploitation: date picker */}
                <div className="edit-row">
                    <label className="edit-label">Дата прийняття в експлуатацію</label>
                    <input type="date" name="dateOfStartExploitation" value={formatDate(localForm.dateOfStartExploitation)} onChange={e => handleChange(e, 'dateOfStartExploitation')} style={{ flex: 1 }} />
                </div>
                {/* acceptedExploitationPerson: select */}
                <div className="edit-row">
                    <label className="edit-label">Прийняв в експлуатацію</label>
                    <select name="acceptedExploitationPerson" value={localForm.acceptedExploitationPerson || ''} onChange={e => handleChange(e, 'acceptedExploitationPerson')} style={{ flex: 1 }}>
                        <option value="">Оберіть особу</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* moveTo: select */}
                <div className="edit-row">
                    <label className="edit-label">Перемістити у</label>
                    <select name="moveTo" value={localForm.moveTo || ''} onChange={e => handleChange(e, 'moveTo')} style={{ flex: 1 }}>
                        <option value="">Оберіть</option>
                        <option value="move1">Варіант 1</option>
                        <option value="move2">Варіант 2</option>
                    </select>
                </div>
                {/* comments: button with icon, opens modal */}
                <div className="edit-row">
                     <label className="edit-label">Коментарі</label>
                    <button type="button" onClick={() => setShowCommentsModal(true)} className="edit-comments-btn">
                        <span role="img" aria-label="comments">💬</span>
                        <span>Коментарі</span>
                    </button>
                </div>
                {showCommentsModal && (
                    <CommentsModal
                        comments={localForm.comments || []}
                        onAddComment={comment => setLocalForm(prev => ({
                            ...prev,
                            comments: [...(prev.comments || []), comment]
                        }))}
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