"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Label, LABEL_COLORS } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterEditor } from './FilterEditor';
import { useEmails } from '@/hooks/useEmails';
import { validateFiltrexExpression, applyFiltrexFilter, PostmarkEmail } from '@/lib/filtrex-utils';
import { DocumentationPanel } from './DocumentationPanel';
import { CheckCircle, XCircle, FileText, AlertCircle, X, GripVertical } from 'lucide-react';

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
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [leftPanelWidth, setLeftPanelWidth] = useState(60); // Porcentaje
  const [isResizing, setIsResizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  
  const { emails } = useEmails();
  
  // Convertir emails al formato esperado por FilterEditor
  const formattedEmails = emails.map(email => ({
    id: email.id,
    subject: email.subject,
    fromEmail: email.sender,
    fromName: undefined,
    textBody: email.content,
    receivedAt: email.date,
    archived: email.archived
  }));

  // Convertir emails al formato PostmarkEmail para usar con filtrex
  const postmarkEmails = useMemo(() => {
    return emails.map(email => ({
      MessageID: email.id,
      Date: email.date.toISOString(),
      Subject: email.subject,
      FromFull: {
        Email: email.sender,
        Name: email.sender // Usar email como nombre si no hay nombre disponible
      },
      ToFull: [{
        Email: '', // No tenemos esta información en nuestros emails
        Name: ''
      }],
      CcFull: [],
      BccFull: [],
      OriginalRecipient: '',
      TextBody: email.content,
      HtmlBody: email.content, // Usar el mismo contenido para HTML
      StrippedTextReply: '',
      Tag: '',
      Headers: [],
      Attachments: []
    } as PostmarkEmail));
  }, [emails]);

  // Validar filtro en tiempo real
  useEffect(() => {
    if (!filter.trim()) {
      setIsValid(null);
      setValidationMessage('');
      return;
    }

    const valid = validateFiltrexExpression(filter);
    setIsValid(valid);
    
    if (valid) {
      setValidationMessage('✅ Filtro válido');
    } else {
      setValidationMessage('❌ Error de sintaxis en el filtro');
    }
  }, [filter]);

  // Filtrar emails usando filtrex real
  const filteredEmails = useMemo(() => {
    if (!filter.trim() || !isValid) {
      return formattedEmails.filter(email => !email.archived);
    }

    return formattedEmails.filter((email, index) => {
      if (email.archived) return false;

      // Usar filtrex real con el email en formato PostmarkEmail
      const postmarkEmail = postmarkEmails[index];
      return applyFiltrexFilter(postmarkEmail, filter);
    });
  }, [filter, isValid, formattedEmails, postmarkEmails]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColor(initialData.color);
      setFilter(initialData.filter || '');
    } else {
      setName('');
      setColor(LABEL_COLORS[0]);
      setFilter('');
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        color,
        filter: filter.trim() || undefined,
      });
      
      // Cerrar el diálogo solo si el submit fue exitoso
      onOpenChange(false);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationIcon = () => {
    if (isValid === null) return <FileText className="w-4 h-4 text-muted-foreground" />;
    if (isValid) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  // Manejar el redimensionamiento
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;
      
      const container = resizeRef.current.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Limitar entre 30% y 80%
      const clampedWidth = Math.min(Math.max(newWidth, 30), 80);
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-6">
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              
              {/* Campos básicos en el header */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Nombre:</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Trabajo, Importante..."
                    className="w-48"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Color:</label>
                  <div className="flex gap-1">
                    {LABEL_COLORS.map((labelColor) => (
                      <button
                        key={labelColor}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${
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
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {initialData ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  `${initialData ? 'Actualizar' : 'Crear'} etiqueta`
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - Editor and Email Preview */}
          <div 
            className="flex flex-col border-r"
            style={{ width: `${leftPanelWidth}%` }}
          >
            {/* Filter Editor */}
            <div className="border-b p-4 bg-background">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filtro automático</h3>
                
                {/* Indicador de validación junto al editor */}
                <div className="flex items-center gap-2">
                  {getValidationIcon()}
                  <span className={`text-sm ${
                    isValid === null ? 'text-muted-foreground' :
                    isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {validationMessage || 'Escribe un filtro...'}
                  </span>
                </div>
              </div>
              
              <FilterEditor
                value={filter}
                onChange={setFilter}
                height="200px"
                showFullscreenButton={false}
                emails={formattedEmails}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Usa sintaxis filtrex para filtrar emails automáticamente. Presiona Ctrl+Espacio para autocompletado.
              </p>
            </div>

            {/* Email Preview */}
            <div className="flex-1 overflow-auto p-4 bg-background">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">
                  Vista Previa de Emails
                  {isValid && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {filteredEmails.length} coincidencias
                    </span>
                  )}
                </h3>
                {!isValid && filter.trim() && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Corrige el filtro para ver resultados</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {filteredEmails.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {!filter.trim() ? (
                      <p>Escribe un filtro para ver qué emails coinciden</p>
                    ) : !isValid ? (
                      <p>Corrige los errores de sintaxis en el filtro</p>
                    ) : (
                      <p>No hay emails que coincidan con este filtro</p>
                    )}
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{email.subject}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            De: {email.fromName || email.fromEmail} &lt;{email.fromEmail}&gt;
                          </p>
                          {email.textBody && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {email.textBody.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {email.receivedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Resizer */}
          <div
            ref={resizeRef}
            className="w-1 bg-border hover:bg-accent cursor-col-resize flex items-center justify-center group"
            onMouseDown={handleMouseDown}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
          </div>

          {/* Right Panel - Documentation */}
          <div 
            className="overflow-auto p-6 bg-muted/30"
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <DocumentationPanel />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 