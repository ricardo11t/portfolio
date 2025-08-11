import React, { createContext, useEffect, useState } from "react";

type BufferInput = string | { data: Uint8Array | number[] };

interface ImageType {
  name: string;
  blob: BufferInput;
}

interface ImagesContextType {
  images: ImageType[];
}

interface ImagesProviderProps {
  children: React.ReactNode;
}

export const ImagesContext = createContext({} as ImagesContextType);

export const ImagesProvider = ({ children }: ImagesProviderProps) => {
  const [images, setImages] = useState<ImageType[]>([]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images");

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data: ImageType[] = await response.json();
      setImages(Array.isArray(data) ? data : []);

    } catch (e) {
      console.error("[ImagesProvider] Falha ao buscar imagens: ", e);
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <ImagesContext.Provider value={{ images }}>
      {children}
    </ImagesContext.Provider>
  );
};
