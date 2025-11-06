'use client'

import StatsCard from './StatsCard'

const DashboardStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Ventas registradas" value={stats.totalSales} />
      <StatsCard title="Productos" value={stats.totalProducts} />
      <StatsCard title="Proveedores" value={stats.totalSuppliers} />
      <StatsCard title="Categorías" value={stats.totalCategories} />
    </div>
  )
}

export default DashboardStats
