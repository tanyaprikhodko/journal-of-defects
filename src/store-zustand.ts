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
  appliedFilters: null,

  setFilters: (filters: {[key: string]: string } | null): void => {
    set({ appliedFilters: filters });
  },

  resetFilters: (): void => {
    set({ appliedFilters: null });
  },

  fetchTableData: async (params) => {
    try {
      const token = localStorage.getItem('accessToken');
      const searchParams = new URLSearchParams({
        page: params?.page ? params.page.toString() : get().currentPage?.toString() || '1',
        ColumnName: params?.sortBy || '',
        IsAscending: params?.order === 'asc' ? 'true' : 'false',
        ItemsPerPage: '20',
        ...get().appliedFilters ? get().appliedFilters : '',
      });

      const response = await fetch(`${getApiUrl()}/Journals?${searchParams.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        method: 'GET',
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
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
      set({ tableData: [] });
      throw error;
    }
  },

  fetchTableDataById: async (id: number) => {
    if (get().tableDataById[id]) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      set(state => ({
        tableDataById: { ...state.tableDataById, [id]: data },
      }));
    } catch (error) {
      console.error('Error fetching table data by ID:', error);
      throw error;
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
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const comments = await response.json();
      set(state => ({
        commentsById: { ...state.commentsById, [id]: comments },
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      set(state => ({
        commentsById: { ...state.commentsById, [id]: [] },
      }));
      throw error;
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
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
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
      throw error;
    }
  },

  fetchObjectTypes: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/objectTypes`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      set({ objectTypes: data });
    } catch (error) {
      console.error('Error fetching object types:', error);
      throw error;
    }
  },

  fetchLookupPlaces: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/places`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage as string);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      set({ lookupPlaces: data });
    } catch (error) {
      console.error('Error fetching lookup places:', error);
      throw error;
    }
  },

  fetchUsersByRegionId: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const regionId = localStorage.getItem('departmentId');
      const response = await fetch(`${getApiUrl()}/Users/by-region/${regionId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      set({
        usersByRegionId: {
          ...get().usersByRegionId,
          [regionId as string]: data,
        },
      });
    } catch (error) {
      console.error('Error fetching users by region ID:', error);
      set({ usersByRegionId: {} });
      throw error;
    }
  },

 fetchSubstations: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/substationRegions`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      set({ substations: data });
    } catch (error) {
      console.error('Error fetching substations:', error);
      throw error;
    }
 },

  deleteJournal: async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Journals/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      // Optionally refresh table data after deletion
      await get().fetchTableData({ page: get().currentPage });
      toast.success('Запис успішно видалено');
    } catch (error) {
      console.error('Error deleting journal:', error);
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

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const newJournal = await response.json();
      set(state => ({
        tableData: [...state.tableData, newJournal],
        tableDataById: { ...state.tableDataById, [newJournal.id]: newJournal },
      }));
      toast.success(isEditMode ? 'Запис успішно оновлено' : 'Запис успішно створено');
    } catch (error) {
      console.error('Error creating journal:', error);
      throw error;
    }
  },
  
  fetchRoles: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Lookups/roles`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const roles = await response.json();
      set({ roles });
    } catch (error) {
      console.error('Error fetching roles:', error);
      set({ roles: [] });
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Users/${userId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.success('Користувач успішно видалений');
    } catch (error) {
      console.error('Error deleting user:', error);
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
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.success('Користувач успішно доданий');
    } catch (error) {
      console.error('Error adding user:', error);
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
      if (!response.ok){
        const errorData = await response.json();
        const errorMessage = Object.values(errorData?.errors || {}).join('&nbsp;');
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      toast.success('Користувач успішно оновлений');
    } catch (error) {
      console.error('Error editing user:', error);
      throw error;
    }
  },
}));