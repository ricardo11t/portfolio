import express, { Router } from "express";
import type { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import cors from "cors";
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

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

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
