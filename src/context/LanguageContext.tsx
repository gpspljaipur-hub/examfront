import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Strings from '../comman/String';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    getLanguage: () => Promise<string | null>;
    labels: typeof Strings.en;
}

const LANGUAGE_KEY = 'APP_LANGUAGE';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const loadLanguage = async () => {
            const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (stored === 'en' || stored === 'hi') {
                setLanguageState(stored);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    };

    const getLanguage = async () => {
        const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
        return lang;
    };

    const value = {
        language,
        setLanguage,
        getLanguage,
        labels: Strings[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};