'use client'

import { useEffect, useState } from 'react'
import { Product, SaleItem } from '../SalesDashboard'


interface Props {
  products: Product[]
}

export default function SalesTab({ products }: Props) {
  const [clientName, setClientName] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [items, setItems] = useState<SaleItem[]>([])
  const [total, setTotal] = useState(0)

  // Calcular total automático
  useEffect(() => {
    setTotal(items.reduce((sum, i) => sum + i.subtotal, 0))
  }, [items])

  // ➕ Agregar producto a la venta
  const addItem = (product_id: number, qty: number) => {
    const product = products.find(p => p.id === product_id)
    if (!product) return alert('Producto inválido')
    if (qty <= 0) return alert('Cantidad inválida')
    if (qty > product.stock) return alert(`Stock insuficiente (${product.stock} disponibles)`)

    const price = product.price_sale
    const subtotal = qty * price

    setItems(prev => [...prev, { product_id, qty, price, subtotal }])
  }

  // 💾 Guardar venta
  const saveSale = async () => {
    if (!clientName || !invoiceNumber || items.length === 0)
      return alert('Completa los campos requeridos.')

    const user_id = 1 // usuario temporal

    // 1️⃣ Guardar cabecera de venta
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_number: invoiceNumber, user_id, client_name: clientName, total }),
    })
    const data = await res.json()
    const saleId = data.id

    // 2️⃣ Guardar los ítems
    for (const item of items) {
      await fetch('/api/sale_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, sale_id: saleId }),
      })
    }

    alert('✅ Venta registrada correctamente.')

    // Limpiar formulario
    setClientName('')
    setInvoiceNumber('')
    setItems([])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Registrar nueva venta</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Número de factura"
          className="border px-3 py-2 rounded w-1/3"
          value={invoiceNumber}
          onChange={e => setInvoiceNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre del cliente"
          className="border px-3 py-2 rounded w-2/3"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
        />
      </div>

      {/* Formulario agregar producto */}
      <div className="flex space-x-2 mt-2">
        <select id="prodSale" className="border px-2 py-1 rounded w-1/3">
          <option value={0}>Selecciona producto</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
          ))}
        </select>
        <input id="qtySale" type="number" placeholder="Cantidad" className="border px-2 py-1 rounded w-1/4" />
        <button
          onClick={() => {
            const product_id = Number((document.getElementById('prodSale') as HTMLSelectElement).value)
            const qty = Number((document.getElementById('qtySale') as HTMLInputElement).value)
            addItem(product_id, qty)
          }}
          className="bg-blue-500 text-white px-3 rounded"
        >
          +
        </button>
      </div>

      {/* Tabla de ítems */}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Producto</th>
            <th className="border px-2 py-1">Cantidad</th>
            <th className="border px-2 py-1">Precio</th>
            <th className="border px-2 py-1">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => {
            const prod = products.find(p => p.id === i.product_id)
            return (
              <tr key={`sale-${i.product_id}-${idx}`}>
                <td className="border px-2 py-1">{prod?.name}</td>
                <td className="border px-2 py-1 text-center">{i.qty}</td>
                <td className="border px-2 py-1 text-right">{i.price.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{i.subtotal.toFixed(2)}</td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={3} className="text-right font-semibold border px-2 py-1">Total</td>
            <td className="border px-2 py-1 text-right font-bold">{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={saveSale}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar Venta
      </button>
    </div>
  )
}
