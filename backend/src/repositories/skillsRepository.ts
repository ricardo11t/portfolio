import SkillsModel, { ISkills } from "../models/skillsModel";
import { DbClient } from "../utils/db";

export default class SkillsRepository {
    public db: DbClient;

    constructor(dbClient: DbClient) {
        this.db = dbClient
    }

    async getAll(): Promise<SkillsModel[] | null> {
        try {
            const { rows } = await this.db`
                SELECT * FROM skills;
                `;
            if(rows.length === 0) {
                return null;
            }
            return rows.map(row => new SkillsModel(row.id, row.name, row.iconUrl, row.category))
        } catch (e) {
            console.error(`[SkillsRepository getAll] Erro ao buscar skills.`);
            throw e;
        }
    }

    async findByName(name: string): Promise<SkillsModel | null> {
        try {
            const { rows } = await this.db`
                    SELECT * FROM skills WHERE \`name\` = ${name.toLowerCase().trim()}
                `;
            if(rows.length === 0) {
                return null;
            }
            const { id: id, name: skillName, iconurl: iconUrl, category: skillCategory } = rows[0];
            return new SkillsModel(id, skillName, iconUrl, skillCategory);
        } catch (e) {
            console.error("[SkillsRepository findByName] Erro ao buscar skill por nome.");
            throw e;
        }
    }

    async create(name: string, iconUrl: string, category: string): Promise<SkillsModel> {
        try {
            const result = await this.db`
                    INSERT INTO skills (\`name\`, \`iconurl\`, \`category\`)
                    VALUES (${name}, ${iconUrl.trim()}, ${category.toLowerCase().trim()});
                `
            const metadata = result.rows as any;
            const newId = metadata.insertId; 
            if(!newId) {
                throw new Error("Falha ao conseguir id da nova coluna criada.");
            }

            return new SkillsModel(newId, name, iconUrl, category);
        } catch (e) {
            throw new Error("[SkillsRepository create] Erro na adição de uma nova skill: ", e);
        }
    }

    async delete(name: string): Promise<Boolean> {
        try {
            const result = await this.db`
                    DELETE FROM skills WHERE \`name\` = ${name};
                `;
            const metadata = result.rows as any;
            return metadata.affectedRows > 0;
        } catch (e) {
            console.error("[SkillsRepository delete] Erro ao deletar skill: ", e);
            throw e;
        }
    }
}
