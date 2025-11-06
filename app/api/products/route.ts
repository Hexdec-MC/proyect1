import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category, s.name AS supplier
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
  `);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sku, name, category_id, supplier_id, brand, price_purchase, price_sale, stock, stock_min, lot, expiry_date } = data;

    const [result] = await db.query(
    `INSERT INTO products (sku, name, category_id, supplier_id, brand, price_purchase, price_sale, stock, stock_min, lot, expiry_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        sku,
        name,
        category_id || null,
        supplier_id || null,
        brand,
        price_purchase,
        price_sale,
        stock,
        stock_min,
        lot || null,
        expiry_date || null
    ]
    );


    return NextResponse.json({ message: 'Producto creado', id: (result as any).insertId });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ message: 'Error al crear producto' }, { status: 500 });
  }
}
