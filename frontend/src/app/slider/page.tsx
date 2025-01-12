'use client';

import { useState, useEffect } from 'react';
import apiClient from "../../utils/api";
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useUser } from '../../utils/UserContext';

const SliderComponent: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [currentSlider, setCurrentSlider] = useState(0);
  const [sliders, setSliders] = useState<any[]>([]);
  const { userData } = useUser();

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await apiClient.get('/sliders/');
        setSliders(response.data);
        if (response.data.length > 0) {
          setCurrentSlider(0);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };
  
    fetchSliders();
  }, []);
  

  useEffect(() => {
    if (sliders[currentSlider]) {
      const fetchSliderImages = async () => {
        try {
          const sliderId = sliders[currentSlider].id;
          const response = await apiClient.get(`/sliders/${sliderId}/`);
          setImages(response.data.images || []);
        } catch (error) {
          console.error('Error fetching slider images:', error);
        }
      };
      fetchSliderImages();
    }
  }, [sliders, currentSlider]);
  

  // Funkcja ustawiająca wysokość kart na równą
  useEffect(() => {
    const setEqualHeight = () => {
      let maxHeight = 0;
      // Zbieramy wszystkie karty
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        const cardHeight = card.clientHeight;
        if (cardHeight > maxHeight) {
          maxHeight = cardHeight;
        }
      });

      // Ustawiamy maksymalną wysokość na wszystkie karty
      cards.forEach((card) => {
        (card as HTMLElement).style.height = `${maxHeight}px`;
      });
    };

    // Uruchamiamy funkcję przy załadowaniu komponentu i przy zmianie slajdu
    setEqualHeight();
    window.addEventListener('resize', setEqualHeight); // Po resize okna
    return () => window.removeEventListener('resize', setEqualHeight);
  }, [images, currentSlider]);

  // Ustawienia dla slidera
  const settings = {
    infinite: true,
    slidesToShow: 3,  // 3 obrazy na raz
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };
  
  return (
    <div className="slider-container py-10">
      {userData?.is_admin && (
        <div className="mb-4 text-center flex justify-center gap-4">
          <Link href="/add_image">
            <button className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">
              Dodaj zdjęcie
            </button>
          </Link>
          <Link href="/slider_order">
            <button className="bg-yellow-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all">
              Zarządzaj slajderami
            </button>
          </Link>
        </div>
      )}

      <div className="text-center mb-4">
        {sliders.map((slider: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlider(index)}
            className={`px-4 py-2 mx-2 rounded-lg bg-green-500 text-white`}
          >
            Zestaw {index + 1}
          </button>
        ))}
      </div>

      <div className="slider-wrapper">
        {images.length === 0 ? (
          <p className="text-center">Brak zdjęć w tym slajderze</p>
        ) : (
          <Slider {...settings}>
            {images.map((image: any) => (
              <div key={image.id} className="card">
                <img
                  src={`http://127.0.0.1:8000${image.image}`}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="description">
                  <h2>{image.title}</h2>
                  <p>{image.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default SliderComponent;
