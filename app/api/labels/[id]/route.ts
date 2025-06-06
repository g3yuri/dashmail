import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/src/db/index';
import { labelsTable } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

// PUT - Actualizar etiqueta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { id: labelId } = await params;
    const body = await request.json();
    const { name, color, filter, promptFilter } = body;

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Nombre y color son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la etiqueta pertenezca al usuario
    const existingLabel = await db
      .select()
      .from(labelsTable)
      .where(and(eq(labelsTable.id, labelId), eq(labelsTable.userId, userId)))
      .limit(1);

    if (existingLabel.length === 0) {
      return NextResponse.json(
        { error: 'Etiqueta no encontrada' },
        { status: 404 }
      );
    }

    const updatedLabel = await db
      .update(labelsTable)
      .set({
        name: name.trim(),
        color,
        filter: filter?.trim() || null,
        promptFilter: promptFilter?.trim() || null,
      })
      .where(and(eq(labelsTable.id, labelId), eq(labelsTable.userId, userId)))
      .returning();

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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { id: labelId } = await params;

    // Verificar que la etiqueta pertenezca al usuario
    const existingLabel = await db
      .select()
      .from(labelsTable)
      .where(and(eq(labelsTable.id, labelId), eq(labelsTable.userId, userId)))
      .limit(1);

    if (existingLabel.length === 0) {
      return NextResponse.json(
        { error: 'Etiqueta no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar relaciones en email_labels (se hace automáticamente por CASCADE)
    // Eliminar la etiqueta
    await db
      .delete(labelsTable)
      .where(and(eq(labelsTable.id, labelId), eq(labelsTable.userId, userId)));

    return NextResponse.json({ message: 'Etiqueta eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando etiqueta:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 