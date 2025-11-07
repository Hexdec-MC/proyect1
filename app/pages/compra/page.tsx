'use client'

import ProductsTab from '@/app/components/ProductsTab'
import PurchasesTab from '@/app/components/PurchasesTab'
import SuppliersTab from '@/app/components/SuppliersTab'
import { useState, useEffect } from 'react'


// --- Interfaces compartidas ---
export interface Supplier {
  id: number
  name: string
  contact?: string
}

export interface Product {
  id: number
  name: string
  price_sale: number
  stock: number
}

export interface PurchaseItem {
  product_id: number
  qty: number
  price: number
}

export default function PurchaseDashboard() {
  const [tab, setTab] = useState<'compras' | 'productos' | 'proveedores'>('compras')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Cargar proveedores y productos
  useEffect(() => {
    Promise.all([
      fetch('/api/suppliers').then(r => r.json()),
      fetch('/api/products').then(r => r.json())
    ]).then(([s, p]) => {
      setSuppliers(s || [])
      setProducts(p || [])
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel de Compras</h1>

      {/* --- Tabs --- */}
      <div className="flex space-x-4 border-b pb-2">
        {['compras', 'productos', 'proveedores'].map((t) => (
          <button
            key={`tab-${t}`}
            onClick={() => setTab(t as any)}
            className={`pb-2 ${tab === t ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
          >
            {t === 'compras' && '🧾 Compras'}
            {t === 'productos' && '📦 Productos'}
            {t === 'proveedores' && '🏭 Proveedores'}
          </button>
        ))}
      </div>

      {/* --- Render dinámico de pestañas --- */}
      {tab === 'compras' && <PurchasesTab suppliers={suppliers} products={products} />}
      {tab === 'productos' && <ProductsTab products={products} setProducts={setProducts} />}
      {tab === 'proveedores' && <SuppliersTab suppliers={suppliers} setSuppliers={setSuppliers} />}
    </div>
  )
}
