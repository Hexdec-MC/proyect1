'use client'

import { useEffect, useState } from 'react'

interface Sale {
  id: number
  invoice_number: string
  client_name: string
  total: number
  date: string
  user: string
}

interface SaleItem {
  product: string
  qty: number
  price: number
  subtotal: number
}

export default function SaleListTab() {
  const [sales, setSales] = useState<Sale[]>([])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [items, setItems] = useState<SaleItem[]>([])
  const [loading, setLoading] = useState(false)

  // 🔹 Cargar todas las ventas
  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(setSales)
  }, [])

  // 🔹 Ver detalle de venta
  const viewDetails = async (sale: Sale) => {
    setSelectedSale(sale)
    setLoading(true)
    const res = await fetch('/api/sale_items')
    const data = await res.json()
    const filtered = data.filter((i: any) => i.sale_id === sale.id)
    setItems(filtered)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Historial de Ventas</h2>

      {/* Tabla principal */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left"># Factura</th>
            <th className="border px-2 py-1 text-left">Cliente</th>
            <th className="border px-2 py-1 text-left">Usuario</th>
            <th className="border px-2 py-1 text-right">Total</th>
            <th className="border px-2 py-1 text-center">Fecha</th>
            <th className="border px-2 py-1 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.invoice_number}</td>
              <td className="border px-2 py-1">{s.client_name}</td>
              <td className="border px-2 py-1">{s.user}</td>
              <td className="border px-2 py-1 text-right">{s.total.toFixed(2)}</td>
              <td className="border px-2 py-1 text-center">{new Date(s.date).toLocaleDateString()}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => viewDetails(s)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No hay ventas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal detalle */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Detalle de venta #{selectedSale.invoice_number}
            </h3>

            <p><strong>Cliente:</strong> {selectedSale.client_name}</p>
            <p><strong>Usuario:</strong> {selectedSale.user}</p>
            <p><strong>Total:</strong> S/ {selectedSale.total.toFixed(2)}</p>

            <h4 className="mt-4 mb-2 font-semibold">Productos vendidos:</h4>
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : (
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">Producto</th>
                    <th className="border px-2 py-1 text-center">Cantidad</th>
                    <th className="border px-2 py-1 text-right">Precio</th>
                    <th className="border px-2 py-1 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{i.product}</td>
                      <td className="border px-2 py-1 text-center">{i.qty}</td>
                      <td className="border px-2 py-1 text-right">{i.price.toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">{i.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-3 text-gray-500">
                        No hay productos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedSale(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
