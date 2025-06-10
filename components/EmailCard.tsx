"use client";

import { Email, Label, EmailStatus } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  Clock, 
  User, 
  ArchiveRestore, 
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeTime } from '@/lib/temporal-utils';

interface EmailCardProps {
  email: Email;
  labels: Label[];
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onStatusChange?: (id: string, status: EmailStatus) => void;
  onClick?: () => void;
  className?: string;
}

export function EmailCard({ 
  email, 
  labels, 
  onArchive, 
  onUnarchive, 
  onStatusChange,
  onClick,
  className 
}: EmailCardProps) {
  const emailLabels = labels.filter(label => email.labels.includes(label.id));

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir que el click se propague si se hizo en un botón
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const handleStatusChange = (newStatus: EmailStatus) => {
    if (onStatusChange) {
      onStatusChange(email.id, newStatus);
    }
  };

  const handleDropdownItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      className={`transition-all hover:shadow-md cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-5 truncate">
              {email.subject}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{email.sender}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {/* Menú contextual */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  title="Más opciones"
                  onMouseDown={(e) => {
                    // Prevenir que el evento se propague al contenedor draggable
                    e.stopPropagation();
                  }}
                  onPointerDown={(e) => {
                    // Prevenir el drag cuando se hace click en el botón
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                onPointerDown={(e) => {
                  // Prevenir que el dropdown interfiera con el drag
                  e.stopPropagation();
                }}
              >
                {/* Cambiar estado */}
                <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => handleStatusChange('pending'))}>
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                  Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => handleStatusChange('in-progress'))}>
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                  En progreso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => handleStatusChange('completed'))}>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  Completado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => handleStatusChange('reviewed'))}>
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                  Revisado
                </DropdownMenuItem>
                
                {/* Separador */}
                <div className="border-t my-1" />
                
                {/* Archivar/Desarchivar */}
                {onArchive && !email.archived && (
                  <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => onArchive(email.id))}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archivar
                  </DropdownMenuItem>
                )}
                {onUnarchive && email.archived && (
                  <DropdownMenuItem onClick={(e) => handleDropdownItemClick(e, () => onUnarchive(email.id))}>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Desarchivar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {email.aiSummary || email.summary}
        </p>
        
        {emailLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {emailLabels.slice(0, 4).map(label => (
              <span
                key={label.id}
                className="inline-flex items-center px-1 py-0 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: label.color + '20',
                  color: label.color,
                  border: `1px solid ${label.color}40`
                }}
                title={label.name}
              >
                {label.name}
              </span>
            ))}
            {emailLabels.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                +{emailLabels.length - 4}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatRelativeTime(email.date, 'es')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {email.archived && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Archivado
              </span>
            )}
            <span className={`text-xs px-1 py-0 rounded capitalize ${
              email.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              email.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              email.status === 'completed' ? 'bg-green-100 text-green-800' :
              email.status === 'reviewed' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {email.status === 'pending' ? 'Pendiente' :
               email.status === 'in-progress' ? 'En progreso' :
               email.status === 'completed' ? 'Completado' :
               email.status === 'reviewed' ? 'Revisado' : email.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 