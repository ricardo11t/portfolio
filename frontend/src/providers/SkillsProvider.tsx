import { createContext, useEffect, useState } from "react";

export const SkillsContext = createContext({
    skills: [],
});

export const SkillsProvider = ({ children }) => {
    const [skills, setSkills] = useState([]);

    const fetchSkills = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/skills", {
                method: "GET",
            });

            if(!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();

            let skillsArray = [];
            if(data && Array.isArray(data)) {
                skillsArray = data;
            } else {
                console.warn("A resposta da API /api/skills não é um array:", data);
            }

            setSkills(skillsArray);
        } catch (e) {
            console.error("[SkillsProvider] Erro ao buscar imagens: ", e);
            setSkills([]);
        }
    }

    useEffect(() => {
        fetchSkills() 
    }, []);

    return (
        <SkillsContext.Provider value={{skills}}>
            {children}
        </SkillsContext.Provider>
    )
}
