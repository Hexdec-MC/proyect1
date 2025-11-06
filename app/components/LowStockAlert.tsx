import React from 'react'

interface Props {
  items: any[]
}

const LowStockAlert: React.FC<Props> = ({ items }) => {
  if (!items.length) return <p className="text-gray-500">Todo el stock está en buen nivel ✅</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-red-100 text-red-700">
          <tr>
            <th className="text-left px-4 py-2">Producto</th>
            <th className="text-left px-4 py-2">Stock</th>
            <th className="text-left px-4 py-2">Stock mínimo</th>
            <th className="text-left px-4 py-2">Categoría</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p: any) => (
            <tr key={p.id} className="border-b">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2">{p.stock_min}</td>
              <td className="px-4 py-2">{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LowStockAlert
