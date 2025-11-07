import { Product } from "../hooks/useProducts"

interface Props {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: number) => void
}

const ProductRow = ({ product, onEdit, onDelete }: Props) => (
  <tr className="hover:bg-gray-50">
    <td className="border px-4 py-2">{product.sku}</td>
    <td className="border px-4 py-2">{product.name}</td>
    <td className="border px-4 py-2">{product.category}</td>
    <td className="border px-4 py-2">{product.supplier}</td>
    <td className="border px-4 py-2">{product.brand}</td>
    <td className="border px-4 py-2">{product.price_sale.toFixed(2)}</td>
    <td className="border px-4 py-2">{product.stock}</td>
    <td className="border px-4 py-2 space-x-2">
      <button onClick={() => onEdit(product)} className="text-blue-500 hover:underline">Editar</button>
      <button onClick={() => onDelete(product.id)} className="text-red-500 hover:underline">Eliminar</button>
    </td>
  </tr>
)

export default ProductRow
