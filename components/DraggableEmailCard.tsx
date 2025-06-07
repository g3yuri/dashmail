"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Email, Label } from '@/lib/types';
import { EmailCard } from './EmailCard';

interface DraggableEmailCardProps {
  email: Email;
  labels: Label[];
  onArchive: (emailId: string) => void;
  onClick?: () => void;
}

export function DraggableEmailCard({
  email,
  labels,
  onArchive,
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
    >
      <EmailCard
        email={email}
        labels={labels}
        onArchive={onArchive}
        onClick={onClick}
        className={isDragging ? 'shadow-lg' : ''}
      />
    </div>
  );
} 