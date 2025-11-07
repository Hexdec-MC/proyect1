import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT id, name, contact FROM suppliers');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const { name, contact } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'El nombre es obligatorio.' }, { status: 400 });
    }

    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact) VALUES (?, ?)',
      [name.trim(), contact?.trim() || null]
    );

    return NextResponse.json({
      message: 'Proveedor creado correctamente',
      id: (result as any).insertId,
    });
  } catch (error: any) {
    console.error('🚨 Error al crear proveedor:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
