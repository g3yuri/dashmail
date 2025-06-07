"use client";

import { Email, Label } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Clock, User, ArchiveRestore } from 'lucide-react';
import { formatRelativeTime } from '@/lib/temporal-utils';

interface EmailCardProps {
  email: Email;
  labels: Label[];
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  className?: string;
}

export function EmailCard({ email, labels, onArchive, onUnarchive, className }: EmailCardProps) {
  const emailLabels = labels.filter(label => email.labels.includes(label.id));

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-5 truncate">
              {email.subject}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{email.sender}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {onArchive && !email.archived && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onArchive(email.id)}
                title="Archivar"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            {onUnarchive && email.archived && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onUnarchive(email.id)}
                title="Desarchivar"
              >
                <ArchiveRestore className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {email.summary}
        </p>
        
        {emailLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {emailLabels.slice(0, 4).map(label => (
              <span
                key={label.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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
            <span className={`text-xs px-2 py-1 rounded capitalize ${
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