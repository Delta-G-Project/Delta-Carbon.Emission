"use client";
import React from 'react';
import Header from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import translations from '@/Translations';  
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const { language } = useLanguage(); 


  const t = translations[language]?.Terms || translations.ar.Terms;
 
  const footerT = translations[language]?.footer || translations.ar.footer;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-cairo" dir={t.dir}>
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4">
       
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#10b981] mb-4 tracking-tight">
            {t.mainTitle}
          </h1>
          <div className="w-20 h-1.5 bg-[#10b981] mx-auto rounded-full mb-6 opacity-30"></div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-80">
            {t.subTitle}
          </p>
        </div>

        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-10">
          {t.cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={card.id} 
                className="group relative cursor-pointer p-10 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                           hover:bg-[#10b981] hover:border-[#10b981] hover:-translate-y-3 hover:shadow-2xl hover:shadow-green-200"
              >
                <div className="flex items-center gap-5 mb-6 justify-start">
                 
                  <div className="w-14 h-14 bg-green-50 text-[#10b981] rounded-2xl flex items-center justify-center shadow-inner 
                                  transition-all duration-500 group-hover:bg-white group-hover:text-[#064e3b] group-hover:rotate-[15deg]">
                    <IconComponent size={28} />
                  </div>
                  
                  <h2 className="text-xl font-extrabold text-slate-800 transition-colors duration-300 group-hover:text-white">
                    {card.title}
                  </h2>
                </div>
                
                <p className="text-[14px] leading-relaxed text-slate-500 font-medium transition-colors duration-300 group-hover:text-green-50">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

    
  
      <Footer />
    </div>
  );
}