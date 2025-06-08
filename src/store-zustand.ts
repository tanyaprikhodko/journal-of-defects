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

interface AuthState {
  departments: string[];
  users: string[];
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (user: string, password: string) => boolean;
  logout: () => void;
  setDepartments: (departments: string[]) => void;
  setUsers: (users: string[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  departments: ['Відділ 1', 'Відділ 2'],
  users: ['User 1', 'User 2'],
  isAuthenticated: false,
  currentUser: null,
  login: (user, password) => {
    // Example: always succeed
    set({ isAuthenticated: true, currentUser: user });
    return true;
  },
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  setDepartments: (departments) => set({ departments }),
  setUsers: (users) => set({ users }),
}));

interface TableState {
  tableData: any[];
  setTableData: (data: any[]) => void;
}

export const useTableStore = create<TableState>((set) => ({
  tableData: [
    { Name: 'John Doe', Age: '30', Department: 'HR' },
    { Name: 'Jane Smith', Age: '25', Department: 'IT' },
    { Name: 'Sam Johnson', Age: '35', Department: 'Finance' },
    { Name: 'Alice Brown', Age: '28', Department: 'Marketing' },
  ],
  setTableData: (data) => set({ tableData: data }),
}));
