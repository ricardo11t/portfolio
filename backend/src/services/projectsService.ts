import { IProject } from "../models/projectsModel";
import ProjectRepository from "../repositories/projectsRepository";

export default class ProjectService {
    public projectRepository: ProjectRepository
    constructor(projectRepository: ProjectRepository) {
        this.projectRepository = projectRepository;
    }
    
    async createProject(projectData: IProject, skillsId: number[]): Promise<IProject> {
        return this.projectRepository.create(projectData, skillsId);
    }
}
