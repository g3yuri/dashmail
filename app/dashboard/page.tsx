"use client";

import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Email, Label } from '@/lib/types';
import { useLabels } from '@/hooks/useLabels';
import { useEmails } from '@/hooks/useEmails';
import { LabelSidebar } from '@/components/LabelSidebar';
import { EmailCard } from '@/components/EmailCard';
import { KanbanView } from '@/components/KanbanView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserButton } from '@clerk/nextjs';
import { Inbox, LayoutDashboard } from 'lucide-react';

type ViewMode = 'labels' | 'kanban' | 'archived';

export default function Dashboard() {
  const { labels, createLabel, updateLabel, deleteLabel, isLoading: labelsLoading } = useLabels();
  const { emails, updateEmail, archiveEmail, unarchiveEmail, isLoading: emailsLoading } = useEmails();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('labels');

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

  // Mostrar loading si cualquiera de los hooks está cargando
  const isLoading = labelsLoading || emailsLoading;

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

  // Funciones para manejar etiquetas
  const handleCreateLabel = async (labelData: Omit<Label, 'id'>) => {
    try {
      await createLabel(labelData);
    } catch (error) {
      console.error('Error creando etiqueta:', error);
    }
  };

  const handleUpdateLabel = async (labelId: string, updates: Partial<Label>) => {
    try {
      await updateLabel(labelId, updates);
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

  const handleShowArchived = () => {
    handleViewModeChange('archived');
    setSelectedLabel(null);
  };

  const handleShowInbox = () => {
    handleViewModeChange('labels');
    setSelectedLabel(null);
  };

  const handleSelectLabel = (labelId: string | null) => {
    setSelectedLabel(labelId);
    handleViewModeChange('labels');
  };

  // Mostrar estado de carga
  if (isLoading) {
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
      <div className="flex-1 flex flex-col">
        {/* Header con tabs */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
              {/* Título dinámico */}
              <div className="text-sm text-muted-foreground">
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

            <div className="flex items-center gap-4">

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

        {/* Contenido de la vista */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'kanban' ? (
            <KanbanView
              emails={displayedEmails}
              labels={labels}
              onUpdateEmail={handleUpdateEmail}
              onArchiveEmail={handleArchiveEmail}
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
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 