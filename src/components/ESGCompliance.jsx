"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";
export default function ESGCompliance() {

  const { language, locale } = useLanguage();
  const activeLang = language || locale || 'ar';
  const t = translations[activeLang]?.esgSection || translations.ar?.esgSection;
  
  const isRtl = activeLang === 'ar';


  // ESG Icons data from translations
  const features = [
    { text: t.points[0], icon: "/ESGCompliance/Num 2.jpg" }, 
    { text: t.points[1], icon: "/ESGCompliance/Num 3.jpg" }, 
    { text: t.points[2], icon: "/ESGCompliance/Num 4.jpg" }, 
  ];

  return (
    <section className="py-24 bg-[#fcfcfc] font-cairo overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        
        
        <div className="flex flex-col md:flex-row items-center gap-16">

        
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex-1 ${isRtl ? 'text-right' : 'text-left'} md:-mt-20 order-1`}
          >
          
            <h2 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
              {t.title}
            </h2>

          
            <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed max-w-xl">
              {t.description}
            </p>

            
            <div className="space-y-4">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group justify-start">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                    <img 
                      src={item.icon} 
                      className="w-full h-full object-contain" 
                      alt="esg-icon" 
                    />
                  </div>
                  <span className="text-slate-600 font-medium text-base">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full order-2"
          >
         {/* imag */}
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100">
              <img
                src="/ESGCompliance/Num 1.jpg" 
                alt="ESG Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
   }