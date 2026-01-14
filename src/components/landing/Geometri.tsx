"use client";
import { Canvas } from "@react-three/fiber";
import { ParticleSystem, TechIcon } from "./ParticleSystem";
import { useEffect, useState } from "react";
import { ScrollContent } from "./ScrollContent";

const DEFAULT_TECH_ICONS: TechIcon[] = [
  {
    name: "wsusdc",
    icon: "/wsusdc.png",
  },
  {
    name: "susdc",
    icon: "/susdc.png",
  },
  {
    name: "usdc",
    icon: "/icons/usdc-logo.svg",
  },
  {
    name: "idrx",
    icon: "/icons/idrx-logo.png",
  },
];

export interface GeometriProps {
  particleCount?: number;
  sphereRadius?: number;
  rotationSpeed?: number;
  particleColor?: string;
  particleSize?: number;
  height?: string;
  showScrollIndicator?: boolean;
  techIcons?: TechIcon[];
  children?: React.ReactNode;
  title?: string;
}

interface ResponsiveSettings {
  particleCount: number;
  sphereRadius: number;
  particleSize: number;
  cameraZ: number;
  fov: number;
}

export default function Geometri({
  particleCount = 14000,
  sphereRadius = 15,
  rotationSpeed = 0.05,
  particleColor = "#4a9eff",
  particleSize = 0.08,
  height = "180vh",
  techIcons = DEFAULT_TECH_ICONS,
  children,
}: GeometriProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [responsiveSettings, setResponsiveSettings] =
    useState<ResponsiveSettings>({
      particleCount,
      sphereRadius,
      particleSize,
      cameraZ: 30,
      fov: 75,
    });

  useEffect(() => {
    const updateResponsiveSettings = () => {
      const width = window.innerWidth;

      // Mobile (< 640px)
      if (width < 640) {
        setResponsiveSettings({
          particleCount: Math.floor(particleCount * 0.5),
          sphereRadius: sphereRadius * 0.8,
          particleSize: particleSize * 1.2,
          cameraZ: 30,
          fov: 90,
        });
      }
      // Tablet (640px - 1024px)
      else if (width < 1024) {
        setResponsiveSettings({
          particleCount: Math.floor(particleCount * 0.5),
          sphereRadius: sphereRadius * 0.75,
          particleSize: particleSize * 1.1,
          cameraZ: 28,
          fov: 80,
        });
      }
      // Desktop (>= 1024px)
      else {
        setResponsiveSettings({
          particleCount,
          sphereRadius,
          particleSize,
          cameraZ: 30,
          fov: 75,
        });
      }
    };

    updateResponsiveSettings();
    window.addEventListener("resize", updateResponsiveSettings);

    return () => window.removeEventListener("resize", updateResponsiveSettings);
  }, [particleCount, sphereRadius, particleSize]);

  const fadeStart = 0.995;
  const clamped = Math.min(
    Math.max((scrollProgress - fadeStart) / (1 - fadeStart), 0),
    1
  );
  const canvasOpacity = 1 - clamped;
  const canvasPointerEvents = canvasOpacity > 0.05 ? "auto" : "none";

  return (
    <>
      {/* Fixed Canvas (hidden after hero scroll) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1,
          transition: "opacity 0.35s ease, visibility 0.35s",
          opacity: canvasOpacity,
          pointerEvents: canvasPointerEvents,
          visibility: canvasOpacity > 0 ? "visible" : "hidden",
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, responsiveSettings.cameraZ],
            fov: responsiveSettings.fov,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]} // Limit pixel ratio for better performance
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.5} />
          <ParticleSystem
            particleCount={responsiveSettings.particleCount}
            sphereRadius={responsiveSettings.sphereRadius}
            rotationSpeed={rotationSpeed}
            particleColor={particleColor}
            particleSize={responsiveSettings.particleSize}
            techIcons={techIcons}
            scrollProgress={scrollProgress}
          />
        </Canvas>
      </div>

      {/* Scroll Content */}
      <ScrollContent height={height} onScrollProgress={setScrollProgress}>
        {children}
      </ScrollContent>
    </>
  );
}
