import React from 'react';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';
const MainView: React.FC = () => {
    
    const TABLE_COLUMNS = {
        NAME: "Ім'я",
        DEFECT_STATE: 'Стан дефекту',
        NUMBER: 'Номер',
        CREATED_AT: 'Дата створення',
        OBJECT: "Об'єкт",
        SUBSTATION: 'Підстанція',
        PLACE_OF_DEFECT: 'Місце дефекту',
        CONNECTION: "З'єднання",
        ESSENCE_OF_DEFECT: 'Суть дефекту',
        AUTHOR: 'Автор',
        TECH_LEAD: 'Технічний лідер',
        RESPONSIBLE_FOR_ELIMINATION: 'Відповідальний за усунення',
        TIME_OF_ELIMINATION: 'Час усунення',
        DATE_OF_ACCEPTING: 'Дата прийняття',
        ACCEPTED_PERSON: 'Прийнята особа',
        DATE_OF_ELIMINATION: 'Дата усунення',
        ELIMINATED: 'Усунено',
        DATE_OF_START_EXPLOITATION: 'Дата початку експлуатації',
        ACCEPTED_EXPLOITATION_PERSON: 'Прийнята особа для експлуатації',
        MOVE_TO: 'Перемістити до',
        COMMENTS: 'Коментарі',
    } as const;
    const navigate = useNavigate();
    // Zustand table state
    const tableData = useTableStore(state => state.tableData);
    console.log('Table data:', tableData);
    const fetchTableData = useTableStore(state => state.fetchTableData);
    const logout = useAuthStore(state => state.logout);

    React.useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    const columns = [
        TABLE_COLUMNS.NAME,
        TABLE_COLUMNS.DEFECT_STATE,
        TABLE_COLUMNS.NUMBER,
        TABLE_COLUMNS.CREATED_AT,
        TABLE_COLUMNS.OBJECT,
        TABLE_COLUMNS.SUBSTATION,
        TABLE_COLUMNS.PLACE_OF_DEFECT,
        TABLE_COLUMNS.CONNECTION,
        TABLE_COLUMNS.ESSENCE_OF_DEFECT,
        TABLE_COLUMNS.AUTHOR,
        TABLE_COLUMNS.TECH_LEAD,
        TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION,
        TABLE_COLUMNS.TIME_OF_ELIMINATION,
        TABLE_COLUMNS.DATE_OF_ACCEPTING,
        TABLE_COLUMNS.ACCEPTED_PERSON,
        TABLE_COLUMNS.DATE_OF_ELIMINATION,
        TABLE_COLUMNS.ELIMINATED,
        TABLE_COLUMNS.DATE_OF_START_EXPLOITATION,
        TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON,
        TABLE_COLUMNS.MOVE_TO,
        TABLE_COLUMNS.COMMENTS,
    ];
    const clickHandler = (row: { [key: string]: string }) => {
        console.log('Row clicked:', row);
        navigate(`/edit/${row[TABLE_COLUMNS.NAME]}`); // Assuming 'Name' is unique and used for navigation
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
     <>
        <div style={{ display: 'flex', backgroundColor: '#fff', zIndex: 1000, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ margin: 0, padding: '10px 20px', textAlign: 'center' }}>Fixed Header with buttons</h1>
            <button 
                style={{ margin: '10px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
        <div style={{ paddingTop: '32px', padding: '20px', backgroundColor: '#f9f9f9', height: '100vh' }}>
            <div style={{ display: 'flex', marginTop: '20px', overflowX: 'auto' }}>
                <Table columns={columns} data={tableData} click={clickHandler }/>
            </div>
        </div>
    </>
    );
};

export default MainView;