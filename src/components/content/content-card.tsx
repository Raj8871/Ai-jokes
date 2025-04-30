'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

type ContentItem = {
  id: string;
  type: 'joke' | 'shayari';
  text: string;
  category: string;
  lang: 'en' | 'hi';
};

interface ContentCardProps {
  content: ContentItem;
  language: 'en' | 'hi';
}

const ContentCard: React.FC<ContentCardProps> = ({ content, language }) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false); // Placeholder state

  const handleCopy = () => {
    navigator.clipboard.writeText(content.text)
      .then(() => {
        toast({
          title: language === 'en' ? "Copied!" : "कॉपी किया गया!",
          description: language === 'en' ? "Content copied to clipboard." : "सामग्री क्लिपबोर्ड पर कॉपी की गई।",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: language === 'en' ? "Error" : "त्रुटि",
          description: language === 'en' ? "Could not copy content." : "सामग्री कॉपी नहीं की जा सकी।",
          variant: "destructive",
        });
      });
  };

  const handleShare = async () => {
     const shareData = {
       title: language === 'en' ? `ShayariSaga ${content.type}` : `शायरी सागा ${content.type}`,
       text: content.text,
       url: window.location.href, // Or a specific URL for the content if available
     };

     try {
        if (navigator.share) {
             await navigator.share(shareData);
             toast({
                 title: language === 'en' ? "Shared!" : "शेयर किया गया!",
             });
        } else {
             // Fallback for browsers that don't support navigator.share
             // Maybe open specific social media links in new tabs
             // For simplicity, just copy for now as a fallback
             handleCopy();
             toast({
                 title: language === 'en' ? "Link Copied" : "लिंक कॉपी किया गया",
                 description: language === 'en' ? "Sharing not supported, link copied instead." : "शेयरिंग समर्थित नहीं है, इसके बजाय लिंक कॉपी किया गया।",
             });
        }
     } catch (err) {
       console.error('Failed to share: ', err);
       // Don't show error toast if user cancelled share dialog etc.
       if (!err?.toString().includes('AbortError')) {
             toast({
             title: language === 'en' ? "Error Sharing" : "शेयर करने में त्रुटि",
             description: language === 'en' ? "Could not share the content." : "सामग्री शेयर नहीं की जा सकी।",
             variant: "destructive",
             });
       }
     }
   };


  const handleFavorite = () => {
    // Placeholder: In a real app, save/remove favorite status to user profile (localStorage/Firebase)
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? (language === 'en' ? 'Removed from Favorites' : 'पसंदीदा से हटाया गया')
                       : (language === 'en' ? 'Added to Favorites' : 'पसंदीदा में जोड़ा गया'),
    });
  };

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.03 }}
    >
      <Card className={`flex flex-col h-full shadow-lg border-primary/20 hover:shadow-primary/30 transition-shadow duration-300 ${content.lang === 'hi' ? 'font-hindi' : ''}`}>
        <CardContent className="flex-grow p-4 pt-6">
          <p className="text-foreground leading-relaxed">{content.text}</p>
        </CardContent>
        <CardFooter className="p-2 border-t mt-auto flex justify-end space-x-1">
          <motion.div whileTap={{ scale: 0.9 }}>
             <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={language === 'en' ? 'Copy' : 'कॉपी करें'}>
                <Copy className="h-4 w-4" />
             </Button>
           </motion.div>
           <motion.div whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label={language === 'en' ? 'Share' : 'शेयर करें'}>
                <Share2 className="h-4 w-4" />
            </Button>
           </motion.div>
           <motion.div whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleFavorite} aria-label={language === 'en' ? 'Favorite' : 'पसंदीदा'}>
                 <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
           </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContentCard;
