'use client'

import { useState, useEffect } from 'react'
import { Supplier, Product, PurchaseItem } from '../PurchaseDashboard'

interface Props {
  suppliers: Supplier[]
  products: Product[]
}

export default function PurchasesTab({ suppliers, products }: Props) {
  const [supplierId, setSupplierId] = useState<number>(0)
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    setTotal(items.reduce((sum, i) => sum + i.qty * i.price, 0))
  }, [items])

  const addItem = (product_id: number, qty: number, price: number) => {
    if (!product_id || qty <= 0 || price <= 0) return alert('Completa todos los campos.')
    setItems(prev => [...prev, { product_id, qty, price }])
  }

  const savePurchase = async () => {
    if (!supplierId || items.length === 0) return alert('Selecciona un proveedor y agrega productos.')
    const user_id = 1
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplier_id: supplierId, user_id, total }),
    })
    const data = await res.json()
    const purchaseId = data.id

    for (const item of items) {
      await fetch('/api/purchase_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, purchase_id: purchaseId }),
      })
    }

    alert('✅ Compra registrada correctamente.')
    setItems([])
    setSupplierId(0)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Registrar nueva compra</h2>

      <select
        className="border px-3 py-2 rounded w-full"
        value={supplierId}
        onChange={e => setSupplierId(Number(e.target.value))}
      >
        <option value={0}>Selecciona proveedor</option>
        {suppliers.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <div className="flex space-x-2">
        <select id="productSelect" className="border px-2 py-1 rounded w-1/3">
          <option value={0}>Producto</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input id="qty" type="number" placeholder="Cantidad" className="border px-2 py-1 rounded w-1/4" />
        <input id="price" type="number" placeholder="Precio" className="border px-2 py-1 rounded w-1/4" />
        <button
          onClick={() => {
            const product_id = Number((document.getElementById('productSelect') as HTMLSelectElement).value)
            const qty = Number((document.getElementById('qty') as HTMLInputElement).value)
            const price = Number((document.getElementById('price') as HTMLInputElement).value)
            addItem(product_id, qty, price)
          }}
          className="bg-blue-500 text-white px-3 rounded"
        >
          +
        </button>
      </div>

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
              <tr key={`item-${i.product_id}-${idx}`}>
                <td className="border px-2 py-1">{prod?.name}</td>
                <td className="border px-2 py-1 text-center">{i.qty}</td>
                <td className="border px-2 py-1 text-center">{i.price.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">{(i.qty * i.price).toFixed(2)}</td>
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
        onClick={savePurchase}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Guardar Compra
      </button>
    </div>
  )
}
