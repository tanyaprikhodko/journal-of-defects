import { describe, expect, it } from 'vitest';
import CommentsModal from '../components/CommentsModal';
import Table from '../components/Table';
import DeleteConformation from '../components/DeleteConformation';
import FiltersModal from '../components/FiltersModal';
import ColumnSort from '../components/ColumnSort';

describe('Component module exports', () => {
    it('loads all shared components', () => {
        expect(CommentsModal).toBeTypeOf('function');
        expect(Table).toBeTypeOf('function');
        expect(DeleteConformation).toBeTypeOf('function');
        expect(FiltersModal).toBeTypeOf('function');
        expect(ColumnSort).toBeTypeOf('function');
    });
});
