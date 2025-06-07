import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { labelsTable, emailsTable, emailLabelsTable } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { applyFiltrexFilter } from '@/lib/filtrex-utils';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para convertir email de BD a formato Postmark
function emailToPostmarkFormat(email: { 
  id: string; 
  messageId?: string; 
  subject?: string; 
  fromEmail?: string; 
  fromName?: string | null; 
  toEmail?: string; 
  textBody?: string | null; 
  htmlBody?: string | null; 
  receivedAt?: Date; 
}) {
  return {
    MessageID: email.messageId || email.id,
    Date: email.receivedAt?.toISOString() || new Date().toISOString(),
    Subject: email.subject || '',
    FromFull: {
      Email: email.fromEmail || '',
      Name: email.fromName || email.fromEmail || ''
    },
    ToFull: [{
      Email: email.toEmail || '',
      Name: ''
    }],
    OriginalRecipient: email.toEmail || '',
    TextBody: email.textBody || '',
    HtmlBody: email.htmlBody || '',
    StrippedTextReply: '',
    Tag: '',
    Headers: [],
    Attachments: []
  };
}

// PUT - Actualizar etiqueta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: labelId } = await params;
    const body = await request.json();
    const { name, color, filter, promptFilter } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Nombre y color son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la etiqueta exista
    const existingLabel = await db
      .select()
      .from(labelsTable)
      .where(eq(labelsTable.id, labelId))
      .limit(1);

    if (existingLabel.length === 0) {
      return NextResponse.json(
        { error: 'Etiqueta no encontrada' },
        { status: 404 }
      );
    }

    const oldFilter = existingLabel[0].filter;
    const newFilter = filter?.trim() || null;

    // Actualizar la etiqueta
    const updatedLabel = await db
      .update(labelsTable)
      .set({
        name: name.trim(),
        color,
        filter: newFilter,
        promptFilter: promptFilter?.trim() || null,
      })
      .where(eq(labelsTable.id, labelId))
      .returning();

    // Si el filtro cambió, re-evaluar todos los emails
    if (oldFilter !== newFilter && newFilter) {
      // Obtener todos los emails
      const allEmails = await db
        .select()
        .from(emailsTable);

      // Obtener emails que actualmente tienen esta etiqueta
      const currentEmailLabels = await db
        .select({ emailId: emailLabelsTable.emailId })
        .from(emailLabelsTable)
        .where(eq(emailLabelsTable.labelId, labelId));

      const currentEmailIds = currentEmailLabels.map(rel => rel.emailId);

      // Evaluar qué emails deberían tener esta etiqueta con el nuevo filtro
      const emailsShouldHaveLabel: string[] = [];
      const emailsShouldNotHaveLabel: string[] = [];

      allEmails.forEach(email => {
        const postmarkEmail = emailToPostmarkFormat(email);
        const shouldHaveLabel = applyFiltrexFilter(postmarkEmail, newFilter);
        
        if (shouldHaveLabel && !currentEmailIds.includes(email.id)) {
          emailsShouldHaveLabel.push(email.id);
        } else if (!shouldHaveLabel && currentEmailIds.includes(email.id)) {
          emailsShouldNotHaveLabel.push(email.id);
        }
      });

      // Agregar etiqueta a emails que la necesitan
      if (emailsShouldHaveLabel.length > 0) {
        const newEmailLabels = emailsShouldHaveLabel.map(emailId => ({
          id: generateId(),
          emailId,
          labelId,
        }));
        await db.insert(emailLabelsTable).values(newEmailLabels);
      }

      // Remover etiqueta de emails que ya no la necesitan
      if (emailsShouldNotHaveLabel.length > 0) {
        for (const emailId of emailsShouldNotHaveLabel) {
          await db
            .delete(emailLabelsTable)
            .where(
              and(
                eq(emailLabelsTable.emailId, emailId),
                eq(emailLabelsTable.labelId, labelId)
              )
            );
        }
      }
    }

    return NextResponse.json(updatedLabel[0]);
  } catch (error) {
    console.error('Error actualizando etiqueta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar etiqueta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: labelId } = await params;

    // Verificar que la etiqueta exista
    const existingLabel = await db
      .select()
      .from(labelsTable)
      .where(eq(labelsTable.id, labelId))
      .limit(1);

    if (existingLabel.length === 0) {
      return NextResponse.json(
        { error: 'Etiqueta no encontrada' },
        { status: 404 }
      );
    }

    await db
      .delete(labelsTable)
      .where(eq(labelsTable.id, labelId));

    return NextResponse.json({ message: 'Etiqueta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando etiqueta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 