'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../utils/api';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToAdd, setBookToAdd] = useState<Book | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const endpoint = selectedCategory === null 
          ? '/books/' 
          : `/books/?category=${selectedCategory}`;
        const response = await apiClient.get(endpoint);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, [selectedCategory]);

  const addToCart = (book: Book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const item = cart.find((item: { book: { id: number } }) => item.book.id === book.id);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Otwórz modal po dodaniu książki do koszyka
    setBookToAdd(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="flex">
      {/* Lewa kolumna z kategoriami */}
      <aside className="p-4 h-fit shadow-md secondary-color">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer px-3 py-2 rounded ${
              selectedCategory === null ? 'bg-blue-500 accent-text' : 'accent-text'
            }`}
          >
            All
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer px-3 py-2 rounded ${
                selectedCategory === category.id ? 'bg-blue-500 accent-text' : 'accent-text'
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
          {selectedCategory ? 'Books from the selected category' : 'All books'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="primary-light rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-80 object-contain primary-light"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-sm">Author: {book.author}</p>
                <p className="text-xl font-bold mt-4">{book.price} PLN</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(book);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mt-4"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && bookToAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="secondary-color p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">The book has been added to the cart</h2>
            <div className="flex gap-4 items-center">
              <img
                src={bookToAdd.image}
                alt={bookToAdd.title}
                className="w-20 h-32 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold">{bookToAdd.title}</h3>
                <p>{bookToAdd.price} PLN</p>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={goToCart}
                className="bg-blue-500 accent-text px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Go to Cart
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 accent-text px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
