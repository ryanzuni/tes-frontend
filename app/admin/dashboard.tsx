'use client'
import Navbar from '@/components/Navbar'
import ArticleTable from '@/components/ArticleTable'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const roleMatch = document.cookie.match(/role=([^;]+)/)
    if (!roleMatch || roleMatch[1] !== 'admin') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div className="mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Tambah Artikel
        </button>
      </div>
      <ArticleTable />
    </div>
  )
}
