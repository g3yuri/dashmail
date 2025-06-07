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
  onUpdateEmail: (emailId: string, updates: Partial<Email>) => Promise<void>;
  onArchiveEmail: (emailId: string) => Promise<void>;
  onEmailClick?: (email: Email) => void;
}

export function KanbanView({
  emails,
  labels,
  onUpdateEmail,
  onArchiveEmail,
  onEmailClick,
}: KanbanViewProps) {
  const [activeEmail, setActiveEmail] = useState<Email | null>(null);

  const getEmailsByStatus = (status: EmailStatus) => {
    return emails.filter((email) => email.status === status && !email.archived);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const email = emails.find((e) => e.id === event.active.id);
    setActiveEmail(email || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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
      await onUpdateEmail(emailId, { status: newStatus });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Container con ancho controlado y scroll horizontal */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full p-6 min-w-max">
            {EMAIL_STATUSES.map((status) => {
              const statusEmails = getEmailsByStatus(status.value);
              
              return (
                <div key={status.value} className="w-80 flex-shrink-0">
                  <KanbanColumn
                    id={status.value}
                    title={status.label}
                    emails={statusEmails}
                    labels={labels}
                    onArchiveEmail={onArchiveEmail}
                    onEmailClick={onEmailClick}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeEmail ? (
            <div className="rotate-3 opacity-90 transform">
              <EmailCard
                email={activeEmail}
                labels={labels}
                className="cursor-grabbing"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 