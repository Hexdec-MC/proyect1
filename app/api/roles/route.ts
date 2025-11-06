import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM roles');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const [result] = await db.query('INSERT INTO roles (name) VALUES (?)', [name]);
  return NextResponse.json({ message: 'Rol creado', id: (result as any).insertId });
}
