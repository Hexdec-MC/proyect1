'use client'

import { useState } from 'react'
import { Product } from '../hooks/useProducts'

interface Props {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function ProductsTab({ products, setProducts }: Props) {
  const [newProduct, setNewProduct] = useState({ name: '', price_sale: 0 })

  const saveProduct = async () => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
    const data = await res.json()

    if (!data?.id) {
      alert('⚠️ Error: el servidor no devolvió un ID del producto.')
      return
    }

    alert('Producto agregado ✅')
    setProducts(prev => [...prev, { id: data.id, ...newProduct, stock: 0 }])
    setNewProduct({ name: '', price_sale: 0 })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Añadir nuevo producto</h2>
      <input
        type="text"
        placeholder="Nombre del producto"
        className="border px-3 py-2 rounded w-full"
        value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio venta"
        className="border px-3 py-2 rounded w-full"
        value={newProduct.price_sale}
        onChange={e => setNewProduct({ ...newProduct, price_sale: Number(e.target.value) })}
      />
      <button onClick={saveProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Guardar Producto
      </button>

      <h3 className="text-md font-semibold mt-6">Lista de productos</h3>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Precio</th>
            <th className="border px-2 py-1">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id || i}>
              <td className="border px-2 py-1">{p.id}</td>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1 text-right">{p.price_sale.toFixed(2)}</td>
              <td className="border px-2 py-1 text-center">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
