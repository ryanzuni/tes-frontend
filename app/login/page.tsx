'use client'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '@/lib/auth';

// ✅ Tambahkan ini
const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
type FormData = z.infer<typeof formSchema>; // ✅ DEFINISIKAN TIPENYA

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const user = loginUser(data.username, data.password);
    if (!user) {
      setError('Username atau password salah');
      setLoading(false);
      return;
    }
    document.cookie = `token=${user.username}; path=/`; // Simpan username sebagai token dummy
    document.cookie = `role=${user.role}; path=/`;
    if (user.role === 'admin') router.push('/admin/dashboard');
    else router.push('/user/articles');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-4">Login</h1>
        <input {...register('username')} placeholder="Username" className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        <input type="password" {...register('password')} placeholder="Password" className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
