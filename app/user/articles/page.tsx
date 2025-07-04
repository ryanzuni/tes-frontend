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

export default function UserArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [sortOrder, setSortOrder] = useState('terbaru')
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem('role')
    if (role !== 'user') {
      router.push('/login')
      return
    }

    const stored = localStorage.getItem('articles')
    if (stored) setArticles(JSON.parse(stored))

    const username = localStorage.getItem('username')
    if (username) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${username}`)
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  const uniqueCategories = ['Semua', ...Array.from(new Set(articles.map(a => a.category)))]

  const filteredArticles = articles
    .filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((article) =>
      selectedCategory === 'Semua' ? true : article.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === 'terbaru') {
        return Number(b.id) - Number(a.id)
      } else {
        return Number(a.id) - Number(b.id)
      }
    })

  const toggleBookmark = (id: string) => {
    const username = localStorage.getItem('username')
    if (!username) return

    const key = `bookmarks_${username}`
    const current = JSON.parse(localStorage.getItem(key) || '[]')

    const updated = current.includes(id)
      ? current.filter((bid: string) => bid !== id)
      : [...current, id]

    localStorage.setItem(key, JSON.stringify(updated))
    setBookmarks(updated)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="p-6 mt-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Daftar Artikel</h1>

        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul..."
            className="w-full md:w-1/3 border px-4 py-2 rounded shadow-sm"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 border px-3 py-2 rounded shadow-sm"
          >
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-1/3 border px-3 py-2 rounded shadow-sm"
          >
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
          </select>
        </div>

        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada artikel.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const commentCount = JSON.parse(localStorage.getItem(`comments_${article.id}`) || '[]').length
              const views = parseInt(localStorage.getItem(`views_${article.id}`) || '0')

              return (
                <div
                  key={article.id}
                  className="relative cursor-pointer bg-white p-4 rounded shadow hover:shadow-md transition"
                >
                  <div onClick={() => router.push(`/user/articles/${article.id}`)}>
                    <h2 className="text-xl font-semibold">{article.title}</h2>
                    <p className="text-sm text-gray-500 mb-1">Kategori: {article.category}</p>
                    <p className="text-sm text-gray-500 mb-1">Penulis: {article.author}</p>
                    <p className="text-gray-700 text-sm mb-2">{article.content.slice(0, 100)}...</p>
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <p>{commentCount} Komentar</p>
                      <p className="flex items-center gap-1">👁️ {views} kali dilihat</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className="absolute top-3 right-3 text-yellow-500 text-xl"
                    title="Bookmark"
                  >
                    {bookmarks.includes(article.id) ? '★' : '☆'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
