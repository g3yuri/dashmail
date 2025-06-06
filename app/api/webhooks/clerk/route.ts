import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db/index';
import { usersTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    created_at: number;
    updated_at: number;
  };
}

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET no está configurado');
    return NextResponse.json(
      { error: 'Configuración del webhook faltante' },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(body, headers) as ClerkWebhookEvent;

    const { type, data } = evt;

    switch (type) {
      case 'user.created':
      case 'user.updated':
        await handleUserUpsert(data);
        break;
      case 'user.deleted':
        await handleUserDelete(data.id);
        break;
      default:
        console.log(`Evento no manejado: ${type}`);
    }

    return NextResponse.json({ message: 'Webhook procesado exitosamente' });
  } catch (error) {
    console.error('Error procesando webhook de Clerk:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

async function handleUserUpsert(userData: ClerkWebhookEvent['data']) {
  try {
    const primaryEmail = userData.email_addresses.find(email => 
      email.id === userData.email_addresses[0].id
    )?.email_address;

    if (!primaryEmail) {
      console.error('No se encontró email principal para el usuario:', userData.id);
      return;
    }

    // Verificar si el usuario ya existe
    const existingUsers = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, userData.id))
      .limit(1);

    const userValues = {
      id: userData.id,
      email: primaryEmail,
      firstName: userData.first_name,
      lastName: userData.last_name,
      imageUrl: userData.image_url,
      updatedAt: new Date(),
    };

    if (existingUsers.length > 0) {
      // Actualizar usuario existente
      await db
        .update(usersTable)
        .set(userValues)
        .where(eq(usersTable.id, userData.id));
      
      console.log(`Usuario actualizado: ${userData.id}`);
    } else {
      // Crear nuevo usuario
      await db.insert(usersTable).values({
        ...userValues,
        createdAt: new Date(),
      });
      
      console.log(`Usuario creado: ${userData.id}`);
    }
  } catch (error) {
    console.error('Error en handleUserUpsert:', error);
    throw error;
  }
}

async function handleUserDelete(userId: string) {
  try {
    await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId));
    
    console.log(`Usuario eliminado: ${userId}`);
  } catch (error) {
    console.error('Error en handleUserDelete:', error);
    throw error;
  }
} 