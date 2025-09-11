import { create } from 'zustand';
import { toast } from 'react-toastify';
import { User, AuthState } from './types';
import { getApiUrl } from './config';

export const useAuthStore = create<AuthState>((set) => ({
  departments: [],
  users: [],
  isAuthenticated: false,
  currentUser: null,
  loginAsync: async (user, password, departmentId) => {
    try {
      const response = await fetch(`${getApiUrl()}/Authentication/login`, {
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
        toast.success('Успішний вхід до системи');
        return true;
      } else {
        set({ isAuthenticated: false, currentUser: null });
        toast.error('Невірний логін або пароль');
        return false;
      }
    } catch {
      set({ isAuthenticated: false, currentUser: null });
      toast.error('Помилка під час входу до системи');
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
        ? `${getApiUrl()}/Users/by-region/${departmentId ??  localStorage.getItem('departmentId')}`
        : `${getApiUrl()}/Users`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');
      let users = await response.json();
      if (Array.isArray(users)) {
        users = users.sort((a, b) => a.name.localeCompare(b.name));
      }
      set({ users });
    } catch {
      set({ users: [] });
      toast.error('Помилка завантаження користувачів');
    }
  },
  fetchUserById: async (id: number): Promise<User | null> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/Users/${id}`, {
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
      toast.error('Помилка завантаження користувача');
      return null;
    }
  },
  fetchDepartments: async () => {
    try {
      const response = await fetch(`${getApiUrl()}/Lookups/regions`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      let departments = await response.json();
      if (Array.isArray(departments)) {
        departments = departments.sort((a, b) => a.name.localeCompare(b.name));
      }
      set({ departments });
    } catch {
      set({ departments: [] });
      toast.error('Помилка завантаження відділів');
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
        return false;
      }
      const response = await fetch(`${getApiUrl()}/Authentication/refresh-token`, {
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
        toast.error('Сесія закінчилася. Увійдіть знову');
        return false;
      }
    } catch {
      set({ isAuthenticated: false, currentUser: null });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.error('Помилка оновлення токену');
      return false;
    }
  },
}));
