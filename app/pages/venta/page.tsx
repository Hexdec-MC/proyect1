'use client'

import SaleListTab from '@/app/components/SaleListTab'
import SalesTab from '@/app/components/SalesTab'
import { useEffect, useState } from 'react'


// --- Interfaces ---
export interface Product {
  id: number
  name: string
  price_sale: number
  stock: number
}

export interface SaleItem {
  product_id: number
  qty: number
  price: number
  subtotal: number
}

export default function SalesDashboard() {
  const [tab, setTab] = useState<'ventas' | 'historial'>('ventas')
  const [products, setProducts] = useState<Product[]>([])

  // Cargar productos desde API
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel de Ventas</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          onClick={() => setTab('ventas')}
          className={`pb-2 ${tab === 'ventas' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          🧾 Registrar Venta
        </button>
        <button
          onClick={() => setTab('historial')}
          className={`pb-2 ${tab === 'historial' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          📜 Historial
        </button>
      </div>

      {tab === 'ventas' && <SalesTab products={products} />}
      {tab === 'historial' && <SaleListTab />}
    </div>
  )
}
