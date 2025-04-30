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
        copiedTitle: "Copied!",
        copiedDesc: "Content copied to clipboard.",
        copyErrorTitle: "Error",
        copyErrorDesc: "Could not copy content.",
        shareTitle: "ShayariSaga Content", // Default share title
        shareApiSuccess: "Shared!",
        shareApiNotSupported: "Link Copied",
        shareApiNotSupportedDesc: "Sharing not supported, link copied instead.",
        shareApiNotSupportedNonHttpsDesc: "Sharing via API failed (non-HTTPS). Link copied instead.",
        sharePermissionDeniedTitle: "Sharing Blocked",
        sharePermissionDeniedDesc: "Browser blocked sharing. Try copying the link.",
        shareNotFoundErrorTitle: "Sharing Failed",
        shareNotFoundErrorDesc: "Could not find a suitable app to share with. Link copied instead.",
        shareErrorTitle: "Error Sharing",
        shareErrorDesc: "Could not share the content. Link copied instead.",
        favoriteAdd: "Added to Favorites",
        favoriteRemove: "Removed from Favorites",
        copyLabel: "Copy",
        shareLabel: "Share",
        favoriteLabel: "Favorite",
    },
    hi: {
        copiedTitle: "कॉपी किया गया!",
        copiedDesc: "सामग्री क्लिपबोर्ड पर कॉपी की गई।",
        copyErrorTitle: "त्रुटि",
        copyErrorDesc: "सामग्री कॉपी नहीं की जा सकी।",
        shareTitle: "शायरी सागा सामग्री", // Default share title
        shareApiSuccess: "शेयर किया गया!",
        shareApiNotSupported: "लिंक कॉपी किया गया",
        shareApiNotSupportedDesc: "शेयरिंग समर्थित नहीं है, इसके बजाय लिंक कॉपी किया गया।",
        shareApiNotSupportedNonHttpsDesc: "API द्वारा शेयरिंग विफल (गैर-HTTPS)। इसके बजाय लिंक कॉपी किया गया।",
        sharePermissionDeniedTitle: "शेयरिंग अवरुद्ध",
        sharePermissionDeniedDesc: "ब्राउज़र ने शेयरिंग ब्लॉक कर दी है। लिंक कॉपी करने का प्रयास करें।",
        shareNotFoundErrorTitle: "शेयरिंग विफल",
        shareNotFoundErrorDesc: "शेयर करने के लिए कोई उपयुक्त ऐप नहीं मिला। इसके बजाय लिंक कॉपी किया गया।",
        shareErrorTitle: "शेयर करने में त्रुटि",
        shareErrorDesc: "सामग्री शेयर नहीं की जा सकी। इसके बजाय लिंक कॉपी किया गया।",
        favoriteAdd: "पसंदीदा में जोड़ा गया",
        favoriteRemove: "पसंदीदा से हटाया गया",
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
        // Optionally show a message or just do nothing
        return;
     }

     const shareData = {
       title: currentText.shareTitle, // Use language-specific title
       text: content.text,
       url: window.location.href, // Or a specific URL for the content if available
     };

     try {
        // Check for HTTPS, as navigator.share often requires it
        if (!window.location.protocol.startsWith('https')) {
            console.warn("Web Share API may require HTTPS.");
            handleCopy(); // Fallback to copy directly if not HTTPS
            toast({
                title: currentText.shareApiNotSupported,
                description: currentText.shareApiNotSupportedNonHttpsDesc,
                variant: 'destructive' // Indicate it's not the ideal outcome
            });
            return; // Exit early
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
       console.error('Failed to share: ', err); // Keep logging for debugging
       // Check error type/message
       let errorTitle = currentText.shareErrorTitle;
       let errorDesc = currentText.shareErrorDesc;

       if (err instanceof DOMException) {
            if (err.name === 'AbortError') {
                // User cancelled the share operation, don't show an error toast
                console.log('Share cancelled by user.');
                return; // Exit without fallback or error toast
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
       // Always fallback to copy for any error other than AbortError
        handleCopy(); // Fallback to copy
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
    hover: { scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } } // Smoother spring animation
  };

  // Animation variants for the buttons
  const buttonVariants = {
     tap: { scale: 0.9, transition: { type: 'spring', stiffness: 500, damping: 15 } },
     hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 10 } } // Add hover effect to buttons too
  };


  return (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        // Use language in key to ensure card re-renders correctly if language changes while visible
        key={content.id + language}
    >
      {/* Apply Hindi font class based on content language, not UI language */}
      <Card className={`flex flex-col h-full shadow-lg border-primary/20 group hover:shadow-primary/30 transition-shadow duration-300 ${content.lang === 'hi' ? 'font-hindi' : ''}`}>
        <CardContent className="flex-grow p-4 pt-6">
          <p className="text-foreground leading-relaxed">{content.text}</p>
        </CardContent>
        <CardFooter className="p-2 border-t mt-auto flex justify-end space-x-1">
          <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
             <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={currentText.copyLabel} disabled={!isClient}>
                <Copy className="h-4 w-4" />
             </Button>
           </motion.div>
           <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label={currentText.shareLabel} disabled={!isClient}>
                <Share2 className="h-4 w-4" />
            </Button>
           </motion.div>
           <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
            <Button variant="ghost" size="icon" onClick={handleFavorite} aria-label={currentText.favoriteLabel} disabled={!isClient}>
                 <Heart className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-destructive text-destructive scale-110' : 'text-muted-foreground group-hover:text-destructive'}`} />
            </Button>
           </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContentCard;
