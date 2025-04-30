// src/app/jokes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ContentCard from '@/components/content/content-card';
import SearchFilter from '@/components/content/search-filter';
import type { ContentItem } from '@/app/page'; // Reuse the type
import { motion } from 'framer-motion';

// Mock data (can be moved to a shared location or fetched)
const mockJokes = {
  en: [
      { id: 'j1', type: 'joke', text: "Why don't scientists trust atoms? Because they make up everything!", category: 'jokes', lang: 'en' },
      { id: 'j2', type: 'joke', text: "Why did the scarecrow win an award? Because he was outstanding in his field!", category: 'jokes', lang: 'en' },
      { id: 'j3', type: 'joke', text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", category: 'jokes', lang: 'en' },
      { id: 'j4', type: 'joke', text: "What do you call fake spaghetti? An impasta!", category: 'jokes', lang: 'en' },
      { id: 'j5', type: 'joke', text: "Why did the bicycle fall over? Because it was two tired!", category: 'jokes', lang: 'en' },
      { id: 'j6', type: 'joke', text: "What do you call a lazy kangaroo? Pouch potato!", category: 'jokes', lang: 'en' },
      { id: 'j7', type: 'joke', text: "Why don't eggs tell jokes? They'd crack each other up!", category: 'jokes', lang: 'en' },
      { id: 'j8', type: 'joke', text: "What musical instrument is found in the bathroom? A tuba toothpaste!", category: 'jokes', lang: 'en' },
    ],
  hi: [
      { id: 'hj1', type: 'joke', text: "वैज्ञानिक परमाणुओं पर भरोसा क्यों नहीं करते? क्योंकि वे सब कुछ बनाते हैं!", category: 'jokes', lang: 'hi' },
      { id: 'hj2', type: 'joke', text: "बिजूका ने पुरस्कार क्यों जीता? क्योंकि वह अपने क्षेत्र में उत्कृष्ट था!", category: 'jokes', lang: 'hi' },
      { id: 'hj3', type: 'joke', text: "मैंने अपनी पत्नी से कहा कि वह अपनी भौहें बहुत ऊंची बना रही है। वह हैरान दिखी।", category: 'jokes', lang: 'hi' },
      { id: 'hj4', type: 'joke', text: "नकली स्पेगेटी को क्या कहते हैं? एक इम्पोस्टा!", category: 'jokes', lang: 'hi' },
      { id: 'hj5', type: 'joke', text: "साइकिल क्यों गिर गई? क्योंकि वह दो थकी हुई थी!", category: 'jokes', lang: 'hi' },
      { id: 'hj6', type: 'joke', text: "आलसी कंगारू को क्या कहते हैं? थैली आलू!", category: 'jokes', lang: 'hi' },
      { id: 'hj7', type: 'joke', text: "अंडे चुटकुले क्यों नहीं सुनाते? वे एक-दूसरे को हंसाएंगे!", category: 'jokes', lang: 'hi' },
      { id: 'hj8', type: 'joke', text: "बाथरूम में कौन सा वाद्य यंत्र पाया जाता है? एक टूबा टूथपेस्ट!", category: 'jokes', lang: 'hi' },
    ]
};

const jokeCategories = [
    { key: 'jokes', en: 'Jokes', hi: 'चुटकुले' }
    // Add more specific joke categories if needed later
];

const pageText = {
  en: {
    title: "Jokes",
    description: "Tickle your funny bone with our collection of jokes!",
    noContentFound: "No jokes found matching your search.",
  },
  hi: {
    title: "चुटकुले",
    description: "हमारे चुटकुलों के संग्रह से अपनी गुदगुदी करें!",
    noContentFound: "आपकी खोज से मेल खाने वाला कोई चुटकुला नहीं मिला।",
  }
};

export default function JokesPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [jokes, setJokes] = useState<ContentItem[]>([]);
  const [filteredJokes, setFilteredJokes] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
     const savedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
     const currentLang = savedLang || 'en';
     setLanguage(currentLang);

     const handleLanguageChange = () => {
        const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' || 'en';
        setLanguage(updatedLang);
     };
     window.addEventListener('languageChanged', handleLanguageChange);

     return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    const currentJokes = mockJokes[language];
    setJokes(currentJokes);
    filterJokes(currentJokes, searchTerm);
  }, [language, searchTerm]);

  const filterJokes = (baseJokes: ContentItem[], term: string) => {
    const filtered = baseJokes.filter(joke =>
      joke.text.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredJokes(filtered);
  };

  const currentText = pageText[language];

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <motion.div
        key={language + "-jokes-title"}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className={`text-3xl md:text-4xl font-bold text-primary ${language === 'hi' ? 'font-hindi' : ''}`}>
          {currentText.title}
        </h1>
        <p className={`mt-2 text-muted-foreground md:text-lg ${language === 'hi' ? 'font-hindi' : ''}`}>
          {currentText.description}
        </p>
      </motion.div>

      <motion.div
        key={language + "-jokes-search"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        {/* Simplified Search Filter - only search term for now */}
         <SearchFilter
            language={language}
            categories={[]} // No category filter needed for this specific page yet
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={'all'} // Not used here
            setSelectedCategory={() => {}} // Not used here
        />
      </motion.div>

      <motion.div
        key={language + "-jokes-content"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {filteredJokes.length > 0 ? (
          filteredJokes.map(item => (
            <ContentCard key={item.id} content={item} language={item.lang} />
          ))
        ) : (
          <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-center col-span-full text-muted-foreground py-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {currentText.noContentFound}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
