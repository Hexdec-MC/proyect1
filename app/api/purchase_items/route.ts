import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT pi.*, p.name AS product
      FROM purchase_items pi
      LEFT JOIN products p ON pi.product_id = p.id
    `)

    // Convertir valores numéricos
    const items = (rows as any[]).map(i => ({
      ...i,
      qty: Number(i.qty),
      price: Number(i.price),
    }))

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('🚨 Error en GET /api/purchase_items:', error)
    return NextResponse.json(
      { message: 'Error al obtener los items', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { purchase_id, product_id, qty, price } = await request.json()

    if (!purchase_id || !product_id || !qty || !price) {
      return NextResponse.json(
        { message: 'Datos incompletos. Verifica purchase_id, product_id, qty y price.' },
        { status: 400 }
      )
    }

    const quantity = Number(qty)
    const unitPrice = Number(price)

    if (quantity <= 0 || unitPrice <= 0) {
      return NextResponse.json(
        { message: 'Cantidad y precio deben ser mayores a 0.' },
        { status: 400 }
      )
    }

    // Insertar item
    const [result] = await db.query(
      'INSERT INTO purchase_items (purchase_id, product_id, qty, price) VALUES (?, ?, ?, ?)',
      [purchase_id, product_id, quantity, unitPrice]
    )

    // Actualizar stock
    await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, product_id])

    return NextResponse.json({
      message: 'Item agregado y stock actualizado ✅',
      id: (result as any).insertId,
    })
  } catch (error: any) {
    console.error('🚨 Error en POST /api/purchase_items:', error)
    return NextResponse.json(
      { message: 'Error al agregar item', error: error.message },
      { status: 500 }
    )
  }
}
