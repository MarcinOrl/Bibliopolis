'use client';

import { useEffect, useState } from "react";
import apiClient from "../../utils/api";
import { useSearchParams } from "next/navigation";  // Importujemy useSearchParams

interface Book {
  id: number;
  title: string;
}

const SearchPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const searchParams = useSearchParams();  // Pobieramy search params
  const searchQuery = searchParams.get('q');  // Pobieramy parametr q z URL

  useEffect(() => {
    if (searchQuery) {
      apiClient.get(`/books/?query=${searchQuery}`)
        .then(response => {
          setBooks(response.data);  // Ustawienie wyników wyszukiwania
        })
        .catch(error => {
          console.error('Błąd podczas wyszukiwania książek:', error);
        });
    }
  }, [searchQuery]);  // Wykonujemy efekt przy zmianie searchQuery

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Wyniki wyszukiwania dla: {searchQuery || "Brak zapytania"}
      </h1>
      <ul className="space-y-2 mb-4">
        {books.length > 0 ? (
          books.map(book => (
            <li key={book.id} className="p-2 border border-gray-300 rounded-lg shadow-sm">
              {book.title}
            </li>
          ))
        ) : (
          <li className="p-2 border border-gray-300 rounded-lg shadow-sm">
            Brak wyników dla {searchQuery || "Brak zapytania"}
          </li>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
