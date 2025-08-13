export interface ISkills {
    id: number;
    name: string;
    iconUrl: string;
    category: string;
}

export type EDITISkills = Partial<Omit<ISkills, 'id'>>

export default class SkillsModel {
    public id: number;
    public name:string;
    public iconUrl: string;
    public category:string;

    constructor(id:number, name: string, iconUrl:string, category: string) {
        this.id = id;
        this.name = name;
        this.iconUrl = iconUrl;
        this.category = category;
    }

    toClientJSON(): ISkills {
        return {
            id: this.id,
            name: this.name,
            iconUrl: this.iconUrl,
            category: this.category,
        }
    }
}
