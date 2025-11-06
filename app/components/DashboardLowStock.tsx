'use client'

import LowStockAlert from './LowStockAlert'

const DashboardLowStock = ({ items }: { items: any[] }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-xl font-medium mb-4 text-red-600">Productos con bajo stock</h2>
      <LowStockAlert items={items} />
    </div>
  )
}

export default DashboardLowStock
