'use client'

import Header from '@/app/components/Header'
import { useEffect, useState } from 'react'
import DashboardStats from '@/app/components/DashboardStats'
import DashboardSalesChart from '@/app/components/DashboardSalesChart'
import DashboardLowStock from '@/app/components/DashboardLowStock'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalCategories: 0,
  })

  const [salesData, setSalesData] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSales = await fetch('/api/sales')
        const sales = await resSales.json()
        const resProducts = await fetch('/api/products')
        const products = await resProducts.json()
        const resSuppliers = await fetch('/api/suppliers')
        const suppliers = await resSuppliers.json()
        const resCategories = await fetch('/api/categories')
        const categories = await resCategories.json()

        const lowStockItems = products.filter((p: any) => p.stock <= p.stock_min)

        setStats({
          totalSales: sales.length,
          totalProducts: products.length,
          totalSuppliers: suppliers.length,
          totalCategories: categories.length,
        })

        setLowStock(lowStockItems)
        setSalesData(sales)
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Header />

      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800">Panel de Control</h1>
        <DashboardStats stats={stats} />
        <DashboardSalesChart data={salesData} />
        <DashboardLowStock items={lowStock} />
      </div>
    </div>
  )
}

export default Dashboard
