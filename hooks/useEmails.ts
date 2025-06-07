"use client";

import { useState, useEffect } from 'react';
import { Email } from '@/lib/types';

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar correos desde la API
  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/emails');
      
      if (!response.ok) {
        throw new Error('Error al cargar correos');
      }
      
      const data = await response.json();
      // Convertir las fechas de string a Date
      const emailsWithDates = data.map((email: Email & { date: string }) => ({
        ...email,
        date: new Date(email.date),
      }));
      setEmails(emailsWithDates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar correo
  const updateEmail = async (emailId: string, updates: Partial<Email>) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar correo');
      }

      const updatedEmail = await response.json();
      const emailWithDate = {
        ...updatedEmail,
        date: new Date(updatedEmail.date),
      };
      
      setEmails(prev =>
        prev.map(email =>
          email.id === emailId ? emailWithDate : email
        )
      );
      return emailWithDate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  // Archivar correo
  const archiveEmail = async (emailId: string) => {
    return updateEmail(emailId, { archived: true });
  };

  // Desarchivar correo
  const unarchiveEmail = async (emailId: string) => {
    return updateEmail(emailId, { archived: false });
  };

  // Cambiar estado del correo
  const changeEmailStatus = async (emailId: string, status: Email['status']) => {
    return updateEmail(emailId, { status });
  };

  // Actualizar etiquetas del correo
  const updateEmailLabels = async (emailId: string, labels: string[]) => {
    return updateEmail(emailId, { labels });
  };

  // Cargar correos al montar el componente
  useEffect(() => {
    fetchEmails();
  }, []);

  return {
    emails,
    isLoading,
    error,
    updateEmail,
    archiveEmail,
    unarchiveEmail,
    changeEmailStatus,
    updateEmailLabels,
    refreshEmails: fetchEmails,
  };
} 