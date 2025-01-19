'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import apiClient from "../../../utils/api";
import { useUser } from "../../../utils/UserContext";


interface Category {
  id: number;
  name: string;
  moderators: number[];
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: string;
  image: string;
  category: Category;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  user: string;
  created_at: string;
  approved: boolean;
}

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { isAuthenticated, userData } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDescription, setEditDescription] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchBookDetails = async () => {
        try {
          const response = await apiClient.get(`/books/${id}/`);
          setBook(response.data);
          console.log('Book response:', response.data);
        } catch (error) {
          console.error('Error fetching book:', error);
        }
      };
      fetchBookDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/books/${id}/comments/`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleApproveComment = async (commentId: number) => {
    try {
      const response = await apiClient.post(`/comments/${commentId}/approve/`);
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, approved: true } : comment
      ));
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      const response = await apiClient.post(`/comments/${commentId}/reject/`);
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, approved: false } : comment
      ));
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const handleSaveDescription = async () => {
    if (editDescription) {
      try {
        const response = await apiClient.put(`/books/${id}/`, { description: editDescription });
        setBook(response.data);
        setEditDescription(null);
      } catch (error) {
        console.error('Error saving description:', error);
      }
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find((item: { book: { id: number } }) => item.book.id === book?.id);
    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ book, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add a comment.");
      return;
    }
    try {
      const response = await apiClient.post(`/books/${id}/comments/`, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!book) {
    return <div>Loading book...</div>;
  }
  {console.log("Moderators for book:", book.category.id)}
  {console.log("Current user ID:", userData?.id)}

  return (
    <div className="flex justify-center p-6">
      <div className="max-w-6xl secondary-color rounded-lg shadow-lg p-8">
        {/* Sekcja z detalami książki */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <img src={book.image} alt={book.title} className="w-full lg:w-96 h-auto object-contain rounded shadow" />
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-lg accent-text mb-2">Author: <span className="font-semibold">{book.author}</span></p>
            <p className="accent-text text-base mb-6" dangerouslySetInnerHTML={{ __html: book.description }} />
            {userData?.is_admin || (userData?.is_moderator && book.category?.moderators?.includes(userData.id)) ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Edit description</h2>
                <textarea
                  value={editDescription ?? book.description}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4 secondary-color accent-text"
                  rows={4}
                />
                <button
                  onClick={handleSaveDescription}
                  className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                  Save Description
                </button>
              </div>
            ) : null}
            <p className="text-2xl font-bold text-green-700 mb-6">{book.price} PLN</p>
            <button onClick={addToCart} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
              Add to cart
            </button>
          </div>
        </div>

        {/* Sekcja komentarzy */}
        <div className="mt-12">
          <h2 className="text-2xl accent-text font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded-lg accent-text shadow">
                <p className="font-semibold">{comment.username}</p>
                <p>{comment.content}</p>
                <small className="text-sm accent-text">{new Date(comment.created_at).toLocaleString()}</small>
                
                {/* Zatwierdzanie lub odrzucanie komentarza przez admina/moda */}
                {(userData?.is_admin || 
                  (userData?.is_moderator && book.category?.moderators?.includes(userData.id))) && (
                  <div className="mt-2 flex gap-2">
                    {/* Przycisk Approve tylko, gdy komentarz czeka na zatwierdzenie */}
                    {comment.approved === null && (
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    {/* Przycisk Reject tylko, gdy komentarz czeka na zatwierdzenie */}
                    {comment.approved === null && (
                      <button
                        onClick={() => handleRejectComment(comment.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    )}
                    {comment.approved && <span className="text-green-500">Approved</span>}
                    {comment.approved === false && <span className="text-red-500">Rejected</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <textarea
            className="w-full mt-4 p-2 border rounded-lg secondary-dark accent-text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment} className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
            Add Comment
          </button>
        </div>

        {/* Modal z powiadomieniem o dodaniu książki */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="secondary-color p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">The book has been added to the cart</h2>
              <div className="flex gap-4 items-center">
                <img src={book.image} alt={book.title} className="w-20 h-32 object-contain" />
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p>{book.price} zł</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button onClick={goToCart} className="bg-blue-500 accent-text px-6 py-2 rounded hover:bg-blue-600 transition">
                  Go to cart
                </button>
                <button onClick={closeModal} className="bg-gray-500 accent-text px-6 py-2 rounded hover:bg-gray-400 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
