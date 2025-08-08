import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Code, Database, Github, Globe, Linkedin, Mail, Monitor, ExternalLink, Smartphone } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge'

function App() {
    const skills = [
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'HTML5', category: 'Frontend' },
    { name: 'CSS3', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'MongoDB', category: 'Backend' },
    { name: 'Git', category: 'Tools' },
    { name: 'Docker', category: 'Tools' },
    { name: 'AWS', category: 'Cloud' },    ]

      const projects = [
    {
      title: 'E-commerce Platform',
      description: 'Plataforma completa de e-commerce com carrinho de compras, sistema de pagamentos e painel administrativo.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Task Management App',
      description: 'Aplicativo de gerenciamento de tarefas com funcionalidades de colaboração em tempo real.',
      tech: ['Next.js', 'TypeScript', 'MongoDB', 'Socket.io'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Weather Dashboard',
      description: 'Dashboard meteorológico com visualizações interativas e previsões detalhadas.',
      tech: ['React', 'Chart.js', 'OpenWeather API', 'Tailwind'],
      github: '#',
      demo: '#'
    }
  ];

  return ( 
        <div className='min-h-screen bg-black dark'>
            <header className='fixed top-0 w-full bg-black/80 backdrop-blur-sm border-b border-zinc-800'>
                <nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
                    <div className='text-xl text-white'>
                        Meu Portifólio
                    </div>
                    <div className='hidden md:flex space-x-6'>
                        <a href='#home' className='text-zinc-300 hover:text-white transition-colors'>Home</a>
                        <a href='#about' className='text-zinc-300 hover:text-white transition-colors'>About</a>
                        <a href='#skills' className='text-zinc-300 hover:text-white transition-colors'>Skills</a>
                        <a href='#projects' className='text-zinc-300 hover:text-white transition-colors'>Projects</a>
                        <a href='#contact' className='text-zinc-300 hover:text-white transition-colors'>Contacts</a>
                    </div>
                </nav>
            </header>

            <section id='home' className='pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900'>
                <div className='container mx-auto px-4 text-center'>
                    <div className='mb-8'>
                        <div className='w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center'>
                            <Code className='w-16 h-16 text-white'/>
                        </div>
                    </div>
                
                
                    <h1 className='text-4xl md:text-6xl text-white mb-4'>
                        Desenvolvedor <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600'>Fullstack</span>
                    </h1>
                    <p className='text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto'>
                        Desenvolvedor apaixonado por criar soluções digitais e inovadoras, com tecnologias modernas
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Button size="lg" className='bg-blue-600 hover:bg-blue-700 text-white'>
                            Ver Projetos
                        </Button>
                        <Button variant="outline" size="lg" className='border-zinc-600 text-zinc-300 hover:bg-zinc-800'>
                            Download CV
                        </Button>
                    </div>
                    <div className='flex justify-center space-x-6 mt-8'>
                        <a href='https://github.com/ricardo11t' className='text-zinc-400 hover:text-white transition-colors' target='_blank'><Github className='w-6 h-6'/></a>
                        <a href='https://www.linkedin.com/in/joão-ricardo-257059363' className='text-zinc-400 hover:text-white transition-colors' target='_blank'><Linkedin className='w-6 h-6'/></a>
                        <a href='malito:ricardo11t.dev@gmail.com' className='text-zinc-400 hover:text-white transition-colors' target='_blank' ><Mail className='w-6 h-6'/></a>
                    </div>
                </div>
            </section>
            <section id='about' className='py-20 bg-zinc-900'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-4xl mx-auto'>
                        <h2 className='text-3xl md:text-4xl text-white text-center mb-12'>
                            Sobre Mim
                        </h2>
                        <div className='grid md:grid-cols-2 gap-12 items-center'>
                            <div>
                                <div className='w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center'>
                                    <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                                        <Code className='w-12 h-12 text-white' />
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-6'>
                                <p className='text-zinc-300 text-lg leading-relaxed'>
                                    Sou um desenvolvedor fullstack júnior com paixão por tecnologia e inovação. 
                                    Tenho experiência em desenvolvimento web moderno, desde interfaces responsivas 
                                    até APIs robustas e escaláveis.
                                </p>
                                <p className='text-zinc-300 text-lg leading-relaxed'>
                                    Sempre em busca de novos desafios e oportunidades para crescer profissionalmente, 
                                    estou constantemente aprendendo novas tecnologias e melhores práticas de desenvolvimento.
                                </p>
                                <div className='flex flex-wrap gap-4'>
                                    <div className='flex items-center gap-2 text-blue-400'>
                                        <Globe className='w-5 h-5'/>
                                        <span>Frontend</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-green-400'>
                                        <Database className='w-5 h-5'/>
                                        <span>Backend</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-purple-400'>
                                        <Monitor className='w-5 h-5'/>
                                        <span>Desktop</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
      <section id="skills" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white text-center mb-12">
              Habilidades Técnicas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="group">
                  <Badge 
                    variant="outline" 
                    className="w-full py-3 border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 cursor-default"
                  >
                    {skill.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="projects" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white text-center mb-12">
              Projetos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white">{project.title}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="bg-zinc-700 text-zinc-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                        <Github className="w-4 h-4 mr-2" />
                        Código
                      </Button>
                      <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
            <section id='contact' className='py-20 bg-black'>
                <div className='container mx-auto px-4'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <h2 className='text-3xl md:text-4xl text-white mb-8'>
                            Vamos Trabalhar Juntos?
                        </h2>
                        <p className='text-xl text-zinc-400 mb-12'>
                            Estou sempre aberto a novas oportunidades e projetos interessantes. 
                            Entre em contato e vamos conversar!
                        </p>
                        <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                            <Button size="lg" className='bg-blue-600 hover:bg-blue-700 text-white'>
                                <Mail className='w-5 h-5 mr-2' />
                                Enviar Email
                            </Button>
                            <Button variant="outline" size="lg" className='border-zinc-600 text-zinc-300 hover:bg-zinc-800'>
                                <Linkedin className='w-5 h-5 mr-2' />
                                LinkedIn
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <footer className='py-8 bg-zinc-900 border-t border-zinc-800'>
                <div className='container mx-auto px-4 text-center'>
                    <p className='text-zinc-400'>
                        © 2025 Portifólio Ricardo. Desenvolvido com React, Tailwind CSS e API em Express.
                    </p>
                </div>
            </footer>
        </div>
)
}

export default App
