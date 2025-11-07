'use client'

import { useEffect, useState } from 'react'

export interface Product {
  id: number
  sku: string
  name: string
  category: string
  supplier: string
  brand: string
  price_purchase: number
  price_sale: number
  stock: number
  stock_min: number
  lot: string | null
  expiry_date: string | null
}

export interface Category {
  id: number
  name: string
}

export interface Supplier {
  id: number
  name: string
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  // 🔁 Función reutilizable para cargar los datos
  const fetchData = async () => {
    try {
      setLoading(true)
      const [resProducts, resCategories, resSuppliers] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/suppliers')
      ])
      const [p, c, s] = await Promise.all([
        resProducts.json(),
        resCategories.json(),
        resSuppliers.json()
      ])
      setProducts(p)
      setCategories(c)
      setSuppliers(s)
    } catch (err) {
      console.error('Error al cargar datos:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🔂 Cargar datos al montar
  useEffect(() => {
    fetchData()
  }, [])

  // 🔁 Nueva función para recargar productos después de una compra
  const reloadProducts = async () => {
    await fetchData()
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const addProduct = (product: Product) => {
    setProducts([...products, product])
  }

  const updateProduct = (updated: Product) => {
    setProducts(products.map(p => (p.id === updated.id ? updated : p)))
  }

  return {
    products,
    categories,
    suppliers,
    loading,
    removeProduct,
    addProduct,
    updateProduct,
    reloadProducts // 👉 expuesto para usarlo desde otras páginas
  }
}
