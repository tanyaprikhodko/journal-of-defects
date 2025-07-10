import { create } from 'zustand';
import { parseJwt } from './utils';

// export interface FormData {
//   defectState: string;
//   number: number | null;
//   createdAt: string | Date;
//   object: string;
//   substation: string;
//   placeOfDefect: string;
//   connection: string;
//   essenceOfDefect: string;
//   author: string;
//   techLead: string;
//   responsibleRorElimination: string;
//   timeOfElimination: string | Date;
//   dateOfAccepting: string | Date;
//   acceptedPerson: string;
//   dateOfElimination: string | Date;
//   eliminated: string;
//   dateOfStartExploitation: string | Date;
//   acceptedExploitationPerson: string;
//   moveTo: string;
//   comments: string[];
// }

// export const initialFormData: FormData = {
//   defectState: '',
//   number: null,
//   createdAt: '',
//   object: '',
//   substation: '',
//   placeOfDefect: '',
//   connection: '',
//   essenceOfDefect: '',
//   author: '',
//   techLead: '',
//   responsibleRorElimination: '',
//   timeOfElimination: '',
//   dateOfAccepting: '',
//   acceptedPerson: '',
//   dateOfElimination: '',
//   eliminated: '',
//   dateOfStartExploitation: '',
//   acceptedExploitationPerson: '',
//   moveTo: '',
//   comments: [],
// };

// interface EditPageState {
//   savedForms: Record<string, FormData>;
//   setForm: (id: string, form: FormData) => void;
//   getForm: (id: string) => FormData;
//   fetchFormData: (id: string) => Promise<void>;
// }

// export const useEditPageStore = create<EditPageState>((set, get) => ({
//   savedForms: {},
//   setForm: (id, form) => set(state => ({
//     savedForms: { ...state.savedForms, [id]: form }
//   })),
//   getForm: (id) => get().savedForms[id] || initialFormData,
//   fetchFormData: async (id) => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch(`http://localhost:5188/api/Journals/${id}`, {
//         headers: token ? { 'Authorization': `Bearer ${token}` } : {},
//       });
//       if (!response.ok) throw new Error('Failed to fetch form data');
//       const data = await response.json();
//       // Ensure the fetched data matches FormData shape
//       set(state => ({
//         savedForms: { ...state.savedForms, [id]: {
//           ...initialFormData,
//           ...data,
//           comments: Array.isArray(data.comments) ? data.comments : [],
//         } }
//       }));
//     } catch {
//       // Optionally handle error
//     }
//   },
// }));

interface Person {
  id: number;
  name: string;
  login: string;
  rank: string;
}

export interface TableRow {
  id: number;
  condition: string;
  substation: string;
  order: number | string;
  substationRegion: string;
  substationRegionId: string;
  registrationDate: string;
  objectType: string;
  objectNumber: number | null;
  place: string;
  connection: string;
  description: string;
  messageAuthor: Person;
  responsible: Person;
  completionTerm: string;
  technicalManager: Person;
  acceptionDate: string;
  acceptedBy: Person;
  completionDate: string;
  completedBy: Person;
  confirmedBy: Person;
  confirmationDate: string;
}

export interface TableState {
  tableData: TableRow[];
  tableDataById: Record<number, TableRow>;
  totalPages?: number;
  currentPage?: number;
  commentsById?: Record<number, any[]>; // Assuming comments are an array of objects
  objectTypes: Array<{ id: number; type: string }>;
  lookupPlaces?: Array<{ id: number; name: string }>;
  usersByRegionId?: Record<string, Person[]>;
  fetchTableData: (page?: number) => Promise<void>;
  fetchTableDataById: (id: number) => Promise<void>;
  getCommentsById: (id: number) => Promise<void>;
  addComment: (journalId: number, comment: string) => Promise<void>;
  fetchObjectTypes: () => Promise<void>;
  fetchLookupPlaces: () => Promise<void>;
  fetchUsersByRegionId: (regionId: string) => Promise<void>;
  deleteJournal: (id: number) => Promise<void>;
}

export const useTableStore = create<TableState>((set, get) => ({
  tableData: [],
  tableDataById: {},
  objectTypes: [],
  lookupPlaces: [],
  usersByRegionId: {},
  fetchTableData: async (page?: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page ? page.toString() : get().currentPage?.toString() || '1',
      });
      const response = await fetch(`http://localhost:5188/api/Journals?${params.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        method: 'GET'
      });
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      // Defensive: support both array and { journals: [...] }
      set({ tableData: data.journals || [] });
      set({ tableDataById: data.journals.reduce((acc: Record<number, TableRow>, row: TableRow) => {
        acc[row.id] = row;
        return acc;
      }, {})});
      set({ totalPages: data.totalPages, currentPage: data.currentPage });
      console.log('Table data fetched successfully:', data.journals);
    } catch(error) {
      console.error('Error fetching table data:', error);
      set({ tableData: [] });
    }
  },

fetchTableDataById: async (id: number) => {
    if (get().tableDataById[id]) return
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5188/api/Journals/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch table data by ID');
      const data = await response.json();
      set(state => ({
        tableDataById: { ...state.tableDataById, [id]: data }
      }));
    } catch {
      // Optionally handle error
    }
  },

  getCommentsById: async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5188/api/Journals/${id }/comments`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const comments = await response.json();
      set(state => ({
        commentsById: { ...state.commentsById, [id]: comments }
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      set(state => ({
        commentsById: { ...state.commentsById, [id]: [] }
      }));
    }
  },

  addComment: async (journalId: number, comment: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const user = parseJwt(token || '');
      console.log('Parsed user from token:', user);
      if (!user?.nameidentifier) throw new Error('User not found');
      const response = await fetch(`http://localhost:5188/api/Comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ comment, authorId: user.nameidentifier, journalId })
      });
      if (!response.ok) throw new Error('Failed to post comment');
      const newComment = await response.json();
      set(state => ({
        commentsById: { ...state.commentsById, [journalId]: [...(state.commentsById?.[journalId] || []), newComment] }
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  },

  fetchObjectTypes: async () => {
    try{
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5188/api/Lookups/objectTypes', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch object types');
      const data = await response.json();
      set({ objectTypes: data });
    } catch (error) {
      console.error('Error fetching object types:', error);
    }
  },

  fetchLookupPlaces: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5188/api/Lookups/places', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch lookup places');
      const data = await response.json();
      set({ lookupPlaces: data });
    } catch (error) {
      console.error('Error fetching lookup places:', error);
    }
  },

  fetchUsersByRegionId: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const regionId = localStorage.getItem('departmentId');
      const response = await fetch(`http://localhost:5188/api/Users?regionId=${regionId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch users by region ID');
      const data = await response.json();
      set({ usersByRegionId: {
        ...get().usersByRegionId,
        [regionId as string]: data
      } });
    } catch (error) {
      console.error('Error fetching users by region ID:', error);
      set({ usersByRegionId: {} });
    }
  },

  deleteJournal: async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5188/api/Journals/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to delete journal');
      // Optionally refresh table data after deletion
      await get().fetchTableData(get().currentPage);
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  }
}));
