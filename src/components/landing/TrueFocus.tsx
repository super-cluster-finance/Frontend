"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

export default function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = "red",
  animationDuration = 2,
  pauseBetweenAnimations = 1,
}: TrueFocusProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const words = sentence.split(" ");

  useEffect(() => {
    if (manualMode) return;

    let currentIndex = 0;
    const totalWords = words.length;

    const interval = setInterval(() => {
      setFocusedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalWords;

      if (currentIndex === 0) {
        setTimeout(() => {
          setFocusedIndex(null);
        }, animationDuration * 1000);
      }
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="relative inline-block"
          animate={{
            filter:
              focusedIndex === index ? "blur(0px)" : `blur(${blurAmount}px)`,
            scale: focusedIndex === index ? 1.05 : 1,
          }}
          transition={{
            duration: animationDuration,
            ease: "easeInOut",
          }}
          style={{
            display: "inline-block",
            position: "relative",
          }}
        >
          {word}
          {focusedIndex === index && (
            <motion.span
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                border: `2px solid ${borderColor}`,
                borderRadius: "4px",
              }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}
