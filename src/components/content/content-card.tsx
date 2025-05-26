
// src/components/content/content-card.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { ContentItem } from '@/app/page';

interface ContentCardProps {
  content: ContentItem;
  language: 'en' | 'hi'; // Language prop to determine UI text
}

// Text content for different languages used within the card
const cardText = {
    en: {
        copiedTitle: "Copied! 👍", // Added emoji
        copiedDesc: "Content copied to clipboard.",
        copyErrorTitle: "Copy Error 😞", // Added emoji
        copyErrorDesc: "Could not copy content.",
        shareTitle: "ShayariSaga Content ✨", // Added emoji
        shareApiSuccess: "Shared successfully! 🚀", // Added emoji
        shareApiNotSupported: "Link Copied Instead 🔗", // Added emoji
        shareApiNotSupportedDesc: "Direct sharing isn't supported here, so the link was copied for you.",
        shareApiNotSupportedNonHttpsDesc: "Sharing via API failed (non-HTTPS). Link copied instead. Please use HTTPS for direct sharing.",
        sharePermissionDeniedTitle: "Sharing Blocked 🚫", // Added emoji
        sharePermissionDeniedDesc: "Browser blocked sharing. Try copying the link. Ensure you're on HTTPS.",
        shareNotFoundErrorTitle: "Sharing App Not Found 🤷", // Added emoji
        shareNotFoundErrorDesc: "Could not find a suitable app to share with. Link copied instead.",
        shareErrorTitle: "Sharing Error 😥", // Added emoji
        shareErrorDesc: "Could not share the content. Link copied instead.",
        favoriteAdd: "Added to Favorites! ❤️", // Added emoji
        favoriteRemove: "Removed from Favorites 💔", // Added emoji
        copyLabel: "Copy",
        shareLabel: "Share",
        favoriteLabel: "Favorite",
    },
    hi: {
        copiedTitle: "कॉपी किया गया! 👍", // Added emoji
        copiedDesc: "सामग्री क्लिपबोर्ड पर कॉपी की गई।",
        copyErrorTitle: "कॉपी त्रुटि 😞", // Added emoji
        copyErrorDesc: "सामग्री कॉपी नहीं की जा सकी।",
        shareTitle: "शायरी सागा सामग्री ✨", // Added emoji
        shareApiSuccess: "सफलतापूर्वक साझा किया गया! 🚀", // Added emoji
        shareApiNotSupported: "लिंक कॉपी किया गया 🔗", // Added emoji
        shareApiNotSupportedDesc: "यहां डायरेक्ट शेयरिंग समर्थित नहीं है, इसलिए आपके लिए लिंक कॉपी किया गया।",
        shareApiNotSupportedNonHttpsDesc: "API द्वारा शेयरिंग विफल (गैर-HTTPS)। इसके बजाय लिंक कॉपी किया गया। कृपया डायरेक्ट शेयरिंग के लिए HTTPS का उपयोग करें।",
        sharePermissionDeniedTitle: "शेयरिंग अवरुद्ध 🚫", // Added emoji
        sharePermissionDeniedDesc: "ब्राउज़र ने शेयरिंग ब्लॉक कर दी है। लिंक कॉपी करने का प्रयास करें। सुनिश्चित करें कि आप HTTPS पर हैं।",
        shareNotFoundErrorTitle: "शेयरिंग ऐप नहीं मिला 🤷", // Added emoji
        shareNotFoundErrorDesc: "शेयर करने के लिए कोई उपयुक्त ऐप नहीं मिला। इसके बजाय लिंक कॉपी किया गया।",
        shareErrorTitle: "शेयर करने में त्रुटि 😥", // Added emoji
        shareErrorDesc: "सामग्री शेयर नहीं की जा सकी। इसके बजाय लिंक कॉपी किया गया।",
        favoriteAdd: "पसंदीदा में जोड़ा गया! ❤️", // Added emoji
        favoriteRemove: "पसंदीदा से हटाया गया 💔", // Added emoji
        copyLabel: "कॉपी करें",
        shareLabel: "शेयर करें",
        favoriteLabel: "पसंदीदा",
    }
};


