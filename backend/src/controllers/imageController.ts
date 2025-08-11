import { NextFunction, Request, Response } from "express";
import ImagesService from "../services/imageService";

export default class ImagesController {
    public imagesService: ImagesService

    constructor(imagesService: ImagesService) {
        this.imagesService = imagesService;
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const images = await this.imagesService.getAllImages();
            res.status(200).json(images);

        } catch (e) {
            next(e);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
        const { name, blob } = req.body;
        if(!name) {
            return res.status(400).json({message: 'Parâmetro "name" é obrigatório'});
        } if(!blob) {
            return res.status(400).json({message: "Parâmetro 'blob' é obrigatório"});
        }

        const newImage = await this.imagesService.addImage(name, blob);
        res.status(200).json(newImage);
        } catch (e) {
            next(e);
        }
    }

    async delete(req: Request, res:Response, next: NextFunction) {
        try {
                    const { name } = req.body;
        if(!name) {
            return res.status(400).json({message: 'Parâmetro "name" é obrigatório'});
        }
        const result = await this.imagesService.deleteImage(name);
        res.status(200).json(result);

        } catch (e) {
            next(e);
        }
    }
}
