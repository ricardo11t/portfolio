import { IImages } from "../models/imagesModel";
import ImagesRepository from "../repositories/imagesRepository";

export default class ImagesService {
    public imagesRepository: ImagesRepository;
    constructor(imagesRepository: ImagesRepository) {
        if(!imagesRepository) {
            throw new Error("ImagesRepository é requerido.");
        }
        this.imagesRepository = imagesRepository; 
    }

    async getAllImages(): Promise<IImages[]> {
        const imagens = await this.imagesRepository.findAll();
        if (!imagens) {
            return [];
        }

        return imagens.map((imagem) => imagem.toClientJSON());
    }
    async addImage(name: string, blob: Buffer): Promise<IImages> {
        const existingImage = await this.imagesRepository.findByName(name);
        if(existingImage) {
            const error = new Error(`Imagem com o nome '${name}' já existe.`);
            throw error;
        }
        const newImage = await this.imagesRepository.create(name, blob);
        return newImage;
    }

    async deleteImage(name: string) {
        const wasDeleted = await this.imagesRepository.deleteImage(name);
        if(!wasDeleted) {
            const error = new Error(`Imagem com o nome '${name}' não achada ou não pode ser deletada.`);
            throw error;
        }
        return true;
    }
}
