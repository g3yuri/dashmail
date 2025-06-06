import { Email, Label, EmailStatus } from './types';

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    subject: 'Reunión de proyecto - Q4 Planning',
    sender: 'maria.garcia@empresa.com',
    summary: 'Necesitamos planificar las metas del último trimestre y asignar recursos.',
    date: new Date('2024-01-15T10:30:00'),
    labels: ['trabajo', 'importante'],
    status: 'pending',
    archived: false,
  },
  {
    id: '2',
    subject: 'Propuesta de colaboración',
    sender: 'carlos.martinez@startup.io',
    summary: 'Interesados en una posible colaboración para desarrollar nuevas funcionalidades.',
    date: new Date('2024-01-14T14:20:00'),
    labels: ['negocios'],
    status: 'in-progress',
    archived: false,
  },
  {
    id: '3',
    subject: 'Actualización de seguridad - Acción requerida',
    sender: 'seguridad@empresa.com',
    summary: 'Es necesario actualizar las credenciales de acceso antes del 20 de enero.',
    date: new Date('2024-01-13T09:15:00'),
    labels: ['urgente', 'seguridad'],
    status: 'pending',
    archived: false,
  },
  {
    id: '4',
    subject: 'Invitación: Conferencia Tech 2024',
    sender: 'eventos@techconf.com',
    summary: 'Te invitamos a participar en la conferencia de tecnología más importante del año.',
    date: new Date('2024-01-12T16:45:00'),
    labels: ['eventos'],
    status: 'completed',
    archived: false,
  },
  {
    id: '5',
    subject: 'Reporte mensual - Diciembre 2023',
    sender: 'analytics@empresa.com',
    summary: 'Resumen de métricas y KPIs del mes de diciembre.',
    date: new Date('2024-01-11T11:00:00'),
    labels: ['reportes'],
    status: 'reviewed',
    archived: false,
  },
  {
    id: '6',
    subject: 'Feedback sobre la nueva interfaz',
    sender: 'ux.team@empresa.com',
    summary: 'Hemos recopilado feedback de usuarios sobre el nuevo diseño.',
    date: new Date('2024-01-10T13:30:00'),
    labels: ['ux', 'feedback'],
    status: 'in-progress',
    archived: false,
  },
  {
    id: '7',
    subject: 'Newsletter: Tendencias en desarrollo',
    sender: 'newsletter@devtrends.com',
    summary: 'Las últimas tendencias en desarrollo web y mejores prácticas.',
    date: new Date('2024-01-09T08:00:00'),
    labels: ['newsletter'],
    status: 'completed',
    archived: true,
  }
];

export const MOCK_LABELS: Label[] = [
  {
    id: 'trabajo',
    name: 'Trabajo',
    color: '#3b82f6',
    filter: 'sender contains "@empresa.com"',
  },
  {
    id: 'importante',
    name: 'Importante',
    color: '#ef4444',
    promptFilter: 'Emails que requieren acción inmediata o son críticos para el negocio',
  },
  {
    id: 'negocios',
    name: 'Negocios',
    color: '#22c55e',
    filter: 'subject contains "propuesta" or subject contains "colaboración"',
  },
  {
    id: 'urgente',
    name: 'Urgente',
    color: '#f97316',
    filter: 'subject contains "urgente" or subject contains "acción requerida"',
  },
  {
    id: 'seguridad',
    name: 'Seguridad',
    color: '#8b5cf6',
    filter: 'sender contains "seguridad" or subject contains "seguridad"',
  },
  {
    id: 'eventos',
    name: 'Eventos',
    color: '#06b6d4',
    filter: 'subject contains "invitación" or sender contains "eventos"',
  },
  {
    id: 'reportes',
    name: 'Reportes',
    color: '#eab308',
    filter: 'subject contains "reporte" or sender contains "analytics"',
  },
];

export function getEmailsByLabel(labelId: string): Email[] {
  return MOCK_EMAILS.filter(email => 
    email.labels.includes(labelId) && !email.archived
  );
}

export function getEmailsByStatus(status: EmailStatus): Email[] {
  return MOCK_EMAILS.filter(email => 
    email.status === status && !email.archived
  );
}

export function getArchivedEmails(): Email[] {
  return MOCK_EMAILS.filter(email => email.archived);
} 