import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/src/db/index';
import { labelsTable } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET - Obtener todas las etiquetas del usuario
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const labels = await db
      .select()
      .from(labelsTable)
      .where(eq(labelsTable.userId, userId))
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color, filter, promptFilter } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Nombre y color son requeridos' },
        { status: 400 }
      );
    }

    const labelId = generateId();

    console.log('payload', {
        id: labelId,
        name: name.trim(),
        color,
        filter: filter?.trim() || null,
        promptFilter: promptFilter?.trim() || null,
        userId,
      });
    
    const newLabel = await db
      .insert(labelsTable)
      .values({
        id: labelId,
        name: name.trim(),
        color,
        filter: filter?.trim() || null,
        promptFilter: promptFilter?.trim() || null,
        userId,
      })
      .returning();

    return NextResponse.json(newLabel[0], { status: 201 });
  } catch (error) {
    console.error('Error creando etiqueta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 