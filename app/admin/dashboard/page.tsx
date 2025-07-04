'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ArticleTable from '@/components/ArticleTable'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem('role')
    if (role !== 'admin') {
        router.push('/login')
    }
    }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manajemen Artikel</h1>
        <div className="flex justify-end mb-4">
  <button
    onClick={() => router.push('/admin/dashboard/create')}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    + Tambah Artikel
  </button>
</div>
        <ArticleTable />
      </div>
    </div>
  )
}
