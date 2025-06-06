import { NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { emailsTable, emailLabelsTable } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Obtener todos los correos con sus etiquetas
export async function GET() {
  try {
    // Obtener todos los correos
    const emails = await db
      .select({
        id: emailsTable.id,
        messageId: emailsTable.messageId,
        subject: emailsTable.subject,
        fromEmail: emailsTable.fromEmail,
        fromName: emailsTable.fromName,
        toEmail: emailsTable.toEmail,
        textBody: emailsTable.textBody,
        htmlBody: emailsTable.htmlBody,
        summary: emailsTable.summary,
        status: emailsTable.status,
        archived: emailsTable.archived,
        receivedAt: emailsTable.receivedAt,
        createdAt: emailsTable.createdAt,
      })
      .from(emailsTable)
      .orderBy(desc(emailsTable.receivedAt));

    // Obtener etiquetas asociadas a cada correo
    const emailsWithLabels = await Promise.all(
      emails.map(async (email) => {
        const emailLabelRelations = await db
          .select({ labelId: emailLabelsTable.labelId })
          .from(emailLabelsTable)
          .where(eq(emailLabelsTable.emailId, email.id));

        const labelIds = emailLabelRelations.map(rel => rel.labelId);

        return {
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
      })
    );

    return NextResponse.json(emailsWithLabels);
  } catch (error) {
    console.error('Error obteniendo correos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 