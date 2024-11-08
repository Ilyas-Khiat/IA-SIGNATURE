// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Quiz from "./components/Quiz";
import LandingPage from "./components/LandingPage";
import ResultsPage from "./components/ResultsPage";
import Chat from "./components/Chat";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<Chat/>} />
      {/* <Route path="/home" element={<LandingPage />} /> */}
    </Routes>
  
  );
};

export default App;
