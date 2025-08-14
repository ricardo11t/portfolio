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
  radius = 150,
  animationSpeed = 20,
  theme = "dark",
  iconSize = 80,
}) => {
  const [angle, setAngle] = useState(0);

  const effectiveRadius = useMemo(() => {
    return radius + skills.length * 4;
  }, [radius, skills.length]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setAngle((prevAngle) => (prevAngle + 1 / animationSpeed) % (2 * Math.PI));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animationSpeed]);

  const skillPositions = useMemo(() => {
    const numSkills = skills.length;
    return skills.map((skill, index) => {
      const itemAngle = (index / numSkills) * 2 * Math.PI;
      const x = effectiveRadius * Math.cos(itemAngle + angle);
      const y = effectiveRadius * Math.sin(itemAngle + angle);
      const scale = (y + effectiveRadius) / (2 * effectiveRadius) * 0.75 + 0.25;
      const zIndex = Math.round(scale * 100);

      return {
        ...skill,
        style: {
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          zIndex: zIndex,
        },
      };
    });
  }, [skills, angle, effectiveRadius]);

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
