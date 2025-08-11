import React, { createContext, useEffect, useState } from "react";

interface SkillType {
  id: number;
  name: string;
  icon_url: string;
}

interface SkillsContextType {
  skills: SkillType[];
}

interface SkillsProviderProps {
  children: React.ReactNode;
}

export const SkillsContext = createContext({} as SkillsContextType);

export const SkillsProvider = ({ children }: SkillsProviderProps) => {
  const [skills, setSkills] = useState<SkillType[]>([]);

  const fetchSkills = async () => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/skills`;
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      
      const data: SkillType[] = await response.json();

      setSkills(Array.isArray(data) ? data : []);

    } catch (e) {
      console.error("[SkillsProvider] Erro ao buscar skills: ", e);
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <SkillsContext.Provider value={{ skills }}>
      {children}
    </SkillsContext.Provider>
  );
};
