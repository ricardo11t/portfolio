import React, { createContext, useEffect, useState } from "react";

interface SkillType {
  id: number;
  name: string;
  icon_url: string;
}

interface ProjectType {
  id: number;
  title: string;
  description: string;
  details?: string;
  skills: SkillType[];
  github_url: string;
  demo_url: string;
}

interface ProjectsContextType {
  projects: ProjectType[];
}

interface ProjectsProviderProps {
  children: React.ReactNode;
}

export const ProjectsContext = createContext({} as ProjectsContextType);

export const ProjectsProvider = ({ children }: ProjectsProviderProps) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      
      const data: ProjectType[] = await response.json();
      setProjects(Array.isArray(data) ? data : []);

    } catch (e) {
      console.error("[ProjectsProvider] Erro ao buscar projetos: ", e);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
