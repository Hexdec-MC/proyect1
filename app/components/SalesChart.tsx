'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface Props {
  data: any[]
}

const SalesChart: React.FC<Props> = ({ data }) => {
  // Agrupar ventas por fecha
  const groupedData = data.reduce((acc: any, sale: any) => {
    const date = new Date(sale.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + parseFloat(sale.total)
    return acc
  }, {})

  const chartData = Object.keys(groupedData).map(date => ({
    date,
    total: groupedData[date],
  }))

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart
