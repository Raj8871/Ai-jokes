'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2, Loader2, Wand2 } from 'lucide-react'; // Added Loader2, Wand2
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DailyHighlight from '@/components/content/daily-highlight';
import SearchFilter from '@/components/content/search-filter';
import ContentCard from '@/components/content/content-card'; // Renamed ShayariCard / JokeCard
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Added RadioGroup
import { generateContent, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/generate-content-flow'; // Added AI flow import

// Mock data (replace with actual data fetching / Firestore)
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
  category: string; // Can be 'ai-generated' for AI content if needed
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

const aiKeywordSuggestions = {
  en: ["Love", "Friendship", "Motivation", "Breakup", "Funny Animals", "Work Life"],
  hi: ["प्यार", "दोस्ती", "प्रेरणा", "ब्रेकअप", "मज़ेदार जानवर", "कामकाजी जीवन"]
};


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
  const { toast } = useToast(); // Use toast hook

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContentType, setAiContentType] = useState<'joke' | 'shayari'>('shayari');
  const [generatedContent, setGeneratedContent] = useState<ContentItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);


  // Set language based on localStorage on initial load
  useEffect(() => {
     const savedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
     if (savedLang) {
       setLanguage(savedLang);
     }
     // Listen for language changes triggered by Header
     const handleLanguageChange = () => {
        const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
        if (updatedLang) {
             setLanguage(updatedLang);
        }
     };
     window.addEventListener('languageChanged', handleLanguageChange);
     // Initial fetch/load based on determined language
     const currentContent = mockContent[savedLang || 'en'];
     setContent(currentContent);
     setFilteredContent(currentContent);

     return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []); // Run only once on mount


   // Refetch mock data when language changes (replace with actual fetch)
   useEffect(() => {
    const currentContent = mockContent[language];
    setContent(currentContent);
    // Reset filters when language changes? Optional.
    // setSearchTerm('');
    // setSelectedCategoryFilter('all');
    // Keep filters applied:
    filterContent(currentContent, searchTerm, selectedCategoryFilter);
    setGeneratedContent(null); // Clear previous AI generation on language change
  }, [language]);


  // Filter content function
  const filterContent = (
    baseContent: Record<Category, ContentItem[]>,
    currentSearchTerm: string,
    currentCategoryFilter: Category | 'all'
   ) => {
    let tempFiltered = {} as Record<Category, ContentItem[]>;

    categories.forEach(({ key }) => {
      tempFiltered[key] = baseContent[key]?.filter(item => {
        const matchesSearch = item.text.toLowerCase().includes(currentSearchTerm.toLowerCase());
        const matchesCategory = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
        return matchesSearch && matchesCategory;
      }) || [];
    });
    setFilteredContent(tempFiltered);
  };

   // Trigger filtering when search term or category changes
   useEffect(() => {
     filterContent(content, searchTerm, selectedCategoryFilter);
   }, [searchTerm, selectedCategoryFilter, content]); // Re-run filter when search, category, or base content changes


  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('shayariSagaLang', newLang);
    // Dispatch custom event for header/footer if they rely on it
    window.dispatchEvent(new Event('languageChanged'));
  };


  // --- AI Generation Handler ---
  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: language === 'en' ? 'Input Required' : 'इनपुट आवश्यक है',
        description: language === 'en' ? 'Please enter a keyword or theme.' : 'कृपया कोई कीवर्ड या विषय दर्ज करें।',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null); // Clear previous result

    try {
      const input: GenerateContentInput = {
        language,
        type: aiContentType,
        prompt: aiPrompt.trim(),
      };
      const result: GenerateContentOutput = await generateContent(input);

      // Create a ContentItem from the result
      const newContentItem: ContentItem = {
        id: `ai-${Date.now()}`, // Simple unique ID for AI content
        type: aiContentType,
        text: result.generatedText,
        category: 'ai-generated', // Mark as AI generated
        lang: language,
      };
      setGeneratedContent(newContentItem);
      // Optional: Save to Firestore here (async) tagged as AI-generated
      // await saveAiContentToFirestore(newContentItem);

    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: language === 'en' ? 'Generation Failed' : 'उत्पन्न करने में विफल',
        description: language === 'en' ? 'Could not generate content. Please try again.' : 'सामग्री उत्पन्न नहीं की जा सकी। कृपया पुन: प्रयास करें।',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  // --- End AI Generation ---

  const welcomeMessages = {
    en: "Welcome to ShayariSaga!",
    hi: "शायरी सागा में आपका स्वागत है!",
  };

  const getCategoryLabel = (categoryKey: Category): string => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category[language] : '';
  }

  return (
    <div className="flex flex-col items-center w-full space-y-12"> {/* Increased spacing */}
      {/* Language Toggle - Now handled in Header */}

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

      {/* --- AI Generation Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }} // Slight delay after highlight
        className="w-full max-w-2xl"
      >
        <Card className="border-primary shadow-md overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className={`text-xl font-semibold text-primary flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
              <Wand2 className="h-5 w-5" />
              {language === 'en' ? 'Generate with AI' : 'एआई के साथ उत्पन्न करें'}
            </CardTitle>
             <p className={`text-sm text-muted-foreground pt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
               {language === 'en' ? 'Enter a keyword or theme (e.g., "Friendship", "Rainy Day")' : 'कोई कीवर्ड या थीम दर्ज करें (जैसे, "दोस्ती", "बरसात का दिन")'}
             </p>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Type Selection */}
            <div className="space-y-2">
                 <Label className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {language === 'en' ? 'Select Type:' : 'प्रकार चुनें:'}
                 </Label>
                 <RadioGroup
                    defaultValue={aiContentType}
                    onValueChange={(value: 'joke' | 'shayari') => setAiContentType(value)}
                    className="flex space-x-4"
                  >
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="shayari" id="ai-shayari" />
                     <Label htmlFor="ai-shayari" className={language === 'hi' ? 'font-hindi' : ''}>{language === 'en' ? 'Shayari' : 'शायरी'}</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="joke" id="ai-joke" />
                     <Label htmlFor="ai-joke" className={language === 'hi' ? 'font-hindi' : ''}>{language === 'en' ? 'Joke' : 'चुटकुला'}</Label>
                   </div>
                 </RadioGroup>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
                <Label htmlFor="ai-prompt" className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
                   {language === 'en' ? 'Keyword / Theme:' : 'कीवर्ड / थीम:'}
                </Label>
                <Input
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={language === 'en' ? 'e.g., Love, Motivation...' : 'उदा., प्यार, प्रेरणा...'}
                  className={language === 'hi' ? 'font-hindi placeholder:font-hindi' : ''}
                  disabled={isGenerating}
                />
            </div>

            {/* Suggestion Box */}
            <div className="flex flex-wrap gap-2 text-xs">
                <span className={`text-muted-foreground mr-1 ${language === 'hi' ? 'font-hindi' : ''}`}>{language === 'en' ? 'Try:' : 'कोशिश करें:'}</span>
                {aiKeywordSuggestions[language].map(suggestion => (
                    <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className={`h-auto py-0.5 px-1.5 text-xs ${language === 'hi' ? 'font-hindi' : ''}`}
                        onClick={() => setAiPrompt(suggestion)}
                        disabled={isGenerating}
                    >
                        {suggestion}
                    </Button>
                ))}
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerateContent} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Generating...' : 'उत्पन्न हो रहा है...'}
                </>
              ) : (
                 <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Generate' : 'उत्पन्न करें'}
                 </>
              )}
            </Button>

            {/* Generated Content Display */}
            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <h4 className={`font-semibold mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {language === 'en' ? 'AI Generated Result:' : 'एआई उत्पन्न परिणाम:'}
                </h4>
                <ContentCard content={generatedContent} language={language} />
              </motion.div>
            )}
            </CardContent>
        </Card>
      </motion.div>
      {/* --- End AI Generation Section --- */}


       {/* Search and Filter for Existing Content */}
       <div className="w-full max-w-4xl space-y-2">
            <h2 className={`text-2xl font-semibold text-center mb-4 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {language === 'en' ? 'Browse Collection' : 'संग्रह ब्राउज़ करें'}
            </h2>
            <SearchFilter
                language={language}
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategoryFilter}
                setSelectedCategory={setSelectedCategoryFilter}
            />
       </div>


      {/* Category Tabs for Existing Content */}
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
                <p className={`text-center col-span-full text-muted-foreground py-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {language === 'en' ? 'No content found matching your filters.' : 'आपके फ़िल्टर से मेल खाने वाली कोई सामग्री नहीं मिली।'}
                </p>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* TODO: Add User Auth, Submit Form, Firestore integration, PWA, etc. */}
    </div>
  );
}
