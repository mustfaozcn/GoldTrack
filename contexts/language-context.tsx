// contexts/language-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextType = {
    language: 'tr' | 'en';
    setLanguage: (lang: 'tr' | 'en') => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<'tr' | 'en'>('tr');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
