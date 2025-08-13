import { EDITIProject, IProject } from "../models/projectsModel";
import { connection, DbClient } from "../utils/db";

export default class ProjectRepository {
    public db: DbClient;
    constructor(dbClient: DbClient) {
        this.db = dbClient;
    }

    async getAll(): Promise<IProject[] | null> {
        try {
            const { rows } = await this.db`
                SELECT
                    p.id,
                    p.title,
                    p.description,
                    p.details,
                    p.image_url,
                    p.github_url,
                    p.demo_url,
                    s.id as skill_id,
                    s.name as skill_name,
                    s.iconurl as skill_iconurl,
                    s.category as skill_category
                FROM
                    projects p
                LEFT JOIN
                    project_skills ps ON p.id = ps.project_id
                LEFT JOIN
                    skills s ON ps.skill_id = s.id
                ORDER BY
                    p.id;
            `;

            if (rows.length === 0) {
                return null;
            }

            const projectsMap: { [key: number]: IProject } = {};

            for (const row of rows) {
                if (!projectsMap[row.id]) {
                    projectsMap[row.id] = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        details: row.details,
                        image_url: row.image_url,
                        github_url: row.github_url,
                        demo_url: row.demo_url,
                        skills: []
                    };
                }

                if (row.skill_id) {
                    projectsMap[row.id].skills.push({
                        id: row.skill_id,
                        name: row.skill_name,
                        iconUrl: row.skill_iconurl,
                        category: row.skill_category
                    });
                }
            }

            return Object.values(projectsMap);

        } catch (e) {
            console.error("[ProjectsRepository getAll] Erro ao buscar todos os projetos: ", e);
            throw e;
       }
    }

    async findById(id: number): Promise<IProject | null> {
        try {
            const { rows } = await this.db`
                SELECT
                    p.id, p.title, p.description, p.details, p.image_url,
                    p.github_url, p.demo_url,
                    s.id as skill_id, s.name as skill_name, s.iconurl as skill_iconurl,
                    s.category as skill_category
                FROM
                    projects p
                LEFT JOIN
                    project_skills ps ON p.id = ps.project_id
                LEFT JOIN
                    skills s ON ps.skill_id = s.id
                WHERE
                    p.id = ${id};
            `

            if(rows.length === 0) {
                return null;
            }

            const project: IProject = {
                id: rows[0].id,
                title: rows[0].title,
                description: rows[0].description,
                details: rows[0].details,
                image_url: rows[0].image_url,
                github_url: rows[0].github_url,
                demo_url: rows[0].demo_url,
                skills: []
            };

            for(const row of rows) {
                if(row.skill_id) {
                    project.skills.push({
                        id: row.skill_id,
                        name: row.skill_name,
                        iconUrl: row.skill_iconurl,
                        category: row.skill_category
                    });
                }
            }

            return project;
        } catch (e) {
            console.error(`[ProjectsRepository findById] Erro ao buscar projeto com ID ${id}: `, e);
            throw e;
        }
    }

    async create(projectData: any, skillIds: number[]) {
        const conn = await connection.getConnection(); 

        try {
            await conn.beginTransaction();

            const { title, description, details, image_url, github_url, demo_url } = projectData;

            const projectSql = `
                INSERT INTO projects (title, description, details, image_url, github_url, demo_url) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [projectResult] = await conn.execute(projectSql, [title, description, details, image_url, github_url, demo_url]);
        
            const projectId = (projectResult as any).insertId;

            if (skillIds && skillIds.length > 0) {
                const projectSkillsSql = 'INSERT INTO project_skills (project_id, skill_id) VALUES ?';
                const values = skillIds.map(skillId => [projectId, skillId]);
                await conn.query(projectSkillsSql, [values]);
            }

            await conn.commit();

            return { id: projectId, ...projectData };

        } catch (error) {
            await conn.rollback();
            console.error("[ProjectRepository create] Erro na transação: ", error);
            throw error;

        } finally {
            conn.release();
        }
    }

    async updateFields(id: number, updatedFields: Partial<Omit<IProject, 'id'>>) {
        const conn = await connection.getConnection(); 
        try {
            await conn.beginTransaction();

            const { skills, ...projectFields } = updatedFields;

            if(Object.keys(projectFields).length > 0) {
                const updateProjectSQL = 'UPDATE projects SET ? WHERE id = ?';
                await conn.query(updateProjectSQL, [projectFields, id]);
            }
        
            if(skills !== undefined) {
                const deleteSkillsSQL = 'DELETE FROM project_skills WHERE project_id = ?';
                await conn.query(deleteSkillsSQL, [id]);
                if(skills.length > 0) {
                    const insertSkillsSQL = 'INSERT INTO project_skills WHERE project_id = ?';
                    const values = skills.map(skillId => [id, skillId]);
                    await conn.query(insertSkillsSQL, [values]);
                }
            }
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            console.error("[ProjectsRepository update] Erro ao editar projeto: ", e);
            throw new Error("Falha ao editar projeto no banco de dados.");
        } finally {
            conn.release();
        }
    }

    async delete(id: number): Promise<Boolean> {
        try {
            const result = await this.db`
                    DELETE FROM projects WHERE \`id\` = ${id};    
                `;
            const metadata = result.rows as any; 
            
            return metadata.affectedRows > 0;
        } catch (e) {
            console.error("[ProjectsRepository delete] Erro ao deletar projeto: ", e);
            throw new Error("Falha ao deletar projeto no banco de dados.");
        }
    }
}
