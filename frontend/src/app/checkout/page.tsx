"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";

const Checkout = () => {
  const { userData, isAuthenticated } = useUser();
  const [shippingAddress, setShippingAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setEmail(userData.email || "");
      setShippingAddress(userData.address || "");
      setCity(userData.city || "");
      setPostalCode(userData.postal_code || "");
      setPhoneNumber(userData.phone_number || "");
    }
  }, [isAuthenticated, userData, router]);

  const handleOrderSubmit = async () => {
    if (!firstName || !lastName || !email || !shippingAddress || !city || !postalCode || !phoneNumber) {
      setMessage("Please fill in all the required fields.");
      setMessageType("error");
      return;
    }
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const orderItems = cartData.map((item: any) => ({
      book: item.book.id,
      quantity: item.quantity,
    }));
  
    try {
      await apiClient.post('/order/', {
        shipping_address: shippingAddress,
        items: orderItems,
        first_name: firstName,
        last_name: lastName,
        email,
        city,
        postal_code: postalCode,
        phone_number: phoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      alert('The order has been placed!');
      localStorage.removeItem('cart');
      router.push('/orders');
    } catch (error) {
      console.error('Error placing the order:', error);
      setMessage("An error occurred while placing the order.");
      setMessageType("error");
    }
  };

  if (!userData) return <div>Ładowanie danych użytkownika...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="max-w-lg w-full secondary-color rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 accent-color">Checkout</h1>

        {message && (
          <div className={`text-center p-2 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white text-lg rounded-lg mb-4`}>
            {message}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="firstName" className="block text-lg font-semibold accent-color mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="lastName" className="block text-lg font-semibold accent-color mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-semibold accent-color mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="shippingAddress" className="block text-lg font-semibold accent-color mb-2">
            Shipping Address
          </label>
          <input
            type="text"
            id="shippingAddress"
            placeholder="Enter shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="city" className="block text-lg font-semibold accent-color mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="postalCode" className="block text-lg font-semibold accent-color mb-2">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-lg font-semibold accent-color mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 secondary-color"
          />
        </div>

        <button
          onClick={handleOrderSubmit}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
