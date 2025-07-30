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
