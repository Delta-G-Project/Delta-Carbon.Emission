"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";

/**
 * HowItWorks Component
 * Describes the process or steps of the platform with interactive cards.
 */
export default function HowItWorks() {
  // Localization and State Hooks
  const { language } = useLanguage();
  const [activeCard, setActiveCard] = useState(null);

  // Data mapping from translation files
  const t = translations[language]?.howItWorks || translations.ar.howItWorks;
  const isRtl = language === 'ar';

  return (
    <section id="HowItWorks" className="scroll-mt-20 min-h-screen flex flex-col justify-center py-20">
  <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Section Header: Title and Subtitle */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">
             {t.title}
          </h2>
          <div className="w-12 h-1 bg-[#10b981] mx-auto rounded-full mb-6 opacity-80"></div>
          <p className="text-slate-400 text-base font-medium max-w-xl mx-auto leading-relaxed">
             {t.subtitle}
          </p>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {t.list.map((f, i) => (
            <motion.div
              key={f.id}
              // Entry Animation
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              
              // Interaction States
              onMouseEnter={() => setActiveCard(f.id)}
              onMouseLeave={() => setActiveCard(null)}
              whileHover={{ y: -10 }}
              
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 text-center shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group"
            >
              {/* Step Icon Container */}
              <div className="w-16 h-16 mx-auto mb-8 rounded-2xl overflow-hidden shadow-inner bg-gray-50 flex items-center justify-center">
                <img 
                  src={`/icon/num${f.id}.jpg`}
                  alt={f.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  // Fallback image if source fails
                  onError={(e) => { 
                    e.target.src = `https://ui-avatars.com/api/?name=${f.id}&background=10b981&color=fff&bold=true` 
                  }}
                />
              </div>

              {/* Content: Title and Description */}
              <h3 className="text-xl font-bold text-slate-700 mb-4 group-hover:text-[#10b981] transition-colors">
                {f.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>

              {/* Decorative Bottom Progress Indicator */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#10b981]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeCard === f.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

