'use client'
import { useState } from 'react'
import { useProducts, Product } from '@/app/hooks/useProducts'
import ProductForm from '@/app/components/ProductForm'
import ProductTable from '@/app/components/ProductTable'


const ProductsPage = () => {
  const { products, categories, suppliers, loading, removeProduct, addProduct, updateProduct } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  if (loading) return <p>Cargando productos...</p>

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    removeProduct(id)
  }

  const handleSubmit = async (form: any, editing?: Product) => {
    const payload = { ...form, category_id: Number(form.category_id), supplier_id: Number(form.supplier_id) }

    if (editing) {
      await fetch(`/api/products/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      updateProduct({ ...editing, ...payload })
    } else {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      addProduct({ id: data.id, ...payload, category: categories.find(c => c.id === payload.category_id)?.name || '', supplier: suppliers.find(s => s.id === payload.supplier_id)?.name || '' })
    }

    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Nuevo Producto
        </button>
      </div>

      <ProductTable products={products} onEdit={(p) => { setEditing(p); setShowForm(true) }} onDelete={handleDelete} />

      <ProductForm visible={showForm} onClose={() => setShowForm(false)} onSubmit={handleSubmit} categories={categories} suppliers={suppliers} editing={editing} />
    </div>
  )
}

export default ProductsPage
