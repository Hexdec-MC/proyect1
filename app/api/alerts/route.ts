import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

// 📦 GET: listar productos
export async function GET() {
  const [rows] = await db.query('SELECT * FROM products');
  return NextResponse.json(rows);
}

// ➕ POST: crear producto
export async function POST(request: Request) {
  const data = await request.json();
  const { sku, name, category_id, supplier_id, brand, price_purchase, price_sale, stock, stock_min, lot, expiry_date } = data;

  const [result] = await db.query(
    `INSERT INTO products (sku, name, category_id, supplier_id, brand, price_purchase, price_sale, stock, stock_min, lot, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [sku, name, category_id, supplier_id, brand, price_purchase, price_sale, stock, stock_min, lot, expiry_date]
  );

  return NextResponse.json({ message: 'Producto creado', id: (result as any).insertId });
}
