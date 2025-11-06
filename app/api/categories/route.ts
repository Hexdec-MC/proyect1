import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM categories');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
  return NextResponse.json({ message: 'Categoría creada', id: (result as any).insertId });
}
