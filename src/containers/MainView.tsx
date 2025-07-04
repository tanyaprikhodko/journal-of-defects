import React from 'react';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';
import { TABLE_COLUMNS } from '../constants/tableColumns';
import { TableRow } from '../types/table';

const MainView: React.FC = () => {
  const tableColumns = [
    { key: 'condition', label: TABLE_COLUMNS.DEFECT_STATE },
    { key: 'order', label: TABLE_COLUMNS.NUMBER }, // Combine two keys in one column
    { key: 'substationRegion', label: TABLE_COLUMNS.SUBSTATION_REGION },
    { key: 'registrationDate', label: TABLE_COLUMNS.CREATED_AT },
    { key: 'objectType', label: TABLE_COLUMNS.OBJECT },
    { key: 'substation', label: TABLE_COLUMNS.SUBSTATION },
    { key: 'place', label: TABLE_COLUMNS.PLACE_OF_DEFECT },
    { key: 'connection', label: TABLE_COLUMNS.CONNECTION },
    { key: 'description', label: TABLE_COLUMNS.ESSENCE_OF_DEFECT },
    { key: 'messageAuthor', label: TABLE_COLUMNS.AUTHOR },
    { key: 'technicalManager', label: TABLE_COLUMNS.TECH_LEAD },
    { key: 'responsible', label: TABLE_COLUMNS.RESPONSIBLE_FOR_ELIMINATION },
    { key: 'completionTerm', label: TABLE_COLUMNS.TIME_OF_ELIMINATION },
    { key: 'confirmationDate', label: TABLE_COLUMNS.DATE_OF_ACCEPTING },
    { key: 'completionDate', label: TABLE_COLUMNS.DATE_OF_ELIMINATION },
    { key: 'completedBy', label: TABLE_COLUMNS.ELIMINATED },
    { key: 'acceptionDate', label: TABLE_COLUMNS.DATE_OF_START_EXPLOITATION },
    { key: 'acceptedBy', label: TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON },
  ];

  const navigate = useNavigate();
  const tableData = useTableStore(state => state.tableData);
  const totalPages = useTableStore(state => state.totalPages);
  const currentPage = useTableStore(state => state.currentPage);
  const fetchTableData = useTableStore(state => state.fetchTableData);
  const logout = useAuthStore(state => state.logout);

  const preparedTableData: Array<TableRow> = React.useMemo(() => {
    return tableData.map(item => {
      return {
        ...item,
        order: `${item.order} - ${item.substationRegionId}`,
        registrationDate: new Date(item.registrationDate).toLocaleDateString(),
        completionTerm: item.completionTerm ? new Date(item.completionTerm).toLocaleDateString() : '',
        confirmationDate: item.confirmationDate ? new Date(item.confirmationDate).toLocaleDateString() : '',
        completionDate: item.completionDate ? new Date(item.completionDate).toLocaleDateString() : '',
        acceptionDate: item.acceptionDate ? new Date(item.acceptionDate).toLocaleDateString() : '',
        messageAuthor: `${item.messageAuthor.name} - ${item.messageAuthor.rank}`,
        technicalManager: `${item.technicalManager.name} - ${item.technicalManager.rank}`,
        responsible: item.responsible ? `${item.responsible.name} - ${item.responsible.rank}` : '',
        completedBy: item.completedBy ? `${item.completedBy.name} - ${item.completedBy.rank}` : '',
        acceptedBy: item.acceptedBy ? `${item.acceptedBy.name} - ${item.acceptedBy.rank}` : '',
        confirmedBy: item.confirmedBy ? `${item.confirmedBy.name} - ${item.confirmedBy.rank}` : '',
      }
    });
  }, [tableData]);

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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/create')}
      >
        <span role="img" aria-label="Створити" style={{ marginRight: 8 }}>➕</span>
        Створити
      </button>
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/create-copy')}
      >
        <span role="img" aria-label="Копія" style={{ marginRight: 8 }}>📋</span>
        Створити копію
      </button>
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/edit')}
      >
        <span role="img" aria-label="Редагувати" style={{ marginRight: 8 }}>✏️</span>
        Редагувати
      </button>
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/delete')}
      >
        <span role="img" aria-label="Видалити" style={{ marginRight: 8 }}>🗑️</span>
        Видалити
      </button>
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => fetchTableData(currentPage ? currentPage : 1)}
      >
        <span role="img" aria-label="Оновити" style={{ marginRight: 8 }}>🔄</span>
        Оновити
      </button>
      <button
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/filter')}
      >
        <span role="img" aria-label="Фільтр" style={{ marginRight: 8 }}>🔍</span>
        Фільтр
      </button>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
            <span role="img" aria-label="Вихід" style={{ marginRight: 8 }}>🚪</span>
          Вихід
        </button>
        {/* Pagination Controls */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '20px' }}>
          <button
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
            onClick={() => fetchTableData(currentPage ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            <span role="img" aria-label="Попередня сторінка">◀️</span>
          </button>
          <span style={{ margin: '0 10px' }}>
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
            onClick={() => fetchTableData(currentPage ? currentPage + 1 : 1)}
            disabled={currentPage === totalPages}
          >
            <span role="img" aria-label="Наступна сторінка">▶️</span>
          </button>
        </div>
      </div>
        <div style={{padding: '16px 32px', paddingBottom: '32px', margin: '16px 0', height: '100%'}}>
          <Table columns={tableColumns} data={preparedTableData} click={clickHandler} />
        </div>
      <footer
        style={{
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
          padding: '16px 32px',
          fontSize: '14px',
          color: '#000',
          position: 'fixed',
          bottom: 0,
          left: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'inline-block', width: 24, height: 24, backgroundColor: 'yellow', borderRadius: 2, verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}> Переміщений</span>
        <div style={{ display: 'inline-block', width: 24, height: 24, backgroundColor: 'red', borderRadius: 2, verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}> Протермінований</span>
        <div style={{ display: 'inline-block', width: 24, height: 24, backgroundColor: 'green', borderRadius: 2, verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}> Прийнятий в експлуатацію</span>
        </div>
      </footer>
    </div>
  );
};

export default MainView;