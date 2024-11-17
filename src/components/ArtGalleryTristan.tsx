// src/components/ArtGalleryWithPopup.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Artwork {
  name: string;
  artist: string;
  image_url: string;
  date: string;
  description: string;
}

export default function ArtGalleryTristan() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://ia-signature-ia-back.hf.space/artworks/Tristan');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data: Artwork[] = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-100">Loading artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error fetching artworks: {error.message}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-zinc-900">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork, index) => {
            const aspectRatio = 0.8; // Default aspect ratio

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-amber-500 transition-all cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <CardContent className="p-0">
                    <div
                      className="relative w-full transition-all duration-300 ease-in-out"
                      style={{
                        paddingBottom: `${(1 / aspectRatio) * 100}%`,
                        maxHeight: '400px',
                      }}
                    >
                      <img
                        src={artwork.image_url}
                        alt={artwork.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-1 p-4 border-t border-zinc-700">
                    <h2 className="text-lg font-semibold text-amber-300 line-clamp-1">
                      {artwork.name}
                    </h2>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-zinc-400 text-sm">{artwork.artist}</p>
                      <p className="text-zinc-500 text-sm">{artwork.date}</p>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dialog for displaying artwork details */}
      <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
        <DialogContent className="sm:max-w-[800px] bg-zinc-800 border border-zinc-700 text-zinc-100">
          {selectedArtwork && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-amber-300">
                  {selectedArtwork.name}
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {selectedArtwork.artist}, {selectedArtwork.date}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="relative w-full items-center">
                  <img
                    src={selectedArtwork.image_url}
                    alt={selectedArtwork.name}
                    className="w-auto h-10/12 object-contain self-center"
                  />
                </div>
                <p className="mt-4 text-zinc-300">{selectedArtwork.description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
