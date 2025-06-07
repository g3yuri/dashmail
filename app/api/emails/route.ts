import { NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { emailsTable, emailLabelsTable } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { retryWithBackoff } from '@/lib/db-utils';

// GET - Obtener todos los correos con sus etiquetas
export async function GET() {
  try {
    // Usar retry automático para la consulta principal
    const emailsWithLabelsRaw = await retryWithBackoff(
      async () => {
        return await db
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
            aiSummary: emailsTable.aiSummary,
            status: emailsTable.status,
            archived: emailsTable.archived,
            receivedAt: emailsTable.receivedAt,
            createdAt: emailsTable.createdAt,
            labelId: emailLabelsTable.labelId,
          })
          .from(emailsTable)
          .leftJoin(emailLabelsTable, eq(emailsTable.id, emailLabelsTable.emailId))
          .orderBy(desc(emailsTable.receivedAt));
      },
      3, // 3 reintentos máximo
      1000 // 1 segundo de delay inicial
    );

    // Agrupar los resultados por email
    const emailsMap = new Map();
    
    emailsWithLabelsRaw.forEach((row) => {
      const emailId = row.id;
      
      if (!emailsMap.has(emailId)) {
        emailsMap.set(emailId, {
          id: row.id,
          subject: row.subject,
          sender: row.fromEmail,
          summary: row.summary || '',
          aiSummary: row.aiSummary || '',
          date: row.receivedAt,
          labels: [],
          status: row.status as 'pending' | 'in-progress' | 'completed' | 'reviewed',
          archived: !!row.archived,
          content: row.textBody || row.htmlBody,
          textBody: row.textBody,
          htmlBody: row.htmlBody,
          fromName: row.fromName,
        });
      }
      
      // Agregar labelId si existe
      if (row.labelId) {
        emailsMap.get(emailId).labels.push(row.labelId);
      }
    });

    // Convertir el Map a array
    const emailsWithLabels = Array.from(emailsMap.values());

    return NextResponse.json(emailsWithLabels);
  } catch (error) {
    console.error('Error obteniendo correos:', error);
    
    // Mejor manejo de errores con información específica
    if (error instanceof Error) {
      if (error.message.includes('Connect Timeout') || error.message.includes('UND_ERR_CONNECT_TIMEOUT')) {
        console.error('Timeout de conexión a la base de datos. Verificar conectividad con Turso.');
        return NextResponse.json(
          { error: 'Error de conexión con la base de datos. Verificando conectividad...' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('fetch failed')) {
        console.error('Error de red al conectar con la base de datos Turso.');
        return NextResponse.json(
          { error: 'Error de conectividad con Turso. Verificar configuración.' },
          { status: 503 }
        );
      }

      if (error.message.includes('Máximo número de reintentos')) {
        console.error('Se agotaron los reintentos para conectar con la base de datos.');
        return NextResponse.json(
          { error: 'Base de datos temporalmente no disponible. Intenta de nuevo en unos momentos.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 