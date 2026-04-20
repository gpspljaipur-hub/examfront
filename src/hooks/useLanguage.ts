import { useEffect, useState } from 'react';
import {
  getLanguage,
  setLanguage,
  loadLanguage,
  subscribeLanguage,
} from '../utils/language';
import { labelsData } from '../utils/labels';

export const useLanguage = () => {
  const [language, setLangState] = useState(getLanguage());

  useEffect(() => {
    // load from storage
    loadLanguage().then(setLangState);

    // listen for changes
    const unsubscribe = subscribeLanguage(() => {
      setLangState(getLanguage());
    });

    return unsubscribe;
  }, []);

  const changeLanguage = async (lang: 'en' | 'hi') => {
    await setLanguage(lang);
  };

  const labels = labelsData[language];

  return {
    language,
    setLanguage: changeLanguage,
    labels,
  };
};
