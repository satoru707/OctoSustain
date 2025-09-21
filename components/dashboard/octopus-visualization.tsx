"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";

interface TentacleData {
  name: string;
  progress: number;
  color: string;
  icon: string;
}

interface OctopusVisualizationProps {
  podId: string;
}

export function OctopusVisualization({ podId }: OctopusVisualizationProps) {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [tentacleData, setTentacleData] = useState<TentacleData[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected, joinPod } = useSocket();

  useEffect(() => {
    const fetchTentacleData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${podId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Tentacles", data);

          const transformedData = [
            {
              name: "Energy",
              progress: data.tentacles.energy.current || 0,
              color: "#22c55e",
              icon: "⚡",
            },
            {
              name: "Waste",
              progress: data.tentacles.waste.current || 0,
              color: "#16a34a",
              icon: "🗑️",
            },
            {
              name: "Transport",
              progress: data.tentacles.transport.current || 0,
              color: "#15803d",
              icon: "🚗",
            },
            {
              name: "Water",
              progress: data.tentacles.water.current || 0,
              color: "#166534",
              icon: "💧",
            },
            {
              name: "Food",
              progress: data.tentacles.food.current || 0,
              color: "#14532d",
              icon: "🍃",
            },
            {
              name: "Custom",
              progress: data.tentacles.custom.current || 0,
              color: "#052e16",
              icon: "📊",
            },
          ];

          setTentacleData(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch tentacle data:", error);
        // Fallback to empty progress if API fails
        setTentacleData([
          { name: "Energy", progress: 0, color: "#22c55e", icon: "⚡" },
          { name: "Waste", progress: 0, color: "#16a34a", icon: "🗑️" },
          { name: "Transport", progress: 0, color: "#15803d", icon: "🚗" },
          { name: "Water", progress: 0, color: "#166534", icon: "💧" },
          { name: "Food", progress: 0, color: "#14532d", icon: "🍃" },
          { name: "Custom", progress: 0, color: "#052e16", icon: "📊" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTentacleData();
  }, [podId]);

  useEffect(() => {
    if (isConnected && podId) {
      joinPod(podId);
    }
  }, [isConnected, podId, joinPod]);

  useEffect(() => {
    if (!socket) return;

    const handleTentacleUpdate = (data) => {
      if (data.podId === podId) {
        setTentacleData((prev) =>
          prev.map((tentacle) =>
            tentacle.name.toLowerCase() === data.category.toLowerCase()
              ? {
                  ...tentacle,
                  progress: Math.min(100, tentacle.progress + data.points / 10),
                }
              : tentacle
          )
        );
      }
    };

    socket.on("tentacle-updated", handleTentacleUpdate);

    return () => {
      socket.off("tentacle-updated", handleTentacleUpdate);
    };
  }, [socket, podId]);

  // Simulate tentacle growth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger((prev) => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative w-96 h-96 mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
        {/* Main octopus body */}
        <ellipse
          cx="200"
          cy="160"
          rx="60"
          ry="45"
          fill="url(#bodyGradient)"
          className="animate-float"
          style={{ transformOrigin: "200px 160px" }}
        />

        {/* Eyes */}
        <circle cx="180" cy="145" r="12" fill="white" />
        <circle cx="220" cy="145" r="12" fill="white" />
        <circle cx="180" cy="145" r="6" fill="#1f2937" />
        <circle cx="220" cy="145" r="6" fill="#1f2937" />

        {/* Animated tentacles with progress bars */}
        <g className="animate-tentacle">
          {tentacleData.map((tentacle, index) => {
            const angle = index * 60 - 150; // Spread tentacles around
            const startX = 200 + Math.cos((angle * Math.PI) / 180) * 50;
            const startY = 200 + Math.sin((angle * Math.PI) / 180) * 30;
            const endX = 200 + Math.cos((angle * Math.PI) / 180) * 150;
            const endY = 280 + Math.sin((angle * Math.PI) / 180) * 80;

            return (
              <g key={tentacle.name}>
                {/* Tentacle base */}
                <path
                  d={`M${startX},${startY} Q${startX + (endX - startX) * 0.5},${
                    startY + (endY - startY) * 0.7
                  } ${endX},${endY}`}
                  stroke="#3b826b"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Progress fill */}
                <path
                  d={`M${startX},${startY} Q${startX + (endX - startX) * 0.5},${
                    startY + (endY - startY) * 0.7
                  } ${startX + (endX - startX) * (tentacle.progress / 100)},${
                    startY + (endY - startY) * (tentacle.progress / 100)
                  }`}
                  stroke={tentacle.color}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    strokeDasharray: "200",
                    strokeDashoffset: animationTrigger % 2 === 0 ? "0" : "20",
                  }}
                />

                {/* Tentacle tip with icon */}
                <circle
                  cx={endX}
                  cy={endY}
                  r="20"
                  fill={tentacle.color}
                  opacity="0.8"
                />
                <text
                  x={endX}
                  y={endY + 6}
                  textAnchor="middle"
                  fontSize="16"
                  className="pointer-events-none select-none"
                >
                  {tentacle.icon}
                </text>

                {/* Progress label */}
                <text
                  x={endX}
                  y={endY + 35}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  className="font-semibold"
                >
                  {tentacle.name}
                </text>
                <text
                  x={endX}
                  y={endY + 50}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.7"
                >
                  {Math.round(tentacle.progress)}%
                </text>
              </g>
            );
          })}
        </g>

        {/* Gradients */}
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#74c69d" />
            <stop offset="70%" stopColor="#3b826b" />
            <stop offset="100%" stopColor="#2d6a4f" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
