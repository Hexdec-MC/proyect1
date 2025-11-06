import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT a.*, u.username AS user
    FROM audit_log a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { user_id, action, entity, entity_id, details } = await request.json();
  const [result] = await db.query(
    'INSERT INTO audit_log (user_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)',
    [user_id, action, entity, entity_id, details]
  );
  return NextResponse.json({ message: 'Registro de auditoría creado', id: (result as any).insertId });
}
