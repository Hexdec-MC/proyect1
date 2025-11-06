import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM suppliers');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, contact } = await request.json();
  const [result] = await db.query('INSERT INTO suppliers (name, contact) VALUES (?, ?)', [name, contact]);
  return NextResponse.json({ message: 'Proveedor creado', id: (result as any).insertId });
}
