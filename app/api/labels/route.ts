import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { labelsTable, emailsTable, emailLabelsTable } from '@/src/db/schema';
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

// GET - Obtener todas las etiquetas
export async function GET() {
  try {
    const labels = await db
      .select()
      .from(labelsTable)
      .orderBy(labelsTable.createdAt);

    return NextResponse.json(labels);
  } catch (error) {
    console.error('Error obteniendo etiquetas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva etiqueta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, filter, promptFilter } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Nombre y color son requeridos' },
        { status: 400 }
      );
    }

    const labelId = generateId();
    const cleanFilter = filter?.trim() || null;

    const newLabel = await db.insert(labelsTable).values({
      id: labelId,
      name: name.trim(),
      color,
      filter: cleanFilter,
      promptFilter: promptFilter?.trim() || null,
    }).returning();

    // Si hay un filtro, aplicarlo a todos los emails existentes
    if (cleanFilter) {
      const allEmails = await db
        .select()
        .from(emailsTable);

      const emailsToLabel: string[] = [];

      allEmails.forEach(email => {
        const postmarkEmail = emailToPostmarkFormat(email);
        if (applyFiltrexFilter(postmarkEmail, cleanFilter)) {
          emailsToLabel.push(email.id);
        }
      });

      // Agregar etiqueta a emails que coinciden
      if (emailsToLabel.length > 0) {
        const emailLabelValues = emailsToLabel.map(emailId => ({
          id: generateId(),
          emailId,
          labelId,
        }));

        await db.insert(emailLabelsTable).values(emailLabelValues);
      }
    }

    return NextResponse.json(newLabel[0], { status: 201 });
  } catch (error) {
    console.error('Error creando etiqueta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 