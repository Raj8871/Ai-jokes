// src/app/jokes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ContentCard from '@/components/content/content-card';
import SearchFilter from '@/components/content/search-filter';
import type { ContentItem } from '@/app/page'; // Reuse the type
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Wand2, Sparkles, Bot, Laugh, Smile, MessageSquareText, ListChecks } from 'lucide-react'; // Added MessageSquareText, ListChecks
import { useToast } from '@/hooks/use-toast';
import { generateContent, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/generate-content-flow';


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
    title: "Jokes 😂",
    description: "Tickle your funny bone with our collection of jokes! 😂",
    noContentFound: "No jokes found matching your search.",
    aiGenerateTitle: "Generate Jokes with AI ✨", // Added emoji
    aiGenerateDescription: "Enter a keyword or theme (e.g., \"Animal\", \"Office\") and get jokes with emojis!", // Updated text
    aiKeywordTheme: "Keyword / Theme:",
    aiPlaceholder: "e.g., Food, Computer...",
    aiSelectLength: "Select Joke Length (Lines):", // Updated label
    aiLengthInfo: "(4-7 lines)", // Added info text for length
    aiGenerateButton: "Generate Joke",
    aiGeneratingButton: "Generating...",
    aiResultTitle: "AI Generated Joke:",
    inputRequired: "Input Required",
    inputRequiredDesc: "Please enter a keyword or theme.",
    generationFailed: "Generation Failed",
    generationFailedDesc: "Could not generate joke. Please try again.",
  },
  hi: {
    title: "चुटकुले 😂",
    description: "हमारे चुटकुलों के संग्रह से अपनी गुदगुदी करें! 😂",
    noContentFound: "आपकी खोज से मेल खाने वाला कोई चुटकुला नहीं मिला।",
    aiGenerateTitle: "एआई के साथ चुटकुले उत्पन्न करें ✨", // Added emoji
    aiGenerateDescription: "कोई कीवर्ड या थीम दर्ज करें (जैसे, \"जानवर\", \"ऑफिस\") और इमोजी के साथ चुटकुले प्राप्त करें!", // Updated text
    aiKeywordTheme: "कीवर्ड / थीम:",
    aiPlaceholder: "उदा., खाना, कंप्यूटर...",
    aiSelectLength: "चुटकुले की लंबाई चुनें (पंक्तियाँ):", // Updated label
    aiLengthInfo: "(4-7 पंक्तियाँ)", // Added info text for length
    aiGenerateButton: "चुटकुला उत्पन्न करें",
    aiGeneratingButton: "उत्पन्न हो रहा है...",
    aiResultTitle: "एआई उत्पन्न चुटकुला:",
    inputRequired: "इनपुट आवश्यक है",
    inputRequiredDesc: "कृपया कोई कीवर्ड या विषय दर्ज करें।",
    generationFailed: "उत्पन्न करने में विफल",
    generationFailedDesc: "चुटकुला उत्पन्न नहीं किया जा सका। कृपया पुन: प्रयास करें।",
  }
};

// Updated possible joke lengths
const possibleJokeLengths = Array.from({ length: 4 }, (_, i) => i + 4); // Generates [4, 5, 6, 7]

