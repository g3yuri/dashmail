"use client";

import { Email, Label, EmailStatus } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  ArchiveRestore, 
  Clock, 
  User, 
  Mail,
  FileText,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeTime } from '@/lib/temporal-utils';

interface EmailDetailsDialogProps {
  email: Email | null;
  labels: Label[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onStatusChange?: (id: string, status: EmailStatus) => void;
}

export function EmailDetailsDialog({ 
  email, 
  labels, 
  open, 
  onOpenChange,
  onArchive,
  onUnarchive,
  onStatusChange
}: EmailDetailsDialogProps) {
  if (!email) return null;

  const emailLabels = labels.filter(label => email.labels.includes(label.id));

  const handleStatusChange = (newStatus: EmailStatus) => {
    if (onStatusChange) {
      onStatusChange(email.id, newStatus);
    }
  };

  const handleArchive = () => {
    if (onArchive && !email.archived) {
      onArchive(email.id);
      onOpenChange(false);
    }
  };

  const handleUnarchive = () => {
    if (onUnarchive && email.archived) {
      onUnarchive(email.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <DialogTitle className="text-xl font-semibold leading-6">
                {email.subject}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{email.fromName || email.sender}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{email.sender}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(email.date, 'es')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Dropdown de estado */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      email.status === 'pending' ? 'bg-yellow-500' :
                      email.status === 'in-progress' ? 'bg-blue-500' :
                      email.status === 'completed' ? 'bg-green-500' :
                      email.status === 'reviewed' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    {email.status === 'pending' ? 'Pendiente' :
                     email.status === 'in-progress' ? 'En progreso' :
                     email.status === 'completed' ? 'Completado' :
                     email.status === 'reviewed' ? 'Revisado' : email.status}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                    Pendiente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    En progreso
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    Completado
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('reviewed')}>
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                    Revisado
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dropdown de acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!email.archived && onArchive && (
                    <DropdownMenuItem onClick={handleArchive}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archivar
                    </DropdownMenuItem>
                  )}
                  {email.archived && onUnarchive && (
                    <DropdownMenuItem onClick={handleUnarchive}>
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      Desarchivar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Etiquetas */}
          {emailLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {emailLabels.map(label => (
                <span
                  key={label.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                  style={{ 
                    backgroundColor: label.color + '20',
                    borderColor: label.color + '40',
                    color: label.color
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {/* Resumen de IA */}
          {email.aiSummary && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Resumen de IA</span>
              </div>
              <p className="text-sm text-muted-foreground">{email.aiSummary}</p>
            </div>
          )}
        </DialogHeader>

        <div className="mt-6">
          <div className="prose prose-sm max-w-none">
            {email.htmlBody ? (
              <div 
                dangerouslySetInnerHTML={{ __html: email.htmlBody }}
                className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              />
            ) : email.textBody ? (
              <div className="whitespace-pre-wrap text-sm">
                {email.textBody}
              </div>
            ) : email.content ? (
              <div className="whitespace-pre-wrap text-sm">
                {email.content}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Sin contenido disponible
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 