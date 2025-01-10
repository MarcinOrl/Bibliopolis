'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter do nawigacji

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

const BooksPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Pobieranie kategorii
    fetch('http://localhost:8000/api/categories/')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (selectedCategory === null) {
      // Pobieranie wszystkich książek
      fetch('http://localhost:8000/api/books/')
        .then((res) => res.json())
        .then((data) => setBooks(data));
    } else {
      // Pobieranie książek z wybranej kategorii
      fetch(`http://localhost:8000/api/books/?category=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => setBooks(data));
    }
  }, [selectedCategory]);

  return (
    <div className="flex">
      {/* Lewa kolumna z kategoriami */}
      <aside className="p-4 h-fit shadow-md secondary-color">
        <h2 className="text-xl font-bold mb-4">Kategorie</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer px-3 py-2 rounded ${
              selectedCategory === null ? 'bg-blue-500 text-white' : 'text-blue-500'
            }`}
          >
            Wszystkie
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer px-3 py-2 rounded ${
                selectedCategory === category.id ? 'bg-blue-500 text-white' : 'text-blue-500'
              }`}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Główna sekcja z książkami */}
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory ? 'Książki z wybranej kategorii' : 'Wszystkie książki'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg shadow hover:shadow-lg transition-all overflow-hidden cursor-pointer"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-80 object-contain primary-light"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-sm">Autor: {book.author}</p>
                <p className="text-xl font-bold mt-4">{book.price} zł</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BooksPage;