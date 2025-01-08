'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "../../utils/UserContext";  // Przykładowy kontekst użytkownika
import axios from 'axios';
import Link from 'next/link';

const AddImageForm = () => {
  const { userData, isAuthenticated } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !userData?.is_admin) {
      router.push('/slider');
    }
  }, [isAuthenticated, userData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', image);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Zdjęcie zostało pomyślnie dodane!');
      setMessageType('success');
      setTitle('');
      setDescription('');
      setImage(null);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('There was an error adding the image:', error);
      setMessage('Wystąpił błąd podczas dodawania zdjęcia. Spróbuj ponownie.');
      setMessageType('error');

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dodaj nowe zdjęcie do slajdera</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg border">
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">Tytuł</label>
          <input
            type="text"
            id="title"
            placeholder="Wpisz tytuł zdjęcia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">Opis</label>
          <textarea
            id="description"
            placeholder="Wpisz opis zdjęcia"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">Wybierz zdjęcie</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Dodaj zdjęcie
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/slider" className="text-blue-500 hover:underline">
          Przejdź do Slajdera
        </Link>
      </div>
    </div>
  );
};

export default AddImageForm;
