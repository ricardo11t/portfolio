import { NextFunction, Request, Response } from "express";
import ProjectService from "../services/projectsService";

export default class ProjectsController {
    public projectsService: ProjectService
    constructor(projectsService: ProjectService) {
        this.projectsService = projectsService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
        const { title, description, details, image_url, github_url, demo_url, skill_ids } = req.body;

        if(!title || !description || !skill_ids) {
            return res.status(400).json("Algum dos campos obrigatórios está vazio.");
        }

        const newProject = await this.projectsService.createProject(req.body, skill_ids);
        res.status(201).json(newProject);
        } catch (e) {
            next(e);
        }
    }
}
