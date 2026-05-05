"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";
export default function AIInsights() {
  const { language, locale } = useLanguage();
  const activeLang = language || locale || 'ar';
  const t = translations[activeLang]?.aiInsightsSection || translations.ar?.aiInsightsSection;
  
  const isRtl = activeLang === 'ar';

  
  const points = [
    { text: t.points[0], icon: "/All -img/Num 2.jpg" }, 
    { text: t.points[1], icon: "/All -img/Num 3.jpg" }, 
    { text: t.points[2], icon: "/All -img/Num 4.jpg" }, 
  ];

  return (
    <section className="py-24 bg-white font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        
    
        <div className="flex flex-col md:flex-row items-center gap-16">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full order-2 md:order-1" 
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
              <img
                src="/All -img/Num 1.jpg"
                alt="AI Insights Dashboard"
                className="w-full h-auto object-cover"
                onError={(e) => { e.target.src = "https://img.freepik.com/free-vector/dashboard-user-panel-template_52683-23323.jpg" }}
              />
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex-1 ${isRtl ? 'text-right' : 'text-left'} order-1 md:order-2`}
          >
           {/* h2 */}
            <h2 className="text-3xl font-bold text-slate-800 mb-6 leading-tight" >
              {t.title}
              </h2>

            <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed max-w-2xl">
              {t.description}
            </p>

            <div className="space-y-5">
              {points.map((point, index) => (
                <div key={index} className={`flex items-center gap-3 group ${isRtl ? 'justify-start' : 'justify-start'}`}>
                  {/*icons*/}
                   <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img 
                      src={point.icon} 
                      className="w-full h-full object-contain" 
                      alt="icon" 
                      onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/10b981/default.png" }}
                    />
                  </div> 
                
                 
                   <span className="text-slate-500 text-lg font-medium mb-0 leading-relaxed max-w-2xl">
                     {point.text}
                     </span>
                 
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}