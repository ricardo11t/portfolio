import { createContext, useEffect, useState } from "react";

export const ImagesContext = createContext({
    images: [],
}); 
export const ImagesProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    
    const fetchImages = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/images', {
                method: "GET",
            });

            if(!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();

            let imagesArray = [];
            
            if(data && Array.isArray(data)) {
                imagesArray = data;
            } else {
                console.warn("A resposta da API /api/images não é um array:", data);
            }

            setImages(imagesArray);
        } catch (e) {
            console.error("[ImagesProvider] Falha ao buscar imagens: ", e);
            setImages([]);
        }
    } 

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <ImagesContext.Provider value={{ images }}>
            {children}
        </ImagesContext.Provider>
    )
}
