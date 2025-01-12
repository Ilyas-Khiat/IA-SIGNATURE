import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import Chat from "./components/Chat";
import ArtGalleryWithPopup from "./components/ArtGalleryWithPopup";
import ArtGalleryTristan from "./components/ArtGalleryTristan";
import WhatIf from "./components/whatif";
import KnowledgeGraph from "./components/KnowledgeGraph";
import { Analytics } from '@vercel/analytics/react'; // Changed from next to react

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        {/* Routes without navigation */}
        <Route path="/" element={<LandingPage />} />

        {/* Routes with navigation */}
        <Route element={<Navigation />}>
          <Route path="/conversation" element={<Chat />} />
          <Route path="/magritte" element={<ArtGalleryWithPopup />} />
          <Route path="/tristan" element={<ArtGalleryTristan />} />
          <Route path="/whatif" element={<WhatIf />} />
          <Route path="/knowledge_graph" element={<KnowledgeGraph />} />
        </Route>
      </Routes>
      <Analytics />
    </div>
  );
};

export default App;
