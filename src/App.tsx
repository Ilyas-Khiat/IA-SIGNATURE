// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Chat from "./components/Chat";
import Navigation from "./components/Navigation";
import ArtGalleryWithPopup from "./components/ArtGalleryWithPopup";
import ArtGalleryTristan from "./components/ArtGalleryTristan";
import WhatIf from "./components/whatif";
import KnowledgeGraph from "./components/KnowledgeGraph"; // Import the new component

const App: React.FC = () => {
  return (
    <Routes>
      {/* Routes without navigation */}
      <Route path="/" element={<LandingPage />} />

      {/* Routes with navigation */}
      <Route element={<Navigation />}>
        <Route path="/conversation" element={<Chat />} />
        <Route path="/magritte" element={<ArtGalleryWithPopup />} />
        <Route path="/tristan" element={<ArtGalleryTristan />} />
        <Route path="/whatif" element={<WhatIf />} />
        <Route path="/knowledge_graph" element={<KnowledgeGraph />} /> {/* New Route */}
        {/* Add other routes that should include the navigation here */}
      </Route>
    </Routes>
  );
};

export default App;
