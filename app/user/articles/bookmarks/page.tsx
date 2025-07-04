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

export default function BookmarkedArticles() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([])
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    if (role !== 'user' || !username) {
      router.push('/login')
      return
    }

    const storedArticles = JSON.parse(localStorage.getItem('articles') || '[]')
    const storedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${username}`) || '[]')

    const filtered = storedArticles.filter((a: Article) => storedBookmarks.includes(a.id))
    setBookmarkedArticles(filtered)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Bookmark Saya</h1>

        {bookmarkedArticles.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada artikel yang dibookmark.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {bookmarkedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/user/articles/${article.id}`)}
                className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-1">Kategori: {article.category}</p>
                <p className="text-sm text-gray-500 mb-2">Penulis: {article.author}</p>
                <p className="text-gray-700 text-sm">{article.content.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
