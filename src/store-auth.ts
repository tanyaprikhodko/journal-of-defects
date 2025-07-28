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

export type User = {
  id: number;
  name: string;
  email: string;
  secondEmail: string;
  login: string;
  password: string;
  rank: string;
  deputyId: number;
  regionId: string;
  roleIds: number[];
  isActive: boolean;
  isLocked: boolean;
  userMessage: string;
  userRoles: {id: number; name: string}[];
};

export interface AuthState {
  departments: Department[];
  users: AuthUser[];
  isAuthenticated: boolean;
  currentUser: string | null;
  loginAsync: (user: string, password: string, departmentId: string) => Promise<boolean>;
  logout: () => void;
  setDepartments: (departments: Department[]) => void;
  setUsers: (users: AuthUser[]) => void;
  fetchUsers: (departmentId?: string) => Promise<void>;
  fetchDepartments: () => Promise<void>;
  refreshTokenAsync: () => Promise<boolean>;
  fetchUserById: (id: number) => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  departments: [],
  users: [],
  isAuthenticated: false,
  currentUser: null,
  loginAsync: async (user, password, departmentId) => {
    try {
      const response = await fetch('http://localhost:5188/api/Authentication/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: user, password })
      });
      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        localStorage.setItem('departmentId', departmentId);
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ isAuthenticated: true });

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
    localStorage.removeItem('departmentId');
    set({ isAuthenticated: false, currentUser: null });
  },
  setDepartments: (departments) => set({ departments }),
  setUsers: (users) => set({ users }),
  fetchUsers: async (departmentId) => {
    try {
      const url = departmentId
        ? `http://localhost:5188/api/Users/by-region/${departmentId ??  localStorage.getItem('departmentId')}`
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
  fetchUserById: async (id: number): Promise<User | null> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5188/api/Users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const user = await response.json();
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? user : u)),
      }));

      return user;
    } catch {
      set({ users: [] });
      return null;
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
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      if (!refreshToken) {
        set({ isAuthenticated: false, currentUser: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log('No refresh token found');
        return false;
      }
      const response = await fetch('http://localhost:5188/api/Authentication/refresh-token', {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken: refreshToken ? refreshToken : '' })
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
