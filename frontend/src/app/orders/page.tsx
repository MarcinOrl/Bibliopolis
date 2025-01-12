'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";

interface Order {
  id: number;
  status: string;
  created_at: string;
  total_price: string;
  username: string; // Dodane pole username
}

interface OrderDetail {
  book_title: string;
  quantity: number;
  total_price: string;
}

const OrdersPage: React.FC = () => {
  const { userData, isAuthenticated } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(''); 
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const endpoint = "/orders/";
      apiClient.get(endpoint)
        .then(response => setOrders(response.data))
        .catch(error => console.error("Error loading orders:", error));
    }
  }, [isAuthenticated]);

  const handleViewDetails = (orderId: number) => {
    apiClient.get(`/orders/${orderId}/`)
      .then(response => {
        setSelectedOrder(response.data);
        setOrderDetails(response.data.items);
        setNewStatus(response.data.status);
        setIsModalOpen(true);
      })
      .catch(error => console.error("Error loading order details:", error));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  const handleStatusChange = (orderId: number) => {
    if (newStatus !== selectedOrder?.status) {
      apiClient.post(`/orders/${orderId}/update-status/`, { status: newStatus })
        .then(() => {
          setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          ));
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
          setIsModalOpen(false);
        })
        .catch(error => console.error("Error updating order status:", error));
    }
  };

  if (!userData) return <div>Ładowanie...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl py-4 font-semibold">Zamówienia</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="p-4 border rounded flex justify-between items-center primary-light accent-text shadow-lg">
            <div>
              <p>ID Zamówienia: {order.id}</p>
              <p>Użytkownik: {order.username}</p>
              <p>Status: {order.status}</p>
              <p>Data zamówienia: {new Date(order.created_at).toLocaleString()}</p>
              <p>Całkowita cena: {order.total_price} zł</p>
            </div>
            <button
              onClick={() => handleViewDetails(order.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Szczegóły
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="secondary-color rounded-lg shadow-lg p-6 w-96 max-w-lg space-y-6">
            <h2 className="text-xl font-semibold text-center mb-4 accent-color">Szczegóły zamówienia #{selectedOrder.id}</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg shadow-sm">
                <p className="font-medium accent-color">Użytkownik: <span className="font-normal">{selectedOrder.username}</span></p>
              </div>
              {orderDetails.map((item, index) => (
                <div key={index} className="primary-color p-4 rounded-lg shadow-sm">
                  <p className="font-medium accent-color">Tytuł książki: <span className="font-normal">{item.book_title}</span></p>
                  <p className="font-medium accent-color">Ilość: <span className="font-normal">{item.quantity}</span></p>
                  <p className="font-medium accent-color">Całkowita cena: <span className="font-normal">{item.total_price} zł</span></p>
                </div>
              ))}
            </div>

            {(userData.is_admin || userData.is_moderator) && (
              <div>
                <label htmlFor="status" className="block font-medium">Zmiana statusu zamówienia:</label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-lg cent accent-text secondary-color"
                >
                  <option value="pending">Oczekujące</option>
                  <option value="shipped">Wysłane</option>
                  <option value="delivered">Dostarczone</option>
                  <option value="cancelled">Anulowane</option>
                </select>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id)}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                >
                  Zmień status
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
