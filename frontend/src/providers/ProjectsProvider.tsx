import { createContext, useEffect, useState } from "react";

export const ProjectsContext = createContext({
    projects: [],
});

export const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/projects", {
                method: "GET",
            });

            if(!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}` );
            }

            const data = await response.json();
           
            let projectsArray = [];
            if(data && Array.isArray(data)) {
                projectsArray = data;
            } else {
                console.warn("A resposta da API /api/projects não é um array:", data);
            }

            setProjects(projectsArray);
        } catch (e) {
            console.error("[projectsProvider] Erro ao buscar imagens: ", e);
            setProjects([]);
        }
    }
    
    useEffect(() => {
        fetchProjects()
    }, []);

    return (
        <ProjectsContext.Provider value={{projects}}>
            {children}
        </ProjectsContext.Provider>
    )
}
