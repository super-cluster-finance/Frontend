import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface TechIcon {
  name: string;
  icon: string;
  bgColor?: string;
}

export interface TechIcon {
  name: string;
  icon: string;
  bgColor?: string;
}

interface ParticleSystemProps {
  particleCount: number;
  sphereRadius: number;
  rotationSpeed: number;
  particleColor: string;
  particleSize: number;
  scrollProgress: number;
  techIcons: TechIcon[];
}

function createTextPositions(
  text: string,
  particleCount: number,
  scaleFactor: number,
  isMobile: boolean,
  isTablet: boolean
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = 2000;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new Float32Array(particleCount * 3);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let fontSize = 280 * scaleFactor;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;

  let textWidth = ctx.measureText(text).width;
  const maxWidth = canvas.width * 0.95;

  while (textWidth > maxWidth) {
    fontSize -= 5;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    textWidth = ctx.measureText(text).width;
  }

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const textPixels: { x: number; y: number }[] = [];

  // Sampling tetap rapat agar bentuk huruf tajam
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = (y * canvas.width + x) * 4;
      if (pixels[i] < 128) {
        textPixels.push({ x, y });
      }
    }
  }

  const positions = new Float32Array(particleCount * 3);
  // Kita alokasikan 60% untuk teks, 40% sisanya PASTI jadi ambient
  const textParticleCount = Math.floor(particleCount * 0.8);

  const textSpreadX = isMobile ? 50 : isTablet ? 58 : 65;
  const textSpreadY = isMobile ? 28 : isTablet ? 32 : 35;
  const ambientSpreadX = isMobile ? 80 : isTablet ? 100 : 120;
  const ambientSpreadY = isMobile ? 50 : isTablet ? 65 : 80;
  const ambientSpreadZ = isMobile ? 25 : isTablet ? 32 : 40;

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    if (i < textParticleCount) {
      const randomIndex = Math.floor(Math.random() * textPixels.length);
      const p = textPixels[randomIndex];

      positions[i3] = (p.x / canvas.width - 0.5) * textSpreadX * scaleFactor;
      positions[i3 + 1] =
        -(p.y / canvas.height - 0.5) * textSpreadY * scaleFactor;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
    } else {
      positions[i3] = (Math.random() - 0.5) * ambientSpreadX * scaleFactor;
      positions[i3 + 1] = (Math.random() - 0.5) * ambientSpreadY * scaleFactor;
      positions[i3 + 2] = (Math.random() - 0.5) * ambientSpreadZ;
    }
  }

  return positions;
}

