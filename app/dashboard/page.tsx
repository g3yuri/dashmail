"use client";

import { useState, useEffect, useMemo } from 'react';
import { useLabels } from '@/hooks/useLabels';
import { useEmails } from '@/hooks/useEmails';
import { LabelSidebar } from '@/components/LabelSidebar';
import { EmailCard } from '@/components/EmailCard';
import { EmailDetailsDialog } from '@/components/EmailDetailsDialog';
import { KanbanView } from '@/components/KanbanView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserButton } from '@clerk/nextjs';
import { Label, Email, EmailStatus } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox, LayoutDashboard } from 'lucide-react';

type ViewMode = 'labels' | 'kanban' | 'archived';

export default function Dashboard() {
  const { labels, createLabel, updateLabel, deleteLabel, isLoading: labelsLoading } = useLabels();
  const { emails, updateEmail, archiveEmail, unarchiveEmail, isLoading: emailsLoading, refreshEmails } = useEmails();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('labels');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  // Cargar modo de vista desde localStorage al inicializar
  useEffect(() => {
    const savedViewMode = localStorage.getItem('dashboard-view-mode') as ViewMode;
    if (savedViewMode && (savedViewMode === 'labels' || savedViewMode === 'kanban')) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Guardar modo de vista en localStorage cuando cambie
  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    if (newViewMode === 'labels' || newViewMode === 'kanban') {
      localStorage.setItem('dashboard-view-mode', newViewMode);
    }
  };

  // Filtrar correos según la vista actual
  const displayedEmails = useMemo(() => {
    switch (viewMode) {
      case 'labels':
        if (selectedLabel) {
          return emails.filter(email => 
            email.labels.includes(selectedLabel) && !email.archived
          );
        }
        // Mostrar todos los correos no archivados si no hay etiqueta seleccionada
        return emails.filter(email => !email.archived);
      
      case 'kanban':
        return emails.filter(email => !email.archived);
      
      case 'archived':
        return emails.filter(email => email.archived);
      
      default:
        return emails.filter(email => !email.archived);
    }
  }, [emails, selectedLabel, viewMode]);

  // Calcular conteos de correos
  const emailCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    labels.forEach(label => {
      counts[label.id] = emails.filter(email => 
        email.labels.includes(label.id) && !email.archived
      ).length;
    });
    return counts;
  }, [emails, labels]);

  const archivedCount = useMemo(() => 
    emails.filter(email => email.archived).length, [emails]
  );

  const inboxCount = useMemo(() => 
    emails.filter(email => !email.archived).length, [emails]
  );

  // Funciones para manejar etiquetas con loading states
  const handleCreateLabel = async (labelData: Omit<Label, 'id'>) => {
    try {
      await createLabel(labelData);
      // Refrescar emails para aplicar el nuevo filtro
      await refreshEmails();
    } catch (error) {
      console.error('Error creando etiqueta:', error);
    }
  };

  const handleUpdateLabel = async (labelId: string, updates: Partial<Label>) => {
    try {
      await updateLabel(labelId, updates);
      // Refrescar emails para aplicar los cambios del filtro
      await refreshEmails();
    } catch (error) {
      console.error('Error actualizando etiqueta:', error);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    try {
      await deleteLabel(labelId);
      
      // Remover la etiqueta de todos los correos que la tenían
      const emailsWithLabel = emails.filter(email => email.labels.includes(labelId));
      
      for (const email of emailsWithLabel) {
        const newLabels = email.labels.filter(id => id !== labelId);
        await updateEmail(email.id, { labels: newLabels });
      }
      
      if (selectedLabel === labelId) {
        setSelectedLabel(null);
      }
    } catch (error) {
      console.error('Error eliminando etiqueta:', error);
    }
  };

  // Funciones para manejar correos
  const handleArchiveEmail = async (emailId: string) => {
    try {
      await archiveEmail(emailId);
    } catch (error) {
      console.error('Error archivando correo:', error);
    }
  };

  const handleUnarchiveEmail = async (emailId: string) => {
    try {
      await unarchiveEmail(emailId);
    } catch (error) {
      console.error('Error desarchivando correo:', error);
    }
  };

  const handleUpdateEmail = async (emailId: string, updates: Partial<Email>) => {
    try {
      await updateEmail(emailId, updates);
    } catch (error) {
      console.error('Error actualizando correo:', error);
    }
  };

  const handleStatusChange = async (emailId: string, status: EmailStatus) => {
    try {
      await updateEmail(emailId, { status });
    } catch (error) {
      console.error('Error actualizando estado del correo:', error);
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsEmailDialogOpen(true);
  };

  // Función para seleccionar etiqueta
  const handleSelectLabel = (labelId: string | null) => {
    setSelectedLabel(labelId);
    setViewMode('labels');
  };

  // Función para mostrar archivados
  const handleShowArchived = () => {
    setViewMode('archived');
    setSelectedLabel(null);
  };

  // Función para mostrar bandeja de entrada
  const handleShowInbox = () => {
    setViewMode('labels');
    setSelectedLabel(null);
  };

  // Mostrar estado de carga inicial
  if (labelsLoading || emailsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar para vista de etiquetas */}
      {viewMode !== 'kanban' && (
        <LabelSidebar
          labels={labels}
          selectedLabel={selectedLabel}
          onSelectLabel={handleSelectLabel}
          onCreateLabel={handleCreateLabel}
          onUpdateLabel={handleUpdateLabel}
          onDeleteLabel={handleDeleteLabel}
          onShowArchived={handleShowArchived}
          onShowInbox={handleShowInbox}
          emailCounts={emailCounts}
          archivedCount={archivedCount}
          inboxCount={inboxCount}
          isArchivedView={viewMode === 'archived'}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header con tabs - ancho fijo */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="flex items-center justify-between p-4 min-w-0">
              {/* Título dinámico */}
              <div className="text-sm text-muted-foreground min-w-0 flex-shrink-0">
                {viewMode === 'archived' ? (
                  'Correos archivados'
                ) : viewMode === 'kanban' ? (
                  'Vista Kanban por estado'
                ) : selectedLabel ? (
                  `Etiqueta: ${labels.find(l => l.id === selectedLabel)?.name}`
                ) : (
                  'Bandeja de entrada'
                )}
              </div>

            <div className="flex items-center gap-4 flex-shrink-0">

            <Tabs 
              value={viewMode === 'archived' ? 'labels' : viewMode} 
              onValueChange={(value) => {
                if (value === 'kanban') {
                  handleViewModeChange('kanban');
                } else {
                  handleViewModeChange('labels');
                }
                setSelectedLabel(null);
              }}
            >
              <TabsList>
                <TabsTrigger value="labels" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  Etiquetas
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>
              
              {/* Toggle de tema y usuario */}
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {/* Contenido de la vista - con overflow control */}
        <div className="flex-1 overflow-hidden min-w-0">
          {viewMode === 'kanban' ? (
            <KanbanView
              emails={displayedEmails}
              labels={labels}
              onUpdateEmail={handleUpdateEmail}
              onArchiveEmail={handleArchiveEmail}
              onEmailClick={handleEmailClick}
            />
          ) : (
            <div className="h-full overflow-auto">
              <div className="p-6">
                {displayedEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {viewMode === 'archived' 
                        ? 'No hay correos archivados'
                        : 'No hay correos en esta vista'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {displayedEmails.map((email) => (
                      <EmailCard
                        key={email.id}
                        email={email}
                        labels={labels}
                        onArchive={viewMode !== 'archived' ? handleArchiveEmail : undefined}
                        onUnarchive={viewMode === 'archived' ? handleUnarchiveEmail : undefined}
                        onStatusChange={handleStatusChange}
                        onClick={() => handleEmailClick(email)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del correo */}
      <EmailDetailsDialog
        email={selectedEmail}
        labels={labels}
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        onArchive={handleArchiveEmail}
        onUnarchive={handleUnarchiveEmail}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
} 