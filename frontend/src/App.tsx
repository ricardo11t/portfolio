import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import {
  Code,
  Database,
  Github,
  Globe,
  Linkedin,
  Mail,
  Monitor,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import AccessibleCarousel from "./mycomponents/AccessibleCarousel";

const skills = [
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "HTML5", category: "Frontend" },
  { name: "CSS3", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "MongoDB", category: "Backend" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "AWS", category: "Cloud" },
];

const projects = [
  {
    title: "E-commerce Platform",
    description:
      "Plataforma completa de e-commerce com carrinho de compras, sistema de pagamentos e painel administrativo.",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "#",
    demo: "#",
    details:
      "Caso de estudo: implementei autenticação, catálogo, checkout com Stripe e painel de administração. Deploy em Vercel + Heroku.",
    image: "/proj-ecommerce.jpg",
  },
  {
    title: "Task Management App",
    description:
      "Aplicativo de gerenciamento de tarefas com funcionalidades de colaboração em tempo real.",
    tech: ["Next.js", "TypeScript", "MongoDB", "Socket.io"],
    github: "#",
    demo: "#",
    details:
      "Aplicativo com sincronização em tempo real usando Socket.io, e autenticação via JWT. Testes unitários com Jest.",
    image: "/proj-tasks.jpg",
  },
  {
    title: "Weather Dashboard",
    description:
      "Dashboard meteorológico com visualizações interativas e previsões detalhadas.",
    tech: ["React", "Chart.js", "OpenWeather API", "Tailwind"],
    github: "#",
    demo: "#",
    details:
      "Dashboard com caching de API, gráficos de precipitação e performance otimizada para dispositivos móveis.",
    image: "/proj-weather.jpg",
  },
];

const carouselImages = ["/vite.svg", "/w3logo.jfif", "/img3.png", "/img4.png"];

function useActiveSection(setActive) {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.55 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [setActive]);
}

