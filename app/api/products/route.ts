import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

// --- GET ---
export async function GET() {
  const [rows] = await db.query(`
    SELECT id, name, price_sale, stock
    FROM products
  `);

  const products = (rows as any[]).map(p => ({
    ...p,
    price_sale: Number(p.price_sale),
    stock: Number(p.stock),
  }));

  return NextResponse.json(products);
}

// --- POST ---
export async function POST(request: Request) {
  try {
    const { name, price_sale } = await request.json();

    if (!name || !price_sale) {
      return NextResponse.json(
        { message: 'Nombre y precio son obligatorios.' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `INSERT INTO products (name, price_sale, stock) VALUES (?, ?, 0)`,
      [name.trim(), Number(price_sale)]
    );

    return NextResponse.json({
      message: 'Producto creado correctamente',
      id: (result as any).insertId,
    });
  } catch (error: any) {
    console.error('🚨 Error al crear producto:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
