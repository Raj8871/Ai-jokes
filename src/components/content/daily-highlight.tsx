'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCard from './content-card'; // Reuse the content card for display

// Mock data - in reality, fetch this from a source or use AI
const mockHighlights = {
  en: { id: 'dh-en-1', type: 'shayari', text: "Like stars guiding sailors, may hope light your way through the darkest of nights and brightest of days.", category: 'motivational', lang: 'en' },
  hi: { id: 'dh-hi-1', type: 'shayari', text: "जैसे तारे नाविकों का मार्गदर्शन करते हैं, आशा है कि सबसे अंधेरी रातों और सबसे उज्ज्वल दिनों में आपका मार्ग रोशन हो।", category: 'motivational', lang: 'hi' },
};

type HighlightItem = {
  id: string;
  type: 'joke' | 'shayari';
  text: string;
  category: string;
  lang: 'en' | 'hi';
};

interface DailyHighlightProps {
  language: 'en' | 'hi';
}

const DailyHighlight: React.FC<DailyHighlightProps> = ({ language }) => {
  const [highlight, setHighlight] = useState<HighlightItem | null>(null);

  useEffect(() => {
    // Simulate fetching the daily highlight based on language
    // In a real app, this could change daily
    setHighlight(mockHighlights[language]);
  }, [language]);

  const titleText = {
    en: "Today's Highlight",
    hi: "आज का विशेष",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl"
    >
      <Card className="border-accent shadow-md overflow-hidden">
        <CardHeader className="bg-accent/10">
          <CardTitle className={`text-xl font-semibold text-accent ${language === 'hi' ? 'font-hindi' : ''}`}>
            {titleText[language]}
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
                {/* Using ContentCard directly to display the highlight with actions */}
                <ContentCard content={highlight} language={language} />
              </motion.div>
            ) : (
              <p className={`text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>
                 {language === 'en' ? 'Loading highlight...' : 'मुख्य आकर्षण लोड हो रहा है...'}
              </p>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyHighlight;
