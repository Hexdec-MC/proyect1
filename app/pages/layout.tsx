'use client'

import { FC, PropsWithChildren } from 'react'
import Header from '@/app/components/Header'

const PagesLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  )
}

export default PagesLayout
