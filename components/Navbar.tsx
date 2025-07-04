'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const currentRole = sessionStorage.getItem('role')
    setRole(currentRole)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Article Manager</h1>
      <div className="space-x-3">
        {role === 'admin' && (
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-blue-600 font-medium"
          >
            Dashboard
          </button>
        )}
        {role === 'user' && (
          <button
            onClick={() => router.push('/user/articles')}
            className="text-green-600 font-medium"
          >
            Artikel
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
