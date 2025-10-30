import { TableRowDisplay } from './table';
import { AuthUser, User } from './auth';
import { CommentRequest } from './store';

export interface TableProps {
  columns: Array<{key: string; label: string}>;
  data: Array<TableRowDisplay>;
  activeRowId?: number | null;
  click?: (id: number) => void;
}

export interface EditModalProps {
  journalId: number | null;
  onAddComment: (comment: CommentRequest) => void;
  onClose: () => void;
  isObserver: boolean;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export type FiltersModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { [key: string]: string }) => void;
};

export type UsersAdminModalProps = {
  visible: boolean;
  users: AuthUser[];
  onClose: () => void;
  onSave: (user: User) => void;
  onAdd: (user: User) => void;
  onRemove: (userId: number) => void;
};

export type SortByOption = 'date' | 'severity' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface ColumnSortProps {
  onChange?: (sortBy: SortByOption, order: SortOrder) => void;
}
