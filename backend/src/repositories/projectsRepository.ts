import { IProject } from "../models/projectsModel";
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
                        iconurl: row.skill_iconurl,
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

    async create(projectData: IProject, skillsIds: number[]): Promise<IProject> {
        try {
            await connection.beginTransaction();

            const projectSql = 'INSERT INTO projects (title, description, details, image_url, github_url, demo_url) VALUES (?, ?, ?, ?, ?, ?)';
            const [projectResult] = await connection.execute(projectSql, [
                projectData.title,
                projectData.description,
                projectData.details,
                projectData.image_url,
                projectData.github_url,
                projectData.demo_url
            ].map(param => param === undefined ? null : param));

            const newProjectId = (projectResult as any).insertId;

            if(skillsIds && skillsIds.length > 0) {
                const projectSkillsSql = 'INSERT INTO project_skills (project_id, skill_id) VALUES ?';
                const values = skillsIds.map(skillId => [newProjectId, skillId]);
                await connection.query(projectSkillsSql, [values]);
            }

            await connection.commit();

            const newProject = await this.findById(newProjectId);

            if(!newProject) {
                throw new Error("Não foi possível encontrar o projeto recém-criado.");
            }

            return newProject;
        } catch (e) {
            await connection.rollback();
            console.error("[ProjectRepository create] Erro ao criar projeto: ", e);
            throw new Error("Falha ao criar projeto no banco de dados.");
        }
    }
}
