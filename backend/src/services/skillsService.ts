import { ISkills } from "../models/skillsModel";
import SkillsRepository from "../repositories/skillsRepository";

export default class SkillsService {
    public skillsRepository: SkillsRepository
    constructor(skillsRepository: SkillsRepository) {
        if(!skillsRepository) {
            throw new Error("SkillsRepository é requerido.");
        }
        this.skillsRepository = skillsRepository;
    }

    async getAllSkills(): Promise<ISkills[]> {
        const skills = await this.skillsRepository.getAll();
        if(!skills) {
            return [];
        }
        
        return skills;
    }

    async addNewSkill(name: string, iconUrl: string, category: string): Promise<ISkills> {
        const existingSkill = await this.skillsRepository.findByName(name);
        if(existingSkill) {
            const error = new Error(`[SkillsService addNewSkill] Skill com o nome '${name}' já existe.`);
            throw error;
        }
        const newImage = await this.skillsRepository.create(name, iconUrl, category);
        return newImage
    }

    async deleteSkill(name: string) {
        const wasDeleted = await this.skillsRepository.delete(name);
        if(!wasDeleted) {
            const error = new Error("[SkillsService deleteSkill] Erro ao deletar skill.");
            throw error;
        }
        return true;
    }
}
