"use client";

import { useState } from 'react';
import { Label } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Edit, Trash2, Archive, Inbox, MoreVertical } from 'lucide-react';
import { LabelDialog } from './LabelDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface LabelSidebarProps {
  labels: Label[];
  selectedLabel: string | null;
  onSelectLabel: (labelId: string | null) => void;
  onCreateLabel: (label: Omit<Label, 'id'>) => void;
  onUpdateLabel: (labelId: string, label: Partial<Label>) => void;
  onDeleteLabel: (labelId: string) => void;
  onShowArchived: () => void;
  onShowInbox: () => void;
  emailCounts: Record<string, number>;
  archivedCount: number;
  inboxCount: number;
}

export function LabelSidebar({
  labels,
  selectedLabel,
  onSelectLabel,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onShowArchived,
  onShowInbox,
  emailCounts,
  archivedCount,
  inboxCount,
}: LabelSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState<Label | null>(null);

  const handleCreateLabel = (label: Omit<Label, 'id'>) => {
    onCreateLabel(label);
    setIsDialogOpen(false);
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    setIsDialogOpen(true);
  };

  const handleUpdateLabel = (label: Omit<Label, 'id'>) => {
    if (editingLabel) {
      onUpdateLabel(editingLabel.id, label);
      setEditingLabel(null);
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLabel(null);
  };

  const handleDeleteClick = (label: Label) => {
    setLabelToDelete(label);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (labelToDelete) {
      onDeleteLabel(labelToDelete.id);
      setLabelToDelete(null);
    }
  };

  return (
    <div className="w-64 bg-muted/30 border-r p-4 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Etiquetas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {/* Bandeja de entrada */}
        <Button
          variant={selectedLabel === null ? "secondary" : "ghost"}
          className="w-full justify-start gap-2 h-9"
          onClick={onShowInbox}
        >
          <Inbox className="h-4 w-4" />
          <span className="flex-1 text-left">Bandeja de entrada</span>
          {inboxCount > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {inboxCount}
            </span>
          )}
        </Button>

        {/* Etiquetas */}
        {labels.map((label) => (
          <div key={label.id} className="group relative">
            <Button
              variant={selectedLabel === label.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 h-9 pr-8"
              onClick={() => onSelectLabel(label.id)}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: label.color }}
              />
              <span className="flex-1 text-left truncate">{label.name}</span>
              {emailCounts[label.id] > 0 && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  {emailCounts[label.id]}
                </span>
              )}
            </Button>
            
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditLabel(label)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(label)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {/* Archivados */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-9 mt-4"
          onClick={onShowArchived}
        >
          <Archive className="h-4 w-4" />
          <span className="flex-1 text-left">Archivados</span>
          {archivedCount > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {archivedCount}
            </span>
          )}
        </Button>
      </div>

      <LabelDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSubmit={editingLabel ? handleUpdateLabel : handleCreateLabel}
        initialData={editingLabel || undefined}
        title={editingLabel ? 'Editar etiqueta' : 'Crear etiqueta'}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar etiqueta"
        description={`¿Estás seguro de que quieres eliminar la etiqueta "${labelToDelete?.name}"? Esta acción no se puede deshacer y se removerá de todos los correos.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
} 