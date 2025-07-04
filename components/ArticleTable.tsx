'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Article {
  id: string
  title: string
  category: string
  author: string
  content: string
}

const ARTICLES_PER_PAGE = 5

export default function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  const [sortBy, setSortBy] = useState<'title' | 'category' | 'author'>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('articles')
    if (stored) {
      setArticles(JSON.parse(stored))
    }
  }, [])

  const deleteArticle = (id: string) => {
    const confirmed = confirm('Yakin ingin menghapus artikel ini?')
    if (!confirmed) return
    const filtered = articles.filter(article => article.id !== id)
    localStorage.setItem('articles', JSON.stringify(filtered))
    setArticles(filtered)
  }

  const allCategories = ['Semua', ...new Set(articles.map((a) => a.category))]

  const filteredArticles = articles.filter((article) => {
    const matchesTitle = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory
    return matchesTitle && matchesCategory
  })

  // 🔽 Sorting
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const valA = a[sortBy].toLowerCase()
    const valB = b[sortBy].toLowerCase()
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedArticles.length / ARTICLES_PER_PAGE)
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const toggleSort = (field: 'title' | 'category' | 'author') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto p-4">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan judul..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="border px-3 py-2 rounded w-full sm:max-w-xs"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
          }}
          className="border px-3 py-2 rounded w-full sm:max-w-xs"
        >
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('title')}>
              Judul {sortBy === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('category')}>
              Kategori {sortBy === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort('author')}>
              Penulis {sortBy === 'author' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedArticles.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Tidak ada artikel yang cocok.
              </td>
            </tr>
          ) : (
            paginatedArticles.map((article) => (
              <tr key={article.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{article.title}</td>
                <td className="px-4 py-3">{article.category}</td>
                <td className="px-4 py-3">{article.author}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => router.push(`/admin/dashboard/edit/${article.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1
            return (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            )
          })}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
