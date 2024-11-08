// src/components/Title.tsx
import React from "react";
import { motion } from "framer-motion";

const Title: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="text-center mt-12"
    >
      <h1 className="text-5xl md:text-7xl font-serif mb-6 text-amber-100">
        The Enigmatic Phoenix
      </h1>
      <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-50/80">
        Rising from the ashes, a symbol of rebirth and eternal mystery.
      </p>
    </motion.div>
  );
};

export default Title;
