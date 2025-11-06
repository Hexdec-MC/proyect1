import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT p.*, s.name AS supplier, u.full_name AS user
    FROM purchases p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN users u ON p.user_id = u.id
  `);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { supplier_id, user_id, total } = await request.json();
  const [result] = await db.query(
    'INSERT INTO purchases (supplier_id, user_id, total) VALUES (?, ?, ?)',
    [supplier_id, user_id, total]
  );
  return NextResponse.json({ message: 'Compra registrada', id: (result as any).insertId });
}
