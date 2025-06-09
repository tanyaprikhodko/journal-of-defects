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
  departments: Array<{
      id: string;
      name: string;
    }>;
  users: Array<{
      id: number;
      name: string;
      login: string;
      rank: string;
    }>
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (user: string, password: string) => boolean;
  logout: () => void;
  setDepartments: (departments: string[]) => void;
  setUsers: (users: string[]) => void;
  fetchUsers: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  departments: [],
  users: [],
  isAuthenticated: false,
  currentUser: null,
  login: (user, password) => {
    set({ isAuthenticated: true, currentUser: user });
    return true;
  },
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  setDepartments: (departments) => set({ departments }),
  setUsers: (users) => set({ users }),
  fetchUsers: async () => {
    try {
      const response = await fetch('http://localhost:5188/api/Users');
      if (!response.ok) throw new Error('Failed to fetch users');
      let users = await response.json();
      if (Array.isArray(users)) {
        users = users.sort((a, b) => a.name.localeCompare(b.name));
      }
      set({ users });
    } catch {
      set({ users: [] });
    }
  },
  fetchDepartments: async () => {
    try {
      const response = await fetch('http://localhost:5188/api/Lookups/regions');
      if (!response.ok) throw new Error('Failed to fetch departments');
      let departments = await response.json();
      if (Array.isArray(departments)) {
        departments = departments.sort((a, b) => a.localeCompare(b));
      }
      set({ departments });
    } catch {
      set({ departments: [] });
    }
  },
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
