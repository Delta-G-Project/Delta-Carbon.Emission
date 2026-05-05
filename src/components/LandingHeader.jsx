"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import translations from "@/Translations";
import { useLanguage } from '@/contexts/LanguageContext'

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  
  const t = translations[language] || translations.ar;

  
  const navItems = [
    { name: t?.nav?.home || (language === 'ar' ? "الرئيسية" : "Home"), href: "/" },
    { name: t?.nav?.howItWorks || (language === 'ar' ? "كيف نعمل" : "How it Works"), href: "/HowItWorks" },
    { name: t?.nav?.features || (language === 'ar' ? "المميزات" : "Features"), href: "/Features" },
    { name: t?.nav?.pricing || (language === 'ar' ? "الأسعار" : "Pricing"), href: "/Pricing" },
    { name: t?.nav?.contact || (language === 'ar' ? "تواصل معنا" : "Contact"), href: "/contact" }, 
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 font-cairo border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        
    
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/Logo.jpg" alt="Logo" width={40} height={40} className="rounded-md shadow-sm" />
          <span className="text-xl font-black text-[#10b981] tracking-tight">{t?.siteName || "Carbon Emission"}</span>
        </Link>

        {/* - Desktop */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item, i) => (
            <Link 
              key={i} 
              href={item.href} 
              className="text-sm font-medium text-gray-700 hover:text-[#10b981] transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10b981] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          
         
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#10b981] transition-all group"
          >
            <svg className={`w-4 h-4 text-gray-500 group-hover:text-[#10b981] ${language === 'en' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9V3m0 9L3 3m0 18l9-9" />
            </svg>
            <span className="text-xs font-black text-gray-600 group-hover:text-[#10b981]">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <Link 
              href="/login" 
              className="text-[#10b981] px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors"
            >
              {t?.login || "دخول"}
            </Link>
            <Link 
              href="/register" 
              className="bg-[#10b981] text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#059669] shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5"
            >
              {t?.signUp || "ابدأ الآن"}
            </Link>
          </div>

       
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>

 
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-50 p-6 space-y-4 shadow-xl">
           {navItems.map((item, i) => (
            <Link key={i} href={item.href} onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-800">
              {item.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
             <Link href="/login" className="text-center font-medium py-2 text-[#10b981]">دخول</Link>
             <Link href="/register" className="text-center bg-[#10b981] text-white py-3 rounded-xl font-medium">ابدأ الآن</Link>
          </div>
        </div>
      )}
    </header>
  );
}
