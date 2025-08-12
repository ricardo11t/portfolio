import { NextFunction, Request, Response } from "express";
import ProjectService from "../services/projectsService";

export default class ProjectsController {
    public projectsService: ProjectService
    constructor(projectsService: ProjectService) {
        this.projectsService = projectsService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const projects = await this.projectsService.getAllProjects();
            res.status(200).json(projects); 
        } catch (e) {
            next(e); 
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
        const { title, description, details, image_url, github_url, demo_url, skill_ids } = req.body;

        if(!title || !description || !skill_ids) {
            res.status(400).json("Algum dos campos obrigatórios está vazio.");
        }

        const newProject = await this.projectsService.createProject(req.body, skill_ids);
        res.status(201).json(newProject);
        } catch (e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const updateFields = req.body;
            const result = await this.projectsService.editProjectsFields(id, updateFields);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body;
            if(!id) {
                res.status(400).json("O campo 'id' está vazio.");
            }
            const result = await this.projectsService.deleteProject(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}
