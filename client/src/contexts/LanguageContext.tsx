import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Language {
    id: string;
    name: string;
}

interface LanguageContextType {
    languages: Language[];
    selectedLanguage: Language | null;
    setSelectedLanguage: (language: Language) => void;
    addLanguage: (name: string) => Promise<Language | null>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/languages');
            const data = await response.json();
            setLanguages(data);
            if (data.length > 0 && !selectedLanguage) {
                setSelectedLanguage(data[0]);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    const addLanguage = async (name: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/languages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            const newLanguage = await response.json();
            setLanguages([...languages, newLanguage]);
            return newLanguage;
        } catch (error) {
            console.error('Error adding language:', error);
            return null;
        }
    };

    return (
        <LanguageContext.Provider value={{ 
            languages, 
            selectedLanguage, 
            setSelectedLanguage,
            addLanguage 
        }}>
            {children}
        </LanguageContext.Provider>
    );
};