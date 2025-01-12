'use client';

import { useState } from 'react';
import apiClient from '../../utils/api';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== password2) {
      setError('Passwords must match.');
      return;
    }
  
    try {
      await apiClient.post('/register/', {
        username,
        email,
        password,
        password2,
      });
      router.push('/login');
    } catch (err) {
      setError('Registration error. Please try again.');
      console.error('Registration error:', err);
    }
  };  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Registration</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="w-full p-3 border secondary-color accent-text border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
