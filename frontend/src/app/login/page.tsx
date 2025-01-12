'use client';

import { useState } from 'react';
import apiClient from '../../utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await apiClient.post('/login/', {
        username,
        password,
      });
  
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      window.location.href = '/';
    } catch (err) {
      setError('Błąd logowania. Sprawdź dane.');
      console.error('Błąd logowania:', err);
    }
  };  

  return (
    <div className="flex min-h-screen">
      {/* Lewa strona - formularz logowania */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold accent-text accent-text mb-6 text-center">Zaloguj się</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Zaloguj się
          </button>
        </form>
      </div>
  
      {/* Prawa strona - link do rejestracji */}
      <div className="w-full md:w-1/2 p-8 secondary-color accent-text flex flex-col justify-center items-center rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Nie masz konta?</h2>
        <p className="mb-6 text-center">
          Załóż konto, aby móc korzystać z naszej platformy.
        </p>
        <Link
          href="/register"
          className="px-6 py-3 bg-blue-500 rounded-lg text-white text-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Załóż konto
        </Link>
      </div>
    </div>
  );  
};

export default Login;
