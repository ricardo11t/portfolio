import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Skill {
  id: number;
  name: string;
  iconUrl: string;
  category: string;
}

interface SkillGlobeProps {
  images: Skill[];
}

export default function SkillGlobe({ images }: SkillGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ringsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!images || images.length === 0) return;

    // ----- CENA -----
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ----- CÂMERA -----
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // ----- RENDERER -----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // ----- LUZ -----
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // ----- CRIAR ANÉIS DE IMAGENS -----
    const numRings = 6; // quantidade de linhas
    const radius = 3;
    ringsRef.current = [];

    let imgIndex = 0;
    for (let r = 0; r < numRings; r++) {
      const ring = new THREE.Group();
      const y = ((r / (numRings - 1)) - 0.5) * 2 * radius * 0.5;
      const ringRadius = Math.sqrt(radius * radius - y * y);
      const numImages = 6 + r * 2; // mais imagens em anéis maiores

      for (let i = 0; i < numImages; i++) {
        const angle = (i / numImages) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;

        // Usa iconUrl da skill
        const skill = images[imgIndex % images.length];
        if (!skill || !skill.iconUrl) continue;

        const texture = new THREE.TextureLoader().load(skill.iconUrl || "/default.png");

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });

        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(0.8, 0.8),
          material
        );

        plane.position.set(x, y, z);
        plane.lookAt(0, y, 0); // olha para o centro
        ring.add(plane);

        imgIndex++;
      }

      scene.add(ring);
      ringsRef.current.push(ring);
    }

    // ----- ANIMAÇÃO -----
    const animate = () => {
      requestAnimationFrame(animate);
      ringsRef.current.forEach((ring, i) => {
        ring.rotation.y += 0.002 * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.2);
      });
      renderer.render(scene, camera);
    };
    animate();

    // ----- RESPONSIVO -----
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [images]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}
