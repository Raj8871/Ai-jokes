'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

type Category = { key: string; en: string; hi: string };

interface SearchFilterProps {
  language: 'en' | 'hi';
  categories: Category[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  language,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {

  const placeholderText = {
    en: "Search by keyword...",
    hi: "कीवर्ड द्वारा खोजें...",
  };

  const categoryLabel = {
    en: "Filter by category",
    hi: "श्रेणी के अनुसार फ़िल्टर करें",
  };

   const allCategoriesOption = {
     en: "All Categories",
     hi: "सभी श्रेणियां",
   };


  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 my-6">
      {/* Search Input */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholderText[language]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-10 ${language === 'hi' ? 'font-hindi placeholder:font-hindi' : ''}`}
        />
      </div>

      {/* Category Filter Dropdown */}
      <div className="md:w-1/3 lg:w-1/4">
         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className={`w-full ${language === 'hi' ? 'font-hindi' : ''}`}>
             <SelectValue placeholder={categoryLabel[language]} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all" className={language === 'hi' ? 'font-hindi' : ''}>
               {allCategoriesOption[language]}
             </SelectItem>
             {categories.map(cat => (
               <SelectItem key={cat.key} value={cat.key} className={language === 'hi' ? 'font-hindi' : ''}>
                 {cat[language]}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>
    </div>
  );
};

export default SearchFilter;
