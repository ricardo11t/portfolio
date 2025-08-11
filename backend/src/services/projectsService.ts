import { IProject } from "../models/projectsModel";
import ProjectRepository from "../repositories/projectsRepository";

export default class ProjectService {
    public projectRepository: ProjectRepository
    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async getAllProjects(): Promise<IProject[]> {
        return this.projectRepository.getAll();
    }
    
    async createProject(projectData: IProject, skillsId: number[]): Promise<IProject> {
        return this.projectRepository.create(projectData, skillsId);
    }

    async deleteProject(id: number) {
        const wasDeleted = await this.projectRepository.delete(id);
        if(!wasDeleted) {
            const error = new Error(`Projeto com o id = '${id}' não achado ou não pode ser deletado.`);
            throw error;
        }
        return true; 
    }
}
