import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'APP_LANGUAGE';

let currentLanguage: 'en' | 'hi' = 'en';
const listeners = new Set<() => void>();

export const getLanguage = () => currentLanguage;

export const setLanguage = async (lang: 'en' | 'hi') => {
  currentLanguage = lang;
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  listeners.forEach(listener => listener());
};

export const loadLanguage = async () => {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (stored === 'en' || stored === 'hi') {
    currentLanguage = stored;
  }
  return currentLanguage;
};

export const subscribeLanguage = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener); // ✅ अब void return होगा
  };
};
