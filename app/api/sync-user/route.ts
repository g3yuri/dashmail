import { NextResponse } from 'next/server';
import { syncCurrentUser } from '@/lib/sync-user';

export async function POST() {
  try {
    const userId = await syncCurrentUser();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Usuario sincronizado exitosamente',
      userId 
    });
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 