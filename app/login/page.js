'use client';

// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/src/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      localStorage.setItem('token', data.token); // Salva o token no local storage
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">

      <main className="container mx-auto flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div>
            <label className="block text-gray-700">Senha:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div>
            <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300">Login</button>
          </div>
        </form>
      </main>
    </div>
  );
}
