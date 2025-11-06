import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT si.*, p.name AS product
    FROM sale_items si
    LEFT JOIN products p ON si.product_id = p.id
  `);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { sale_id, product_id, qty, price, subtotal } = await request.json();
  const [result] = await db.query(
    'INSERT INTO sale_items (sale_id, product_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)',
    [sale_id, product_id, qty, price, subtotal]
  );
  return NextResponse.json({ message: 'Item agregado a venta', id: (result as any).insertId });
}