const ContentCard: React.FC<ContentCardProps> = ({ content, language }) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteStorageKey = `shayariSagaFavorite_${content.id}`;
  const currentText = cardText[language]; // Get UI text based on the language prop
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering

  useEffect(() => {
    setIsClient(true); // Set client to true after initial render
    const savedFavorite = localStorage.getItem(favoriteStorageKey);
    if (savedFavorite) {
      setIsFavorite(JSON.parse(savedFavorite));
    }
     // Cleanup function to avoid memory leaks if component unmounts quickly
    return () => {};
  }, [favoriteStorageKey]);


  const handleCopy = () => {
    // Ensure navigator is available (client-side)
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(content.text)
          .then(() => {
            toast({
              title: currentText.copiedTitle,
              description: currentText.copiedDesc,
            });
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            toast({
              title: currentText.copyErrorTitle,
              description: currentText.copyErrorDesc,
              variant: "destructive",
            });
          });
    } else {
        console.error('Clipboard API not available.');
         toast({
          title: currentText.copyErrorTitle,
          description: "Clipboard API not available in this environment.",
          variant: "destructive",
        });
    }
  };

  const handleShare = async () => {
     // Ensure this runs only on the client and navigator is available
     if (!isClient || typeof navigator === 'undefined') {
        console.warn("Share button clicked before client hydration or navigator is undefined.");
        toast({
            title: currentText.shareErrorTitle,
            description: "Share feature not ready yet. Please try again shortly.",
            variant: "destructive",
        });
        return;
     }

     const shareData = {
       title: currentText.shareTitle, // Use language-specific title
       text: content.text,
       url: window.location.href, // Or a specific URL for the content if available
     };

     try {
        // Check for HTTPS, as navigator.share often requires it
        if (typeof window !== 'undefined' && !window.location.protocol.startsWith('https')) {
            console.warn("Web Share API requires HTTPS. Falling back to copy.");
            handleCopy();
            toast({
                title: currentText.shareApiNotSupported,
                description: currentText.shareApiNotSupportedNonHttpsDesc,
                variant: 'destructive'
            });
            return; 
        }

        if (navigator.share) {
             await navigator.share(shareData);
             // Success toast is only shown if navigator.share resolves without error
             toast({
                 title: currentText.shareApiSuccess,
             });
        } else {
             // Fallback if navigator.share doesn't exist
             handleCopy();
             toast({
                 title: currentText.shareApiNotSupported,
                 description: currentText.shareApiNotSupportedDesc,
             });
        }
     } catch (err) {
       console.error('Share API Error:', err); 
       let errorTitle = currentText.shareErrorTitle;
       let errorDesc = currentText.shareErrorDesc;

       if (err instanceof DOMException) {
            if (err.name === 'AbortError') {
                // User cancelled the share operation, don't show an error toast or fallback
                console.log('Share cancelled by user.');
                return; 
            } else if (err.name === 'NotAllowedError') {
                 // Permission denied - often requires HTTPS or user gesture
                 errorTitle = currentText.sharePermissionDeniedTitle;
                 errorDesc = currentText.sharePermissionDeniedDesc;
            } else if (err.name === 'NotFoundError') {
                // Can happen if the target app isn't available or share fails internally
                errorTitle = currentText.shareNotFoundErrorTitle;
                errorDesc = currentText.shareNotFoundErrorDesc;
            }
       }
       
       // Fallback to copy for any error other than AbortError
        handleCopy(); 
        toast({
            title: errorTitle,
            description: errorDesc,
            variant: "destructive",
        });
     }
   };


  const handleFavorite = () => {
    if (!isClient) return; // Ensure client-side for localStorage
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    localStorage.setItem(favoriteStorageKey, JSON.stringify(newFavoriteState));
    toast({
      title: newFavoriteState ? currentText.favoriteAdd : currentText.favoriteRemove,
    });
    // TODO: Sync with Firestore user profile
  };

  // Animation variants for the card itself
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.03, y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.2)" }, // Enhanced hover
  };

  // Animation variants for the buttons
  const buttonVariants = {
     tap: { scale: 0.9, transition: { type: 'spring', stiffness: 500, damping: 15 } },
     hover: { scale: 1.1, color: "hsl(var(--primary))", transition: { type: 'spring', stiffness: 400, damping: 10 } }
  };


  return (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        // Use language in key to ensure card re-renders correctly if language changes while visible
        key={content.id + language}
        className="rounded-lg overflow-hidden" // Ensure shadow is clipped if card has rounded corners
    >
      {/* Apply Hindi font class based on content language, not UI language */}
      <Card className={`flex flex-col h-full shadow-lg border-border group transition-all duration-300 ease-in-out ${content.lang === 'hi' ? 'font-hindi' : ''}`}>
        <CardContent className="flex-grow p-4 pt-6">
           {/* Ensure text breaks words and handles long lines gracefully */}
          <p className="text-foreground leading-relaxed break-words whitespace-pre-line">{content.text}</p>
        </CardContent>
        <CardFooter className="p-2 border-t mt-auto flex justify-end space-x-1 bg-muted/30">
          <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
             <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={currentText.copyLabel} disabled={!isClient} title={currentText.copyLabel}>
                <Copy className="h-4 w-4" />
             </Button>
           </motion.div>
           <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label={currentText.shareLabel} disabled={!isClient} title={currentText.shareLabel}>
                <Share2 className="h-4 w-4" />
            </Button>
           </motion.div>
           <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
            <Button variant="ghost" size="icon" onClick={handleFavorite} aria-label={currentText.favoriteLabel} disabled={!isClient} title={currentText.favoriteLabel}>
                 <Heart className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-destructive text-destructive scale-110' : 'text-muted-foreground group-hover:text-destructive'}`} />
            </Button>
           </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContentCard;

