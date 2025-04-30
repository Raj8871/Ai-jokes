// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2, Loader2, Wand2, Languages, Lightbulb, Star, MessageSquareQuote } from 'lucide-react'; // Added MessageSquareQuote
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
// REMOVED JOKES FROM HERE
const mockContent = {
  en: {
    romantic: [
      { id: 'r1', type: 'shayari', text: "In your eyes, a universe I see, a love story written, just for you and me.", category: 'romantic', lang: 'en' },
      { id: 'r2', type: 'shayari', text: "Like a gentle breeze, your love touches my soul, making my broken heart finally whole.", category: 'romantic', lang: 'en' },
      { id: 'r3', type: 'shayari', text: "With every beat, my heart calls your name, a love like ours, an eternal flame.", category: 'romantic', lang: 'en' },
      { id: 'r4', type: 'shayari', text: "Your smile is the sunrise that brightens my day, in your loving arms, I wish to forever stay.", category: 'romantic', lang: 'en' },
      { id: 'r5', type: 'shayari', text: "If love is a journey, I'd walk miles with you, hand in hand, under skies ever blue.", category: 'romantic', lang: 'en' },
      { id: 'r6', type: 'shayari', text: "The moon envies the sparkle in your gaze, lost in your love through all my days.", category: 'romantic', lang: 'en' },
    ],
    sad: [
      { id: 's1', type: 'shayari', text: "Tears fall like rain on a lonely night, remembering moments that once felt so right.", category: 'sad', lang: 'en' },
      { id: 's2', type: 'shayari', text: "The echoes of laughter now fade away, leaving silence in the light of day.", category: 'sad', lang: 'en' },
      { id: 's3', type: 'shayari', text: "A heart once full, now feels so bare, lost in the shadows of despair.", category: 'sad', lang: 'en' },
      { id: 's4', type: 'shayari', text: "The path we walked together now diverges, leaving behind unspoken urges.", category: 'sad', lang: 'en' },
      { id: 's5', type: 'shayari', text: "Empty rooms whisper your name, a constant reminder of the burning flame.", category: 'sad', lang: 'en' },
    ],
    friendship: [
       { id: 'f1', type: 'shayari', text: "A true friend is a treasure, rare and kind, a bond of souls, forever intertwined.", category: 'friendship', lang: 'en' },
       { id: 'f2', type: 'shayari', text: "Through thick and thin, you're always near, a friend like you dispels all fear.", category: 'friendship', lang: 'en' },
       { id: 'f3', type: 'shayari', text: "Miles may part us, but hearts remain close, a friendship like ours, beautifully grows.", category: 'friendship', lang: 'en' },
       { id: 'f4', type: 'shayari', text: "Like stars in the sky, friends light up the dark, leaving a hopeful and lasting mark.", category: 'friendship', lang: 'en' },
    ],
    motivational: [
       { id: 'm1', type: 'shayari', text: "Though the path is steep, keep climbing high, your strength within will reach the sky.", category: 'motivational', lang: 'en' },
       { id: 'm2', type: 'shayari', text: "Every stumble is a lesson learned, rise again, let your spirit be returned.", category: 'motivational', lang: 'en' },
       { id: 'm3', type: 'shayari', text: "Believe in the power that lies within you, dreams can come true, start something new.", category: 'motivational', lang: 'en' },
       { id: 'm4', type: 'shayari', text: "Let challenges shape you, don't let them break, resilience blooms with each step you take.", category: 'motivational', lang: 'en' },
    ]
  },
  hi: {
    romantic: [
      { id: 'hr1', type: 'shayari', text: "तुम्हारी आँखों में, मैं एक ब्रह्मांड देखता हूँ, एक प्रेम कहानी लिखी है, सिर्फ तुम्हारे और मेरे लिए।", category: 'romantic', lang: 'hi' },
      { id: 'hr2', type: 'shayari', text: "एक हल्की हवा की तरह, तुम्हारा प्यार मेरी आत्मा को छूता है, मेरे टूटे हुए दिल को आखिरकार पूरा करता है।", category: 'romantic', lang: 'hi' },
      { id: 'hr3', type: 'shayari', text: "हर धड़कन के साथ, मेरा दिल तुम्हारा नाम पुकारता है, हमारे जैसा प्यार, एक शाश्वत ज्वाला।", category: 'romantic', lang: 'hi' },
      { id: 'hr4', type: 'shayari', text: "तुम्हारी मुस्कान वह सूर्योदय है जो मेरे दिन को रोशन करती है, तुम्हारी प्यारी बाहों में, मैं हमेशा रहना चाहता हूँ।", category: 'romantic', lang: 'hi' },
      { id: 'hr5', type: 'shayari', text: "अगर प्यार एक सफ़र है, तो मैं तुम्हारे साथ मीलों चलूंगा, हाथ में हाथ डाले, हमेशा नीले आसमान के नीचे।", category: 'romantic', lang: 'hi' },
      { id: 'hr6', type: 'shayari', text: "चाँद भी तुम्हारी निगाहों की चमक से जलता है, तुम्हारे प्यार में खोया हूँ अपने सारे दिनों में।", category: 'romantic', lang: 'hi' },
    ],
     sad: [
      { id: 'hs1', type: 'shayari', text: "आँसू बारिश की तरह गिरते हैं अकेली रात में, उन पलों को याद करते हुए जो कभी बहुत सही लगते थे।", category: 'sad', lang: 'hi' },
      { id: 'hs2', type: 'shayari', text: "हँसी की गूँज अब फीकी पड़ गई है, दिन के उजाले में खामोशी छोड़ गई है।", category: 'sad', lang: 'hi' },
      { id: 'hs3', type: 'shayari', text: "एक दिल जो कभी भरा हुआ था, अब कितना खाली महसूस होता है, निराशा की छाया में खो गया।", category: 'sad', lang: 'hi' },
      { id: 'hs4', type: 'shayari', text: "जिस रास्ते पर हम साथ चले थे, वह अब अलग हो गया है, पीछे अनकही इच्छाएँ छोड़ गया है।", category: 'sad', lang: 'hi' },
      { id: 'hs5', type: 'shayari', text: "खाली कमरे तुम्हारा नाम फुसफुसाते हैं, उस जलती हुई लौ की लगातार याद दिलाते हैं।", category: 'sad', lang: 'hi' },
    ],
    friendship: [
       { id: 'hf1', type: 'shayari', text: "एक सच्चा दोस्त एक खजाना है, दुर्लभ और दयालु, आत्माओं का बंधन, हमेशा के लिए जुड़ा हुआ।", category: 'friendship', lang: 'hi' },
       { id: 'hf2', type: 'shayari', text: "सुख-दुख में, तुम हमेशा पास हो, तुम्हारे जैसा दोस्त हर डर को दूर करता है।", category: 'friendship', lang: 'hi' },
       { id: 'hf3', type: 'shayari', text: "मील हमें अलग कर सकते हैं, लेकिन दिल करीब रहते हैं, हमारी जैसी दोस्ती, खूबसूरती से बढ़ती है।", category: 'friendship', lang: 'hi' },
       { id: 'hf4', type: 'shayari', text: "आसमान में तारों की तरह, दोस्त अंधेरे को रोशन करते हैं, एक आशावादी और स्थायी छाप छोड़ते हैं।", category: 'friendship', lang: 'hi' },
    ],
    motivational: [
       { id: 'hm1', type: 'shayari', text: "भले ही रास्ता कठिन हो, ऊँचा चढ़ते रहो, तुम्हारी भीतर की ताकत आसमान तक पहुँच जाएगी।", category: 'motivational', lang: 'hi' },
       { id: 'hm2', type: 'shayari', text: "हर ठोकर एक सबक है, फिर से उठो, अपनी आत्मा को वापस लौटने दो।", category: 'motivational', lang: 'hi' },
       { id: 'hm3', type: 'shayari', text: "अपने भीतर की शक्ति पर विश्वास करो, सपने सच हो सकते हैं, कुछ नया शुरू करो।", category: 'motivational', lang: 'hi' },
       { id: 'hm4', type: 'shayari', text: "चुनौतियों को तुम्हें आकार देने दो, उन्हें तुम्हें तोड़ने न दो, लचीलापन हर कदम के साथ खिलता है।", category: 'motivational', lang: 'hi' },
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

// Removed 'jokes' from Category type
type Category = 'romantic' | 'sad' | 'friendship' | 'motivational';

// REMOVED 'jokes' category from the categories array
const categories: { key: Category; en: string; hi: string }[] = [
  { key: 'romantic', en: 'Romantic Shayari', hi: 'रोमांटिक शायरी' },
  { key: 'sad', en: 'Sad Shayari', hi: 'दर्द भरी शायरी' },
  { key: 'friendship', en: 'Friendship Shayari', hi: 'दोस्ती शायरी' },
  { key: 'motivational', en: 'Motivational Shayari', hi: 'प्रेरक शायरी' },
];

const aiKeywordSuggestions = {
  en: ["Love", "Friendship", "Motivation", "Breakup", "Rainy Day", "Work Life", "College Days", "Hope"], // Adjusted suggestions
  hi: ["प्यार", "दोस्ती", "प्रेरणा", "ब्रेकअप", "बरसात का दिन", "कामकाजी जीवन", "कॉलेज के दिन", "आशा"] // Adjusted suggestions
};

// Text content for different languages
const pageText = {
  en: {
    welcome: "Welcome to ShayariSaga!",
    aboutTitle: "Discover, Generate, Share",
    aboutText: "Your ultimate destination for beautiful Shayari in both English and Hindi. Explore our curated collection, or let our AI generate unique content just for you!", // Removed mention of jokes here
    featuresTitle: "Key Features",
    feature1Title: "Bilingual Content",
    feature1Text: "Enjoy Shayari in both English and Hindi.", // Changed text
    feature2Title: "AI Generation",
    feature2Text: "Create new Shayari instantly based on your themes.", // Changed text
    feature3Title: "Save & Share",
    feature3Text: "Keep your favorites and easily share with friends.",
    feature4Title: "Extensive Collection", // New Feature
    feature4Text: "Browse through a growing library of user and AI content.", // New Feature
    aiGenerateTitle: "Generate with AI",
    aiGenerateDescription: "Enter a keyword or theme (e.g., \"Friendship\", \"Rainy Day\")",
    aiSelectType: "Select Type:",
    aiShayari: "Shayari",
    aiJoke: "Joke", // Keep Joke option here for AI generation, but tabs below are only Shayari
    aiKeywordTheme: "Keyword / Theme:",
    aiPlaceholder: "e.g., Love, Motivation...",
    aiTry: "Try:",
    aiGenerateButton: "Generate",
    aiGeneratingButton: "Generating...",
    aiResultTitle: "AI Generated Result:",
    browseTitle: "Browse Shayari Collection", // Changed title
    noContentFound: "No Shayari found matching your filters.", // Changed text
    inputRequired: "Input Required",
    inputRequiredDesc: "Please enter a keyword or theme.",
    generationFailed: "Generation Failed",
    generationFailedDesc: "Could not generate content. Please try again.",
    moreContentInfo: "Explore thousands of user-submitted and AI-crafted pieces. New additions daily!", // New Info
    howItWorksTitle: "How It Works", // New Section Title
    howItWorks1: "Browse categories or search for specific themes.", // Step 1
    howItWorks2: "Use the AI Generator to create unique jokes or shayari.", // Step 2
    howItWorks3: "Save your favorites, copy, or share instantly!", // Step 3
  },
  hi: {
    welcome: "शायरी सागा में आपका स्वागत है!",
    aboutTitle: "खोजें, उत्पन्न करें, साझा करें",
    aboutText: "अंग्रेजी और हिंदी दोनों में सुंदर शायरी के लिए आपका अंतिम गंतव्य। हमारे क्यूरेटेड संग्रह का अन्वेषण करें, या हमारे एआई को केवल आपके लिए अद्वितीय सामग्री उत्पन्न करने दें!", // Removed mention of jokes here
    featuresTitle: "मुख्य विशेषताएं",
    feature1Title: "द्विभाषी सामग्री",
    feature1Text: "अंग्रेजी और हिंदी दोनों में शायरी का आनंद लें।", // Changed text
    feature2Title: "एआई जनरेशन",
    feature2Text: "अपने विषयों के आधार पर तुरंत नई शायरी बनाएं।", // Changed text
    feature3Title: "सहेजें और साझा करें",
    feature3Text: "अपने पसंदीदा रखें और दोस्तों के साथ आसानी से साझा करें।",
    feature4Title: "विस्तृत संग्रह", // New Feature
    feature4Text: "उपयोगकर्ता और एआई सामग्री की बढ़ती लाइब्रेरी ब्राउज़ करें।", // New Feature
    aiGenerateTitle: "एआई के साथ उत्पन्न करें",
    aiGenerateDescription: "कोई कीवर्ड या थीम दर्ज करें (जैसे, \"दोस्ती\", \"बरसात का दिन\")",
    aiSelectType: "प्रकार चुनें:",
    aiShayari: "शायरी",
    aiJoke: "चुटकुला", // Keep Joke option here for AI generation
    aiKeywordTheme: "कीवर्ड / थीम:",
    aiPlaceholder: "उदा., प्यार, प्रेरणा...",
    aiTry: "कोशिश करें:",
    aiGenerateButton: "उत्पन्न करें",
    aiGeneratingButton: "उत्पन्न हो रहा है...",
    aiResultTitle: "एआई उत्पन्न परिणाम:",
    browseTitle: "शायरी संग्रह ब्राउज़ करें", // Changed title
    noContentFound: "आपके फ़िल्टर से मेल खाने वाली कोई शायरी नहीं मिली।", // Changed text
    inputRequired: "इनपुट आवश्यक है",
    inputRequiredDesc: "कृपया कोई कीवर्ड या विषय दर्ज करें।",
    generationFailed: "उत्पन्न करने में विफल",
    generationFailedDesc: "सामग्री उत्पन्न नहीं की जा सकी। कृपया पुन: प्रयास करें।",
    moreContentInfo: "हजारों उपयोगकर्ता-प्रस्तुत और एआई-निर्मित रचनाओं का अन्वेषण करें। प्रतिदिन नई सामग्री!", // New Info
    howItWorksTitle: "यह कैसे काम करता है", // New Section Title
    howItWorks1: "श्रेणियाँ ब्राउज़ करें या विशिष्ट विषयों की खोज करें।", // Step 1
    howItWorks2: "अद्वितीय चुटकुले या शायरी बनाने के लिए एआई जेनरेटर का उपयोग करें।", // Step 2
    howItWorks3: "अपने पसंदीदा सहेजें, कॉपी करें, या तुरंत साझा करें!", // Step 3
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  // Adjusted state for content to only include Shayari categories
  const [content, setContent] = useState<Record<Category, ContentItem[]>>({
     romantic: [], sad: [], friendship: [], motivational: []
  });
  const [filteredContent, setFilteredContent] = useState<Record<Category, ContentItem[]>>({
     romantic: [], sad: [], friendship: [], motivational: []
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
     } else {
        // Set default language if none is saved
        localStorage.setItem('shayariSagaLang', language);
     }

     const handleLanguageChange = () => {
        const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
        if (updatedLang) {
             setLanguage(updatedLang);
        }
     };
     window.addEventListener('languageChanged', handleLanguageChange);

     // Load mock content based on the determined language
     const currentContent = mockContent[savedLang || language];
     setContent(currentContent);
     filterContent(currentContent, searchTerm, selectedCategoryFilter); // Apply initial filtering

     return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []); // Run only once on mount


   // Refetch mock data and apply filters when language changes or filters are updated
   useEffect(() => {
    const currentLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' || 'en';
    const currentContent = mockContent[currentLang];
    setContent(currentContent);
    filterContent(currentContent, searchTerm, selectedCategoryFilter); // Re-apply filters
    setGeneratedContent(null); // Clear previous AI generation
  }, [language, searchTerm, selectedCategoryFilter]); // Add filter dependencies


  // Filter content function - Updated to only handle Shayari categories
  const filterContent = (
    baseContent: Record<Category, ContentItem[]>,
    currentSearchTerm: string,
    currentCategoryFilter: Category | 'all'
   ) => {
    let tempFiltered = {} as Record<Category, ContentItem[]>;
    const currentLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' || 'en'; // Get current language

    // Iterate only over Shayari categories
    categories.forEach(({ key }) => {
      // Check if baseContent exists and has the key, provide empty array if not
      const categoryContent = baseContent && baseContent[key] ? baseContent[key] : [];

      tempFiltered[key] = categoryContent.filter(item => {
        const matchesSearch = item.text.toLowerCase().includes(currentSearchTerm.toLowerCase());
        const matchesCategory = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
        const matchesLanguage = item.lang === currentLang; // Filter strictly by CURRENT UI language
        return matchesSearch && matchesCategory && matchesLanguage;
      });
    });
    setFilteredContent(tempFiltered);
  };

   // Handle language toggle
  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    localStorage.setItem('shayariSagaLang', newLang);
    setLanguage(newLang); // Update state immediately
    window.dispatchEvent(new Event('languageChanged')); // Notify other components if needed
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
       // Get language from localStorage directly for the API call
       const currentLangForApi = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' || 'en';
       const input: GenerateContentInput = {
        language: currentLangForApi,
        type: aiContentType,
        prompt: aiPrompt.trim(),
      };
      const result: GenerateContentOutput = await generateContent(input);

      const newContentItem: ContentItem = {
        id: `ai-${Date.now()}`,
        type: aiContentType,
        text: result.generatedText,
        // Tag AI content differently - maybe use a more specific category?
        category: aiContentType === 'joke' ? 'ai-joke' : 'ai-shayari',
        lang: currentLangForApi, // Tag generated content with the language it was generated in
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
    <div className="flex flex-col items-center w-full space-y-12 md:space-y-16">

      {/* Animated Welcome Message */}
      <motion.h1
        key={language + "-welcome"}
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
             <p className={`text-sm text-muted-foreground italic ${language === 'hi' ? 'font-hindi' : ''}`}>
               {currentText.moreContentInfo} {/* Added more info text */}
             </p>
        </motion.section>


      {/* Key Features Section - Now includes 4 features */}
        <motion.section
          key={language + "-features"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-5xl" // Increased max-width for 4 columns
        >
            <h2 className={`text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Adjusted grid columns */}
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
                  {/* Feature 4 (New) */}
                 <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="text-center p-6 h-full border-secondary hover:border-primary transition-colors duration-300">
                        <CardHeader className="p-0 mb-3">
                             <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                                <MessageSquareQuote className="h-8 w-8 text-primary" /> {/* New Icon */}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <h3 className={`text-lg font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature4Title}</h3>
                            <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>{currentText.feature4Text}</p>
                        </CardContent>
                    </Card>
                 </motion.div>
            </div>
        </motion.section>

         {/* How It Works Section */}
        <motion.section
          key={language + "-how-it-works"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl text-center space-y-6"
        >
            <h2 className={`text-2xl md:text-3xl font-semibold ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.howItWorksTitle}
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-muted-foreground">
                <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.4}} className={`flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">1</span>
                    <span>{currentText.howItWorks1}</span>
                </motion.div>
                 <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.5}} className={`flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                     <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">2</span>
                    <span>{currentText.howItWorks2}</span>
                </motion.div>
                <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.6}} className={`flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">3</span>
                    <span>{currentText.howItWorks3}</span>
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-primary shadow-lg overflow-hidden">
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
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-4xl space-y-4"
        >
            <h2 className={`text-2xl md:text-3xl font-semibold text-center ${language === 'hi' ? 'font-hindi' : ''}`}>
                {currentText.browseTitle}
            </h2>
            <SearchFilter
                language={language}
                categories={categories} // Pass only Shayari categories
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategoryFilter}
                setSelectedCategory={setSelectedCategoryFilter}
            />
       </motion.div>


      {/* Category Tabs for Existing Shayari Content */}
      <Tabs defaultValue="romantic" className="w-full max-w-4xl"> {/* Default to a Shayari category */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4"> {/* Adjusted grid columns */}
          {categories.map(cat => ( // Iterate only over Shayari categories
            <TabsTrigger
                key={cat.key + "-" + language}
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

        {categories.map(cat => ( // Iterate only over Shayari categories
          <TabsContent key={cat.key + "-content-" + language} value={cat.key}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {/* Check if filteredContent exists and has the category key */}
              {filteredContent && filteredContent[cat.key] && filteredContent[cat.key].length > 0 ? (
                 filteredContent[cat.key].map(item => (
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
