import { create } from 'zustand';

export interface FormData {
  defectState: string;
  number: number | null;
  createdAt: string | Date;
  object: string;
  substation: string;
  placeOfDefect: string;
  connection: string;
  essenceOfDefect: string;
  author: string;
  techLead: string;
  responsibleRorElimination: string;
  timeOfElimination: string | Date;
  dateOfAccepting: string | Date;
  acceptedPerson: string;
  dateOfElimination: string | Date;
  eliminated: string;
  dateOfStartExploitation: string | Date;
  acceptedExploitationPerson: string;
  moveTo: string;
  comments: string[];
}

export const initialFormData: FormData = {
  defectState: '',
  number: null,
  createdAt: '',
  object: '',
  substation: '',
  placeOfDefect: '',
  connection: '',
  essenceOfDefect: '',
  author: '',
  techLead: '',
  responsibleRorElimination: '',
  timeOfElimination: '',
  dateOfAccepting: '',
  acceptedPerson: '',
  dateOfElimination: '',
  eliminated: '',
  dateOfStartExploitation: '',
  acceptedExploitationPerson: '',
  moveTo: '',
  comments: [],
};

interface EditPageState {
  savedForms: Record<string, FormData>;
  setForm: (name: string, form: FormData) => void;
  getForm: (name: string) => FormData;
}

export const useEditPageStore = create<EditPageState>((set, get) => ({
  savedForms: {},
  setForm: (name, form) => set(state => ({
    savedForms: { ...state.savedForms, [name]: form }
  })),
  getForm: (name) => get().savedForms[name] || initialFormData,
}));

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

interface TableState {
  tableData: TableRow[];
  setTableData: (data: TableRow[]) => void;
  fetchTableData: () => Promise<void>;
}

export const useTableStore = create<TableState>((set) => ({
  tableData: [],
  setTableData: (data) => set({ tableData: data }),
  fetchTableData: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5188/api/Journals', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      set({ tableData: data.journals });
    } catch {
      set({ tableData: [] });
    }
  },
}));
