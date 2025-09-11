import { create } from 'zustand';
import { toast } from 'react-toastify';
import { parseJwt } from './utils';
import { 
  createJournalPayload, 
  TableRow, 
  CommentRequest, 
  TableState,
  Person 
} from './types';
import { getApiUrl } from './config';

export const useTableStore = create<TableState>((set, get) => ({
  tableData: [],
  tableDataById: {},
  objectTypes: [],
  lookupPlaces: [],
  usersByRegionId: {},
  fetchTableData: async (params) => {
    try {
      const token = localStorage.getItem('accessToken');
      const searchParams = new URLSearchParams({
        page: params?.page ? params.page.toString() : get().currentPage?.toString() || '1',
        ColumnName: params?.sortBy || '',
        IsAscending: params?.order === 'asc' ? 'true' : 'false',
        ...params.filter ? params.filter : '',
      });
      const response = await fetch(`${getApiUrl()}/Journals?${searchParams.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      set({ tableData: data.journals || [] });
      set({
        tableDataById: data.journals.reduce((acc: Record<number, TableRow>, row: TableRow) => {
          acc[row.id as number] = row;
          return acc;
        }, {}),
      });
      set({ totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (error) {
      console.error('Error fetching table data:', error);
      toast.error('Помилка завантаження даних таблиці');
      set({ tableData: [] });
    }
  },

  fetchTableDataById: async (id: number) => {
    if (get().tableDataById[id]) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch table data by ID');
      const data = await response.json();
      set(state => ({
        tableDataById: { ...state.tableDataById, [id]: data },
      }));
    } catch (error) {
      console.error('Error fetching table data by ID:', error);
      toast.error('Помилка завантаження деталей запису');
    }
  },

  getTableDataById: (id: number) => {
    return get().tableDataById[id];
  },

  getCommentsById: async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${id}/comments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const comments = await response.json();
      set(state => ({
        commentsById: { ...state.commentsById, [id]: comments },
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Помилка завантаження коментарів');
      set(state => ({
        commentsById: { ...state.commentsById, [id]: [] },
      }));
    }
  },

  addComment: async (comment: CommentRequest) => {
    try {
      const token = localStorage.getItem('accessToken');
      const user = parseJwt(token || '');
      if (!user?.nameidentifier) throw new Error('User not found');
      const response = await fetch(`${getApiUrl()}/Comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ body: comment.body, authorId: user.nameidentifier, journalId: comment.journalId }),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      const newComment = await response.json();
      set(state => ({
        commentsById: {
          ...state.commentsById,
          [comment.journalId]: [...(state.commentsById?.[comment.journalId] || []), newComment],
        },
      }));
      toast.success('Коментар успішно додано');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Помилка додавання коментаря');
    }
  },

  fetchObjectTypes: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/objectTypes`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch object types');
      const data = await response.json();
      set({ objectTypes: data });
    } catch (error) {
      console.error('Error fetching object types:', error);
      toast.error('Помилка завантаження типів об\'єктів');
    }
  },

  fetchLookupPlaces: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/places`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch lookup places');
      const data = await response.json();
      set({ lookupPlaces: data });
    } catch (error) {
      console.error('Error fetching lookup places:', error);
      toast.error('Помилка завантаження місць дефектів');
    }
  },

  fetchUsersByRegionId: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const regionId = localStorage.getItem('departmentId');
      const response = await fetch(`${getApiUrl()}/Users/by-region/${regionId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch users by region ID');
      const data = await response.json();
      set({
        usersByRegionId: {
          ...get().usersByRegionId,
          [regionId as string]: data,
        },
      });
    } catch (error) {
      console.error('Error fetching users by region ID:', error);
      toast.error('Помилка завантаження користувачів регіону');
      set({ usersByRegionId: {} });
    }
  },

 fetchSubstations: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/substationRegions`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch substations');
      const data = await response.json();
      set({ substations: data });
    } catch (error) {
      console.error('Error fetching substations:', error);
      toast.error('Помилка завантаження підстанцій');
    }
 },

  deleteJournal: async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to delete journal');
      // Optionally refresh table data after deletion
      await get().fetchTableData({ page: get().currentPage });
      toast.success('Запис успішно видалено');
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Помилка видалення запису');
      throw error;
    }
  },

  createJournal: async (journal: createJournalPayload, isEditMode: boolean, id: number | null) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${ isEditMode ? id : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(journal),
      });
      if (!response.ok) throw new Error('Failed to create journal');
      const newJournal = await response.json();
      set(state => ({
        tableData: [...state.tableData, newJournal],
        tableDataById: { ...state.tableDataById, [newJournal.id]: newJournal },
      }));
      toast.success(isEditMode ? 'Запис успішно оновлено' : 'Запис успішно створено');
    } catch (error) {
      console.error('Error creating journal:', error);
      toast.error(isEditMode ? 'Помилка оновлення запису' : 'Помилка створення запису');
      throw error;
    }
  },
  
  fetchRoles: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/roles`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const roles = await response.json();
      set({ roles });
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Помилка завантаження ролей');
      set({ roles: [] });
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Users/${userId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to delete user');
      toast.success('Користувач успішно видалений');
      // Optionally, refresh users list or update state here
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Помилка видалення користувача');
      throw error;
    }
  },

  addUser: async (user: Partial<Person>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to add user');
      toast.success('Користувач успішно доданий');
      // Optionally, refresh users list or update state here
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Помилка додавання користувача');
      throw error;
    }
  },

  editUser: async (userId: number, user: Partial<Person>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to edit user');
      toast.success('Користувач успішно оновлений');
      // Optionally, refresh users list or update state here
    } catch (error) {
      console.error('Error editing user:', error);
      toast.error('Помилка редагування користувача');
      throw error;
    }
  },
}));