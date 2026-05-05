"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const { language, locale } = useLanguage();
  const activeLang = language || locale || 'ar';
  const t = translations[activeLang]?.footer || translations.ar?.footer;
  const common = translations[activeLang]?.nav || translations.ar?.nav;
  
  const isRtl = activeLang === "ar";

  return (
    <footer className="w-full font-cairo bg-white" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. CTA Section -*/}
      <div className="bg-[#10b981] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white text-3xl md:text-5xl font-black mb-6 leading-tight"
          >
            {t.ctaTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-white/90 text-lg mb-10"
          >
            {t.ctaSubtitle}
          </motion.p>
          
          {/* emissions-calculator */}
          <Link href="/emissions-calculator?mode=standalone">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#10b981] px-12 py-3 rounded-xl font-black text-lg shadow-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {t.ctaButton}
            </motion.button>
          </Link>
        </div>
      </div>

      {/* 2. Links Section */}
      <div className="bg-white py-16 px-6 border-t border-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
      
          <div className={`flex flex-col gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Logo.jpg" alt="Logo" width={40} height={40} className="rounded-md" />
              <span className="text-2xl font-black text-[#10b981]">Carbon Emission</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-bold">
              {t.description}
            </p>
          </div>

       
          <div className={`flex flex-col gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h4 className="font-black text-gray-900 text-lg">{t.productTitle}</h4>
            <ul className="text-gray-500 space-y-3 text-sm font-bold">
              <li><Link href="/Features" className="hover:text-[#10b981] transition-colors">{common.features}</Link></li>
              <li><Link href="/Pricing" className="hover:text-[#10b981] transition-colors">{common.pricing}</Link></li>
              <li><Link href="/HowItWorks" className="hover:text-[#10b981] transition-colors">{t.aiInsights}</Link></li>
            </ul>
          </div>

         
          <div className={`flex flex-col gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h4 className="font-black text-gray-900 text-lg">{t.companyTitle}</h4>
            <ul className="text-gray-500 space-y-3 text-sm font-bold">
              <li><Link href="/About" className="hover:text-[#10b981] transition-colors">{t.aboutUs}</Link></li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 text-[#10b981] hover:underline">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

        
          <div className={`flex flex-col gap-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h4 className="font-black text-gray-900 text-lg">{t.legalTitle}</h4>
            <ul className="text-gray-500 space-y-3 text-sm font-bold">
              <li><Link href="/Privacy" className="hover:text-[#10b981] transition-colors">{t.privacy}</Link></li>
              <li><Link href="/Terms" className="hover:text-[#10b981] transition-colors">{t.terms}</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* English-only Copyright */}
      <div className="bg-gray-50 py-6 px-6 text-center text-gray-400 text-xs font-bold border-t border-gray-100">
        <p>© 2026 Carbon Emission. All rights reserved.</p>
      </div>
    </footer>
  );
}