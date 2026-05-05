
"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";
import Image from "next/image"; 
export default function FeaturesGrid() {
  const { language, locale } = useLanguage(); 
  const activeLang = language || locale || 'ar'; 
  const t = translations[activeLang]?.featuresGrid || translations.ar.featuresGrid;
  
  const isAr = activeLang === 'ar';

 


  return (
   <section 
  id="Features" 
  // 1. خلينا الـ scroll-mt-16 عشان الهيدر، والـ pt-24 عشان ندي "نفس" للكلام فوق
  className="scroll-mt-16 min-h-screen flex flex-col justify-center pt-24 pb-12 bg-white font-cairo overflow-hidden" 
  dir={isAr ? 'rtl' : 'ltr'}
>
  <div className="max-w-7xl mx-auto px-6 w-full">
    
    {/* الهيدينج: قللنا الـ mb من 24 لـ 8 عشان الكروت تطلع لفوق وتدخل في الكادر */}
    <div className="text-center mb-8 md:mb-10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight"
      >
        {t.title}
      </motion.h2>
      <div className="w-12 md:w-16 h-1 bg-emerald-500 rounded-full mx-auto mb-4"></div>
      <p className="text-slate-400 text-xs md:text-base max-w-xl mx-auto font-bold opacity-70 px-2">
        {t.subtitle}
      </p>
    </div>

    {/* الجريد: قللنا الـ gap والـ padding بتاع الكروت عشان نضمن إنها متخرجش بره الشاشة */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {t.list.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -10 }} 
          // قللنا الـ padding هنا من 12 لـ 8
          className="group relative p-6 md:p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] hover:border-emerald-500/20"
        >
          {/* حاوية الأيقونة: صغرناها شوية عشان توفر مساحة رأسيّة */}
          <div className="mb-4 md:mb-6 relative">
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 blur-3xl rounded-full scale-150 transition-all duration-700"></div>
            
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-50 group-hover:bg-white group-hover:border-emerald-100 transition-all duration-500">
              <div className="w-8 h-8 md:w-12 md:h-12 relative">
                <img
                  src={`/icon/num${f.id}.jpg`} 
                  alt={f.title}
                  className="object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-base md:text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors font-cairo">
              {f.title}
            </h3>
            <p className="text-slate-500/80 text-[10px] md:text-xs leading-relaxed font-bold group-hover:opacity-100 transition-opacity font-cairo">
              {f.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
  );
//    <section 
//   id="Features" 
//   className="scroll-mt-16 min-h-screen flex flex-col justify-center pt-0 pb-16 md:pb-32 bg-white font-cairo overflow-hidden" 
//   dir={isAr ? 'rtl' : 'ltr'}
// >
//       <div className="max-w-7xl mx-auto px-6">

       
//         <div className="text-center mb-16 md:mb-24">
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="text-2xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight"
//           >
//             {t.title}
//           </motion.h2>
//           <div className="w-12 md:w-16 h-1 md:h-1.5 bg-emerald-500 rounded-full mx-auto mb-6"></div>
//           <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-bold opacity-70 px-2">
//             {t.subtitle}
//           </p>
//         </div>

       
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//           {t.list.map((f, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               whileHover={{ y: -10 }} 
              
           
//               className="group relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)] hover:border-emerald-500/20"
//             >
//               {/* Icon Container -*/}
//               <div className="mb-6 md:mb-10 relative">
//                 <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 blur-3xl rounded-full scale-150 transition-all duration-700"></div>
                
//                 <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-50 group-hover:bg-white group-hover:border-emerald-100 transition-all duration-500">
//                   <div className="w-10 h-10 md:w-14 md:h-14 relative">
//                     <Image
//                       src={`/icon/num${f.id}.jpg`} 
//                       alt={f.title}
//                       fill
//                       className="object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500"
//                       onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/10b981/default.png" }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="relative z-10">
               
//                 <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors font-cairo">
//                   {f.title}
//                 </h3>
             
//                 <p className="text-slate-500/80 text-xs md:text-sm leading-relaxed font-bold group-hover:opacity-100 transition-opacity font-cairo">
//                   {f.desc}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
}