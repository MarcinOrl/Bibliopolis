"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: string;
  image: string;
}

interface CartItem {
  book: Book;
  quantity: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isAuthenticated } = useUser();
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);

    const bookIds = cartData.map((item: CartItem) => item.book.id);
    apiClient
      .get("/books/", { params: { ids: bookIds.join(",") } })
      .then((response) => {
        const booksData = response.data;

        const updatedCart = cartData.map((item: CartItem) => {
          const book = booksData.find((b: Book) => b.id === item.book.id);
          return { ...item, book };
        });
        setCart(updatedCart);

        let price = 0;
        updatedCart.forEach((item: CartItem) => {
          price += item.quantity * parseFloat(item.book.price);
        });

        setTotalPrice(parseFloat(price.toFixed(2)));
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const handleQuantityChange = (bookId: number, quantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.book.id === bookId) {
        item.quantity = quantity;
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    let price = 0;
    updatedCart.forEach((item: CartItem) => {
      price += item.quantity * parseFloat(item.book.price);
    });

    setTotalPrice(parseFloat(price.toFixed(2)));
  };

  const handleRemoveItem = (bookId: number) => {
    const updatedCart = cart.filter((item) => item.book.id !== bookId);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    let price = 0;
    updatedCart.forEach((item: CartItem) => {
      price += item.quantity * parseFloat(item.book.price);
    });

    setTotalPrice(parseFloat(price.toFixed(2)));
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty. Please add some items before proceeding.");
      setMessageType("error");
      return;
    }
  
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  
    router.push("/checkout");
  };

  return (
    <div className="flex justify-center p-6">
      <div className="max-w-6xl secondary-color rounded-lg shadow-lg p-8 w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Your cart</h1>

        {/* Lista książek w koszyku */}
        <div className="flex flex-col gap-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 border-b border-gray-300 rounded-lg"
            >
              <div className="flex-shrink-0 w-32 h-32">
                <img
                  src={item.book?.image || "/default-image.jpg"}
                  alt={item.book?.title || "Book"}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{item.book?.title || "Unknown Book"}</h3>
                <p className="text-gray-600">{item.book?.author || "Unknown Author"}</p>
              </div>
              <div className="text-lg font-medium">
                <p>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleQuantityChange(item.book.id, parseInt(e.target.value, 10))
                    }
                    className="ml-2 secondary-color accent-text w-16 p-1 border rounded"
                  />
                </p>
                <p>Price: {item.book?.price || "N/A"} PLN</p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.book.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Łączna cena */}
        <div className="mt-6 flex justify-between items-center text-2xl font-bold">
          <span>Total price:</span>
          <span>{totalPrice} zł</span>
        </div>

        {/* Przycisk składania zamówienia */}
        <div className="mt-8 text-center">
          {/* Komunikat o błędzie */}
          {message && messageType === "error" && (
            <div className="text-white bg-red-500 text-lg text-center rounded-lg mb-4">{message}</div>
          )}
          <button
            onClick={handleSubmitOrder}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
