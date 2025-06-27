import { create } from 'zustand';

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
  order: number;
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
  setTableData: (data: TableRow[]) => void;
  fetchTableData: () => Promise<void>;
  fetchTableDataById: (id: number) => Promise<void>;
}

export const useTableStore = create<TableState>((set, get) => ({
  tableData: [],
  tableDataById: {},
  setTableData: (data) => set({ tableData: data }),
  fetchTableData: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5188/api/Journals', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      // Defensive: support both array and { journals: [...] }
      set({ tableData: data.journals || [] });
      set({ tableDataById: data.journals.reduce((acc: Record<number, TableRow>, row: TableRow) => {
        acc[row.id] = row;
        return acc;
      }, {})});
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
  }

}));
