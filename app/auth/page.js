// pages/auth.js
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/src/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar');
      }

      const data = await response.json();
      console.log('Registro bem-sucedido:', data);
      // Redirecionar ou fazer algo após o registro bem-sucedido
      router.push('/'); // Exemplo de redirecionamento para a página inicial
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setError('Erro ao registrar. Verifique os dados e tente novamente.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/src/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      console.log('Login bem-sucedido:', data);
      // Armazenar o token e redirecionar após o login bem-sucedido
      localStorage.setItem('token', data.token);
      router.push('/'); // Exemplo de redirecionamento para a página inicial
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Autenticação - Loja de Roupas Moderna</title>
      </Head>
      <div className="relative w-full min-w-screen min-h-screen flex bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Container for Register */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isLogin ? 'hidden md:flex' : 'flex'}`}>
          <div>
            <h2 className="text-2xl font-bold mb-4">Registrar</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nome:</label>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Senha:</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
              >
                Registrar
              </button>
            </form>
          </div>
        </div>

        {/* Right Container for Login */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isLogin ? 'flex' : 'hidden md:flex'}`}>
          <div>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Senha:</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Image Container */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center md:w-1/2 bg-gray-100 transform transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-full' : ''}`}
          style={{ zIndex: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <img src="/login-image.jpg" alt="Login" className="w-full h-full object-cover" />
            <button
              onClick={toggleForm}
              className="absolute bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600 transition duration-300 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:bottom-8 md:right-8"
            >
              {isLogin ? 'Registrar' : 'Login'}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
