'use client'
import { useEffect, useState } from 'react'

export interface Purchase {
  id: number
  supplier_id: number
  user_id: number
  total: number
  supplier: string
  user: string
}

export interface PurchaseItem {
  id: number
  purchase_id: number
  product_id: number
  product: string
  qty: number
  price: number
}

export interface Supplier {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
}

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const urls = [
          '/api/purchases',
          '/api/purchase_items',
          '/api/suppliers',
          '/api/products'
        ]

        // Llamamos todas las APIs
        const responses = await Promise.all(urls.map(url => fetch(url)))

        // Verificamos si alguna falló o devolvió HTML
        for (const res of responses) {
          if (!res.ok) {
            const text = await res.text()
            console.error(`❌ Error en ${res.url}: ${res.status}`, text)
            throw new Error(`Error cargando ${res.url}`)
          }
          const contentType = res.headers.get('content-type') || ''
          if (!contentType.includes('application/json')) {
            const text = await res.text()
            console.error(`⚠️ Respuesta no JSON de ${res.url}:`, text.slice(0, 200))
            throw new Error(`Respuesta inválida en ${res.url}`)
          }
        }

        // Convertimos todas a JSON
        const [p, i, s, pr] = await Promise.all(responses.map(r => r.json()))

        setPurchases(p)
        setItems(i)
        setSuppliers(s)
        setProducts(pr)
      } catch (err) {
        console.error('🚨 Error cargando datos de compras:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const addPurchase = (purchase: Purchase) => setPurchases(prev => [...prev, purchase])
  const addItem = (item: PurchaseItem) => setItems(prev => [...prev, item])

  return { purchases, items, suppliers, products, loading, addPurchase, addItem }
}
