import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM users');
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { username, password_hash, full_name, role_id } = data;

  const [result] = await db.query(
    'INSERT INTO users (username, password_hash, full_name, role_id) VALUES (?, ?, ?, ?)',
    [username, password_hash, full_name, role_id]
  );

  return NextResponse.json({ message: 'Usuario creado', id: (result as any).insertId });
}
