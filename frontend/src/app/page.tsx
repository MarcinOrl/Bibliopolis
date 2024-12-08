'use client';

import { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
}

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    apiClient.get('/books/')
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Lista książek */}
      <h1 className="text-2xl font-bold mb-4">Lista książek</h1>
      <ul className="space-y-2 mb-4">
        {books.map(book => (
          <li key={book.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
