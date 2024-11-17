import React from "react";
import { motion } from "framer-motion";

const ResultsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <motion.div
        className="text-center p-8 bg-zinc-800 bg-opacity-80 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-serif text-amber-100 mb-6">
          Pas encore disponible
        </h1>
        <p className="text-xl text-amber-50/80">
          cette page est en cours de construction
        </p>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
