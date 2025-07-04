'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserNavbar from '@/components/UserNavbar'

interface Article {
  id: string
  title: string
  category: string
  author: string
  content: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Article[]>([])
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem('role')
    if (role !== 'user') {
      router.push('/login')
      return
    }

    const username = localStorage.getItem('username')
    if (username) {
      const stored = localStorage.getItem(`history_${username}`)
      if (stored) setHistory(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="pt-24 px-4 pb-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Riwayat Artikel Dibaca</h1>

        {history.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada riwayat artikel.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/user/articles/${article.id}`)}
                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-500">Kategori: {article.category}</p>
                <p className="text-sm text-gray-500">Penulis: {article.author}</p>
                <p className="text-sm text-gray-600 mt-2">{article.content.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
