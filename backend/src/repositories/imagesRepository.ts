import ImagesModel from "../models/imagesModel";
import { DbClient } from "../utils/db";

export default class ImagesRepository {
    public db: DbClient;
    constructor(dbClient: DbClient) {
        if (!dbClient || typeof dbClient !== `function`) {
            throw new Error(`O cliente provido, do banco de dados, é inválido. É esperado uma função.`);
        }
        this.db = dbClient;
    }

    async findAll(): Promise<ImagesModel[] | null> {
        try {
            const { rows } = await this.db`SELECT * FROM images;`;
            if (rows.length === 0) {
                return null;
            }
            return rows.map(row => new ImagesModel(row.name, row.blob));
        } catch (e) {
            console.error("[ImagesRepository findAll] Erro ao buscar todas as imagens: ", e);
            throw e;
        }
    }

    async findByName(name: string): Promise<ImagesModel | null> {
        try {
            const { rows } = await this.db`SELECT * FROM images WHERE \`name\` = ${name.toLowerCase().trim()};`;
            if (rows.length === 0) {
                return null;
            }
            const { name: imageName, blob: iblob } = rows[0];
            return new ImagesModel(imageName, iblob);
        } catch (e) {
            console.error('[ImagesRepository findByName] Erro na query =', e);
            throw e;
        }
    }

    async create(name: string, blob: Buffer): Promise<ImagesModel> {
        try {
            const result = await this.db`
                INSERT INTO images (\`name\`, \`blob\`)
                VALUES (${name.toLowerCase()}, ${blob});
            `;

            const metadata = result.rows as any;
            const newId = metadata.insertId;

            if (!newId) {
                throw new Error("Falha ao obter o ID da imagem inserida do resultado da query.");
            }

            return new ImagesModel(name, blob);

        } catch (e: any) {
            console.error("[ImagesRepository create] Detalhe do erro:", e);
            throw new Error("[ImagesRepository create] Falha ao adicionar imagem.");
        }
    }

    async deleteImage(name: string): Promise<Boolean> {
        try {
            if (typeof name !== "string" || name.trim() === '') {
                throw new Error("Para deletar, o parâmetro name é obrigatório.");
            }
            console.log(`Deletando imagem com o nome ${name.toLowerCase().trim()}`);

            const result = await this.db`DELETE FROM images WHERE \`name\` = ${name.toLowerCase()};`;
            
            const metadata = result.rows as any;

            return metadata.affectedRows > 0;

        } catch (e: any) {
            console.error(`[ImagesRepository deleteImage] Erro ao deletar imagem com o nome ${name}: `, e);
            throw e;
        }
    }
}
