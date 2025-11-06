import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT pi.*, p.name AS product
    FROM purchase_items pi
    LEFT JOIN products p ON pi.product_id = p.id
  `);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { purchase_id, product_id, qty, price } = await request.json();
  const [result] = await db.query(
    'INSERT INTO purchase_items (purchase_id, product_id, qty, price) VALUES (?, ?, ?, ?)',
    [purchase_id, product_id, qty, price]
  );
  return NextResponse.json({ message: 'Item agregado a compra', id: (result as any).insertId });
}
