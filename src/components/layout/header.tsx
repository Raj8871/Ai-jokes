'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Menu, X } from 'lucide-react'; // Icons for mobile menu
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile drawer


const Header = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist language preference (optional, using localStorage)
  useEffect(() => {
    const savedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
     // Add event listener to update language state if changed elsewhere (e.g., in page)
     const handleStorageChange = () => {
        const updatedLang = localStorage.getItem('shayariSagaLang') as 'en' | 'hi' | null;
        if (updatedLang && updatedLang !== language) {
             setLanguage(updatedLang);
        }
     };
     window.addEventListener('storage', handleStorageChange);
     return () => window.removeEventListener('storage', handleStorageChange);

  }, []); // Run only once on mount

  const handleLanguageToggle = (checked: boolean) => {
    const newLang = checked ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('shayariSagaLang', newLang);
     // Dispatch a custom event to notify other components (like the main page)
    window.dispatchEvent(new Event('languageChanged'));
  };

  const NavLinks = () => (
    <>
       <Link href="/" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
        {language === 'en' ? 'Home' : 'होम'}
      </Link>
      {/* Add more links as needed */}
       {/* <Link href="/about" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
        {language === 'en' ? 'About' : 'हमारे बारे में'}
      </Link>
      <Link href="/submit" className="hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
         {language === 'en' ? 'Submit' : 'सबमिट करें'}
       </Link> */}
    </>
  );

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Placeholder for a logo icon/svg */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <path d="M11.77 7.77l-1.41 1.41L12.94 12l-2.58 2.58 1.41 1.41L14.36 12l1.41-1.41-1.41-1.41L11.77 7.77zM17 14.5c0 .83-.67 1.5-1.5 1.5S14 15.33 14 14.5 14.67 13 15.5 13s1.5.67 1.5 1.5zM7 14.5C7 15.33 7.67 16 8.5 16S10 15.33 10 14.5 9.33 13 8.5 13 7 13.67 7 14.5z"/>
            </svg>
           <span className="font-bold text-lg">ShayariSaga</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
           <NavLinks />
           <div className="flex items-center space-x-2">
            <Label htmlFor="language-switch-desktop" className={language === 'hi' ? 'font-hindi' : ''}>
                {language === 'en' ? 'English' : 'अंग्रेज़ी'}
            </Label>
            <Switch
              id="language-switch-desktop"
              checked={language === 'hi'}
              onCheckedChange={handleLanguageToggle}
              aria-label="Toggle language between English and Hindi"
            />
            <Label htmlFor="language-switch-desktop" className={language === 'hi' ? 'font-hindi' : ''}>
                {language === 'en' ? 'Hindi' : 'हिंदी'}
            </Label>
            </div>
        </nav>

         {/* Mobile Navigation Button & Drawer */}
        <div className="md:hidden flex items-center">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
             <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                 <Menu className="h-6 w-6" />
                 <span className="sr-only">Open menu</span>
               </Button>
             </SheetTrigger>
             <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                 <div className="flex flex-col h-full p-4">
                     {/* Close Button Inside Drawer */}
                      <div className="flex justify-between items-center mb-6">
                         <span className="font-bold text-lg">Menu</span>
                         <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                             <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                         </Button>
                      </div>

                      {/* Mobile Nav Links */}
                      <nav className="flex flex-col space-y-4 mb-auto">
                          <NavLinks />
                     </nav>

                     {/* Language Toggle in Mobile */}
                      <div className="flex items-center justify-center space-x-2 mt-auto pt-4 border-t">
                         <Label htmlFor="language-switch-mobile" className={`text-sm ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {language === 'en' ? 'EN' : 'EN'}
                         </Label>
                         <Switch
                             id="language-switch-mobile"
                             checked={language === 'hi'}
                             onCheckedChange={handleLanguageToggle}
                             aria-label="Toggle language"
                         />
                         <Label htmlFor="language-switch-mobile" className={`text-sm ${language === 'hi' ? 'font-hindi' : ''}`}>
                            {language === 'en' ? 'HI' : 'HI'}
                        </Label>
                     </div>
                 </div>
             </SheetContent>
           </Sheet>
         </div>

      </div>
    </motion.header>
  );
};

export default Header;
