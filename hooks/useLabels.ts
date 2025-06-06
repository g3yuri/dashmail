"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/lib/types';

export function useLabels() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar usuario y cargar etiquetas desde la API
  const fetchLabels = async () => {
    try {
      setIsLoading(true);
      
      // Primero sincronizar el usuario
      await fetch('/api/sync-user', { method: 'POST' });
      
      // Luego cargar etiquetas
      const response = await fetch('/api/labels');
      
      if (!response.ok) {
        throw new Error('Error al cargar etiquetas');
      }
      
      const data = await response.json();
      setLabels(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nueva etiqueta
  const createLabel = async (labelData: Omit<Label, 'id'>) => {
    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labelData),
      });

      if (!response.ok) {
        throw new Error('Error al crear etiqueta');
      }

      const newLabel = await response.json();
      setLabels(prev => [...prev, newLabel]);
      return newLabel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  // Actualizar etiqueta
  const updateLabel = async (labelId: string, updates: Partial<Label>) => {
    try {
      const response = await fetch(`/api/labels/${labelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar etiqueta');
      }

      const updatedLabel = await response.json();
      setLabels(prev =>
        prev.map(label =>
          label.id === labelId ? updatedLabel : label
        )
      );
      return updatedLabel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  // Eliminar etiqueta
  const deleteLabel = async (labelId: string) => {
    try {
      const response = await fetch(`/api/labels/${labelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar etiqueta');
      }

      setLabels(prev => prev.filter(label => label.id !== labelId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  // Cargar etiquetas al montar el componente
  useEffect(() => {
    fetchLabels();
  }, []);

  return {
    labels,
    isLoading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    refreshLabels: fetchLabels,
  };
} 