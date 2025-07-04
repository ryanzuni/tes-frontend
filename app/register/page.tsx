'use client'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveUser } from '@/lib/auth';

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['admin', 'user'])
});

// ✅ Tambahkan ini
type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    saveUser(data);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-4">Register</h1>
        <input {...register('username')} placeholder="Username" className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        <input type="password" {...register('password')} placeholder="Password" className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        <select {...register('role')} className="border px-3 py-2 w-full mb-2 rounded">
          <option value="">Pilih Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
