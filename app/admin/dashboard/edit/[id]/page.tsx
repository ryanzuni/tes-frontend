'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  category: z.string().min(3, 'Kategori harus diisi'),
  author: z.string().min(3, 'Penulis harus diisi'),
  content: z.string().min(10, 'Isi artikel minimal 10 karakter'),
})

type FormData = z.infer<typeof schema>

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id?.toString()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (typeof window === 'undefined' || !id) return

    const role = document.cookie.match(/role=([^;]+)/)?.[1]
    if (role !== 'admin') {
      router.push('/login')
      return
    }

    const articles = JSON.parse(localStorage.getItem('articles') || '[]')
    const article = articles.find((a: any) => a.id === Number(id))

    if (!article) {
      router.push('/admin/dashboard')
    } else {
      setValue('title', article.title)
      setValue('category', article.category)
      setValue('author', article.author)
      setValue('content', article.content)
      setLoading(false)
    }
  }, [id])

  const onSubmit = (data: FormData) => {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]')

    // Validasi judul tidak duplikat dengan artikel lain
    const isDuplicate = articles.some((a: any) =>
      a.id !== Number(id) &&
      a.title.toLowerCase() === data.title.toLowerCase()
    )

    if (isDuplicate) {
      setError('title', {
        type: 'manual',
        message: 'Judul artikel sudah digunakan oleh artikel lain',
      })
      return
    }

    const updated = articles.map((a: any) =>
      a.id === Number(id) ? { ...a, ...data } : a
    )

    localStorage.setItem('articles', JSON.stringify(updated))
    router.push('/admin/dashboard')
  }

  if (loading) return <div className="p-6 text-center">Loading data...</div>

  return (
    <div className="min-h-screen flex justify-center items-start py-10 bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg w-full max-w-xl space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Edit Artikel</h1>

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
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}
