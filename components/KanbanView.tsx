"use client";

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';

import { Email, EmailStatus, Label, EMAIL_STATUSES } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { EmailCard } from './EmailCard';

interface KanbanViewProps {
  emails: Email[];
  labels: Label[];
  onUpdateEmail: (emailId: string, updates: Partial<Email>) => void;
  onArchiveEmail: (emailId: string) => void;
}

export function KanbanView({
  emails,
  labels,
  onUpdateEmail,
  onArchiveEmail,
}: KanbanViewProps) {
  const [activeEmail, setActiveEmail] = useState<Email | null>(null);

  const getEmailsByStatus = (status: EmailStatus) => {
    return emails.filter((email) => email.status === status && !email.archived);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const email = emails.find((e) => e.id === event.active.id);
    setActiveEmail(email || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEmail(null);

    if (!over) return;

    const emailId = active.id as string;
    const newStatus = over.id as EmailStatus;

    // Verificar si el status es válido
    if (!EMAIL_STATUSES.some(status => status.value === newStatus)) return;

    // Actualizar el email solo si el status cambió
    const email = emails.find(e => e.id === emailId);
    if (email && email.status !== newStatus) {
      onUpdateEmail(emailId, { status: newStatus });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-auto p-6">
        {EMAIL_STATUSES.map((status) => {
          const statusEmails = getEmailsByStatus(status.value);
          
          return (
            <div key={status.value} className="flex-1 min-w-80">
              <KanbanColumn
                id={status.value}
                title={status.label}
                emails={statusEmails}
                labels={labels}
                onArchiveEmail={onArchiveEmail}
              />
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeEmail ? (
          <EmailCard
            email={activeEmail}
            labels={labels}
            className="rotate-3 opacity-90"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 