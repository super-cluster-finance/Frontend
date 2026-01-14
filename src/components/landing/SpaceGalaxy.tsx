import React, { useEffect, useRef } from "react";

interface SuperclusterAnimationProps {
  onMouseMove?: (pos: { x: number; y: number }) => void;
}

export default function SuperclusterAnimation({
  onMouseMove,
}: SuperclusterAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const stats = [
    {
      label: "Total Value Locked",
      value: "$2.4B",
      description: "Across all protocols",
    },
    { label: "Active Users", value: "125,000", description: "Last 30 days" },
    { label: "Current APR", value: "12.5%", description: "Average yield rate" },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
      }

      if (onMouseMove) {
        onMouseMove({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [onMouseMove]);

  return (
    <div className="relative h-[600px] hidden lg:block">
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 600 600">
        <defs>
          <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="300"
          cy="300"
          r="180"
          fill="url(#centralGlow)"
          className="transition-all duration-500"
        />

        {[1, 2, 3, 4, 5].map((ring) => {
          const ringRadius = 50 * ring;

          return (
            <circle
              key={ring}
              cx="300"
              cy="300"
              r={ringRadius}
              fill="none"
              stroke="rgba(59, 130, 246, 0.12)"
              strokeWidth="0.8"
              strokeDasharray="2,8"
              className="transition-all duration-300"
              style={{
                animation: `spin ${30 + ring * 12}s linear infinite`,
                transformOrigin: "center",
              }}
            />
          );
        })}
      </svg>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="flex flex-col gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-950/30 backdrop-blur-sm border border-white/16 rounded-md px-4 py-2.5 min-w-[400px] transition-all duration-300 hover:border-blue-400/40 hover:bg-slate-900/40"
            >
              <div className="flex items-baseline justify-between mb-0.5">
                <div className="text-lg text-white/70">{stat.label}</div>
                <div className="text-base text-blue-100">{stat.value}</div>
              </div>
              <div className="text-sm text-blue-400/50">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full"
            style={{
              animation: `float-${i % 3} ${12 + i * 2.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              left: `${10 + i * 8}%`,
              top: `${5 + i * 8}%`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float-0 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -35px);
            opacity: 0.6;
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.25;
          }
          50% {
            transform: translate(-30px, 45px);
            opacity: 0.55;
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.35;
          }
          50% {
            transform: translate(35px, 20px);
            opacity: 0.65;
          }
        }
      `}</style>
    </div>
  );
}
