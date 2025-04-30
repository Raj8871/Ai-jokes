'use client';

import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    const [language, setLanguage] = useState<'en' | 'hi'>('en');

    // Sync language with localStorage if used in Header
    useEffect(() => {
      const savedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
      if (savedLang) {
        setLanguage(savedLang);
      }
       // Listen for language changes from other components
       const handleLanguageChange = () => {
            const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
            if (updatedLang) {
                setLanguage(updatedLang);
            }
       };
       window.addEventListener('languageChanged', handleLanguageChange);
       return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    const copyrightText = {
        en: `© ${new Date().getFullYear()} ShayariSaga. All rights reserved.`,
        hi: `© ${new Date().getFullYear()} शायरी सागा। सर्वाधिकार सुरक्षित।`,
    };

  return (
    <footer className="bg-muted py-6 mt-12 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className={`text-sm text-muted-foreground ${language === 'hi' ? 'font-hindi' : ''}`}>
          {copyrightText[language]}
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
           <Link href="#" passHref legacyBehavior>
             <a target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
            </Link>
            <Link href="#" passHref legacyBehavior>
             <a target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </Link>
            <Link href="#" passHref legacyBehavior>
             <a target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
