import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../authorizationSlice';
import './styles/authorization.scss';


const AuthorizeContainer: React.FC = () => {
    const [department, setDepartment] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get department and user options from Redux authorization state
    const departmentOptions = useSelector((state: { authorization: { departments: string[] } }) => state.authorization.departments);
    const userOptions = useSelector((state: { authorization: { users: string[] } }) => state.authorization.users);
    const isAuthenticated = useSelector((state: { authorization: { isAuthenticated: boolean } }) => state.authorization.isAuthenticated);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ user, password }));
        setShowError(true); // Show error if login fails
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