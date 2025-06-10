"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Email, Label, EmailStatus } from '@/lib/types';
import { EmailCard } from './EmailCard';

interface DraggableEmailCardProps {
  email: Email;
  labels: Label[];
  onArchive: (emailId: string) => void;
  onStatusChange?: (emailId: string, status: EmailStatus) => void;
  onClick?: () => void;
}

export function DraggableEmailCard({
  email,
  labels,
  onArchive,
  onStatusChange,
  onClick,
}: DraggableEmailCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: email.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
      data-draggable="true"
    >
      <EmailCard
        email={email}
        labels={labels}
        onArchive={onArchive}
        onStatusChange={onStatusChange}
        onClick={onClick}
        className={isDragging ? 'shadow-lg' : ''}
      />
    </div>
  );
} 