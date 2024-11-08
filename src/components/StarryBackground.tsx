// src/components/StarryBackground.tsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const StarryBackground: React.FC = () => {
  const starsControl = useAnimation();

  useEffect(() => {
    starsControl.start({
      opacity: [0.4, 1, 0.4],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    });
  }, [starsControl]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={starsControl}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
