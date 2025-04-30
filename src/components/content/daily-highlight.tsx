// src/components/content/daily-highlight.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCard from './content-card'; // Reuse the content card for display
import type { ContentItem } from '@/app/page'; // Import type from page

// Mock data - in reality, fetch this from a source or use AI
const mockHighlights: Record<'en' | 'hi', ContentItem> = {
  en: { id: 'dh-en-1', type: 'shayari', text: "Like stars guiding sailors, may hope light your way through the darkest of nights and brightest of days.", category: 'motivational', lang: 'en' },
  hi: { id: 'dh-hi-1', type: 'shayari', text: "जैसे तारे नाविकों का मार्गदर्शन करते हैं, आशा है कि सबसे अंधेरी रातों और सबसे उज्ज्वल दिनों में आपका मार्ग रोशन हो।", category: 'motivational', lang: 'hi' },
};

interface DailyHighlightProps {
  language: 'en' | 'hi';
}

// Text content for different languages
const highlightText = {
  en: {
    title: "Today's Highlight",
    loading: "Loading highlight...",
  },
  hi: {
    title: "आज का विशेष",
    loading: "मुख्य आकर्षण लोड हो रहा है...",
  }
};

const DailyHighlight: React.FC<DailyHighlightProps> = ({ language }) => {
  const [highlight, setHighlight] = useState<ContentItem | null>(null);

  useEffect(() => {
    // Simulate fetching the daily highlight based on language
    setHighlight(mockHighlights[language]);
  }, [language]);

  const currentText = highlightText[language]; // Get text based on current language

  return (
    <motion.div
      key={language + "-daily-highlight"} // Ensure re-animation on language change
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl"
    >
      <Card className="border-accent shadow-lg overflow-hidden"> {/* Increased shadow */}
        <CardHeader className="bg-accent/10">
          <CardTitle className={`text-xl font-semibold text-accent ${language === 'hi' ? 'font-hindi' : ''}`}>
            {currentText.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <AnimatePresence mode="wait">
            {highlight ? (
              <motion.div
                key={highlight.id} // Ensure animation triggers on content change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Pass the correct language prop based on the highlight's content */}
                <ContentCard content={highlight} language={highlight.lang} />
              </motion.div>
            ) : (
              <p className={`text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>
                 {currentText.loading}
              </p>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyHighlight;
