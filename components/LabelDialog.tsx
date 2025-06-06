"use client";

import { useState, useEffect } from 'react';
import { Label, LABEL_COLORS } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: Omit<Label, 'id'>) => void;
  initialData?: Label;
  title: string;
}

export function LabelDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: LabelDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(LABEL_COLORS[0]);
  const [filter, setFilter] = useState('');
  const [promptFilter, setPromptFilter] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColor(initialData.color);
      setFilter(initialData.filter || '');
      setPromptFilter(initialData.promptFilter || '');
    } else {
      setName('');
      setColor(LABEL_COLORS[0]);
      setFilter('');
      setPromptFilter('');
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      color,
      filter: filter.trim() || undefined,
      promptFilter: promptFilter.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nombre de la etiqueta
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Trabajo, Importante..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {LABEL_COLORS.map((labelColor) => (
                <button
                  key={labelColor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === labelColor
                      ? 'border-foreground'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: labelColor }}
                  onClick={() => setColor(labelColor)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Filtro automático (opcional)
            </label>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Ej. sender contains &quot;@empresa.com&quot;"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Usa sintaxis filtrex: field operator &quot;value&quot;
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Filtro por prompt (opcional)
            </label>
            <Input
              value={promptFilter}
              onChange={(e) => setPromptFilter(e.target.value)}
              placeholder="Ej. Correos que requieren acción inmediata"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Describe qué emails deben incluirse en esta etiqueta
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {initialData ? 'Actualizar' : 'Crear'} etiqueta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 