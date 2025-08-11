export interface IImages {
    name: string;
    blob: Buffer;
}

export default class ImagesModel {
    public name: string;
    public blob: Buffer;

    constructor(name: string, blob:Buffer) {
        this.name = name;
        this.blob = blob;
    }

    toClientJSON(): IImages {
        return {
            name: this.name,
            blob: this.blob,
        }
    }
}
