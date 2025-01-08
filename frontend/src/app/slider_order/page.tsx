'use client';

import { useState, useEffect } from 'react';
import { useUser } from "../../utils/UserContext";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SliderOrderForm = () => {
  const { userData, isAuthenticated } = useUser();
  const [images, setImages] = useState<any[]>([]); // Przechowujemy wszystkie zdjęcia
  const [sliders, setSliders] = useState<any[]>([]); // Przechowujemy zestawy slajdów
  const [currentSlider, setCurrentSlider] = useState<number | null>(null); // Indeks aktualnie wybranego slajdera
  const [currentSliderImages, setCurrentSliderImages] = useState<any[]>([]); // Zdjęcia przypisane do slajdera
  const [message, setMessage] = useState<string | null>(null); // Komunikat o sukcesie lub błędzie
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null); // Typ komunikatu
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !userData?.is_admin) {
      router.push('/slider');
    }
  }, [isAuthenticated, userData, router]);

  // Ładowanie zdjęć i zestawów slajdów
  useEffect(() => {
    const fetchData = async () => {
      const imageResponse = await axios.get('http://127.0.0.1:8000/api/images/');
      setImages(imageResponse.data);

      const sliderResponse = await axios.get('http://127.0.0.1:8000/api/sliders/');
      setSliders(sliderResponse.data);

      if (currentSlider !== null) {
        const sliderDetailResponse = await axios.get(`http://127.0.0.1:8000/api/sliders/${currentSlider}`);
        setCurrentSliderImages(sliderDetailResponse.data.images);
      }
    };
    fetchData();
  }, [currentSlider]);

  // Funkcja do ustawiania aktywnego slajdera
  const handleSliderChange = (sliderId: number) => {
    setCurrentSlider(sliderId);
  };

  // Funkcja do tworzenia nowego slajdera
  const handleCreateSlider = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sliders/', {});
      setSliders((prevSliders) => [...prevSliders, response.data]);
      setMessage('Slajder został utworzony.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy tworzeniu slajdera:', error);
      setMessage('Błąd przy tworzeniu slajdera.');
      setMessageType('error');
    }
  };

  // Funkcja do usuwania slajdera
  const handleDeleteSlider = async (sliderId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/sliders/${sliderId}`);
      setSliders((prevSliders) => prevSliders.filter((slider) => slider.id !== sliderId));
      setMessage('Slajder został usunięty.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy usuwaniu slajdera:', error);
      setMessage('Błąd przy usuwaniu slajdera.');
      setMessageType('error');
    }
  };

  // Funkcja do dodania zdjęcia do slajdera (za pomocą POST)
  const handleAddImageToSlider = async (imageId: number) => {
    if (currentSlider === null) return;

    try {
      await axios.post(`http://127.0.0.1:8000/api/sliders/${currentSlider}/add_image/`, { image_id: imageId });
      setMessage('Zdjęcie zostało dodane do slajdera.');
      setMessageType('success');
      // Odświeżenie zdjęć przypisanych do slajdera
      const sliderDetailResponse = await axios.get(`http://127.0.0.1:8000/api/sliders/${currentSlider}`);
      setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
      console.error('Błąd przy dodawaniu zdjęcia do slajdera:', error);
      setMessage('Błąd przy dodawaniu zdjęcia do slajdera.');
      setMessageType('error');
    }
  };

  // Funkcja do usuwania zdjęcia ze slajdera
  const handleRemoveImageFromSlider = async (imageId: number) => {
    if (currentSlider === null) return;
    try {
        await axios.post(`http://127.0.0.1:8000/api/sliders/${currentSlider}/`, { image_id: imageId });

        setMessage('Zdjęcie zostało usunięte ze slajdera.');
        setMessageType('success');

        const sliderDetailResponse = await axios.get(`http://127.0.0.1:8000/api/sliders/${currentSlider}`);
        setCurrentSliderImages(sliderDetailResponse.data.images);
    } catch (error) {
        console.error('Błąd przy usuwaniu zdjęcia ze slajdera:', error);
        setMessage('Błąd przy usuwaniu zdjęcia ze slajdera.');
        setMessageType('error');
    }
};

  // Funkcja do zmiany kolejności zdjęć
  const handleOrderChange = async (imageId: number, newOrder: number) => {
    if (currentSlider === null) return;

    try {
      await axios.patch(`http://127.0.0.1:8000/api/sliders/${currentSlider}/update_order/`, { image_id: imageId, new_order: newOrder });
      setMessage('Kolejność zdjęć została zaktualizowana.');
      setMessageType('success');
    } catch (error) {
      console.error('Błąd przy zmianie kolejności zdjęć:', error);
      setMessage('Błąd przy zmianie kolejności zdjęć.');
      setMessageType('error');
    }
  };

  // Funkcja do sprawdzenia, czy zdjęcie jest już dodane do slajdera
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
