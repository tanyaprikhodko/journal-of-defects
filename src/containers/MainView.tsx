import React from 'react';
import Table from '../components/Table';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useTableStore } from '../store-zustand';
import { useAuthStore } from '../store-auth';
import { TABLE_COLUMNS } from '../constants/tableColumns';
import { TableRowDisplay } from '../types/table';
import DeleteConfirmation from '../components/DeleteConformation';
import ColumnSort from '../components/ColumnSort';
import FiltersModal from '../components/FiltersModal';
import '../containers/styles/mainView.scss';
import 'react-toastify/dist/ReactToastify.css';
import { parseJwt } from '../utils';

const MainView: React.FC = () => {
  const tableColumns = [
    { key: 'condition', label: TABLE_COLUMNS.DEFECT_STATE },
    { key: 'order', label: TABLE_COLUMNS.NUMBER },
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
    { key: 'acceptionDate', label: TABLE_COLUMNS.DATE_OF_ACCEPTING },
    { key: 'completionDate', label: TABLE_COLUMNS.DATE_OF_ELIMINATION },
    { key: 'completedBy', label: TABLE_COLUMNS.ELIMINATED },
    { key: 'confirmationDate', label: TABLE_COLUMNS.DATE_OF_START_EXPLOITATION },
    { key: 'acceptedBy', label: TABLE_COLUMNS.ACCEPTED_EXPLOITATION_PERSON },
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tableData = useTableStore(state => state.tableData);
  const totalPages = useTableStore(state => state.totalPages);
  const currentPage = useTableStore(state => state.currentPage);
  const appliedFilters = useTableStore(state => state.appliedFilters);
  const fetchTableData = useTableStore(state => state.fetchTableData);
  const deleteJournal = useTableStore(state => state.deleteJournal);
  const setAppliedFilters = useTableStore(state => state.setAppliedFilters);
  const logout = useAuthStore(state => state.logout);
  const fetchUsers = useAuthStore(state => state.fetchUsers);
  const jwt = localStorage.getItem('accessToken');
  const currentUserRole = jwt ? parseJwt(jwt)?.role : '';

  const [actionToNavigate, setActionToNavigate] = React.useState<string>('');
  const [selectedJournalId, setSelectedJournalId] = React.useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Watch for search params changes
  React.useEffect(() => {
    const data = {
      ...(searchParams.get('page') ? { page: searchParams.get('page') } : {}),
      ...(searchParams.get('sortBy') ? { sortBy: searchParams.get('sortBy') } : {}),
      ...(searchParams.get('order') ? { order: searchParams.get('order') } : {}),
      ...(searchParams.get('filters') ? { filters: searchParams.get('filters') } : {}),
    };

    fetchTableData(data);
  }, [searchParams, fetchTableData]);

  // Parse URL parameters
  const parseUrlParams = React.useCallback(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sortBy') || undefined;
    const order = searchParams.get('order') || undefined;
    const filtersJson = searchParams.get('filters');
    
    let filters = null;
    if (filtersJson) {
      try {
        filters = JSON.parse(decodeURIComponent(filtersJson));
      } catch (e) {
        console.error('Error parsing filters from URL:', e);
      }
    }

    return { page, sortBy, order, filters };
  }, [searchParams]);

  // Update URL with page parameter
  const updatePageInUrl = React.useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // Load data from URL on mount
  React.useEffect(() => {
    if (isInitialLoad) {
      const { page, sortBy, order, filters } = parseUrlParams();
      
      if (filters) {
        setAppliedFilters(filters);
      }
      
      fetchTableData({ page, sortBy, order, filter: filters || undefined });
      fetchUsers();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, parseUrlParams, setAppliedFilters, fetchTableData, fetchUsers]);

  const preparedTableData: TableRowDisplay[] = React.useMemo(() => {
    return tableData.map(item => {
      return {
        ...item,
        order: `${item.order} - ${item.substationRegionId}`,
        registrationDate: new Date(item.registrationDate).toLocaleDateString(),
        completionTerm: item.completionTerm ? new Date(item.completionTerm).toLocaleDateString() : '',
        confirmationDate: item.confirmationDate ? new Date(item.confirmationDate).toLocaleDateString() : '',
        completionDate: item.completionDate ? new Date(item.completionDate).toLocaleDateString() : '',
        acceptionDate: item.acceptionDate ? new Date(item.acceptionDate).toLocaleDateString() : '',
        messageAuthor: `${item.messageAuthor?.name} - ${item.messageAuthor?.rank}`,
        technicalManager: item.technicalManager ? `${item.technicalManager?.name} - ${item.technicalManager?.rank}` : '',
        responsible: item.responsible ? `${item.responsible?.name} - ${item.responsible?.rank}` : '',
        completedBy: item.completedBy ? `${item.completedBy?.name} - ${item.completedBy?.rank}` : '',
        acceptedBy: item.confirmedBy ? `${item.confirmedBy?.name} - ${item.confirmedBy?.rank}` : '',
        confirmedBy: item.acceptedBy ? `${item.acceptedBy?.name} - ${item.acceptedBy?.rank}` : '', 
      }
    });
  }, [tableData]);

  const handleFetchData = () => {
    const data = parseUrlParams();
    fetchTableData(data);
  };

  const clickHandler = (id: number) => {
    setSelectedJournalId(id);
    if (actionToNavigate === 'delete') {
      if (isObserver()) return;
      setShowDeleteModal(true);
      return;
    }
    if (!actionToNavigate) {
      navigate(`/edit/${id}`);
    } else {
      if (isObserver()) return;
      navigate(`/${actionToNavigate}/${id}`);
    }
    setActionToNavigate('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isObserver = () => { return currentUserRole.includes('Перегляд всіх журналів'); }

  const isCreateDisabled = () => { return currentUserRole.includes('Адміністратор') && !isObserver(); }

  const handleDeleteJournal = () => {
    if (selectedJournalId) {
      deleteJournal(selectedJournalId);
    }
    setSelectedJournalId(null);
    setActionToNavigate('');
  };

  const handlePageChange = (newPage: number) => {
    updatePageInUrl(newPage);
    const data = parseUrlParams();
    fetchTableData({ ...data, page: newPage });
  };

  return (
    <div className="main-view-root">
      <div className="main-view-header">
      <button
        className={`main-view-btn${actionToNavigate === 'create' ? ' active' : ''}`}
        onClick={() => navigate('/create')}
        disabled={isCreateDisabled()}
      >
        <span role="img" aria-label="Створити" style={{ marginRight: 8 }}>➕</span>
        Створити
      </button>
      <button
        className={`main-view-btn${actionToNavigate === 'create-copy' ? ' active' : ''}`}
        onClick={() => actionToNavigate === 'create-copy' ? setActionToNavigate('') : setActionToNavigate('create-copy')}
        disabled={isCreateDisabled()}
      >
        <span role="img" aria-label="Копія" style={{ marginRight: 8 }}>📋</span>
        Створити копію
      </button>
      <button
        className={`main-view-btn${actionToNavigate === 'edit' ? ' active' : ''}`}
        onClick={() => actionToNavigate === 'edit' ? setActionToNavigate('') : setActionToNavigate('edit')}
        disabled={isObserver()}
      >
        <span role="img" aria-label="Редагувати" style={{ marginRight: 8 }}>✏️</span>
        Редагувати
      </button>
      <button
        className={`main-view-btn${actionToNavigate === 'delete' ? ' active' : ''}`}
        onClick={() => actionToNavigate === 'delete' ? setActionToNavigate('') : setActionToNavigate('delete')}
        disabled={isObserver()}
      >
        <span role="img" aria-label="Видалити" style={{ marginRight: 8 }}>🗑️</span>
        Видалити
      </button>
      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={() => {
            handleDeleteJournal();
            setShowDeleteModal(false);
            setSelectedJournalId(null);
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedJournalId(null);
            setActionToNavigate('');
          }}
        />
      )}
      <button
        className="main-view-btn"
        onClick={() => handleFetchData()}
      >
        <span role="img" aria-label="Оновити" style={{ marginRight: 8 }}>🔄</span>
        Оновити
      </button>
      <button
        className="main-view-btn"
        onClick={() => actionToNavigate === 'filter' ? setActionToNavigate('') : setActionToNavigate('filter')}
      >
        <span role="img" aria-label="Фільтр" style={{ marginRight: 8 }}>🔍</span>
        Фільтр
        {appliedFilters && <span style={{ marginLeft: 4, color: '#4CAF50' }}>●</span>}
      </button>
      {actionToNavigate === 'filter' && (
        <FiltersModal
          open={actionToNavigate === 'filter'}
          onClose={() => setActionToNavigate('')}
          onApply={() => {
            setActionToNavigate('');
          }}
        />
      )}
      {currentUserRole.includes('Адміністратор') && (
        <button
          className="main-view-btn"
           onClick={() => navigate('/users-admin')}
        >
          <span role="img" aria-label="Користувачі" style={{ marginRight: 8 }}>👥</span>
          Користувачі
        </button>
      )}
      <button
        className="main-view-btn"
        onClick={handleLogout}
      >
        <span role="img" aria-label="Вихід" style={{ marginRight: 8 }}>🚪</span>
        Вихід
      </button>
      {/* Pagination Controls */}
      <div className="main-view-pagination">
        <button
          className="main-view-pagination-btn"
          onClick={() => handlePageChange((currentPage || 1) - 1)}
          disabled={currentPage === 1}
        >
          <span role="img" aria-label="Попередня сторінка">◀️</span>
        </button>
        <span className="main-view-pagination-info">
          Сторінка {currentPage} з {totalPages}
        </span>
        <button
          className="main-view-pagination-btn"
          onClick={() => handlePageChange((currentPage || 1) + 1)}
          disabled={currentPage === totalPages}
        >
          <span role="img" aria-label="Наступна сторінка">▶️</span>
        </button>
      </div>
      </div>
      <div className="main-view-table-container">
        <Table columns={tableColumns} data={preparedTableData} click={clickHandler} activeRowId={selectedJournalId} />
      </div>
      <footer className="main-view-footer">
        <div className="main-view-footer-legend">
          <div className="main-view-legend-item main-view-legend-moved" />
          <span> Переміщений</span>
          <div className="main-view-legend-item main-view-legend-overdue" />
          <span> Протермінований</span>
          <div className="main-view-legend-item main-view-legend-accepted" />
          <span> Прийнятий в експлуатацію</span>
        </div>
        <div className="main-view-column-sort">
         <ColumnSort />
        </div>
      </footer>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default MainView;