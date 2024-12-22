// src/components/KnowledgeGraph.tsx
import React from 'react';

const KnowledgeGraph: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        src="https://ia-signature-analyse-agent.hf.space"
        title="Knowledge Graph"
        frameBorder="0"
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      ></iframe>
    </div>
  );
};

export default KnowledgeGraph;
