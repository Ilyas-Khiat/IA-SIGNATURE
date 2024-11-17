// src/components/PhoenixRiddle.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw } from "lucide-react"; // Import the refresh icon
import axios from "axios";

interface PhoenixRiddleProps {
  isVisible: boolean;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

interface SphinxQuestion {
  question: string;
  answers: string[];
}

interface VerifyResponseModel {
  response: string;
  answers: string[];
  question: string;
}

const API_BASE_URL = 'https://ia-signature-ia-back.hf.space'; // Replace with your API base URL

const PhoenixRiddle: React.FC<PhoenixRiddleProps> = ({
  isVisible,
  onAnswerSubmit,
}) => {
  const [currentRiddle, setCurrentRiddle] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string>("");

  // Extracted fetchQuestion function
  const fetchQuestion = async () => {
    try {
      setCurrentRiddle("");
      const response = await axios.post<SphinxQuestion>(
        `${API_BASE_URL}/generate_sphinx`
      );
      setCurrentRiddle(response.data.question);
      setAnswers(response.data.answers);
      setAnswer("");
      setError("");
    } catch (err) {
      console.error("Error fetching sphinx question:", err);
      setError("Erreur lors du chargement de la question. Veuillez réessayer.");
    }
  };

  // Fetch the sphinx question when the component is visible
  useEffect(() => {
    if (isVisible) {
      fetchQuestion();
    }
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentRiddle || answers.length === 0) {
      setError("La question n'a pas encore été chargée. Veuillez réessayer.");
      return;
    }

    const verifyData: VerifyResponseModel = {
      response: answer,
      answers: answers,
      question: currentRiddle,
    };

    try {
      const response = await axios.post<{ score: boolean }>(
        `${API_BASE_URL}/verify_sphinx`,
        verifyData
      );

      if (response.data.score) {
        // Answer is correct
        setError("Bravo ! IA SIGNATURE vous félicite. Vous avez bien compris le sens du récit");
        setTimeout(() => {
          onAnswerSubmit(true);
        }, 7000);
      } else {
        // Answer is incorrect
        setError("IA SIGNATURE vous recommande de relire la nouvelle afin de mieux comprendre le sens du récit");
        setTimeout(() => {
          setError("");
        }, 7000);
        console.log("The correct answer is:", answers);
        onAnswerSubmit(false);
      }
    } catch (err) {
      console.error("Error verifying answer:", err);
      setError("Échec de la vérification de la réponse. Veuillez réessayer.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="riddle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl max-w-2xl mx-auto text-amber-50/80 italic"
        >
          <p className="text-3xl mb-4">
            "{currentRiddle || "Génération de la question..."}"
          </p>
          {error && (
            <p className="mb-4 text-blue-400 text-center">{error}</p>
          )}
          <br />
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center mt-4"
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Votre réponse"
              className="px-4 py-2 w-full max-w-md bg-zinc-800 text-amber-50 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-amber-50 rounded-r-full p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300"
              aria-label="Submit answer"
            >
              <Send size={24} />
            </button>
          </form>
          {/* Refresh icon button */}
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={fetchQuestion}
              className="text-amber-50 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300"
              aria-label="Refresh question"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoenixRiddle;
