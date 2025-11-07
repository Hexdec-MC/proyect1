import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

// ✅ GET: listar todas las compras
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.name AS supplier, u.full_name AS user
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `)
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error('🚨 Error en GET /api/purchases:', error)
    return NextResponse.json(
      { message: 'Error al obtener las compras', error: error.message },
      { status: 500 }
    )
  }
}

// ✅ POST: registrar una nueva compra
export async function POST(request: Request) {
  try {
    const { supplier_id, user_id, total } = await request.json()

    if (!supplier_id || !user_id) {
      return NextResponse.json(
        { message: 'Proveedor y usuario son requeridos.' },
        { status: 400 }
      )
    }

    const totalNum = Number(total) || 0
    if (totalNum <= 0) {
      return NextResponse.json(
        { message: 'El total debe ser mayor a 0.' },
        { status: 400 }
      )
    }

    const [result] = await db.query(
      `INSERT INTO purchases (supplier_id, user_id, total)
       VALUES (?, ?, ?)`,
      [supplier_id, user_id, totalNum]
    )

    const purchaseId = (result as any).insertId

    // 🔹 Opcional: devolver la compra recién creada
    const [rows] = await db.query(
      `SELECT p.*, s.name AS supplier
       FROM purchases p
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = ?`,
      [purchaseId]
    )

    return NextResponse.json({
      message: 'Compra registrada correctamente ✅',
      id: purchaseId,
      purchase: rows[0],
    })
  } catch (error: any) {
    console.error('🚨 Error en POST /api/purchases:', error)
    return NextResponse.json(
      { message: 'Error al registrar la compra', error: error.message },
      { status: 500 }
    )
  }
}
