import React from 'react';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';
import { TABLE_COLUMNS } from '../constants/tableColumns';

const MainView: React.FC = () => {
  const tableColumns = [
    { key: 'condition', label: TABLE_COLUMNS.DEFECT_STATE },
    { key: 'order', label: TABLE_COLUMNS.NUMBER },
    { key: 'substationRegion', label: TABLE_COLUMNS.SUBSTATION_REGION },
    { key: 'registrationDate', label: TABLE_COLUMNS.CREATED_AT },
    { key: 'objectType', label: TABLE_COLUMNS.OBJECT },
    { key: 'substation', label: TABLE_COLUMNS.SUBSTATION },
    { key: 'place', label: TABLE_COLUMNS.PLACE_OF_DEFECT },
    { key: 'connection', label: TABLE_COLUMNS.CONNECTION },
    { key: 'description', label: TABLE_COLUMNS.ESSENCE_OF_DEFECT },
    { key: 'messageAuthor.name', label: TABLE_COLUMNS.AUTHOR },
    { key: 'techLead', label: TABLE_COLUMNS.TECH_LEAD },
    { key: 'responsibleForElimination', label: TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION },
    { key: 'timeOfElimination', label: TABLE_COLUMNS.TIME_OF_ELIMINATION },
    { key: 'dateOfAccepting', label: TABLE_COLUMNS.DATE_OF_ACCEPTING },
    { key: 'acceptedPerson', label: TABLE_COLUMNS.ACCEPTED_PERSON },
    { key: 'dateOfElimination', label: TABLE_COLUMNS.DATE_OF_ELIMINATION },
    { key: 'eliminated', label: TABLE_COLUMNS.ELIMINATED },
    { key: 'dateOfStartExploitation', label: TABLE_COLUMNS.DATE_OF_START_EXPLOITATION },
    { key: 'acceptedExploitationPerson', label: TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON },
    { key: 'moveTo', label: TABLE_COLUMNS.MOVE_TO },
    { key: 'comments', label: TABLE_COLUMNS.COMMENTS },
  ];

  const navigate = useNavigate();
  const tableData = useTableStore(state => state.tableData);
  const fetchTableData = useTableStore(state => state.fetchTableData);
  const logout = useAuthStore(state => state.logout);

  React.useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const clickHandler = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ margin: 0, padding: '10px 20px', textAlign: 'center' }}>
          Fixed Header with buttons
        </h1>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div style={{ paddingTop: '32px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', marginTop: '20px', height: '80vh', overflow: 'auto' }}>
          <Table columns={tableColumns} data={tableData} click={clickHandler} />
        </div>
      </div>
    </>
  );
};

export default MainView;