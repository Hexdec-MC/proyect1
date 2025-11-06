import React from 'react'

interface StatsCardProps {
  title: string
  value: number | string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all duration-200">
      <h3 className="text-gray-600 font-medium">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  )
}

export default StatsCard
