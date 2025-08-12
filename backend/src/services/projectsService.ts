import { EDITIProject, IProject } from "../models/projectsModel";
import ProjectRepository from "../repositories/projectsRepository";

export default class ProjectService {
    public projectRepository: ProjectRepository
    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async getAllProjects(): Promise<IProject[] | null> {
        return this.projectRepository.getAll();
    }
    
    async createProject(projectData: IProject, skillsId: number[]): Promise<IProject> {
        return this.projectRepository.create(projectData, skillsId);
    }

    async editProjectsFields(id: number, updatedFields: EDITIProject) {
        if(!id) {
            throw new Error("O ID do projeto é obrigatório.");
        }
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            throw new Error("Pelo menos um campo para atualizar deve ser fornecido.");
        }
        return this.projectRepository.updateFields(id, updatedFields);
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
