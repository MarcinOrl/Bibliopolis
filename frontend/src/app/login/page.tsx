'use client';

import { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      window.location.href = '/';
    } catch (err) {
      setError('Błąd logowania. Sprawdź dane.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lewa strona - formularz logowania */}
      <div className="w-1/2 p-8 bg-gray-100 flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">Zaloguj się</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Zaloguj się
          </button>
        </form>
      </div>

      {/* Prawa strona - link do rejestracji */}
      <div className="w-1/2 p-8 bg-gray-800 text-white flex flex-col justify-center items-center">
        <h2 className="text-x1 font-bold mb-4">
          Nie masz konta?
        </h2>
        <p className="mb-4">
          Załóź konto, aby móc korzystać z naszej platformy.
        </p>
        <Link href="/register" className="px-4 py-2 bg-blue-500 rounded">
          Załóż konto
        </Link>
      </div>
    </div>
  );
};

export default Login;
