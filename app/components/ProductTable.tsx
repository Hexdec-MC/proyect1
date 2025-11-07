import { Product } from '@/app/hooks/useProducts'

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

const ProductTable = ({ products, onEdit, onDelete }: Props) => {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">SKU</th>
          <th className="border px-2 py-1">Nombre</th>
          <th className="border px-2 py-1">Categoría</th>
          <th className="border px-2 py-1">Proveedor</th>
          <th className="border px-2 py-1 text-right">Compra</th>
          <th className="border px-2 py-1 text-right">Venta</th>
          <th className="border px-2 py-1 text-right">Stock</th>
          <th className="border px-2 py-1 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td className="border px-2 py-1">{p.sku}</td>
            <td className="border px-2 py-1">{p.name}</td>
            <td className="border px-2 py-1">{p.category || '—'}</td>
            <td className="border px-2 py-1">{p.supplier || '—'}</td>
            <td className="border px-2 py-1 text-right">{Number(p.price_purchase).toFixed(2)}</td>
            <td className="border px-2 py-1 text-right">{Number(p.price_sale).toFixed(2)}</td>
            <td className="border px-2 py-1 text-right">{p.stock}</td>
            <td className="border px-2 py-1 text-center space-x-2">
              <button
                onClick={() => onEdit(p)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable
