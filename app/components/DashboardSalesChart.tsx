'use client'

import SalesChart from './SalesChart'

const DashboardSalesChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-xl font-medium mb-4">Gráfico de Ventas</h2>
      <SalesChart data={data} />
    </div>
  )
}

export default DashboardSalesChart
