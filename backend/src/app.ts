import express, { Router } from "express";
import type { NextFunction, Request, Response, ErrorRequestHandler } from "express";
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

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.json({ message: "API está online!" });
});

// ==================================================================================== //

router.get("/images", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await imagesController.getAll(req, res);
    } catch (error) {
        next(error);
    }
});

router.post("/images", async (req: Request, res: Response, next: NextFunction) => {
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
        await imagesController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete("/images", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name) {
            const error: any = new Error('O parâmetro "name" é obrigatório.');
            error.status = 400;
            return next(error);
        }
        await imagesController.delete(req, res);
    } catch (error) {
        next(error);
    }
});

// ==================================================================================== //

router.get("/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
       await skillsController.getAll(req, res); 
    } catch (error) {
        next(error);
    }
});

router.post("/skills", async (req: Request, res: Response, next: NextFunction) => {
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
        await skillsController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete("/skills", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.name) {
            const error: any = new Error("O parâmetro 'name' é obrigatório.");
            error.status = 400;
            return next(error);
        }
        await skillsController.delete(req, res);
    } catch (error) {
        next(error);
    }
});

// ==================================================================================== //

router.post("/projects", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, skill_ids } = req.body;
        
        if(!title || !description || !skill_ids) {
            return res.status(400).json("Algum dos campos obrigatórios está vazio.");
        }
        await projectsController.create(req, res);
    } catch (error) {
        next(error);
    }
});

// ==================================================================================== //

app.use("/api", authMidleware, router);

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
