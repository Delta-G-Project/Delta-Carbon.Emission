'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import translations from '@/Translations';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLocale = 'ar' }) {
  const [locale, setLocale] = useState(initialLocale); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Zero-Storage Policy: Only read from cookies
    const match = document.cookie.match(new RegExp('(^| )ecovision_locale=([^;]+)'));
    const saved = match ? match[2] : initialLocale;
    
    if (saved && saved !== initialLocale) {
      setLocale(saved);
      document.cookie = `ecovision_locale=${saved}; path=/; max-age=31536000`;
    }
  }, [initialLocale]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
      // No localStorage
    }
  }, [locale, mounted]);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    document.cookie = `ecovision_locale=${newLocale}; path=/; max-age=31536000`;
  };

  const t = (key) => {
    if (!key) return '';
    try {
      const keys = key.split('.');
      return keys.reduce((obj, k) => obj?.[k], translations[locale]) || key;
    } catch (error) {
      console.error("Translation Error:", error);
      return key;
    }
  };

  const isRTL = locale === 'ar';

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ 
        language: locale,      
        setLanguage: changeLocale, 
        locale,              
        changeLocale,
        isRTL, 
        t      
    }}>
        <div className={isRTL ? 'font-readex-pro' : 'font-plus-jakarta-sans'}>
            {children}
        </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
// / 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import translations from '@/translations';

// const translations = { ar, en };

// const LanguageContext = createContext();

// export function LanguageProvider({ children }) {
//   const [locale, setLocale] = useState('ar'); // default arabic
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     // get saved language
//     const saved = localStorage.getItem('ecovision_locale') || 'ar';
//     setLocale(saved);
//     document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
//     document.documentElement.lang = saved;
//   }, []);

//   useEffect(() => {
//     if (mounted) {
//       document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
//       document.documentElement.lang = locale;
//       localStorage.setItem('ecovision_locale', locale);
//     }
//   }, [locale, mounted]);

//   const changeLocale = (newLocale) => {
//     setLocale(newLocale);
//   };

//   // translate function
//   const t = (key) => {
//     const keys = key.split('.');
//     let result = translations[locale];
    
//     for (const k of keys) {
//       result = result?.[k];
//     }
    
//     return result || key;
//   };

//   const isRTL = locale === 'ar';

// return (
//     <LanguageContext.Provider value={{ 
//         language: locale,      
//         setLanguage: changeLocale, 
//         locale,            
//         changeLocale         
//     }}>
//         {children}
//     </LanguageContext.Provider>
// );
// }

// export function useLanguage() {
//   const ctx = useContext(LanguageContext);
//   if (!ctx) {
//     throw new Error('useLanguage must be used within LanguageProvider');
//   }
//   return ctx;
// }
