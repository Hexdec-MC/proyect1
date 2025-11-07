import { Category, Supplier, Product } from '../hooks/useProducts'
import { useState, useEffect } from 'react'

interface Props {
  visible: boolean
  onClose: () => void
  onSubmit: (form: any, editing?: Product) => Promise<void>
  categories: Category[]
  suppliers: Supplier[]
  editing?: Product | null
}

const ProductForm = ({ visible, onClose, onSubmit, categories, suppliers, editing }: Props) => {
  const [form, setForm] = useState({
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
  })

  useEffect(() => {
    if (editing) {
      setForm({
        sku: editing.sku ?? '',
        name: editing.name ?? '',
        category_id: categories.find(c => c.name === editing.category)?.id ?? 0,
        supplier_id: suppliers.find(s => s.name === editing.supplier)?.id ?? 0,
        brand: editing.brand ?? '',
        price_purchase: editing.price_purchase ?? 0,
        price_sale: editing.price_sale ?? 0,
        stock: editing.stock ?? 0,
        stock_min: editing.stock_min ?? 0,
        lot: editing.lot ?? '',
        expiry_date: editing.expiry_date ?? ''
      })
    } else {
      setForm({
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
      })
    }
  }, [editing, categories, suppliers])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={e => { e.preventDefault(); onSubmit(form, editing || undefined) }} className="space-y-2">

          {/* Inputs de texto */}
          {['sku', 'name', 'brand', 'lot'].map(key => (
            <input
              key={key}
              type="text"
              placeholder={key.toUpperCase()}
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          ))}

          {/* Select de categoría */}
          <select
            value={form.category_id}
            onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Selecciona categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Select de proveedor */}
          <select
            value={form.supplier_id}
            onChange={e => setForm({ ...form, supplier_id: Number(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Selecciona proveedor</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Inputs numéricos */}
          {['price_purchase', 'price_sale', 'stock', 'stock_min'].map(key => (
            <input
              key={key}
              type="number"
              placeholder={key.replace('_', ' ').toUpperCase()}
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
              className="w-full border px-3 py-2 rounded"
            />
          ))}

          {/* Input de fecha */}
          <input
            type="date"
            value={form.expiry_date}
            onChange={e => setForm({ ...form, expiry_date: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              {editing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
