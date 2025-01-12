'use client';

import { useState, useEffect } from 'react';
import { useUser } from "../../utils/UserContext";
import apiClient from "../../utils/api";
import { useRouter } from 'next/navigation';

const SliderOrderForm = () => {
  const { userData, isAuthenticated } = useUser();
  const [images, setImages] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [currentSlider, setCurrentSlider] = useState<number | null>(null);
  const [currentSliderImages, setCurrentSliderImages] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
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
    try {
      const response = await apiClient.post('/sliders/', {});
      setSliders((prevSliders) => [...prevSliders, response.data]);
      setMessage('Slajder został utworzony.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy tworzeniu slajdera:', error);
      setMessage('Błąd przy tworzeniu slajdera.');
      setMessageType('error');
    }
  };
  
  const handleDeleteSlider = async (sliderId: number) => {
    try {
      await apiClient.delete(`/sliders/${sliderId}`);
      setSliders((prevSliders) => prevSliders.filter((slider) => slider.id !== sliderId));
      setMessage('Slajder został usunięty.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy usuwaniu slajdera:', error);
      setMessage('Błąd przy usuwaniu slajdera.');
      setMessageType('error');
    }
  };
  
  const handleAddImageToSlider = async (imageId: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.post(`/sliders/${currentSlider}/add_image/`, { image_id: imageId });
      setMessage('Zdjęcie zostało dodane do slajdera.');
      setMessageType('success');
  
      const sliderDetailResponse = await apiClient.get(`/sliders/${currentSlider}`);
      setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
      console.error('Błąd przy dodawaniu zdjęcia do slajdera:', error);
      setMessage('Błąd przy dodawaniu zdjęcia do slajdera.');
      setMessageType('error');
    }
  };
  
  const handleRemoveImageFromSlider = async (imageId: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.post(`/sliders/${currentSlider}/`, { image_id: imageId });
      setMessage('Zdjęcie zostało usunięte ze slajdera.');
      setMessageType('success');
  
      const sliderDetailResponse = await apiClient.get(`/sliders/${currentSlider}`);
      setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
      console.error('Błąd przy usuwaniu zdjęcia ze slajdera:', error);
      setMessage('Błąd przy usuwaniu zdjęcia ze slajdera.');
      setMessageType('error');
    }
  };
  
  const handleOrderChange = async (imageId: number, newOrder: number) => {
    if (currentSlider === null) return;
  
    try {
      await apiClient.patch(`/sliders/${currentSlider}/update_order/`, { image_id: imageId, new_order: newOrder });
      setMessage('Kolejność zdjęć została zaktualizowana.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy zmianie kolejności zdjęć:', error);
      setMessage('Błąd przy zmianie kolejności zdjęć.');
      setMessageType('error');
    }
  };  

  const isImageAddedToSlider = (imageId: number) => {
    return currentSliderImages.some((image: any) => image.id === imageId);
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
        <button
          onClick={handleCreateSlider}
          className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Utwórz nowy slajder
        </button>
      </div>

      {/* Lista slajderów */}
      <div className="text-center mb-6">
        <h3>Wybierz slajder do edycji</h3>
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
            Usuń wybrany slajder
          </button>
        </div>
      )}

      {/* Edycja zdjęć w slajderze */}
      {currentSlider !== null && (
        <div>
          <h3>Zdjęcia w slajderze</h3>
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
                      Dodaj
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveImageFromSlider(image.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      Usuń
                    </button>
                  )}
                  <input
                    type="number"
                    placeholder="Kolejność"
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
