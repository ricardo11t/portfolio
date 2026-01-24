import express, { Router } from "express";
import type { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import ImagesController from "./controllers/imageController";
import ImagesRepository from "./repositories/imagesRepository";
import ImagesService from "./services/imageService";
import { sql as dbSqlFunction } from "./utils/db";
import { authMidleware } from "./shared/authMiddleware";
import SkillsRepository from "./repositories/skillsRepository";
import SkillsService from "./services/skillsService";
import SkillsController from "./controllers/skillsController";
import ProjectRepository from "./repositories/projectsRepository";
import ProjectService from "./services/projectsService";
import ProjectsController from "./controllers/projectsController";

// Imagens //

const imagesRepository = new ImagesRepository(dbSqlFunction);
const imagesService = new ImagesService(imagesRepository);
const imagesController = new ImagesController(imagesService);

// Skills //

const skillsRepository = new SkillsRepository(dbSqlFunction);
const skillsService = new SkillsService(skillsRepository);
const skillsController = new SkillsController(skillsService);

// Projects //

const projectsRepository = new ProjectRepository(dbSqlFunction);
const projectsService = new ProjectService(projectsRepository);
const projectsController = new ProjectsController(projectsService);

const app = express();
const router = Router();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

const swaggerDocument = {
    openapi: "3.0.3",
    info: {
        title: "Portfolio API",
        version: "1.0.0",
        description: "Documentação da API do portfólio"
    },
    servers: [
        {
            url: `${API_BASE_URL}/api`
        }
    ],
    tags: [
        { name: "Images", description: "Gerenciamento de imagens" },
        { name: "Skills", description: "Gerenciamento de skills" },
        { name: "Projects", description: "Gerenciamento de projetos" }
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "Use: ApiKey {SUA_CHAVE}"
            }
        },
        schemas: {
            Image: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "logo.png" },
                    blob: { type: "string", example: "data:image/png;base64,..." }
                }
            },
            Skill: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "TypeScript" },
                    iconUrl: { type: "string", example: "https://.../ts.svg" },
                    category: { type: "string", example: "frontend" }
                }
            },
            Project: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    title: { type: "string", example: "Portfolio" },
                    description: { type: "string", example: "Meu projeto pessoal" },
                    details: { type: "string", example: "Detalhes do projeto" },
                    image_url: { type: "string", example: "https://.../image.png" },
                    github_url: { type: "string", example: "https://github.com/..." },
                    demo_url: { type: "string", example: "https://..." },
                    skill_ids: { type: "array", items: { type: "integer", example: 1 } }
                }
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    status: { type: "string", example: "error" },
                    statusCode: { type: "integer", example: 400 },
                    message: { type: "string", example: "Mensagem de erro" }
                }
            }
        }
    },
    paths: {
        "/images": {
            get: {
                tags: ["Images"],
                summary: "Lista todas as imagens",
                responses: {
                    "200": {
                        description: "Lista de imagens",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Image" } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Images"],
                summary: "Cria uma imagem",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "blob"],
                                properties: {
                                    name: { type: "string" },
                                    blob: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Imagem criada" },
                    "400": { description: "Parâmetros inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            },
            delete: {
                tags: ["Images"],
                summary: "Remove uma imagem",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name"],
                                properties: {
                                    name: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Imagem removida" },
                    "400": { description: "Parâmetro inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            }
        },
        "/skills": {
            get: {
                tags: ["Skills"],
                summary: "Lista todas as skills",
                responses: {
                    "200": {
                        description: "Lista de skills",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Skill" } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Skills"],
                summary: "Cria uma skill",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "iconUrl", "category"],
                                properties: {
                                    name: { type: "string" },
                                    iconUrl: { type: "string" },
                                    category: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Skill criada" },
                    "400": { description: "Parâmetros inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            },
            delete: {
                tags: ["Skills"],
                summary: "Remove uma skill",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name"],
                                properties: {
                                    name: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Skill removida" },
                    "400": { description: "Parâmetro inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            }
        },
        "/skills/{id}": {
            put: {
                tags: ["Skills"],
                summary: "Atualiza uma skill",
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    iconUrl: { type: "string" },
                                    category: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Skill atualizada" },
                    "400": { description: "Parâmetro inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            }
        },
        "/projects": {
            get: {
                tags: ["Projects"],
                summary: "Lista todos os projetos",
                responses: {
                    "200": {
                        description: "Lista de projetos",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Project" } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ["Projects"],
                summary: "Cria um projeto",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["title", "description", "skill_ids"],
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    details: { type: "string" },
                                    image_url: { type: "string" },
                                    github_url: { type: "string" },
                                    demo_url: { type: "string" },
                                    skill_ids: { type: "array", items: { type: "integer" } }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Projeto criado" },
                    "400": { description: "Parâmetros inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            },
            delete: {
                tags: ["Projects"],
                summary: "Remove um projeto",
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["id"],
                                properties: {
                                    id: { type: "integer" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Projeto removido" },
                    "400": { description: "Parâmetro inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            }
        },
        "/projects/{id}": {
            put: {
                tags: ["Projects"],
                summary: "Atualiza um projeto",
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    details: { type: "string" },
                                    image_url: { type: "string" },
                                    github_url: { type: "string" },
                                    demo_url: { type: "string" },
                                    skill_ids: { type: "array", items: { type: "integer" } }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Projeto atualizado" },
                    "400": { description: "Parâmetro inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    "401": { description: "Não autorizado" },
                    "403": { description: "Proibido" }
                }
            }
        }
    }
};

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: Request, res: Response) => {
    return res.json({ message: "API está online!" });
});

// ==================================================================================== //

router.get("/images", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await imagesController.getAll(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post("/images", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name) {
            const error: any = new Error('O parâmetro "name" é obrigatório.');
            error.status = 400;
            return next(error);
        }
        if (!req.body.blob) {
            const error: any = new Error('O parâmetro "blob" é obrigatório.');
            error.status = 400;
            return next(error);
        }
        await imagesController.create(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.delete("/images", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name) {
            const error: any = new Error('O parâmetro "name" é obrigatório.');
            error.status = 400;
            return next(error);
        }
        await imagesController.delete(req, res, next);
    } catch (error) {
        next(error);
    }
});

// ==================================================================================== //

router.get("/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await skillsController.getAll(req, res, next); 
    } catch (error) {
        next(error);
    }
});

router.post("/skills", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.name) {
            const error: any = new Error("O parâmetro 'name' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        if(!req.body.iconUrl) {
            const error: any = new Error("O parâmetro 'iconUrl' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        if(!req.body.category) {
            const error: any = new Error("O parâmetro 'category' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        await skillsController.create(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.put("/skills/:id", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.params) {
            const error: any = new Error("O parâmetro 'name' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        if(!req.body) {
            const error: any = new Error("Pelo menos um campo tem que ser alterado.");
            error.status = 400;
            return next(error);
        }
        await skillsController.update(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.delete("/skills", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.name) {
            const error: any = new Error("O parâmetro 'name' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        await skillsController.delete(req, res, next);
    } catch (error) {
        next(error);
    }
});

// ==================================================================================== //

router.get("/projects", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await projectsController.getAll(req, res, next);
    } catch (error) {
        next(error);
    }
})

router.post("/projects", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, skill_ids } = req.body;
        
        if(!title || !description || !skill_ids) {
            return res.status(400).json("pos obrigatórios está vazio.");
        }
        await projectsController.create(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.put("/projects/:id", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (Object.keys(req.body).length === 0 || !req.body) {
            const error: any = new Error("O corpo (body) da requisição não pode ser vazio.");
            error.status = 400;
            return next(error);
        }
        await projectsController.update(req, res, next);
    } catch (error) {
        next(error);
    } 
})

router.delete("/projects", authMidleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
       if(!req.body.id) {
            const error:any = new Error("O parâmetro 'id' é obrigatório");
            error.status = 400;
            return next(error);
        }
        await projectsController.delete(req, res, next); 
    } catch (error) {
        next(error);
    }
})

// ==================================================================================== //

app.use("/api", router);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `A rota '${req.originalUrl}' não foi encontrada.` });
});

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error("OCORREU UM ERRO NA APLICAÇÃO:");
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || "Ocorreu um erro interno no servidor.";

    res.status(statusCode).json({
        status: "error",
        statusCode: statusCode,
        message: message,
    });
};

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Rotas da API disponíveis em http://localhost:${PORT}/api`);
});