export function ParticleSystem({
  particleCount,
  sphereRadius,
  particleColor,
  particleSize,
  scrollProgress,
  techIcons = [],
}: ParticleSystemProps & {
  techIcons?: { icon: string }[];
}): React.ReactElement {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const iconsGroupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  const textures = useLoader(
    THREE.TextureLoader,
    techIcons.map((t) => t.icon)
  );

  const mousePos = useRef(new THREE.Vector3(9999, 9999, 9999));
  const raycasterRef = useRef(new THREE.Raycaster());
  const originalPositions = useRef<Float32Array>(
    new Float32Array(particleCount * 3)
  );
  const velocities = useRef<Float32Array>(new Float32Array(particleCount * 3));

  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  const scaleFactor = isMobile ? 0.6 : isTablet ? 0.8 : 1;
  const responsiveSphereRadius = sphereRadius * scaleFactor;
  const responsiveParticleSize = particleSize * scaleFactor;

  // 1. Inisialisasi Data Partikel (Logic Asli)
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] =
        responsiveSphereRadius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] =
        responsiveSphereRadius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = responsiveSphereRadius * Math.cos(phi);
      originalPositions.current[i * 3] = positions[i * 3];
      originalPositions.current[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions.current[i * 3 + 2] = positions[i * 3 + 2];
      scales[i] = Math.random() * 0.5 + 0.5;
    }

    const textPositions = createTextPositions(
      "Efficient savings for stablecoins",
      particleCount,
      scaleFactor,
      isMobile,
      isTablet
    );
    return { positions, scales, count: particleCount, textPositions };
  }, [particleCount, responsiveSphereRadius, scaleFactor]);

  // 2. Data Orbit Ikon (Radius diperkecil agar tidak "terlalu jauh")
  const iconOrbitData = useMemo(() => {
    // Radius dikurangi sedikit agar ikon lebih rapat mengelilingi teks
    const radius = (isMobile ? 12 : 28) * scaleFactor;
    return techIcons.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / techIcons.length);
      const theta = Math.sqrt(techIcons.length * Math.PI) * phi;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
      };
    });
  }, [techIcons, scaleFactor, isMobile]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / size.width) * 2 - 1,
        -(event.clientY / size.height) * 2 + 1
      );
      raycasterRef.current.setFromCamera(mouse, camera);
      mousePos.current.copy(raycasterRef.current.ray.origin);
      mousePos.current.add(
        raycasterRef.current.ray.direction
          .clone()
          .multiplyScalar(camera.position.z - 12)
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera, size]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const transitionThreshold = 0.01;

    if (groupRef.current) {
      if (scrollProgress < transitionThreshold) {
        groupRef.current.rotation.y = time * 0.05;
        groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.05;
      } else {
        // Set langsung ke 0 agar text selalu menghadap depan tanpa rotasi
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
      }
    }

    const startZ = isMobile ? 20 : isTablet ? 25 : 30;
    const endZ = isMobile ? 18 : isTablet ? 22 : 25;
    camera.position.z =
      startZ - (startZ - endZ) * Math.min(scrollProgress * 2, 1);
    camera.updateProjectionMatrix();

    if (pointsRef.current && groupRef.current) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const morphStart = 0;
      const morphEnd = 0.3;
      const morphProgress = Math.min(
        Math.max((scrollProgress - morphStart) / (morphEnd - morphStart), 0),
        1
      );
      const easedMorph =
        morphProgress * morphProgress * (3 - 2 * morphProgress);

      const localMouse = mousePos.current
        .clone()
        .applyMatrix4(groupRef.current.matrixWorld.clone().invert());

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Fisika Repel (Asli)
        if (scrollProgress < transitionThreshold) {
          const dx = positions[i3] - localMouse.x;
          const dy = positions[i3 + 1] - localMouse.y;
          const dz = positions[i3 + 2] - localMouse.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (distance < 3.5 && distance > 0.01) {
            const force = Math.pow(1 - distance / 3.5, 3) * 1.2;
            velocities.current[i3] += (dx / distance) * force;
            velocities.current[i3 + 1] += (dy / distance) * force;
            velocities.current[i3 + 2] += (dz / distance) * force;
          }
        }

        // Floating & Physics
        positions[i3] += velocities.current[i3];
        positions[i3 + 1] += velocities.current[i3 + 1];
        positions[i3 + 2] += velocities.current[i3 + 2];

        const floatX = Math.sin(time * 0.3 + i * 0.1) * 0.1;
        const floatY = Math.cos(time * 0.21 + i * 0.15) * 0.1;

        const targetX =
          originalPositions.current[i3] * (1 - easedMorph) +
          (particleData.textPositions[i3] + floatX) * easedMorph;
        const targetY =
          originalPositions.current[i3 + 1] * (1 - easedMorph) +
          (particleData.textPositions[i3 + 1] + floatY) * easedMorph;
        const targetZ =
          originalPositions.current[i3 + 2] * (1 - easedMorph) +
          particleData.textPositions[i3 + 2] * easedMorph;

        const returnSpeed = morphProgress > 0 ? 0.12 : 0.06;
        positions[i3] += (targetX - positions[i3]) * returnSpeed;
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * returnSpeed;
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * returnSpeed;

        const damping = morphProgress > 0 ? 0.8 : 0.88;
        velocities.current[i3] *= damping;
        velocities.current[i3 + 1] *= damping;
        velocities.current[i3 + 2] *= damping;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      if (pointsRef.current.material) {
        (pointsRef.current.material as THREE.PointsMaterial).opacity =
          0.7 + morphProgress * 0.2;
      }

      // --- LOGIKA IKON (Disesuaikan agar lebih pelan dan rapat) ---
      if (iconsGroupRef.current) {
        const iconAlpha = Math.max(0, (morphProgress - 0.2) * 1.25);
        iconsGroupRef.current.visible = iconAlpha > 0;

        // Kecepatan rotasi diperlambat (0.05 dan 0.02)
        iconsGroupRef.current.rotation.y = time * 0.05;
        iconsGroupRef.current.rotation.z = time * 0.02;

        iconsGroupRef.current.children.forEach((child) => {
          const sprite = child as THREE.Sprite;
          (sprite.material as THREE.SpriteMaterial).opacity = iconAlpha;
          const s = (isMobile ? 1.8 : 2.5) * iconAlpha;
          sprite.scale.set(s, s, 1);
        });
      }
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={responsiveParticleSize}
          color={particleColor}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <group ref={iconsGroupRef}>
        {techIcons.map((_, i) => (
          <sprite
            key={i}
            position={[
              iconOrbitData[i].x,
              iconOrbitData[i].y,
              iconOrbitData[i].z,
            ]}
          >
            <spriteMaterial
              map={textures[i]}
              transparent
              opacity={0}
              depthTest={false}
            />
          </sprite>
        ))}
      </group>
    </group>
  );
}
