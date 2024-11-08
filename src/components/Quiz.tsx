import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface QuizProps {}

const Quiz: React.FC<QuizProps> = () => {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process the answer if needed
    navigate("/results");
  };

  return (
    <motion.div
      className="mt-12 max-w-xl mx-auto p-6 bg-zinc-800 bg-opacity-80 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <h2 className="text-3xl font-serif text-amber-100 mb-4 text-center">
        Are you ready to embrace the enigma?
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-amber-50 text-lg mb-2" htmlFor="answer">
            What does the Phoenix symbolize to you?
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            className="w-full px-4 py-2 bg-zinc-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Your answer"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default Quiz;
