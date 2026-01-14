import { useEffect, useState } from "react";

export interface ScrollContentProps {
  height?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onScrollProgress?: (progress: number) => void;
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / Math.max(maxScroll, 1), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}

export function ScrollContent({
  children,
  height = "100vh",
  onScrollProgress,
}: ScrollContentProps) {
  const [heroProgress, setHeroProgress] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);

  const parseHeightToPx = (h: string) => {
    if (h.endsWith("vh")) {
      const num = parseFloat(h.replace("vh", ""));
      return (num / 100) * window.innerHeight;
    }
    if (h.endsWith("px")) {
      return parseFloat(h.replace("px", ""));
    }
    const n = parseFloat(h);
    return isNaN(n) ? window.innerHeight * 2 : n;
  };

  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY;
      setScrollY(scrollY);

      const heroPx = parseHeightToPx(height);
      const maxHeroScroll = Math.max(heroPx - window.innerHeight, 1);
      const p = Math.min(scrollY / maxHeroScroll, 1);
      setHeroProgress(p);
    };

    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    handle();
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [height]);

  useEffect(() => {
    if (onScrollProgress) {
      onScrollProgress(heroProgress);
    }
  }, [heroProgress, onScrollProgress]);

  // Multiplier untuk sensitivitas text movement
  const textScrollMultiplier = 2.5;
  const textTranslateY = -scrollY * textScrollMultiplier;
  const textOpacity = Math.max(1 - scrollY / 150, 0);

  return (
    <div
      style={{
        width: "100%",
        height: height,
        background: "#000",
      }}
    >
      {/* Title */}
      <div
        className="fixed inset-0 flex flex-col justify-center items-center text-center px-4"
        style={{
          zIndex: 3,
          opacity: heroProgress >= 0.9 ? (heroProgress - 0.9) / 0.1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
          display: heroProgress >= 1 ? "none" : undefined,
        }}
      ></div>

      {/* Content */}
      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            pointerEvents: "auto",
            transform: `translateY(${textTranslateY}px)`,
            opacity: textOpacity,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
