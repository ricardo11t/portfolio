import { useEffect, useMemo, useState } from "react";

interface Skill {
    id: number;
    name: string;
    iconUrl: string;
}

interface SkillGlobeProps {
  skills: Skill[];
  radius?: number;
  animationSpeed?: number;
  theme?: "dark" | "light";
  iconSize?: number;
}

const SkillGlobe: React.FC<SkillGlobeProps> = ({
  skills = [],
  radius = 150, // Raio base, o globo crescerá a partir daqui
  animationSpeed = 20,
  theme = "dark",
  iconSize = 80, // Tamanho padrão do ícone em pixels
}) => {
  const [angle, setAngle] = useState(0);

  // O raio efetivo agora é calculado dinamicamente.
  const effectiveRadius = useMemo(() => {
    return radius + skills.length * 4;
  }, [radius, skills.length]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Usamos o operador de módulo (%) para manter o ângulo dentro de um ciclo completo (0 a 2*PI).
      setAngle((prevAngle) => (prevAngle + 1 / animationSpeed) % (2 * Math.PI));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animationSpeed]);

const skillPositions = useMemo(() => {
  const numSkills = skills.length;

  // Ajusta dinamicamente para telas menores
  const isMobile = window.innerWidth < 768;
  const radiusFactor = isMobile ? 0.6 : 1;
  const iconFactor = isMobile ? 0.7 : 1;

  const adjustedRadius = effectiveRadius * radiusFactor;
  const adjustedIconSize = iconSize * iconFactor;

  const rows = Math.ceil(Math.sqrt(numSkills));
  const cols = Math.ceil(numSkills / rows);

  return skills.map((skill, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    // Latitude (mais achatado verticalmente)
    const lat = ((row / (rows - 1)) - 0.5) * Math.PI * 0.6; // 0.6 = achatamento

    // Longitude (mais espaçado horizontalmente)
    const lon = ((col / cols) * 2.5 * Math.PI) + angle; // 2.5 para abrir mais

    const x = adjustedRadius * Math.cos(lat) * Math.cos(lon);
    const y = adjustedRadius * Math.sin(lat);
    const z = adjustedRadius * Math.cos(lat) * Math.sin(lon);

    const depthScale = (z + adjustedRadius) / (2 * adjustedRadius) * 0.5 + 0.5;
    const zIndex = Math.round(depthScale * 100);

    return {
      ...skill,
      style: {
        transform: `translate(${x}px, ${y}px) scale(${depthScale})`,
        zIndex: zIndex,
        width: `${adjustedIconSize}px`,
        height: `${adjustedIconSize}px`,
        marginTop: `-${adjustedIconSize / 2}px`,
        marginLeft: `-${adjustedIconSize / 2}px`,
      },
    };
  });
}, [skills, angle, effectiveRadius, iconSize]);

  const circleBgClass = theme === 'dark'
    ? 'bg-zinc-800 hover:bg-zinc-700'
    : 'bg-gray-200 hover:bg-gray-300';
  
  const tooltipBgClass = theme === 'dark'
    ? 'bg-black text-white'
    : 'bg-white text-black shadow-md';

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      <div className="relative w-0 h-0 group animate-pulse-slow">
        {skillPositions.map((skill) => (
          <div
            key={skill.id}
            className="absolute top-0 left-0 transition-all duration-300 ease-in-out group-hover:[animation-play-state:paused] hover:!scale-125 hover:!z-[101]"
            style={{
              ...skill.style,
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              marginTop: `-${iconSize / 2}px`,
              marginLeft: `-${iconSize / 2}px`,
            }}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center p-2 transition-transform duration-300 transform-gpu ${circleBgClass}`}>
              <img
                src={skill.iconUrl}
                alt={skill.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const placeholderBg = theme === 'dark' ? '18181b' : 'e4e4e7';
                  const placeholderText = theme === 'dark' ? 'ffffff' : '18181b';
                  target.src = `https://placehold.co/64x64/${placeholderBg}/${placeholderText}?text=${skill.name.charAt(0)}`;
                }}
              />
            </div>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${tooltipBgClass}`}>
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SkillGlobe;
