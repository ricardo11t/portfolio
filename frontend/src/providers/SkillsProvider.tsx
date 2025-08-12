import React, { createContext, useEffect, useState } from "react";

interface SkillType {
  id: number;
  name: string;
  iconUrl: string;
  category: string;
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
    try {
      const response = await fetch("/api/skills");

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
