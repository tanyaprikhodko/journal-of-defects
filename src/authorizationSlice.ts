import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthorizationState {
  departments: string[];
  users: string[];
  credentials: { [user: string]: string };
  isAuthenticated: boolean;
  currentUser: string | null;
}

const initialState: AuthorizationState = {
  departments: ['HR', 'IT', 'Finance', 'Marketing'],
  users: ['User1', 'User2', 'User3', 'User4'],
  credentials: {
    User1: 'pass1',
    User2: 'pass2',
    User3: 'pass3',
    User4: 'pass4',
  },
  isAuthenticated: false,
  currentUser: null,
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setDepartments(state, action: PayloadAction<string[]>) {
      state.departments = action.payload;
    },
    setUsers(state, action: PayloadAction<string[]>) {
      state.users = action.payload;
    },
    login(state, action: PayloadAction<{ user: string; password: string }>) {
      const { user, password } = action.payload;
      if (state.credentials[user] && state.credentials[user] === password) {
        state.isAuthenticated = true;
        state.currentUser = user;
      } else {
        state.isAuthenticated = false;
        state.currentUser = null;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

export const { setDepartments, setUsers, login, logout } = authorizationSlice.actions;
export default authorizationSlice.reducer;
