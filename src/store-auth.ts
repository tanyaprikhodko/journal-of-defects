import { create } from 'zustand';

export interface AuthUser {
  id: number;
  name: string;
  login: string;
  rank: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface AuthState {
  departments: Department[];
  users: AuthUser[];
  isAuthenticated: boolean;
  currentUser: string | null;
  loginAsync: (user: string, password: string) => Promise<boolean>;
  logout: () => void;
  setDepartments: (departments: Department[]) => void;
  setUsers: (users: AuthUser[]) => void;
  fetchUsers: (departmentId: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  refreshTokenAsync: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  departments: [{ id: '1', name: 'Відділ 1' }, { id: '2', name: 'Відділ 2' }],
  users: [],
  isAuthenticated: false,
  currentUser: null,
  loginAsync: async (user, password) => {
    try {
      const response = await fetch('http://localhost:5188/api/Authentication/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: user, password })
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ isAuthenticated: true, currentUser: user });
        return true;
      } else {
        set({ isAuthenticated: false, currentUser: null });
        return false;
      }
    } catch {
      set({ isAuthenticated: false, currentUser: null });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, currentUser: null });
  },
  setDepartments: (departments) => set({ departments }),
  setUsers: (users) => set({ users }),
  fetchUsers: async (departmentId) => {
    try {
      const url = departmentId
        ? `http://localhost:5188/api/Users?departmentId=${departmentId}`
        : 'http://localhost:5188/api/Users';
      const response = await fetch(url);
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
        departments = departments.sort((a, b) => a.name.localeCompare(b.name));
      }
      set({ departments });
    } catch {
      set({ departments: [] });
    }
  },
  refreshTokenAsync: async () => {
    try {
      const response = await fetch('http://localhost:5188/api/Authentication/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          set({ isAuthenticated: true });
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        return true;
      } else {
        set({ isAuthenticated: false, currentUser: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return false;
      }
    } catch {
      set({ isAuthenticated: false, currentUser: null });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
  },
}));
