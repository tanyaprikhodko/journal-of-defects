import { TableRow } from './table';

export interface Person {
  id: number | null;
  name: string;
  login: string;
  rank: string;
}

export interface createJournalPayload {
  order?: number | null;
  substationId?: number | null;
  objectNumber?: number | null;
  placeId?: number | null;
  responsibleId?: number | null;
  completionTerm?: string | null;
  technicalManagerId?: number | null;
  acceptionDate?: string | null;
  acceptedById?: number | null;
  completionDate?: string | null;
  completedById?: number | null;
  confirmationDate?: string | null;
  confirmedById?: number | null;
  registrationDate?: string | null;
  objectTypeId?: number | null;
  connection?: string | null;
  description?: string | null;
  messageAuthorId?: number | null;
  redirectRegionId?: string | null;
  condition?: string | null;
  comments?: CommentRequest[];
  substationRegionId?: number;
  substationRegion?: string | null;
}

export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  journalId: number;
  body: string;
  creationDate: string;
  isEdited: boolean;
}

export interface CommentRequest {
  body: string;
  authorId: number;
  journalId: number;
}

export interface Substation {
  id: string;
  name: string;
  substations: {
    id: number;
    name: string;
  }[];
}

export interface TableState {
  tableData: TableRow[];
  tableDataById: Record<number, TableRow>;
  totalPages?: number;
  currentPage?: number;
  commentsById?: Record<number, Comment[]>;
  objectTypes: Array<{ id: number; type: string }>;
  lookupPlaces?: Array<{ id: number; name: string }>;
  usersByRegionId?: Record<string, Person[]>;
  substations?: Substation[];
  roles?: Array<{ id: number; name: string }>;
  fetchTableData: (params: { page?: number; sortBy?: string; order?: string; filter?: { [key: string]: string } }) => Promise<void>;
  fetchTableDataById: (id: number) => Promise<void>;
  getCommentsById: (id: number) => Promise<void>;
  addComment: (comment: CommentRequest) => Promise<void>;
  fetchObjectTypes: () => Promise<void>;
  fetchLookupPlaces: () => Promise<void>;
  fetchSubstations: () => Promise<void>;
  fetchUsersByRegionId: (regionId?: string) => Promise<void>;
  deleteJournal: (id: number) => Promise<void>;
  createJournal: (journal: createJournalPayload, isEditMode: boolean, id: number | null) => Promise<void>;
  fetchRoles: () => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  addUser: (user: Partial<Person>) => Promise<void>;
  editUser: (userId: number, user: Partial<Person>) => Promise<void>;
  getTableDataById: (id: number) => TableRow;
}
