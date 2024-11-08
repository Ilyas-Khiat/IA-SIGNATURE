// src/components/AnimatedImage.tsx
import React from "react";
import { motion } from "framer-motion";

const AnimatedImage: React.FC = () => {
  return (
    <motion.div
      className="w-96 h-96 relative overflow-hidden rounded-full shadow-2xl"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 30px rgba(251, 191, 36, 0.7)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src="/phoenix.jpg" // Place the image in the public folder
        alt="Phoenix or Enigma"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </motion.div>
  );
};

export default AnimatedImage;
