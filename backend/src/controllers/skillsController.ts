import { NextFunction, Request, Response } from "express";
import SkillsService from "../services/skillsService";

export default class SkillsController {
    public skillsService: SkillsService;
    constructor(skillsService: SkillsService) {
        if(!skillsService) {
            throw new Error("SkillsService é requerido.");
        }
        this.skillsService = skillsService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const skills = await this.skillsService.getAllSkills();
            res.status(200).json(skills);
        } catch (e) {
            next(e);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
        const { name, iconUrl, category } = req.body;
        if(!name) {
            return res.status(400).json("O parâmetro 'name' é requerido.");
        } if(!iconUrl){
            return res.status(400).json("O parâmetro 'iconUrl' é requerido.");
        } if(!category) {
            return res.status(400).json("O parâmetro 'category' é requerido.");
        }
        const newSkill = await this.skillsService.addNewSkill(name, iconUrl, category);
        return res.status(200).json(newSkill);

        } catch (e) {
            next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
        const { name } = req.body;
        if(!name) {
            return res.status(400).json("O parâmetro 'name' é requerido.");
        }
        const result = await this.skillsService.deleteSkill(name);
        return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}