export default function JokesPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [jokes, setJokes] = useState<ContentItem[]>([]);
  const [filteredJokes, setFilteredJokes] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // AI Joke Generation State
  const [aiJokePrompt, setAiJokePrompt] = useState('');
  const [aiJokeLength, setAiJokeLength] = useState<number>(4); // Default length 4 lines
  const [generatedJoke, setGeneratedJoke] = useState<ContentItem | null>(null);
  const [isGeneratingJoke, setIsGeneratingJoke] = useState(false);

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
    setGeneratedJoke(null); // Clear previous AI joke on language change
  }, [language]); // Removed searchTerm dependency to avoid clearing AI joke on search

  // Separate effect for filtering based on search term
   useEffect(() => {
    filterJokes(jokes, searchTerm);
   }, [searchTerm, jokes]);

  const filterJokes = (baseJokes: ContentItem[], term: string) => {
    const filtered = baseJokes.filter(joke =>
      joke.text.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredJokes(filtered);
  };

  // --- AI Joke Generation Handler ---
  const handleGenerateJoke = async () => {
    if (!aiJokePrompt.trim()) {
      toast({
        title: pageText[language].inputRequired,
        description: pageText[language].inputRequiredDesc,
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingJoke(true);
    setGeneratedJoke(null); // Clear previous result

    try {
       const currentLangForApi = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' || 'en';
       const input: GenerateContentInput = {
        language: currentLangForApi,
        type: 'joke', // Explicitly set type to joke
        prompt: aiJokePrompt.trim(),
        length: aiJokeLength, // Pass selected length
      };
      const result: GenerateContentOutput = await generateContent(input);

       // Use timestamp and prompt for a more unique key, reducing chance of duplicate keys if generation is fast
      const uniqueKey = `ai-joke-${aiJokePrompt}-${Date.now()}`;
      const newJokeItem: ContentItem = {
        id: uniqueKey,
        type: 'joke',
        text: result.generatedText,
        category: 'ai-joke', // Mark as AI generated joke
        lang: currentLangForApi,
      };
      setGeneratedJoke(newJokeItem); // Display the newly generated joke
      toast({
        title: language === 'en' ? 'Joke Generated! 😂' : 'चुटकुला बन गया! 😂', // Added emoji
        description: language === 'en' ? 'Scroll down to see your AI-generated joke.' : 'अपना एआई-जनित चुटकुला देखने के लिए नीचे स्क्रॉल करें।',
      });

    } catch (error) {
      console.error('AI Joke Generation Error:', error);
      toast({
        title: pageText[language].generationFailed,
        description: pageText[language].generationFailedDesc,
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingJoke(false);
    }
  };
  // --- End AI Joke Generation ---


  const currentText = pageText[language];

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      {/* Page Title and Description */}
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

      {/* --- AI Joke Generation Section --- */}
      <motion.div
        key={language + "-ai-joke-gen"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-primary shadow-md overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className={`text-xl font-semibold text-primary flex items-center gap-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
              <Wand2 className="h-5 w-5" />
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <Bot className="h-5 w-5" />
              {currentText.aiGenerateTitle}
            </CardTitle>
             <p className={`text-sm text-muted-foreground pt-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
               {currentText.aiGenerateDescription}
             </p>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Prompt Input */}
            <div className="space-y-2">
                <Label htmlFor="ai-joke-prompt" className={`text-sm font-medium ${language === 'hi' ? 'font-hindi' : ''}`}>
                   {currentText.aiKeywordTheme}
                </Label>
                <Input
                  id="ai-joke-prompt"
                  value={aiJokePrompt}
                  onChange={(e) => setAiJokePrompt(e.target.value)}
                  placeholder={currentText.aiPlaceholder}
                  className={language === 'hi' ? 'font-hindi placeholder:font-hindi' : ''}
                  disabled={isGeneratingJoke}
                />
            </div>

            {/* Joke Length Selection */}
            <div className="space-y-2">
                 <Label className={`text-sm font-medium flex items-center gap-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    <ListChecks className="h-4 w-4"/> {/* Icon for length */}
                    {currentText.aiSelectLength}
                     <span className="text-xs text-muted-foreground">
                        {currentText.aiLengthInfo}
                     </span>
                 </Label>
                 <RadioGroup
                    value={String(aiJokeLength)} // Controlled component
                    onValueChange={(value: string) => setAiJokeLength(parseInt(value, 10))}
                    className="flex flex-wrap gap-x-4 gap-y-2" // Use flex-wrap for better spacing
                  >
                   {possibleJokeLengths.map(len => (
                      <div key={len} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(len)} id={`joke-len-${len}`} disabled={isGeneratingJoke}/>
                        <Label htmlFor={`joke-len-${len}`}>{len}</Label>
                      </div>
                   ))}
                 </RadioGroup>
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerateJoke} disabled={isGeneratingJoke} className="w-full">
              {isGeneratingJoke ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentText.aiGeneratingButton}
                </>
              ) : (
                 <>
                  <Wand2 className="mr-1 h-4 w-4" />
                  <Sparkles className="mr-1 h-4 w-4 text-yellow-300" />
                  <Bot className="mr-2 h-4 w-4" />
                  {currentText.aiGenerateButton}
                 </>
              )}
            </Button>

            {/* Generated Joke Display */}
            {generatedJoke && (
              <motion.div
                key={generatedJoke.id} // Use the unique joke ID as key
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} // Add exit animation if needed elsewhere
                transition={{ duration: 0.5 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <h4 className={`font-semibold mb-2 flex items-center gap-1 ${language === 'hi' ? 'font-hindi' : ''}`}>
                    <Laugh className="h-4 w-4 text-yellow-500"/>
                    <Smile className="h-4 w-4 text-green-500"/>
                    <MessageSquareText className="h-4 w-4 text-blue-400"/> {/* Icon for text */}
                    <Sparkles className="h-4 w-4 text-yellow-400"/> {/* Added sparkles for AI */}
                    {currentText.aiResultTitle}
                </h4>
                {/* Pass generated joke's language */}
                <ContentCard content={generatedJoke} language={generatedJoke.lang} />
              </motion.div>
            )}
            </CardContent>
        </Card>
      </motion.div>
      {/* --- End AI Joke Generation Section --- */}


      {/* Search Filter for Existing Jokes */}
      <motion.div
        key={language + "-jokes-search"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
         <SearchFilter
            language={language}
            categories={[]} // No category filter needed for existing jokes
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={'all'} // Not used here
            setSelectedCategory={() => {}} // Not used here
        />
      </motion.div>

      {/* Display Existing Jokes */}
      <motion.div
        key={language + "-jokes-content"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {filteredJokes.length > 0 ? (
          filteredJokes.map(item => (
             // Pass item's language
            <ContentCard key={item.id} content={item} language={item.lang} />
          ))
        ) : (
          <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-center col-span-full text-muted-foreground py-8 ${language === 'hi' ? 'font-hindi' : ''}`}>
            {currentText.noContentFound}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
