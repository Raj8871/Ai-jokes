'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DailyHighlight from '@/components/content/daily-highlight';
import SearchFilter from '@/components/content/search-filter';
import ContentCard from '@/components/content/content-card'; // Renamed ShayariCard / JokeCard

// Mock data (replace with actual data fetching)
const mockContent = {
  en: {
    jokes: [
      { id: 'j1', type: 'joke', text: "Why don't scientists trust atoms? Because they make up everything!", category: 'jokes', lang: 'en' },
      { id: 'j2', type: 'joke', text: "Why did the scarecrow win an award? Because he was outstanding in his field!", category: 'jokes', lang: 'en' },
    ],
    romantic: [
      { id: 'r1', type: 'shayari', text: "In your eyes, a universe I see, a love story written, just for you and me.", category: 'romantic', lang: 'en' },
      { id: 'r2', type: 'shayari', text: "Like a gentle breeze, your love touches my soul, making my broken heart finally whole.", category: 'romantic', lang: 'en' },
    ],
    sad: [
      { id: 's1', type: 'shayari', text: "Tears fall like rain on a lonely night, remembering moments that once felt so right.", category: 'sad', lang: 'en' },
    ],
    friendship: [
       { id: 'f1', type: 'shayari', text: "A true friend is a treasure, rare and kind, a bond of souls, forever intertwined.", category: 'friendship', lang: 'en' },
    ],
    motivational: [
       { id: 'm1', type: 'shayari', text: "Though the path is steep, keep climbing high, your strength within will reach the sky.", category: 'motivational', lang: 'en' },
    ]
  },
  hi: {
    jokes: [
      { id: 'hj1', type: 'joke', text: "वैज्ञानिक परमाणुओं पर भरोसा क्यों नहीं करते? क्योंकि वे सब कुछ बनाते हैं!", category: 'jokes', lang: 'hi' },
      { id: 'hj2', type: 'joke', text: "बिजूका ने पुरस्कार क्यों जीता? क्योंकि वह अपने क्षेत्र में उत्कृष्ट था!", category: 'jokes', lang: 'hi' },
    ],
    romantic: [
      { id: 'hr1', type: 'shayari', text: "तुम्हारी आँखों में, मैं एक ब्रह्मांड देखता हूँ, एक प्रेम कहानी लिखी है, सिर्फ तुम्हारे और मेरे लिए।", category: 'romantic', lang: 'hi' },
      { id: 'hr2', type: 'shayari', text: "एक हल्की हवा की तरह, तुम्हारा प्यार मेरी आत्मा को छूता है, मेरे टूटे हुए दिल को आखिरकार पूरा करता है।", category: 'romantic', lang: 'hi' },
    ],
     sad: [
      { id: 'hs1', type: 'shayari', text: "आँसू बारिश की तरह गिरते हैं अकेली रात में, उन पलों को याद करते हुए जो कभी बहुत सही लगते थे।", category: 'sad', lang: 'hi' },
    ],
    friendship: [
       { id: 'hf1', type: 'shayari', text: "एक सच्चा दोस्त एक खजाना है, दुर्लभ और दयालु, आत्माओं का बंधन, हमेशा के लिए जुड़ा हुआ।", category: 'friendship', lang: 'hi' },
    ],
    motivational: [
       { id: 'hm1', type: 'shayari', text: "भले ही रास्ता कठिन हो, ऊँचा चढ़ते रहो, तुम्हारी भीतर की ताकत आसमान तक पहुँच जाएगी।", category: 'motivational', lang: 'hi' },
    ]
  }
};

type ContentItem = {
  id: string;
  type: 'joke' | 'shayari';
  text: string;
  category: string;
  lang: 'en' | 'hi';
};

type Category = 'jokes' | 'romantic' | 'sad' | 'friendship' | 'motivational';

const categories: { key: Category; en: string; hi: string }[] = [
  { key: 'jokes', en: 'Jokes', hi: 'चुटकुले' },
  { key: 'romantic', en: 'Romantic Shayari', hi: 'रोमांटिक शायरी' },
  { key: 'sad', en: 'Sad Shayari', hi: 'दर्द भरी शायरी' },
  { key: 'friendship', en: 'Friendship Shayari', hi: 'दोस्ती शायरी' },
  { key: 'motivational', en: 'Motivational Shayari', hi: 'प्रेरक शायरी' },
];

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [content, setContent] = useState<Record<Category, ContentItem[]>>({
    jokes: [], romantic: [], sad: [], friendship: [], motivational: []
  });
  const [filteredContent, setFilteredContent] = useState<Record<Category, ContentItem[]>>({
    jokes: [], romantic: [], sad: [], friendship: [], motivational: []
  });
   const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | 'all'>('all');

  // Simulate fetching data and setting initial language based on preference/default
   useEffect(() => {
    // In a real app, fetch data here based on language
    const currentContent = mockContent[language];
    setContent(currentContent);
    setFilteredContent(currentContent); // Initially show all content
  }, [language]);

   // Filter content based on search term and category filter
  useEffect(() => {
    const currentContent = content; // Use the full content set for filtering
    let tempFiltered = {} as Record<Category, ContentItem[]>;

    categories.forEach(({ key }) => {
      tempFiltered[key] = currentContent[key]?.filter(item => {
        const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
      }) || [];
    });

    setFilteredContent(tempFiltered);
  }, [searchTerm, selectedCategoryFilter, content]); // Re-run filter when search, category, or base content changes


  const handleLanguageToggle = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'hi' : 'en'));
  };

  const welcomeMessages = {
    en: "Welcome to ShayariSaga!",
    hi: "शायरी सागा में आपका स्वागत है!",
  };

  const getCategoryLabel = (categoryKey: Category): string => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category[language] : '';
  }

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      {/* Language Toggle - Moved to Header */}

      {/* Animated Welcome Message */}
      <motion.h1
        key={language} // Re-trigger animation on language change
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-3xl md:text-4xl font-bold text-center text-primary ${language === 'hi' ? 'font-hindi' : ''}`}
      >
        {welcomeMessages[language]}
      </motion.h1>

      {/* Daily Highlight */}
      <DailyHighlight language={language} />

       {/* Search and Filter */}
      <SearchFilter
        language={language}
        categories={categories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategoryFilter}
        setSelectedCategory={setSelectedCategoryFilter}
      />


      {/* Category Tabs */}
      <Tabs defaultValue="jokes" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map(cat => (
            <TabsTrigger key={cat.key} value={cat.key} className={language === 'hi' ? 'font-hindi' : ''}>
              {cat[language]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.key} value={cat.key}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {filteredContent[cat.key] && filteredContent[cat.key].length > 0 ? (
                 filteredContent[cat.key].map(item => (
                    <ContentCard key={item.id} content={item} language={language} />
                 ))
              ) : (
                <p className={`text-center col-span-full ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'en' ? 'No content available in this category yet.' : 'इस श्रेणी में अभी कोई सामग्री उपलब्ध नहीं है।'}
                </p>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* TODO: Add User Auth and Submit Form components later */}
    </div>
  );
}
