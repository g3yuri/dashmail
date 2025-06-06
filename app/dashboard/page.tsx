"use client";

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Email, Label } from '@/lib/types';
import { MOCK_EMAILS, MOCK_LABELS, getEmailsByLabel, getArchivedEmails } from '@/lib/data';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LabelSidebar } from '@/components/LabelSidebar';
import { EmailCard } from '@/components/EmailCard';
import { KanbanView } from '@/components/KanbanView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Inbox, LayoutDashboard } from 'lucide-react';

type ViewMode = 'labels' | 'kanban' | 'archived';

export default function Dashboard() {
  const [emails, setEmails] = useLocalStorage<Email[]>('emails', MOCK_EMAILS);
  const [labels, setLabels] = useLocalStorage<Label[]>('labels', MOCK_LABELS);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('labels');

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
      counts[label.id] = getEmailsByLabel(label.id).length;
    });
    return counts;
  }, [emails, labels]);

  const archivedCount = useMemo(() => 
    getArchivedEmails().length, [emails]
  );

  const inboxCount = useMemo(() => 
    emails.filter(email => !email.archived).length, [emails]
  );

  // Funciones para manejar etiquetas
  const handleCreateLabel = (labelData: Omit<Label, 'id'>) => {
    const newLabel: Label = {
      ...labelData,
      id: Date.now().toString(),
    };
    setLabels(prev => [...prev, newLabel]);
  };

  const handleUpdateLabel = (labelId: string, updates: Partial<Label>) => {
    setLabels(prev => 
      prev.map(label => 
        label.id === labelId ? { ...label, ...updates } : label
      )
    );
  };

  const handleDeleteLabel = (labelId: string) => {
    setLabels(prev => prev.filter(label => label.id !== labelId));
    
    // Remover la etiqueta de todos los correos
    setEmails(prev => 
      prev.map(email => ({
        ...email,
        labels: email.labels.filter(id => id !== labelId)
      }))
    );
    
    if (selectedLabel === labelId) {
      setSelectedLabel(null);
    }
  };

  // Funciones para manejar correos
  const handleArchiveEmail = (emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, archived: true } : email
      )
    );
  };

  const handleUpdateEmail = (emailId: string, updates: Partial<Email>) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, ...updates } : email
      )
    );
  };

  const handleShowArchived = () => {
    setViewMode('archived');
    setSelectedLabel(null);
  };

  const handleShowInbox = () => {
    setViewMode('labels');
    setSelectedLabel(null);
  };

  const handleSelectLabel = (labelId: string | null) => {
    setSelectedLabel(labelId);
    setViewMode('labels');
  };

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
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header con tabs */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
            <Tabs 
              value={viewMode === 'archived' ? 'labels' : viewMode} 
              onValueChange={(value) => {
                if (value === 'kanban') {
                  setViewMode('kanban');
                } else {
                  setViewMode('labels');
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

            <div className="flex items-center gap-4">
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
              
              {/* Toggle de tema */}
              <ThemeToggle />
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