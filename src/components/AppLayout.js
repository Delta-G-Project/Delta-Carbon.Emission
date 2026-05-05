// 'use client';
// import { usePathname } from 'next/navigation';
// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';
// import { useLanguage } from '@/contexts/LanguageContext';

// export default function AppLayout({ children, title }) {
//   const { isRTL } = useLanguage();
//   const pathname = usePathname();
//   const isLoginPage = pathname === '/login';
//   if (isLoginPage) {
//     return (
//       <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
//         {children}
//       </div>
//     );
//   }
//   return (
//     <div 
//       className="flex h-screen overflow-hidden bg-gray-100" 
//       dir={isRTL ? 'rtl' : 'ltr'}
//     >
//       <Sidebar />
      
//       <div className="flex flex-1 flex-col overflow-hidden min-w-0">
//         <Header title={title} />
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//         <footer className="border-t border-gray-200 bg-white px-6 py-2 text-center text-xs text-gray-400">
//           © 2026 CarbonEmission. All rights reserved
//         </footer>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState } from 'react'; // ضفنا useState عشان نتحكم في فتح وقفل المنيو
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AppLayout({ children, title }) {
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة المنيو في الموبايل

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen overflow-hidden bg-gray-100" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. تعديل الـ Sidebar: يظهر فوق المحتوى في الموبايل ويختفي لما نقفله */}
      <div className={`
        fixed inset-y-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        lg:block
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* 2. طبقة خلفية سوداء خفيفة تظهر لما المنيو تتفتح في الموبايل */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 w-full">
        
        <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        
        <footer className="border-t border-gray-200 bg-white px-6 py-2 text-center text-[10px] md:text-xs text-gray-400">
          © 2026 CarbonEmission. All rights reserved
        </footer>
      </div>
    </div>
  );
}