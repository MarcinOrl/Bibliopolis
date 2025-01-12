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
  
  useEffect(() => {
    const setEqualHeight = () => {
      let maxHeight = 0;
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        const cardHeight = card.clientHeight;
        if (cardHeight > maxHeight) {
          maxHeight = cardHeight;
        }
      });

      cards.forEach((card) => {
        (card as HTMLElement).style.height = `${maxHeight}px`;
      });
    };

    setEqualHeight();
    window.addEventListener('resize', setEqualHeight);
    return () => window.removeEventListener('resize', setEqualHeight);
  }, [images, currentSlider]);

  const settings = {
    infinite: true,
    slidesToShow: 3,
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
              Add Image
            </button>
          </Link>
          <Link href="/slider_edit">
            <button className="bg-blue-500 px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">
              Manage Sliders
            </button>
          </Link>
        </div>
      )}

      <div className="text-center mb-4">
        {sliders.map((slider: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlider(index)}
            className={`border border-green-500  px-4 py-2 mx-2 rounded-lg accent-text primary-color`}
          >
            Slider{index + 1}
          </button>
        ))}
      </div>
      <div className="slider-wrapper">
        {images.length === 0 ? (
          <p className="text-center">No images in this slider</p>
        ) : (
          <Slider {...settings}>
            {images.map((image: any) => (
              <div key={image.id} className="card shadow-lg">
                <img
                  src={image.image}
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
