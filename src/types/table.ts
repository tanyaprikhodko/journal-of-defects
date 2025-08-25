import { Person } from './store';

export interface TableRow {
  id: number;
  condition: string;
  substation: string;
  order: number | string;
  substationRegion: string;
  substationRegionId: string;
  registrationDate: string;
  objectType: string;
  objectNumber: number | null;
  place: string;
  connection: string;
  description: string;
  messageAuthor: Person;
  responsible: Person;
  completionTerm: string;
  technicalManager: Person;
  acceptionDate: string;
  acceptedBy: Person;
  completionDate: string;
  completedBy: Person;
  confirmedBy: Person;
  confirmationDate: string;
  redirectRegionId?: string;
  substationId?: number | null;
  objectTypeId?: number | null;
  placeId?: number | null;
  messageAuthorId?: number | null;
  technicalManagerId?: number | null;
  confirmedById?: number | null;
  completedById?: number | null;
  acceptedById?: number | null;
  responsibleId?: number | null;
}

export interface TableRowDisplay {
  id: number;
  condition: string;
  substation: string;
  order: number | string;
  substationRegion: string;
  substationRegionId: string;
  registrationDate: string;
  objectType: string;
  objectNumber: number | null;
  place: string;
  connection: string;
  description: string;
  messageAuthor: string;
  responsible: string;
  completionTerm: string;
  technicalManager: string;
  acceptionDate: string;
  acceptedBy: string;
  completionDate: string;
  completedBy: string;
  confirmedBy: string;
  confirmationDate: string;
  redirectRegionId?: string;
  substationId?: number | null;
  objectTypeId?: number | null;
  placeId?: number | null;
  messageAuthorId?: number | null;
}