'use client'

import { useEffect, useState } from 'react'

interface Product {
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

interface Category {
  id: number
  name: string
}

interface Supplier {
  id: number
  name: string
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const emptyForm = {
    sku: '',
    name: '',
    category_id: 0,
    supplier_id: 0,
    brand: '',
    price_purchase: 0,
    price_sale: 0,
    stock: 0,
    stock_min: 0,
    lot: '',
    expiry_date: ''
  }

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resCategories, resSuppliers] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/suppliers')
        ])
        if (!resProducts.ok || !resCategories.ok || !resSuppliers.ok) {
          console.error('Error cargando datos iniciales')
          return
        }
        const [productsData, categoriesData, suppliersData] = await Promise.all([
          resProducts.json(),
          resCategories.json(),
          resSuppliers.json()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setSuppliers(suppliersData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Cargando productos...</p>

  // Funciones del formulario
  const handleNew = () => {
    setForm(emptyForm)
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product: Product) => {
    setForm({
      sku: product.sku,
      name: product.name,
      category_id: categories.find(c => c.name === product.category)?.id || 0,
      supplier_id: suppliers.find(s => s.name === product.supplier)?.id || 0,
      brand: product.brand,
      price_purchase: product.price_purchase,
      price_sale: product.price_sale,
      stock: product.stock,
      stock_min: product.stock_min,
      lot: product.lot || '',
      expiry_date: product.expiry_date || ''
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Error al eliminar producto')
        return
      }
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        supplier_id: Number(form.supplier_id),
        price_purchase: Number(form.price_purchase),
        price_sale: Number(form.price_sale),
        stock: Number(form.stock),
        stock_min: Number(form.stock_min),
        lot: form.lot || null,
        expiry_date: form.expiry_date || null
      }

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) {
          console.error('Error al actualizar producto')
          return
        }
        setProducts(products.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...payload, category: categories.find(c => c.id === payload.category_id)?.name || '', supplier: suppliers.find(s => s.id === payload.supplier_id)?.name || '' } as Product
            : p
        ))
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) {
          console.error('Error al crear producto')
          return
        }
        const data = await res.json()
        setProducts([...products, { id: data.id, ...payload, category: categories.find(c => c.id === payload.category_id)?.name || '', supplier: suppliers.find(s => s.id === payload.supplier_id)?.name || '' } as Product])
      }

      setShowForm(false)
      setEditingProduct(null)
      setForm(emptyForm)
    } catch (error) {
      console.error('Error al guardar producto:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <button onClick={handleNew} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Nuevo Producto
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Categoría</th>
            <th className="border px-4 py-2">Proveedor</th>
            <th className="border px-4 py-2">Marca</th>
            <th className="border px-4 py-2">Precio Venta</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{p.sku}</td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.category}</td>
              <td className="border px-4 py-2">{p.supplier}</td>
              <td className="border px-4 py-2">{p.brand}</td>
              <td className="border px-4 py-2">{p.price_sale.toFixed(2)}</td>
              <td className="border px-4 py-2">{p.stock}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:underline">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full border px-3 py-2 rounded"/>
              <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded"/>
              <select name="category_id" value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })} className="w-full border px-3 py-2 rounded">
                <option value={0}>Selecciona categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select name="supplier_id" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: Number(e.target.value) })} className="w-full border px-3 py-2 rounded">
                <option value={0}>Selecciona proveedor</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="text" name="brand" placeholder="Marca" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full border px-3 py-2 rounded"/>
              <input type="number" step="0.01" name="price_purchase" placeholder="Precio Compra" value={form.price_purchase} onChange={e => setForm({ ...form, price_purchase: Number(e.target.value) })} className="w-full border px-3 py-2 rounded"/>
              <input type="number" step="0.01" name="price_sale" placeholder="Precio Venta" value={form.price_sale} onChange={e => setForm({ ...form, price_sale: Number(e.target.value) })} className="w-full border px-3 py-2 rounded"/>
              <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border px-3 py-2 rounded"/>
              <input type="number" name="stock_min" placeholder="Stock mínimo" value={form.stock_min} onChange={e => setForm({ ...form, stock_min: Number(e.target.value) })} className="w-full border px-3 py-2 rounded"/>
              <input type="text" name="lot" placeholder="Lote" value={form.lot} onChange={e => setForm({ ...form, lot: e.target.value })} className="w-full border px-3 py-2 rounded"/>
              <input type="date" name="expiry_date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} className="w-full border px-3 py-2 rounded"/>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">{editingProduct ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
