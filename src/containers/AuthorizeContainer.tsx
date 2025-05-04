import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/authorization.scss';


const AuthorizeContainer: React.FC = () => {
    const [department, setDepartment] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ department, user, password });
        navigate('/main-view');
    };

    return (
        <div style={{ margin: 'auto auto', width: '30%', padding: '20px', backgroundColor: '#d5f5f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>Authorization</h2>
            <form onSubmit={handleSubmit} className='form'>
                <div className='option'>
                    <label htmlFor="department">
                        Department
                    </label>
                    <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>
                            Select Department
                        </option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                <div className='option'>
                    <label htmlFor="user" >
                        User
                    </label>
                    <select
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>Select User</option>
                        <option value="User1">User1</option>
                        <option value="User2">User2</option>
                        <option value="User3">User3</option>
                    </select>
                </div>
                <div  className='option'>
                    <label htmlFor="password">
                        Password
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
                    Authorize
                </button>
            </form>
        </div>
    );
};

export default AuthorizeContainer;