'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UserNavbar from '@/components/UserNavbar'

interface Article {
  id: string
  title: string
  category: string
  author: string
  content: string
}

interface Comment {
  name: string
  message: string
  timestamp: string
}

export default function ArticleDetail() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editMessage, setEditMessage] = useState('')

  const [likes, setLikes] = useState<number>(0)
  const [views, setViews] = useState<number>(0)
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('username') : ''

  // Tambah view sekali per user per artikel
  useEffect(() => {
    const role = sessionStorage.getItem('role')
    if (role !== 'user') {
      router.push('/login')
      return
    }

    const storedArticles = localStorage.getItem('articles')
    if (storedArticles) {
      const articles: Article[] = JSON.parse(storedArticles)
      const found = articles.find((a) => a.id === id)
      if (!found) {
        router.push('/user/articles')
      } else {
        setArticle(found)
      }
    }

    const storedComments = localStorage.getItem(`comments_${id}`)
    if (storedComments) setComments(JSON.parse(storedComments))

    // Ambil like
    const storedLikes = localStorage.getItem(`likes_${id}`)
    setLikes(storedLikes ? parseInt(storedLikes) : 0)

    // Tambah view sekali per user
    const username = localStorage.getItem('username')
    if (username) {
      const viewedKey = `viewed_${id}_${username}`
      const hasViewed = localStorage.getItem(viewedKey)
      const currentViews = parseInt(localStorage.getItem(`views_${id}`) || '0')
      if (!hasViewed) {
        const updated = currentViews + 1
        localStorage.setItem(`views_${id}`, updated.toString())
        localStorage.setItem(viewedKey, 'true')
        setViews(updated)
      } else {
        setViews(currentViews)
      }
    }
  }, [id])

  const handleAddComment = () => {
    if (!name.trim() || !message.trim()) return

    const newComment: Comment = {
      name,
      message,
      timestamp: new Date().toLocaleString()
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments))
    setName('')
    setMessage('')
  }

  const handleDeleteComment = (index: number) => {
    const confirmed = confirm('Yakin ingin menghapus komentar ini?')
    if (!confirmed) return

    const updated = [...comments]
    updated.splice(index, 1)
    setComments(updated)
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated))
  }

  const handleSaveEdit = (index: number) => {
    const updated = [...comments]
    updated[index].message = editMessage
    updated[index].timestamp = new Date().toLocaleString()
    setComments(updated)
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated))
    setEditingIndex(null)
  }

  const handleLike = () => {
    const updatedLikes = likes + 1
    setLikes(updatedLikes)
    localStorage.setItem(`likes_${id}`, updatedLikes.toString())
  }

  if (!article) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />

      <div className="pt-24 px-4 pb-10 max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-sm text-gray-500 mb-2">Kategori: {article.category}</p>
          <p className="text-sm text-gray-500 mb-4">Penulis: {article.author}</p>
          <p className="text-gray-700 text-base whitespace-pre-line">{article.content}</p>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span>👁️ {views} kali dilihat</span>
            <button onClick={handleLike} className="hover:text-blue-600">
              👍 {likes} Suka
            </button>
          </div>

          {/* Komentar Form */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Tinggalkan Komentar</h2>
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <textarea
              placeholder="Komentar..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2 h-24"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Kirim Komentar
            </button>
          </div>

          {/* Daftar Komentar */}
          {comments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Komentar ({comments.length})</h3>
              <ul className="space-y-4">
                {comments.map((c, index) => (
                  <li key={index} className="border-t pt-2">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.timestamp}</p>

                        {editingIndex === index ? (
                          <>
                            <textarea
                              value={editMessage}
                              onChange={(e) => setEditMessage(e.target.value)}
                              className="w-full border px-3 py-2 rounded mb-2 mt-1"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(index)}
                                className="text-blue-500 text-sm hover:underline"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingIndex(null)}
                                className="text-gray-500 text-sm hover:underline"
                              >
                                Batal
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="mt-1">{c.message}</p>
                        )}

                        {currentUser === c.name && editingIndex !== index && (
                          <button
                            onClick={() => {
                              setEditingIndex(index)
                              setEditMessage(c.message)
                            }}
                            className="text-blue-500 text-xs hover:underline mt-2 block"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteComment(index)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => router.back()}
            className="mt-10 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  )
}
