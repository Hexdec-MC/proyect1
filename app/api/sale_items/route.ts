import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT si.*, p.name AS product
      FROM sale_items si
      LEFT JOIN products p ON si.product_id = p.id
    `)

    // Convertir price y subtotal a números
    const items = (rows as any[]).map(i => ({
      ...i,
      qty: Number(i.qty),
      price: Number(i.price),
      subtotal: Number(i.subtotal),
    }))

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('🚨 Error en GET /api/sale_items:', error)
    return NextResponse.json(
      { message: 'Error al obtener los items de venta', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { sale_id, product_id, qty, price, subtotal } = await request.json()

    if (!sale_id || !product_id || !qty || !price || !subtotal) {
      return NextResponse.json(
        { message: 'Datos incompletos. Verifica sale_id, product_id, qty, price y subtotal.' },
        { status: 400 }
      )
    }

    const quantity = Number(qty)
    const unitPrice = Number(price)
    const sub = Number(subtotal)

    if (quantity <= 0 || unitPrice <= 0 || sub <= 0) {
      return NextResponse.json(
        { message: 'Cantidad, precio y subtotal deben ser mayores a 0.' },
        { status: 400 }
      )
    }

    const [result] = await db.query(
      'INSERT INTO sale_items (sale_id, product_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [sale_id, product_id, quantity, unitPrice, sub]
    )

    return NextResponse.json({
      message: 'Item agregado a venta ✅',
      id: (result as any).insertId,
    })
  } catch (error: any) {
    console.error('🚨 Error en POST /api/sale_items:', error)
    return NextResponse.json(
      { message: 'Error al agregar item a venta', error: error.message },
      { status: 500 }
    )
  }
}
