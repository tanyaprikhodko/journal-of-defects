import React from 'react';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../authorizationSlice';

const MainView: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login'); 
    }
    const columns = ['Name', 'Age', 'Department'];
    const data = useSelector((state: { table: { data: { [key: string]: string }[] } }) => state.table.data);
    const clickHandler = (row: { [key: string]: string }) => {
        console.log('Row clicked:', row);
        navigate(`/edit/${row.Name}`); // Assuming 'Name' is unique and used for navigation
    };
    return (
     <>
        <div style={{ display: 'flex', width: '100%', backgroundColor: '#fff', zIndex: 1000, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ margin: 0, padding: '10px 20px', textAlign: 'center' }}>Fixed Header with buttons</h1>
            <button 
                style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >
                Logout
            </button>
        </div>
        <div style={{ paddingTop: '32px', padding: '20px', backgroundColor: '#f9f9f9', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Table columns={columns} data={data} click={clickHandler }/>
            </div>
        </div>
    </>
    );
};

export default MainView;