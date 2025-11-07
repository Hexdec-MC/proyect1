'use client'

import { useState } from 'react'
import { Supplier } from '../PurchaseDashboard'

interface Props {
  suppliers: Supplier[]
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>
}

export default function SuppliersTab({ suppliers, setSuppliers }: Props) {
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '' })

  const saveSupplier = async () => {
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier),
    })
    const data = await res.json()

    if (!data?.id) {
      alert('⚠️ Error: el servidor no devolvió un ID del proveedor.')
      return
    }

    alert('Proveedor agregado ✅')
    setSuppliers(prev => [...prev, { id: data.id, ...newSupplier }])
    setNewSupplier({ name: '', contact: '' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Añadir nuevo proveedor</h2>
      <input
        type="text"
        placeholder="Nombre del proveedor"
        className="border px-3 py-2 rounded w-full"
        value={newSupplier.name}
        onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Contacto"
        className="border px-3 py-2 rounded w-full"
        value={newSupplier.contact}
        onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })}
      />
      <button
        onClick={saveSupplier}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Guardar Proveedor
      </button>

      <h3 className="text-md font-semibold mt-6">Lista de proveedores</h3>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Contacto</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => (
            <tr key={s.id || i}>
              <td className="border px-2 py-1">{s.id}</td>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
