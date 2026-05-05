'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header({ title }) {
  const { locale, changeLocale } = useLanguage(); 
  const language = locale; 

  const [userData, setUserData] = useState({
    name: 'User',
    avatarUrl: ''
  });

  const updateUserData = () => {
    const savedData = localStorage.getItem('user_settings_profile');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  useEffect(() => {
    updateUserData();
    window.addEventListener('profileUpdated', updateUserData);
    window.addEventListener('storage', updateUserData);

    return () => {
      window.removeEventListener('profileUpdated', updateUserData);
      window.removeEventListener('storage', updateUserData);
    };
  }, []);

  const handleLanguageToggle = () => {
    const newLang = locale === 'ar' ? 'en' : 'ar';
    changeLocale(newLang);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 flex-shrink-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* left side - logo and company name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden">
            <img 
              src="/Logo.jpg" 
              alt="Logo" 
              className="h-6 w-6 object-contain" 
            />
          </div>
          <span className={`text-base font-semibold text-gray-900 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'ar' ? ' انبعاثات كربونية' : 'Carbon Emission'}
          </span>
        </div>
      </div>

      {/* right side - language toggle + user avatar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className={language === 'ar' ? 'font-cairo' : ''}>
            {locale === 'ar' ? 'EN' : 'عربي'}
          </span>
        </button>
        
        {/* User Avatar */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden border border-gray-100">
          {userData.avatarUrl ? (
            <img 
              src={userData.avatarUrl} 
              alt="User Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-white text-xs font-bold uppercase">
              {userData.name ? userData.name[0] : 'U'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}