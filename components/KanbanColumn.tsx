"use client";

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Email, EmailStatus, Label } from '@/lib/types';
import { DraggableEmailCard } from './DraggableEmailCard';

interface KanbanColumnProps {
  id: EmailStatus;
  title: string;
  emails: Email[];
  labels: Label[];
  onArchiveEmail: (emailId: string) => void;
  onEmailClick?: (email: Email) => void;
}

export function KanbanColumn({
  id,
  title,
  emails,
  labels,
  onArchiveEmail,
  onEmailClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
          {emails.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
          isOver ? 'bg-muted/50' : ''
        }`}
      >
        <SortableContext items={emails.map(e => e.id)} strategy={verticalListSortingStrategy}>
          {emails.map((email) => (
            <DraggableEmailCard
              key={email.id}
              email={email}
              labels={labels}
              onArchive={onArchiveEmail}
              onClick={onEmailClick ? () => onEmailClick(email) : undefined}
            />
          ))}
        </SortableContext>
        
        {emails.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed border-muted rounded-lg">
            No hay correos en esta columna
          </div>
        )}
      </div>
    </div>
  );
} 