'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

const schema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  category: z.string().min(3, 'Kategori harus diisi'),
  author: z.string().min(3, 'Penulis harus diisi'),
  content: z.string().min(10, 'Isi artikel minimal 10 karakter'),
})

type FormData = z.infer<typeof schema>

export default function CreateArticlePage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const role = document.cookie.match(/role=([^;]+)/)?.[1]
    if (role !== 'admin') router.push('/login')
  }, [])

  const onSubmit = (data: FormData) => {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]')

    const isDuplicate = articles.some((a: any) => a.title.toLowerCase() === data.title.toLowerCase())
    if (isDuplicate) {
      setError('title', { type: 'manual', message: 'Judul artikel sudah ada' })
      return
    }

    const newArticle = {
      id: Date.now(),
      ...data,
    }

    localStorage.setItem('articles', JSON.stringify([...articles, newArticle]))
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex justify-center items-start py-10 bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg w-full max-w-xl space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Tambah Artikel</h1>

        <div>
          <label className="text-sm font-medium">Judul</label>
          <input {...register('title')} className="w-full border px-3 py-2 rounded" />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Kategori</label>
          <input {...register('category')} className="w-full border px-3 py-2 rounded" />
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Penulis</label>
          <input {...register('author')} className="w-full border px-3 py-2 rounded" />
          {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Isi Artikel</label>
          <textarea {...register('content')} className="w-full border px-3 py-2 rounded h-32" />
          {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Simpan Artikel
          </button>
        </div>
      </form>
    </div>
  )
}
