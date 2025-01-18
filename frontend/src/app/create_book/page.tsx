"use client";

import { useState, useEffect } from 'react';
import apiClient from '../../utils/api';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

const CreateBook: React.FC = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1000.00);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Pobieranie kategorii z backendu
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('description', description);
        formData.append('price', price.toString());
        formData.append('category', category.toString());
        if (image) formData.append('image', image);
    
        try {
            await apiClient.post('/books/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/profile');
        } catch (error) {
            console.error('Error creating book:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 secondary-color accent-text shadow-md rounded-lg">
            <h1 className="text-xl font-semibold py-4">Create New Book</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Title</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Author</label>
                    <input 
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full p-2 border rounded secondary-color accent-text"
                    />
                </div>
                <div>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Book'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBook;
