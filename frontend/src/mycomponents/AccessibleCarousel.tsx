import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarouselImage {
  name: string;
  src: string | null;
  id?: number;
}

interface AccessibleCarouselProps {
  images: CarouselImage[];
}

export default function AccessibleCarousel({ images }: AccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (!images || images.length === 0) return 0;
      return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(goToNext, 6000);
    return () => clearInterval(intervalId);
  }, [images.length, goToNext]);

  if (!images || images.length === 0) {
    return <div className="text-zinc-400">Nenhuma imagem para exibir.</div>;
  }
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full h-full group overflow-hidden rounded-xl" role="region" aria-label="Galeria de Imagens">
      
      <div className="w-full h-full flex items-center justify-center">
        {currentImage && currentImage.src ? (
          <img
            key={currentImage.name || currentIndex}
            src={currentImage.src}
            alt={currentImage.name}
            className="block w-full h-full object-contain transition-opacity duration-500"
          />
        ) : (
          <div className="text-zinc-400">Imagem indisponível</div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-3 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Imagem Anterior"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Próxima Imagem"
          >
            <ArrowRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir para a imagem ${slideIndex + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
