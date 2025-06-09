import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store-zustand';
import './styles/authorization.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const AuthorizeContainer: React.FC = () => {
    const [department, setDepartment] = useState<{ id: string; name: string } | null>(null);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    // Zustand hooks
    const departmentOptions = useAuthStore(state => state.departments);
    const userOptions = useAuthStore(state => state.users);
    console.log(userOptions)
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const login = useAuthStore(state => state.login);
    const fetchUsers = useAuthStore(state => state.fetchUsers);
    const fetchDepartments = useAuthStore(state => state.fetchDepartments);

    React.useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, [fetchUsers, fetchDepartments]);

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
                    <Autocomplete
                        id="department"
                        style={{ width: '100%' }}
                        options={departmentOptions}
                        value={department}
                        onChange={(_, newValue) => setDepartment(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Виберіть РЕМ"
                                variant="outlined"
                                size="small"
                                style={{ width: '100%' }}
                            />
                        )}
                        freeSolo={false}
                    />
                </div>
                <div className='option'>
                    <label htmlFor="user" >
                        Користувач
                    </label>
                    <Autocomplete
                        id="user"
                        style={{ width: '100%' }}
                        options={userOptions}
                        getOptionLabel={(option) => option.name}
                        value={userOptions.find(u => u.login === user) || null}
                        onChange={(_, newValue) => setUser(newValue ? newValue.login : '')}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Виберіть користувача"
                                variant="outlined"
                                size="small"
                                style={{ width: '100%' }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
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