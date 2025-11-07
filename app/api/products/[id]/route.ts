import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

// 🔹 Utilidad para convertir a número seguro
const safeNumber = (v: any, defaultValue = 0) => (v != null && !isNaN(Number(v)) ? Number(v) : defaultValue);

// ✅ GET: obtener un producto por id
export async function GET(request: Request, context: Params) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ message: 'ID requerido' }, { status: 400 });

    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const product = (rows as any[])[0];

    if (!product) return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });

    // Convertir valores numéricos
    product.price_sale = safeNumber(product.price_sale);
    product.price_purchase = safeNumber(product.price_purchase);
    product.stock = safeNumber(product.stock);
    product.stock_min = safeNumber(product.stock_min);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('🚨 Error en GET /api/products/[id]:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ PUT: actualizar un producto
export async function PUT(request: Request, context: Params) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ message: 'ID requerido' }, { status: 400 });

    const data = await request.json();
    const {
      name,
      price_sale,
      price_purchase,
      stock,
      stock_min,
      sku,
      brand,
      lot,
      expiry_date,
      category_id,
      supplier_id
    } = data;

    // Validaciones básicas
    if (!name || price_sale == null) {
      return NextResponse.json({ message: 'Nombre y precio de venta son obligatorios' }, { status: 400 });
    }

    const [result] = await db.query(
      `UPDATE products SET 
        name = ?, 
        price_sale = ?, 
        price_purchase = ?, 
        stock = ?, 
        stock_min = ?, 
        sku = ?, 
        brand = ?, 
        lot = ?, 
        expiry_date = ?, 
        category_id = ?, 
        supplier_id = ? 
      WHERE id = ?`,
      [
        name.trim(),
        safeNumber(price_sale),
        safeNumber(price_purchase),
        safeNumber(stock),
        safeNumber(stock_min),
        sku?.trim() || null,
        brand?.trim() || '',
        lot?.trim() || null,
        expiry_date?.trim() || null,
        category_id || null,
        supplier_id || null,
        id
      ]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Producto no encontrado o sin cambios' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto actualizado correctamente' });
  } catch (error: any) {
    console.error('🚨 Error en PUT /api/products/[id]:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE: eliminar un producto
export async function DELETE(request: Request, context: Params) {
  try {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ message: 'ID requerido' }, { status: 400 });

    // 🔹 Verificar relaciones
    const [relatedPurchases] = await db.query(
      'SELECT COUNT(*) AS count FROM purchase_items WHERE product_id = ?',
      [id]
    );
    const [relatedSales] = await db.query(
      'SELECT COUNT(*) AS count FROM sale_items WHERE product_id = ?',
      [id]
    );

    if ((relatedPurchases as any)[0].count > 0 || (relatedSales as any)[0].count > 0) {
      return NextResponse.json(
        { message: 'No se puede eliminar: existen compras o ventas con este producto' },
        { status: 400 }
      );
    }

    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    console.error('🚨 Error en DELETE /api/products/[id]:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