function ProjectModal({ open, onClose, project }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const trap = (e) => {
      const focusable = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", trap);
    setTimeout(() => modalRef.current?.querySelector("button, a, input")?.focus(), 0);
    return () => document.removeEventListener("keydown", trap);
  }, [open, onClose]);

  if (!open || !project) return null;
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} - detalhes`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={modalRef} className="max-w-2xl w-full bg-zinc-900 rounded-lg overflow-hidden shadow-lg focus:outline-none">
        <div className="p-6">
          <h3 className="text-2xl text-white mb-2">{project.title}</h3>
          <p className="text-zinc-300 mb-4">{project.details || project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t, i) => (
              <Badge key={i} className="bg-zinc-800 text-zinc-300">
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-zinc-700 text-zinc-300">
                <Github className="w-4 h-4 mr-2" /> Código
              </Button>
            </a>
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Demo <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [modalProject, setModalProject] = useState(null);

  useActiveSection(setActive);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onHash = () => setMobileOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen bg-black/90 text-zinc-200`}>
      <header
        className={`fixed top-0 w-full z-50 transition-all :backdrop-blur-sm border-b border-zinc-800 ${
          scrolled ? "py-2 shadow-md" : "py-4"
        } ${theme === "dark" ? "bg-black/80 text-white" : "bg-white/80 text-black"}`}
      >
        <nav className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-zinc-800" />}
            </button>

            <div className={`text-xl font-medium  select-none`}>João Ricardo</div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("home");
              }}
              className={`transition-colors ${active === "home" ? "text-white" : "text-zinc-300 hover:text-white"}`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("about");
              }}
              className={`transition-colors ${active === "about" ? "text-white" : "text-zinc-300 hover:text-white"}`}
            >
              About
            </a>
            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("skills");
              }}
              className={`transition-colors ${active === "skills" ? "text-white" : "text-zinc-300 hover:text-white"}`}
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("projects");
              }}
              className={`transition-colors ${active === "projects" ? "text-white" : "text-zinc-300 hover:text-white"}`}
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
              className={`transition-colors ${active === "contact" ? "text-white" : "text-zinc-300 hover:text-white"}`}
            >
              Contacts
            </a>
          </div>

          <div className="md:hidden">
            <button
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-black/95">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {["home", "about", "skills", "projects", "contact"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                    setMobileOpen(false);
                  }}
                  className={`py-2 px-3 rounded transition-colors ${active === id ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900"}`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-24">
        <section id="home" className={`min-h-screen flex items-center justify-center bg-gradient-to-t ${theme === "dark" ? "from-black to-zinc-900" : "from-white to-zinc-900"} scroll-mt-20`}>
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Code className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl text-white mb-4">
              Desenvolvedor{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Fullstack</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto">
              Desenvolvedor apaixonado por criar soluções digitais e inovadoras, com tecnologias modernas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => scrollTo("projects")}
                aria-label="Ver Projetos"
              >
                Ver Projetos
              </Button>

              <a href="/Curriculo-Joao-Ricardo-Holanda-Lima.pdf" download className="inline-block">
                <Button variant="outline" size="lg" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800" aria-label="Download do CV">
                  Download CV
                </Button>
              </a>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <a href="https://github.com/ricardo11t" className="text-zinc-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/joão-ricardo-257059363" className="text-zinc-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:ricardo11t.dev@gmail.com" className="text-zinc-300 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-zinc-900 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Sobre Mim</h2>
              <div className="grid md:grid-cols-2 gap-12 items-center relative">
                <div>
                  <div className="w-full h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center p-6">
                    <AccessibleCarousel images={carouselImages} />
                  </div>
                </div>

                <div className="space-y-6">
                    <p className="text-zinc-300 text-lg leading-relaxed">
                        Meu nome é João Ricardo, mas pode me chamar de Ricardo.
                    </p>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                    Sou um desenvolvedor fullstack com paixão por tecnologia e inovação. Tenho experiência em desenvolvimento web moderno, desde interfaces responsivas até APIs robustas e escaláveis.
                    </p>
                  
                  <p className="text-zinc-300 text-lg leading-relaxed">
                    Sempre em busca de novos desafios e oportunidades para crescer profissionalmente, estou constantemente aprendendo novas tecnologias e melhores práticas de desenvolvimento.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Globe className="w-5 h-5" />
                      <span>Frontend</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <Database className="w-5 h-5" />
                      <span>Backend</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Monitor className="w-5 h-5" />
                      <span>Desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className={`py-20 bg-gradient-to-bl ${theme === "dark" ? "from-black to-black" : "from-zinc-600 to-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Habilidades Técnicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="group">
                    <Badge variant="outline" className="w-full py-3 border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 cursor-default">
                      {skill.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 bg-zinc-900 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Projetos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <Card key={index} className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors transform hover:-translate-y-1 motion-safe:transition-transform">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-zinc-400">{project.description}</CardDescription>
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
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                            <Github className="w-4 h-4 mr-2" />
                            Código
                          </Button>
                        </a>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 ml-auto"
                          onClick={() => setModalProject(project)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
                        
        <section id="contact" className={`py-20 bg-gradient-to-tl ${theme === "dark" ? "bg-black" : "from-zinc-600 to-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={`text-3xl md:text-4xl text-white mb-8`}>Se interessou pelo meu trabalho?</h2>
              <p className="text-xl text-zinc-300 mb-12">
                Estou sempre aberto a novas oportunidades e projetos interessantes. Entre em contato e vamos conversar!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="mailto:ricardo11t.dev@gmail.com">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Email
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/joão-ricardo-257059363" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 bg-zinc-900 border-t border-zinc-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-zinc-400">© 2025 Portifólio Ricardo. Desenvolvido com React, Tailwind CSS e API em Express.</p>
          </div>
        </footer>
      </main>

      <ProjectModal
        open={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
        project={modalProject}
      />
    </div>
  );
}
