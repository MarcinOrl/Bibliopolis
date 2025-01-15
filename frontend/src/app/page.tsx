'use client';

import { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: string;
  image: string;
}

interface Event {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToAdd, setBookToAdd] = useState<Book | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    apiClient.get('/books/')
      .then(response => setBooks(response.data.slice(0, 3)))
      .catch(error => console.error(error));

    apiClient.get('/events/')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  const addToCart = (book: Book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const item = cart.find((item: { book: { id: number } }) => item.book.id === book.id);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Bibliopolis!</h1>
      <h2 className="text-2xl font-semibold text-center mb-6">Recommended Books</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {books.length === 0 ? (
          <p>No books to display.</p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="primary-light rounded-lg shadow-lg hover:shadow-xl transition-all w-full max-w-xs cursor-pointer"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-80 object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold accent-text">{book.title}</h3>
                <p className="text-sm accent-text">Author: {book.author}</p>
                <p className="text-xl font-bold mt-4 accent-text">{book.price} PLN</p>
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
          ))
        )}
      </div>

      {/* Wyświetlanie zdarzeń pod książkami */}
      <div className="mt-8">
        <div>
          {events.map((event, index) => (
            <div key={`${event.id}-${index}`} className="secondary-color shadow-md p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold accent-text">{event.description}</p>
                {event.action && (
                  <span className="bg-blue-500 accent-text text-xs py-1 px-3 rounded-full">{event.action}</span>
                )}
              </div>
              <small className="text-sm accent-text">{new Date(event.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>

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

export default HomePage;
