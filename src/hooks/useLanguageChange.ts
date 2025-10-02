import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook để force re-render component khi ngôn ngữ thay đổi
 * Sử dụng khi component không tự động cập nhật sau khi đổi ngôn ngữ
 */
export const useLanguageChange = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return language;
};

/**
 * Hook để lấy translation với force re-render
 */
export const useTranslationWithRerender = () => {
  const { t, i18n } = useTranslation();
  const language = useLanguageChange();

  return { t, i18n, language };
};
