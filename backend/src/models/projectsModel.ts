import { ISkills } from "./skillsModel";

export interface IProject {
    id: number;
    title: string;
    description: string;
    details?: string;
    image_url?: string;
    github_url?: string;
    demo_url?: string;
    skills: ISkills[];
}

export default class ProjectsModel {
    public id:number;
    public title:string;
    public description:string;
    public details?:string;
    public image_url?:string;
    public github_url?:string;
    public demo_url?:string;
    public skills: ISkills[] = [];

    constructor(id:number, title:string, description:string, details?:string, image_url?:string, github_url?:string, demo_url?:string,) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.details = details;
        this.image_url = image_url;
        this.github_url = github_url;
        this.demo_url = demo_url;
    }

    toClientJSON(): IProject {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            details: this.details,
            image_url: this.image_url,
            github_url: this.github_url,
            demo_url: this.demo_url,
            skills: this.skills,
        }
    }
}
