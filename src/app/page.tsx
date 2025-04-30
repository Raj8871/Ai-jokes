// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2, Loader2, Wand2, Languages, Lightbulb, Star } from 'lucide-react'; // Added icons
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DailyHighlight from '@/components/content/daily-highlight';
import SearchFilter from '@/components/content/search-filter';
import ContentCard from '@/components/content/content-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateContent, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/generate-content-flow';

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

export type ContentItem = {
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

const aiKeywordSuggestions = {
  en: ["Love", "Friendship", "Motivation", "Breakup", "Funny Animals", "Work Life"],
  hi: ["प्यार", "दोस्ती", "प्रेरणा", "ब्रेकअप", "मज़ेदार जानवर", "कामकाजी जीवन"]
};

// Text content for different languages
const pageText = {
  en: {
    welcome: "Welcome to ShayariSaga!",
    aboutTitle: "Discover, Generate, Share",
    aboutText: "Your ultimate destination for beautiful Shayari and witty Jokes in both English and Hindi. Explore our curated collection, or let our AI generate unique content just for you!",
    featuresTitle: "Key Features",
    feature1Title: "Bilingual Content",
    feature1Text: "Enjoy jokes and Shayari in both English and Hindi.",
    feature2Title: "AI Generation",
    feature2Text: "Create new content instantly based on your themes.",
    feature3Title: "Save & Share",
    feature3Text: "Keep your favorites and easily share with friends.",
    aiGenerateTitle: "Generate with AI",
    aiGenerateDescription: "Enter a keyword or theme (e.g., \"Friendship\", \"Rainy Day\")",
    aiSelectType: "Select Type:",
    aiShayari: "Shayari",
    aiJoke: "Joke",
    aiKeywordTheme: "Keyword / Theme:",
    aiPlaceholder: "e.g., Love, Motivation...",
    aiTry: "Try:",
    aiGenerateButton: "Generate",
    aiGeneratingButton: "Generating...",
    aiResultTitle: "AI Generated Result:",
    browseTitle: "Browse Collection",
    noContentFound: "No content found matching your filters.",
    inputRequired: "Input Required",
    inputRequiredDesc: "Please enter a keyword or theme.",
    generationFailed: "Generation Failed",
    generationFailedDesc: "Could not generate content. Please try again.",
  },
  hi: {
    welcome: "शायरी सागा में आपका स्वागत है!",
    aboutTitle: "खोजें, उत्पन्न करें, साझा करें",
    aboutText: "अंग्रेजी और हिंदी दोनों में सुंदर शायरी और मजेदार चुटकुलों के लिए आपका अंतिम गंतव्य। हमारे क्यूरेटेड संग्रह का अन्वेषण करें, या हमारे एआई को केवल आपके लिए अद्वितीय सामग्री उत्पन्न करने दें!",
    featuresTitle: "मुख्य विशेषताएं",
    feature1Title: "द्विभाषी सामग्री",
    feature1Text: "अंग्रेजी और हिंदी दोनों में चुटकुलों और शायरी का आनंद लें।",
    feature2Title: "एआई जनरेशन",
    feature2Text: "अपने विषयों के आधार पर तुरंत नई सामग्री बनाएं।",
    feature3Title: "सहेजें और साझा करें",
    feature3Text: "अपने पसंदीदा रखें और दोस्तों के साथ आसानी से साझा करें।",
    aiGenerateTitle: "एआई के साथ उत्पन्न करें",
    aiGenerateDescription: "कोई कीवर्ड या थीम दर्ज करें (जैसे, \"दोस्ती\", \"बरसात का दिन\")",
    aiSelectType: "प्रकार चुनें:",
    aiShayari: "शायरी",
    aiJoke: "चुटकुला",
    aiKeywordTheme: "कीवर्ड / थीम:",
    aiPlaceholder: "उदा., प्यार, प्रेरणा...",
    aiTry: "कोशिश करें:",
    aiGenerateButton: "उत्पन्न करें",
    aiGeneratingButton: "उत्पन्न हो रहा है...",
    aiResultTitle: "एआई उत्पन्न परिणाम:",
    browseTitle: "संग्रह ब्राउज़ करें",
    noContentFound: "आपके फ़िल्टर से मेल खाने वाली कोई सामग्री नहीं मिली।",
    inputRequired: "इनपुट आवश्यक है",
    inputRequiredDesc: "कृपया कोई कीवर्ड या विषय दर्ज करें।",
    generationFailed: "उत्पन्न करने में विफल",
    generationFailedDesc: "सामग्री उत्पन्न नहीं की जा सकी। कृपया पुन: प्रयास करें।",
  }
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
  const { toast } = useToast();

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
     const handleLanguageChange = () => {
        const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
        if (updatedLang) {
             setLanguage(updatedLang);
        }
     };
     window.addEventListener('languageChanged', handleLanguageChange);
     const currentContent = mockContent[savedLang || 'en'];
     setContent(currentContent);
     setFilteredContent(currentContent); // Apply initial filtering

     // Apply filters from initial state as well
     filterContent(currentContent, searchTerm, selectedCategoryFilter);

     return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []); // Run only once on mount


   // Refetch mock data and apply filters when language changes
   useEffect(() => {
    const currentContent = mockContent[language];
    setContent(currentContent);
    filterContent(currentContent, searchTerm, selectedCategoryFilter); // Re-apply filters
    setGeneratedContent(null); // Clear previous AI generation
  }, [language, searchTerm, selectedCategoryFilter]); // Add filter dependencies


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
        // Ensure item language matches current language, OR if it's AI generated (allow showing it regardless of language setting? TBD)
        // For now, strictly filter by language:
        const matchesLanguage = item.lang === language;
        return matchesSearch && matchesCategory && matchesLanguage;
      }) || [];
    });
    setFilteredContent(tempFiltered);
  };

   // Trigger filtering when search term or category changes
   // This useEffect is now combined with the language change useEffect above


  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('shayariSagaLang', newLang);
    window.dispatchEvent(new Event('languageChanged'));
  };


  // --- AI Generation Handler ---
  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: pageText[language].inputRequired,
        description: pageText[language].inputRequiredDesc,
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

      const newContentItem: ContentItem = {
        id: `ai-${Date.now()}`,
        type: aiContentType,
        text: result.generatedText,
        category: 'ai-generated',
        lang: language, // Generated content is in the current language
      };
      setGeneratedContent(newContentItem);

    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: pageText[language].generationFailed,
        description: pageText[language].generationFailedDesc,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  // --- End AI Generation ---

  const getCategoryLabel = (categoryKey: Category): string => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category[language] : '';
  }

  const currentText = pageText[language]; // Get text based on current language

  return (
    <div className="flex flex-col items-center w-full space-y-12 md:space-y-16"> {/* Increased spacing */}

      {/* Animated Welcome Message */}
      <motion.h1
        key={language + "-welcome"} // Ensure re-animation on language change
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-3xl md:text-4xl font-bold text-center text-primary ${language === 'hi' ? 'font-hindi' : ''}`}
      >
        {currentText.welcome}
      </motion.h1>

      {/* About Section */}
        <motion.section
          key={language + "-about"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-3xl text-center space-y-3"
        >
            <h2 className={`text-2xl md:text-3xl font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.aboutTitle}
            </h2>
            <p className={`text-muted-foreground md:text-lg ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.aboutText}
            </p>
        </motion.section>

      {/* Key Features Section */}
        <motion.section
          key={language + "-features"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl"
        >
            <h2 className={`text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Feature 1 */}
                 <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="text-center p-6 h-full border-secondary hover:border-primary transition-colors duration-300">
                        <CardHeader className="p-0 mb-3">
                            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                                <Languages className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <h3 className={`text-lg font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature1Title}</h3>
                            <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature1Text}</p>
                        </CardContent>
                    </Card>
                 </motion.div>
                 {/* Feature 2 */}
                 <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="text-center p-6 h-full border-secondary hover:border-primary transition-colors duration-300">
                        <CardHeader className="p-0 mb-3">
                            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                                <Lightbulb className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <h3 className={`text-lg font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature2Title}</h3>
                            <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature2Text}</p>
                        </CardContent>
                    </Card>
                </motion.div>
                 {/* Feature 3 */}
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="text-center p-6 h-full border-secondary hover:border-primary transition-colors duration-300">
                        <CardHeader className="p-0 mb-3">
                             <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                                <Star className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <h3 className={`text-lg font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature3Title}</h3>
                            <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature3Text}</p>
                        </CardContent>
                    </Card>
                 </motion.div>
            </div>
        </motion.section>

      {/* Daily Highlight */}
      <DailyHighlight language={language} />

      {/* --- AI Generation Section --- */}
      <motion.div
        key={language + "-ai-gen"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }} // Delay adjusted
        className="w-full max-w-2xl"
      >
        <Card className="border-primary shadow-lg overflow-hidden"> {/* Increased shadow */}
          <CardHeader className="bg-primary/10">
            <CardTitle className={`text-xl font-semibold text-primary flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
              <Wand2 className="h-5 w-5" />
              {currentText.aiGenerateTitle}
            </CardTitle>
             <p className={`text-sm text-muted-foreground pt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
               {currentText.aiGenerateDescription}
             </p>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Type Selection */}
            <div className="space-y-2">
                 <Label className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
                    {currentText.aiSelectType}
                 </Label>
                 <RadioGroup
                    defaultValue={aiContentType}
                    onValueChange={(value: 'joke' | 'shayari') => setAiContentType(value)}
                    className="flex space-x-4"
                  >
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="shayari" id="ai-shayari" />
                     <Label htmlFor="ai-shayari" className={language === 'hi' ? 'font-hindi' : ''}>{currentText.aiShayari}</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="joke" id="ai-joke" />
                     <Label htmlFor="ai-joke" className={language === 'hi' ? 'font-hindi' : ''}>{currentText.aiJoke}</Label>
                   </div>
                 </RadioGroup>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
                <Label htmlFor="ai-prompt" className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
                   {currentText.aiKeywordTheme}
                </Label>
                <Input
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={currentText.aiPlaceholder}
                  className={language === 'hi' ? 'font-hindi placeholder:font-hindi' : ''}
                  disabled={isGenerating}
                />
            </div>

            {/* Suggestion Box */}
            <div className="flex flex-wrap gap-2 text-xs">
                <span className={`text-muted-foreground mr-1 ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.aiTry}</span>
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
                  {currentText.aiGeneratingButton}
                </>
              ) : (
                 <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {currentText.aiGenerateButton}
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
                    {currentText.aiResultTitle}
                </h4>
                {/* Ensure generated content uses the correct language prop */}
                <ContentCard content={generatedContent} language={generatedContent.lang} />
              </motion.div>
            )}
            </CardContent>
        </Card>
      </motion.div>
      {/* --- End AI Generation Section --- */}


       {/* Search and Filter for Existing Content */}
       <motion.div
            key={language + "-search-filter"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }} // Delay adjusted
            className="w-full max-w-4xl space-y-4" // Added more spacing
        >
            <h2 className={`text-2xl md:text-3xl font-semibold text-center ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.browseTitle}
            </h2>
            <SearchFilter
                language={language}
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategoryFilter}
                setSelectedCategory={setSelectedCategoryFilter}
            />
       </motion.div>


      {/* Category Tabs for Existing Content */}
      <Tabs defaultValue="jokes" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map(cat => (
            <TabsTrigger
                key={cat.key + "-" + language} // Ensure key changes with language
                value={cat.key}
                className={language === 'hi' ? 'font-hindi' : ''}
                asChild
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {cat[language]}
                </motion.button>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.key + "-content-" + language} value={cat.key}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {filteredContent[cat.key] && filteredContent[cat.key].length > 0 ? (
                 filteredContent[cat.key].map(item => (
                     // Pass the correct language prop to ContentCard based on the item's language
                    <ContentCard key={item.id} content={item} language={item.lang} />
                 ))
              ) : (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-center col-span-full text-muted-foreground py-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  {currentText.noContentFound}
                </motion.p>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* TODO: Add User Auth, Submit Form, Firestore integration, PWA, etc. */}
    </div>
  );
}
