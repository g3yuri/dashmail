import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { emailsTable, emailLabelsTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// PUT - Actualizar correo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: emailId } = await params;
    const body = await request.json();
    const { status, archived, labels } = body;

    // Verificar que el email exista
    const existingEmail = await db
      .select()
      .from(emailsTable)
      .where(eq(emailsTable.id, emailId))
      .limit(1);

    if (existingEmail.length === 0) {
      return NextResponse.json(
        { error: 'Correo no encontrado' },
        { status: 404 }
      );
    }

    // Preparar los datos a actualizar
    const updateData: { status?: string; archived?: boolean } = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (archived !== undefined) {
      updateData.archived = archived;
    }

    // Actualizar el correo si hay campos que actualizar
    if (Object.keys(updateData).length > 0) {
      await db
        .update(emailsTable)
        .set(updateData)
        .where(eq(emailsTable.id, emailId));
    }

    // Actualizar etiquetas si se proporcionaron
    if (labels !== undefined && Array.isArray(labels)) {
      // Eliminar etiquetas existentes
      await db
        .delete(emailLabelsTable)
        .where(eq(emailLabelsTable.emailId, emailId));

      // Insertar nuevas etiquetas
      if (labels.length > 0) {
        const emailLabelValues = labels.map((labelId: string) => ({
          id: generateId(),
          emailId,
          labelId,
        }));

        await db.insert(emailLabelsTable).values(emailLabelValues);
      }
    }

    // Obtener el correo actualizado con etiquetas
    const updatedEmail = await db
      .select()
      .from(emailsTable)
      .where(eq(emailsTable.id, emailId))
      .limit(1);

    // Obtener etiquetas del correo
    const emailLabelRelations = await db
      .select({ labelId: emailLabelsTable.labelId })
      .from(emailLabelsTable)
      .where(eq(emailLabelsTable.emailId, emailId));

    const labelIds = emailLabelRelations.map(rel => rel.labelId);

    const email = updatedEmail[0];
    const emailFormatted = {
      id: email.id,
      subject: email.subject,
      sender: email.fromEmail,
      summary: email.summary || '',
      date: email.receivedAt,
      labels: labelIds,
      status: email.status as 'pending' | 'in-progress' | 'completed' | 'reviewed',
      archived: !!email.archived,
      content: email.textBody || email.htmlBody,
    };

    return NextResponse.json(emailFormatted);
  } catch (error) {
    console.error('Error actualizando correo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 