'use client';

import { useEffect, useState } from "react";
import apiClient from "../../utils/api";
import { useSearchParams } from "next/navigation";

interface Book {
  id: number;
  title: string;
}

const SearchPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    if (searchQuery) {
      apiClient.get(`/books/?query=${searchQuery}`)
        .then(response => {
          setBooks(response.data);
        })
        .catch(error => {
          console.error('Błąd podczas wyszukiwania książek:', error);
        });
    }
  }, [searchQuery]);

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
