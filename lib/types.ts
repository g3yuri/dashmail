export interface Email {
  id: string;
  subject: string;
  sender: string;
  summary: string;
  aiSummary?: string;
  date: Date;
  labels: string[];
  status: EmailStatus;
  archived: boolean;
  content?: string;
  textBody?: string;
  htmlBody?: string;
  fromName?: string;
}

export type EmailStatus = 'pending' | 'in-progress' | 'completed' | 'reviewed';

export interface Label {
  id: string;
  name: string;
  color: string;
  filter?: string;
}

export interface KanbanColumn {
  id: EmailStatus;
  title: string;
  emails: Email[];
}

export interface FilterExpression {
  field: string;
  operator: string;
  value: string;
}

export const EMAIL_STATUSES: { value: EmailStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in-progress', label: 'En proceso' },
  { value: 'completed', label: 'Completado' },
  { value: 'reviewed', label: 'Revisado' },
];

export const LABEL_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
]; 