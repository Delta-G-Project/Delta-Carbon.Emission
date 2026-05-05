'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from "@/Translations";


const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-6 0h6" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h12m-5-8v8m5-8v8m-12 0V6a2 2 0 012-2h8l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
  </svg>
);
const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.826 3.31.077 3.279 1.815a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.31 1.529-1.09 2.78-2.615 2.469a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.826-3.31-.077-3.279-1.815a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.31-1.529 1.09-2.78 2.615-2.469a1.724 1.724 0 002.573-1.066zm-2.325 6.683a2 2 0 104 0 2 2 0 01-4 0z" />
  </svg>
);
const LogoutIcon = ({ isRTL }) => (
  <svg className={`w-5 h-5 transition-transform ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H9m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1" />
  </svg>
);

// ✅ مكون الـ NavLink (تم نقل تعريفه خارج الـ Sidebar لزيادة الأداء)
const NavLink = ({ item, pathname, language, t }) => {
  const active = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
        ${active ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <span className={active ? 'text-emerald-500' : 'text-gray-400'}>
        <Icon />
      </span>
      <span className={language === 'ar' ? 'font-alexandria' : ''}>
        {t(item.key)}
      </span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRTL, locale } = useLanguage();
  const language = locale;

  // ✅ دالة ترجمة ذكية تقرأ من ملف translations.js بناءً على الـ key
  const t = (path) => {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], translations[language]) || path;
  };

  const mainNav = [
    { key: 'nav.dashboard', href: '/dashboard', icon: HomeIcon },
    { key: 'nav.emissionsCalculator', href: '/emissions-calculator', icon: ChartIcon },
    { key: 'nav.aiInsights', href: '/ai-insights', icon: LightbulbIcon },
    { key: 'nav.esgReports', href: '/esg-reports', icon: DocumentIcon },
    { key: 'nav.reportsLog', href: '/reports-log', icon: ClipboardIcon },
    { key: 'nav.chatbot', href: '/chatbot', icon: ChatIcon },
  ];

  const bottomNav = [
    { key: 'nav.companyTeam', href: '/company-profile', icon: UsersIcon },
    { key: 'nav.settings', href: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.replace('/login');
  };

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex h-screen w-64 flex-shrink-0 flex-col bg-white border-e border-gray-200 transition-all duration-300"
    >
      {/* logo section */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden shrink-0">
          <img
            src="/Logo.jpg"
            alt="Carbon Emission Logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <span className={`text-base font-semibold text-gray-900 whitespace-nowrap ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'ar' ? 'انبعاثات كربونية' : 'Carbon Emission'}
        </span>
      </div>

      {/* main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {mainNav.map(item => (
          <NavLink 
            key={item.href} 
            item={item} 
            pathname={pathname} 
            language={language} 
            t={t} 
          />
        ))}
      </nav>

      {/* bottom section */}
      <div className="border-t border-gray-200 px-3 py-3 space-y-0.5">
        {bottomNav.map(item => (
          <NavLink 
            key={item.href} 
            item={item} 
            pathname={pathname} 
            language={language} 
            t={t} 
          />
        ))}

        {/* logout button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <span className="text-red-400">
            <LogoutIcon isRTL={isRTL} />
          </span>
          <span className={language === 'ar' ? 'font-cairo' : ''}>
            {t('nav.logout')}
          </span>
        </button>

      </div>
    </aside>
  );
}
// 'use client';


// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useLanguage } from '@/contexts/LanguageContext';
// import translations from "@/app/translations";

// const HomeIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-6 0h6" />
//   </svg>
// );

// const ChartIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// const LightbulbIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//   </svg>
// );

// const ChatIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//   </svg>
// );

// const DocumentIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h12m-5-8v8m5-8v8m-12 0V6a2 2 0 012-2h8l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
//   </svg>
// );

// const ClipboardIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//   </svg>
// );

// const UsersIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const SettingsIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.826 3.31.077 3.279 1.815a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.31 1.529-1.09 2.78-2.615 2.469a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.826-3.31-.077-3.279-1.815a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.31-1.529 1.09-2.78 2.615-2.469a1.724 1.724 0 002.573-1.066zm-2.325 6.683a2 2 0 104 0 2 2 0 01-4 0z" />
//   </svg>
// );

// const LogoutIcon = ({ isRTL }) => (
//   <svg className={`w-5 h-5 transition-transform ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H9m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1" />
//   </svg>
// );

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
  
//   const { t, isRTL, locale } = useLanguage();
//   const language = locale;

//   // main navigation items
//   const mainNav = [
//     { key: 'nav.dashboard', href: '/dashboard', icon: HomeIcon },
//     { key: 'nav.emissionsCalculator', href: '/emissions-calculator', icon: ChartIcon },
//     { key: 'nav.aiInsights', href: '/ai-insights', icon: LightbulbIcon },
//     { key: 'nav.esgReports', href: '/esg-reports', icon: DocumentIcon },
//     { key: 'nav.reportsLog', href: '/reports-log', icon: ClipboardIcon },
//     { key: 'nav.chatbot', href: '/chatbot', icon: ChatIcon },
//   ];

//   // bottom navigation items
//   const bottomNav = [
//     { key: 'nav.companyTeam', href: '/company-profile', icon: UsersIcon },
//     { key: 'nav.settings', href: '/settings', icon: SettingsIcon },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//     router.replace('/login');
//   };


// const NavLink = ({ item, pathname, language, t }) => {
//     const active = pathname === item.href;
//     const Icon = item.icon;
    
    
//     return (
//       <Link
//         href={item.href}
//         className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
//           ${active ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
//       >
//         <span className={active ? 'text-emerald-500' : 'text-gray-400'}>
//           <Icon />
//         </span>
//         <span className={language === 'ar' ? 'font-alexandria' : ''}>
//             {t(item.key)}
//         </span>
//       </Link>
//     );
//   };

//   return (
//     <aside 
//       dir={isRTL ? 'rtl' : 'ltr'}
//       className="flex h-screen w-64 flex-shrink-0 flex-col bg-white border-e border-gray-200 transition-all duration-300"
//     >
//       {/* logo section */}
//       <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
//         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden shrink-0">
//           <img 
//             src="/Logo.jpg" 
//             alt="Carbon Emission Logo" 
//             className="h-8 w-8 object-contain" 
//           />
//         </div>
//         <span className={`text-base font-semibold text-gray-900 whitespace-nowrap ${language === 'ar' ? 'font-cairo' : ''}`}>
//             {language === 'ar' ? 'انبعاثات كربونية' : 'Carbon Emission'}
//         </span>
//       </div>

//       {/* main navigation */}
//       <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
//         {mainNav.map(item => (
//           <NavLink key={item.href} item={item} />
//         ))}
//       </nav>

//       {/* bottom section */}
//       <div className="border-t border-gray-200 px-3 py-3 space-y-0.5">
//         {bottomNav.map(item => (
//           <NavLink key={item.href} item={item} />
//         ))}
        
//         {/* logout button */}
//          <button 
//           onClick={handleLogout}
//            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
//          >
//            <span className="text-red-400">
//             <LogoutIcon isRTL={isRTL} />
//           </span>
//            <span className={language === 'ar' ? 'font-cairo' : ''}>
//              {t('nav.logout')}
//            </span>
//          </button>
       
//       </div>
//     </aside>
//   );
// }


