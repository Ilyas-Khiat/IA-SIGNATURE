// src/components/LandingPage.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoenixRiddle from "./PhoenixRiddle";
import { useNavigate } from "react-router-dom";
import magritte from "@/assets/magritte.png"; // Ensure this path is correct

interface StarProps {
  id: number;
  size: number;
  left: number; // Percentage position
  top: number;  // Percentage position
  deltaX: number; // Pixel movement in X
  deltaY: number; // Pixel movement in Y
  duration: number;
  delay: number;
}

const numStars = 500;
const stars: StarProps[] = [...Array(numStars)].map((_, i) => ({
  id: i,
  size: Math.random() * 2 + 1,
  left: Math.random() * 100, // Random left position (0% to 100%)
  top: Math.random() * 100,  // Random top position (0% to 100%)
  deltaX: Math.random() * 200 - 100, // Movement between -100px and 100px
  deltaY: Math.random() * 200 - 100, // Movement between -100px and 100px
  duration: Math.random() * 20 + 10, // Duration between 10s and 30s
  delay: Math.random() * 5,          // Random delay up to 5s
}));

const LandingPage: React.FC = () => {
  const [showRiddle, setShowRiddle] = useState(false);
  const navigate = useNavigate();

  const handleAnswerSubmit = (isCorrect: boolean, question: string, answer: string) => {
    if (isCorrect) {
      navigate("/whatif", {
        state: {
          question,
          answer
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative">
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 to-transparent pointer-events-none" />
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0.7,
              scale: 1,
            }}
            animate={{
              x: star.deltaX,
              y: star.deltaY,
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1.1, 0.5],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
            }}
          />
        ))}
      </div>
      <br />
      <br />
      <h1 className="text-xl md:text-5xl font-serif text-center text-amber-100">
            La confession muette
          </h1>
      <div className="container mx-auto px-1 py-20 relative z-10 text-center">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center items-center"
        >
          <motion.div
            className="relative group"
            whileHover={{
              scale: 1.05,
              filter: "brightness(1.2)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Bloom effect background */}
            {/* The image */}
            <img
              src={magritte}
              alt="magritte"
              className="w-auto h-21 relative z-1"
            />
          </motion.div>
        </motion.div>

        {/* Central Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mt-12"
        >

          <br />

          <AnimatePresence mode="wait">
            {!showRiddle && (
              <motion.p
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-3xl max-w-2xl mx-auto text-amber-50/80 mb-6"
              >
                l'IA SIGNATURE vous invite à réponde à l'énigme du récit pour accéder à la suite de l'expérience.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Phoenix Riddle Component */}
          <PhoenixRiddle
            isVisible={showRiddle}
            onAnswerSubmit={handleAnswerSubmit}
          />

          {/* Reveal Riddle Button */}
          {!showRiddle && (
            <motion.button
              className="mt-6 px-6 py-3 bg-amber-600 text-amber-100 rounded-full font-semibold text-lg shadow-lg hover:bg-amber-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRiddle(true)}
            >
              Révéler l'énigme
            </motion.button>
          )}
        </motion.div>

        {/* Centered Line at the Bottom */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <div className="w-40 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full" />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-sm text-amber-50"
        >
          <p>
            Auteur Gaspard Boréal.
          </p>
          <p>
            Conception et développement Laurent TRIPIED et Ilyas KHIAT.
          </p>
          <p>
            &copy; 2024 IA SIGNATURE. Tous droits réservés.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;
