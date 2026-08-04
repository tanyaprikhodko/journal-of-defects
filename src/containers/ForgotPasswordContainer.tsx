import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../config';
import './styles/authorization.scss';

const ForgotPasswordContainer: React.FC = () => {
    const [login, setLogin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch(`${getApiUrl()}/Authentication/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login }),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            // Одне й те саме повідомлення незалежно від результату - не розкриваємо факт існування логіну.
            toast.success('Якщо такий користувач існує, на його електронну пошту надіслано новий пароль.');
        }
    };

    return (
        <div style={{ margin: 'auto auto', width: '30%', padding: '20px', backgroundColor: '#d5f5f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>Відновлення пароля</h2>
            <p>Введіть свій логін, і ми надішлемо на вашу електронну пошту новий пароль.</p>
            <form onSubmit={handleSubmit} className="form">
                <div className="option">
                    <label htmlFor="login">Логін</label>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" className="button" disabled={isSubmitting}>
                    <span className="button-text">Надіслати</span>
                    <span className="button-icon">📧</span>
                </button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
                    Повернутися до входу
                </button>
            </p>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default ForgotPasswordContainer;
