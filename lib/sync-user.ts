import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/src/db/index';
import { usersTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function syncCurrentUser() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return null;
    }

    const primaryEmail = user.emailAddresses.find(email => 
      email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      console.error('No se encontró email principal para el usuario:', user.id);
      return null;
    }

    // Verificar si el usuario ya existe en la base de datos
    const existingUsers = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    const userValues = {
      id: user.id,
      email: primaryEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      updatedAt: new Date(),
    };

    if (existingUsers.length > 0) {
      // Actualizar usuario existente
      await db
        .update(usersTable)
        .set(userValues)
        .where(eq(usersTable.id, user.id));
      
      console.log(`Usuario sincronizado: ${user.id}`);
    } else {
      // Crear nuevo usuario
      await db.insert(usersTable).values({
        ...userValues,
        createdAt: new Date(),
      });
      
      console.log(`Usuario creado durante sincronización: ${user.id}`);
    }

    return user.id;
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    return null;
  }
} 