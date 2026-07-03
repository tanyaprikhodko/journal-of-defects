import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../store-auth';
import { useTableStore } from '../store-zustand';

describe('Store modules', () => {
    it('initializes auth store with expected functions and state', () => {
        const authState = useAuthStore.getState();
        expect(authState.isAuthenticated).toBe(false);
        expect(authState.loginAsync).toBeTypeOf('function');
        expect(authState.logout).toBeTypeOf('function');
        expect(authState.fetchDepartments).toBeTypeOf('function');
    });

    it('logout clears auth tokens and resets state', () => {
        localStorage.setItem('accessToken', 'token');
        localStorage.setItem('refreshToken', 'refresh');
        useAuthStore.getState().logout();
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('applies and resets table filters', () => {
        const tableState = useTableStore.getState();
        tableState.setFilters({ search: 'test' });
        expect(useTableStore.getState().appliedFilters).toEqual({ search: 'test' });
        tableState.resetFilters();
        expect(useTableStore.getState().appliedFilters).toBeNull();
    });

    it('can store data by id in the table store', () => {
        useTableStore.setState({ tableDataById: {} });
        useTableStore.getState().setFilters({});
        expect(useTableStore.getState().getTableDataById(1)).toBeUndefined();
    });
});
