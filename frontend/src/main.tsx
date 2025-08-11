import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ImagesProvider } from './providers/ImagesProvider.tsx'
import { ProjectsProvider }  from './providers/ProjectsProvider.tsx'
import { SkillsProvider } from './providers/SkillsProvider.tsx'

createRoot(document.getElementById('root')!).render (
    <SkillsProvider>
        <ProjectsProvider>
            <ImagesProvider>
                <StrictMode>
                    <App />
                </StrictMode>
            </ImagesProvider>
        </ProjectsProvider>
    </SkillsProvider>
)
