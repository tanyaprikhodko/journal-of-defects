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
}