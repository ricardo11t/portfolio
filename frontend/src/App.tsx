import  { useEffect, useState, useRef, useContext } from "react";
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
import { SkillsContext } from "./providers/SkillsProvider";
import { ProjectsContext } from "./providers/ProjectsProvider";
import { ImagesContext } from "./providers/ImagesProvider";

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

interface ImageType {
  name: string;
  blob: BufferInput;
}

type BufferInput = string | { data: Uint8Array | number[] };

function useActiveSection(setActive: React.Dispatch<React.SetStateAction<string>>) {
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

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: ProjectType | null;
}

function ProjectModal({ open, onClose, project }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const trap = (e: KeyboardEvent) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
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
    setTimeout(() => modalRef.current?.querySelector<HTMLElement>("button, a, input")?.focus(), 0);
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
            {project.skills.map((skill) => (
              <Badge key={skill.id} className="bg-zinc-800 text-zinc-300">
                {skill.name}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-zinc-700 text-zinc-300">
                <Github className="w-4 h-4 mr-2" /> Código
              </Button>
            </a>
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
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
  const { skills } = useContext(SkillsContext) as { skills: SkillType[] };
  const { projects } = useContext(ProjectsContext) as { projects: ProjectType[] };
  const { images } = useContext(ImagesContext) as { images: ImageType[] };

const normalizeBase64 = (b64: string) => {
  if (!b64) return '';
  let cleaned = b64.replace(/\s+/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
  const pad = cleaned.length % 4;
  if (pad > 0) cleaned += '='.repeat(4 - pad);
  return cleaned;
};

const base64ToBlob = (base64OrDataUrl: string): Blob | null => {
  if (!base64OrDataUrl) return null;
  let base64 = base64OrDataUrl;
  let mime = 'image/jpeg';
  if (base64OrDataUrl.startsWith('data:')) {
    const parts = base64OrDataUrl.split(',');
    if (parts.length < 2) return null;
    const meta = parts[0];
    base64 = parts[1];
    const m = meta.match(/data:([^;]+);/);
    if (m) mime = m[1];
  }

  base64 = normalizeBase64(base64);
  if (!/^[A-Za-z0-9+/]+=*$/.test(base64)) return null;

  try {
    const binary = atob(base64);
    const len = binary.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: mime });
  } catch {
    return null;
  }
};
const bufferToUrl = (buffer: BufferInput): string | null => {
  if (!buffer) return null;

  if (typeof buffer === 'string') {
    if (buffer.startsWith('blob:') || buffer.startsWith('data:')) return buffer;
    const blob = base64ToBlob(buffer);
    if (blob) return URL.createObjectURL(blob);
    return null;
  }

  const bytes = buffer.data instanceof Uint8Array ? buffer.data : new Uint8Array(buffer.data);

  try {
    const txt = new TextDecoder().decode(bytes).trim();
    const maybe = normalizeBase64(txt);
    if (/^[A-Za-z0-9+/]+=*$/.test(maybe.slice(0, 200))) {
      const blob = base64ToBlob(maybe);
      if (blob) return URL.createObjectURL(blob);
    }
  } catch { /* ignore */ }

  let mime = 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50) mime = 'image/png';
  else if (bytes[0] === 0x47 && bytes[1] === 0x49) mime = 'image/gif';
  const blob = new Blob([bytes], { type: mime });
  return URL.createObjectURL(blob);
};

const carouselImages = images.map((img, i: number) => ({
  id: i,
  name: img.name,
  src: bufferToUrl(img.blob)
}));

useEffect(() => {
  return () => {
    carouselImages.forEach(img => {
      if (img.src?.startsWith('blob:')) URL.revokeObjectURL(img.src);
    });
  };
}, [carouselImages]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [modalProject, setModalProject] = useState<ProjectType | null>(null);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black/90 text-zinc-200" : "bg-zinc-100 text-zinc-800"}`}>
      <header
        className={`fixed top-0 w-full z-50 transition-all :backdrop-blur-sm border-b ${theme === "dark" ? "border-zinc-800 bg-black/80 text-white" : "border-zinc-200 bg-zinc-50/80 text-zinc-900"} ${scrolled ? "py-2 shadow-md" : "py-4"
          }`}
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

            <div className={`text-xl font-medium  select-none`}>Ricardo Holanda</div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("home");
              }}
              className={`transition-colors ${active === "home" ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"}`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("about");
              }}
              className={`transition-colors ${active === "about" ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"}`}
            >
              About
            </a>
            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("skills");
              }}
              className={`transition-colors ${active === "skills" ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"}`}
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("projects");
              }}
              className={`transition-colors ${active === "projects" ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"}`}
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
              className={`transition-colors ${active === "contact" ? "text-blue-600" : "text-zinc-600 hover:text-blue-600"}`}
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
          <div className={`md:hidden border-t ${theme === "dark" ? "border-zinc-800 bg-black/95" : "border-zinc-200 bg-white/95"}`}>
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
                  className={`py-2 px-3 rounded transition-colors ${active === id ? "bg-blue-100 text-blue-800" : "text-zinc-600 hover:bg-zinc-100"}`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-24">
        <section id="home" className={`min-h-screen flex items-center justify-center bg-gradient-to-t ${theme === "dark" ? "from-black to-zinc-900" : "from-zinc-200 to-zinc-50"
          } scroll-mt-20`}>
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Code className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className={` text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? " text-white" : " text-zinc-900"}`}>
              Desenvolvedor{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800">Fullstack</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
              Desenvolvedor apaixonado por programação, desenvolvimento web e desenvolvimento de software
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

              <a href="/Currículo - João Ricardo Holanda Lima.pdf" download className="inline-block">
                <Button variant="outline" size="lg" className={`${theme === "dark" ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : "border-zinc-300 text-zinc-700 hover:bg-zinc-200"}`} aria-label="Download do CV">
                  Download CV
                </Button>
              </a>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <a href="https://github.com/ricardo11t" className={`${theme === "dark" ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-blue-500"} transition-colors`} target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/joão-ricardo-257059363" className={`${theme === "dark" ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-blue-500"} transition-colors`} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:ricardo11t.dev@gmail.com" className={`${theme === "dark" ? "text-zinc-300 hover:text-white" : "text-zinc-600 hover:text-blue-500"} transition-colors`}>
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>

        <section id="about" className={`py-20 ${theme === "dark" ? "bg-zinc-900" : "bg-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-3xl md:text-4xl text-center mb-12 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                Sobre Mim
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center relative">
                <div>
                  <div className="w-full h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center p-6">
                    <AccessibleCarousel images={carouselImages} />
                  </div>
                </div>
                <div className="space-y-6">
                  <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                    Tenho experiência com React, Node.js, TypeScript e bancos de dados relacionais. Gosto de criar soluções eficientes e escaláveis, sempre focando na experiência do usuário.
                  </p>
                  <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                    Já participei de projetos colaborativos, contribuindo tanto no frontend quanto no backend, e estou sempre aberto a aprender novas tecnologias e metodologias.
                  </p>
                  <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                    Meu objetivo é crescer como desenvolvedor, contribuir para projetos inovadores e ajudar empresas a alcançarem seus objetivos através da tecnologia.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Globe className="w-5 h-5" />
                      <span>Frontend</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Database className="w-5 h-5" />
                      <span>Backend</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Monitor className="w-5 h-5" />
                      <span>Desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className={`py-20 bg-gradient-to-t ${theme === "dark" ? "from-black to-zinc-900" : "from-zinc-100 to-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-3xl md:text-4xl text-center mb-12 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Habilidades Técnicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="group">
                    <img src={skill.icon_url} />
                    <Badge variant="outline" className={`w-full py-3 ${theme === "dark" ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"} hover:border-blue-500 hover:text-blue-500 transition-all duration-200 cursor-default`}>
                      {skill.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className={`py-20 ${theme === "dark" ? "bg-zinc-900" : "bg-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-3xl md:text-4xl text-center mb-12 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Projetos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Card key={project.id} className={`${theme === "dark" ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-zinc-100 border-zinc-300 hover:border-zinc-400"} transition-colors transform hover:-translate-y-1 motion-safe:transition-transform`}>
                    <CardHeader>
                      <CardTitle className={`${theme === "dark" ? "text-white" : "text-zinc-900"} text-lg`}>{project.title}</CardTitle>
                      <CardDescription className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary" className={`${theme === "dark" ? "bg-zinc-700 text-zinc-300" : "bg-zinc-200 text-zinc-700"}`}>
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className={`${theme === "dark" ? "border-zinc-600 text-zinc-300 hover:bg-zinc-700" : "border-zinc-300 text-zinc-700 hover:bg-zinc-200"}`}>
                            <Github className="w-4 h-4 mr-2" />
                            Código
                          </Button>
                        </a>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className={`${theme === "dark" ? "border-zinc-600 text-zinc-300 hover:bg-zinc-700" : "border-zinc-300 text-zinc-700 hover:bg-zinc-200"}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${theme === "dark" ? "border-zinc-600 text-zinc-300 hover:bg-zinc-700" : "border-zinc-300 text-zinc-700 hover:bg-zinc-200"} ml-auto`}
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

        <section id="contact" className={`py-20 bg-gradient-to-t ${theme === "dark" ? "from-black to-zinc-900" : "from-zinc-100 to-white"} scroll-mt-20`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={`text-3xl md:text-4xl mb-8 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>Se interessou pelo meu trabalho?</h2>
              <p className={`text-xl mb-12 ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
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
                  <Button variant="outline" size="lg" className={`${theme === "dark" ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : "border-zinc-300 text-zinc-700 hover:bg-zinc-200"}`}>
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className={`py-8 ${theme === "dark" ? "bg-zinc-900" : "bg-white"} border-t ${theme === "dark" ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className="container mx-auto px-4 text-center">
            <p className={`${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>© 2025 Portifólio Ricardo Holanda. Desenvolvido com React, Tailwind CSS e API em Express, na linguagem TypeScript. Hospedado em instância EC2 da AWS.</p>
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
