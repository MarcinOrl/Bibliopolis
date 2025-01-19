'use client';

import { useState, useEffect } from 'react';
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";
import { useRouter } from 'next/navigation';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface SliderModel {
  id: number;
  title: string;
  is_default: boolean;
  images: GalleryImage[];
}

const SliderOrderForm = () => {
  const { userData, isAuthenticated } = useUser();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [sliders, setSliders] = useState<SliderModel[]>([]);
  const [currentSlider, setCurrentSlider] = useState<number | null>(null);
  const [currentSliderImages, setCurrentSliderImages] = useState<GalleryImage[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [sliderTitle, setSliderTitle] = useState<string>(''); // Stan dla tytułu slajdera
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !userData?.is_admin) {
      router.push('/slider');
    }
  }, [isAuthenticated, userData, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageResponse = await apiClient.get('/images/');
        setImages(imageResponse.data);
  
        const sliderResponse = await apiClient.get('/sliders/');
        setSliders(sliderResponse.data);
  
        if (currentSlider !== null) {
          const sliderDetailResponse = await apiClient.get(`/sliders/${currentSlider}`);
          setCurrentSliderImages(sliderDetailResponse.data.images);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [currentSlider]);
  
  const handleSliderChange = (sliderId: number) => {
    setCurrentSlider(sliderId);
  };

  const handleCreateSlider = async () => {
    if (!sliderTitle) {
      setMessage('Please enter a title for the slider.');
      setMessageType('error');
      return;
    }
    
    try {
      const response = await apiClient.post('/sliders/', { title: sliderTitle }); // Przesyłanie tytułu
      setSliders((prevSliders) => [...prevSliders, response.data]);
      setMessage('The slider has been created.');
      setMessageType('success');
      setSliderTitle(''); // Reset tytułu po utworzeniu slajdera
    } catch (error) {
      console.error('Error creating the slider.', error);
      setMessage('Error creating the slider.');
      setMessageType('error');
    }
  };
  
  const handleDeleteSlider = async (sliderId: number) => {
    try {
      await apiClient.delete(`/sliders/${sliderId}`);
      setSliders((prevSliders) => prevSliders.filter((slider) => slider.id !== sliderId));
      setMessage('The slider has been deleted.');
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting the slider.', error);
      setMessage('Error deleting the slider.');
      setMessageType('error');
    }
  };
  
  const handleAddImageToSlider = async (imageId: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.post(`/sliders/${currentSlider}/add_image/`, { image_id: imageId });
      setMessage('Image has been added to the slider.');
      setMessageType('success');
  
      const sliderDetailResponse = await apiClient.get(`/sliders/${currentSlider}`);
      setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
      console.error('Error adding image to the slider.', error);
      setMessage('Error adding image to the slider.');
      setMessageType('error');
    }
  };
  
  const handleRemoveImageFromSlider = async (imageId: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.post(`/sliders/${currentSlider}/`, { image_id: imageId });
      setMessage('Image has been removed from the slider.');
      setMessageType('success');
  
      const sliderDetailResponse = await apiClient.get(`/sliders/${currentSlider}`);
      setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
      console.error('Error removing image from the slider.', error);
      setMessage('Error removing image from the slider.');
      setMessageType('error');
    }
  };
  
  const handleOrderChange = async (imageId: number, newOrder: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.patch(`/sliders/${currentSlider}/update_order/`, { image_id: imageId, new_order: newOrder });
      setMessage('Image order has been updated.');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating image order.', error);
      setMessage('Error updating image order.');
      setMessageType('error');
    }
  };  

  const isImageAddedToSlider = (imageId: number) => {
    return currentSliderImages.some((image: GalleryImage) => image.id === imageId);
  };

  return (
    <div className="slider-container py-10">
      {/* Komunikat o sukcesie lub błędzie */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center ${messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message}
        </div>
      )}

      {/* Przycisk do tworzenia nowego slajdera */}
      <div className="text-center mb-6">
        <input
          type="text"
          value={sliderTitle}
          onChange={(e) => setSliderTitle(e.target.value)}
          placeholder="Enter slider title"
          className="px-4 py-2 mx-2 border rounded-lg mb-4 secondary-color accent-text"
        />
        <button
          onClick={handleCreateSlider}
          className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Create New Slider
        </button>
      </div>

      {/* Lista slajderów */}
      <div className="text-center mb-6">
        <h3>Select a slider to edit</h3>
        {sliders.map((slider) => (
          <button
            key={slider.id}
            onClick={() => handleSliderChange(slider.id)}
            className={`px-4 py-2 mx-2 rounded-lg ${currentSlider === slider.id ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {slider.title}
          </button>
        ))}
      </div>

      {/* Przycisk usuwania slajdera */}
      {currentSlider !== null && (
        <div className="text-center mb-6">
          <button
            onClick={() => handleDeleteSlider(currentSlider)}
            className="bg-red-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
          >
            Delete selected slider
          </button>
        </div>
      )}

      {/* Edycja zdjęć w slajderze */}
      {currentSlider !== null && (
        <div>
          <h3>Images in the slider</h3>
          <ul className="space-y-4">
            {images.map((image) => (
              <li key={image.id} className="flex justify-between items-center space-x-4">
                <div className="w-16 h-16 overflow-hidden rounded-lg">
                  <img
                    src={`http://127.0.0.1:8000${image.image}`}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-lg font-medium text-gray-700">{image.title}</div>

                {/* Przyciski do dodawania/usuwania zdjęcia oraz zmiany kolejności */}
                <div className="flex items-center space-x-2">
                  {!isImageAddedToSlider(image.id) ? (
                    <button
                      onClick={() => handleAddImageToSlider(image.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveImageFromSlider(image.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    type="number"
                    placeholder="No."
                    onChange={(e) => handleOrderChange(image.id, +e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                    style={{ width: '60px' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SliderOrderForm;
