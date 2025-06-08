import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store-zustand';
import './styles/authorization.scss';


const AuthorizeContainer: React.FC = () => {
    const [department, setDepartment] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    // Zustand hooks
    const departmentOptions = useAuthStore(state => state.departments);
    const userOptions = useAuthStore(state => state.users);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const login = useAuthStore(state => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(user, password);
        setShowError(!success);
    };

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/main-view');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div style={{ margin: 'auto auto', width: '30%', padding: '20px', backgroundColor: '#d5f5f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>Вітаємо Вас у Журналі дефектів</h2>
            {showError && !isAuthenticated && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    Невірний користувач або пароль
                </div>
            )}
            <form onSubmit={handleSubmit} className='form'>
                <div className='option'>
                    <label htmlFor="department">
                        РЕМ
                    </label>
                    <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>
                            Виберіть РЕМ
                        </option>
                        {departmentOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className='option'>
                    <label htmlFor="user" >
                        Користувач
                    </label>
                    <select
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>Виберіть користувача</option>
                        {userOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div  className='option'>
                    <label htmlFor="password">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" className='button'>
                <span className='button-text'>Увійти</span>
                <span className='button-icon'>🔑</span>
                </button>
            </form>
        </div>
    );
};

export default AuthorizeContainer;