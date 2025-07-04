'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserNavbar() {
  const router = useRouter()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('username')
    if (storedUser) setUsername(storedUser)
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.removeItem('username')
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Artikel Untuk Pengguna</h1>

        <div className="flex items-center gap-4">
          <Link href="/user/articles" className="hover:underline text-sm text-blue-600">
            Artikel
          </Link>
          <Link href="/user/articles/bookmarks" className="hover:underline text-sm text-blue-600">
            Bookmark
          </Link>
          <Link href="/user/history" className="hover:underline text-sm text-blue-600">
            Riwayat
          </Link>

          {username && (
            <span className="text-gray-700 text-sm">👤 {username}</span>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
