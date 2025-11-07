import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT s.*, u.full_name AS user
    FROM sales s
    LEFT JOIN users u ON s.user_id = u.id
  `);

  // 🔹 Convertir total a número para evitar errores en toFixed
  const sales = (rows as any[]).map(s => ({
    ...s,
    total: Number(s.total),
  }));

  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  const { invoice_number, user_id, client_name, total } = await request.json();
  const [result] = await db.query(
    'INSERT INTO sales (invoice_number, user_id, client_name, total) VALUES (?, ?, ?, ?)',
    [invoice_number, user_id, client_name, total]
  );

  return NextResponse.json({
    message: 'Venta registrada',
    id: (result as any).insertId,
  });
}
