import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { emailsTable, attachmentsTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { generateEmailSummary } from '@/lib/ai';

// Tipo para el webhook de Postmark Inbound
interface PostmarkInboundWebhook {
  MessageID: string;
  Date: string;
  Subject: string;
  FromFull: {
    Email: string;
    Name: string;
  };
  ToFull: Array<{
    Email: string;
    Name: string;
  }>;
  CcFull?: Array<{
    Email: string;
    Name: string;
  }>;
  BccFull?: Array<{
    Email: string;
    Name: string;
  }>;
  OriginalRecipient: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: Array<{
    Name: string;
    Value: string;
  }>;
  Attachments: Array<{
    Name: string;
    Content: string;
    ContentType: string;
    ContentLength: number;
    ContentID?: string;
  }>;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSummary(textBody: string, maxLength: number = 200): string {
  if (!textBody) return '';
  
  // Limpiar el texto de caracteres innecesarios
  const cleanText = textBody
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Cortar en la palabra más cercana al límite
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

export async function POST(request: NextRequest) {
  try {
    const body: PostmarkInboundWebhook = await request.json();
    
    // Validar que tengamos los datos necesarios
    if (!body.MessageID || !body.Subject || !body.FromFull?.Email || !body.ToFull?.[0]?.Email) {
      return NextResponse.json(
        { error: 'Datos del webhook incompletos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingEmails = await db
      .select({ id: emailsTable.id })
      .from(emailsTable)
      .where(eq(emailsTable.messageId, body.MessageID))
      .limit(1);

    if (existingEmails.length > 0) {
      console.log(`Email con MessageID ${body.MessageID} ya existe`);
      return NextResponse.json(
        { message: 'Email ya procesado' },
        { status: 200 }
      );
    }

    const emailId = generateId();
    const receivedAt = new Date(body.Date);
    const summary = generateSummary(body.TextBody || body.StrippedTextReply);
    const recipientEmail = body.ToFull[0].Email;

    // Generar resumen con IA
    const emailContent = body.TextBody || body.StrippedTextReply || '';
    const aiSummary = await generateEmailSummary(emailContent, body.Subject);

    // Insertar el email en la base de datos
    await db.insert(emailsTable).values({
      id: emailId,
      messageId: body.MessageID,
      subject: body.Subject,
      fromEmail: body.FromFull.Email,
      fromName: body.FromFull.Name || null,
      toEmail: recipientEmail,
      textBody: body.TextBody || null,
      htmlBody: body.HtmlBody || null,
      summary: summary,
      aiSummary: aiSummary,
      status: 'pending',
      archived: false,
      receivedAt: receivedAt,
    });

    // Insertar adjuntos si existen
    if (body.Attachments && body.Attachments.length > 0) {
      const attachmentValues = body.Attachments.map(attachment => ({
        id: generateId(),
        emailId: emailId,
        name: attachment.Name,
        contentType: attachment.ContentType,
        contentLength: attachment.ContentLength,
        content: attachment.Content,
        contentId: attachment.ContentID || null,
      }));

      await db.insert(attachmentsTable).values(attachmentValues);
    }

    console.log(`Email procesado exitosamente: ${body.MessageID}`);

    return NextResponse.json(
      { 
        message: 'Email procesado exitosamente',
        emailId: emailId,
        messageId: body.MessageID
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error procesando webhook de Postmark:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Método GET para verificar que el endpoint está activo.
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Endpoint de webhook activo',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
} 