
"use client";
import React from 'react';
import Header from '@/components/LandingHeader';
import Footer from "@/components/Footer";
import { ShieldCheck, Database, Lock } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/Translations";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = translations[language]?.Privacy || translations.ar.Privacy;
  const isRtl = language === 'ar';

  
  const IconList = [Database, ShieldCheck];

  return (
    <>
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-black text-[#10b981] text-center mb-12 tracking-tight">
          {t.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {t.cards.map((card, index) => {
            
            const IconComponent = IconList[index];
            
            return (
              <section 
                key={index} 
                className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:-translate-y-2 hover:shadow-2xl hover:border-[#10b981]/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
              
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#10b981] group-hover:rotate-[15deg] transition-all duration-500 shadow-inner">
                  <span className="text-[#10b981] group-hover:text-white transition-colors duration-500 scale-110">
                  
                    <IconComponent size={32} />
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold mb-4 text-slate-800 group-hover:text-[#10b981] transition-colors">
                  {card.title}
                </h2>
                <p className="text-slate-500 leading-relaxed text-[15px] font-medium">
                  {card.text}
                </p>
              </section>
            );
          })}
        </div>

        
        <div className="mt-12 p-6 bg-green-50/40 border border-green-100 rounded-[1.5rem] flex items-center justify-center gap-4 text-slate-600 text-sm font-bold hover:bg-green-50 transition-colors duration-300">
          <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
            <Lock size={16} />
          </div>
          <span>{t.footerNote}</span>
        </div>
      </main>
      <Footer />
    </>
  );
}


// "use client";
// import Header from '@/components/LandingHeader';
// import Footer from '@/components/Footer';

// export default function PrivacyPage() {
//   return (
//     <>
//       <Header />
//       <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto font-cairo">
//         <h1 className="text-4xl font-black text-[#10b981] mb-8">سياسة الخصوصية | Privacy Policy</h1>
//         <div className="prose prose-lg text-gray-600 space-y-6 text-right" dir="rtl">
//           <section>
//             <h2 className="text-2xl font-bold text-gray-900">1. جمع البيانات</h2>
//             <p>نحن في "Carbon Emission" نلتزم بحماية بياناتك الصناعية والبيئية. نقوم بجمع البيانات المتعلقة باستهلاك الطاقة والوقود فقط لغرض حساب البصمة الكربونية.</p>
//           </section>
//           <section>
//             <h2 className="text-2xl font-bold text-gray-900">2. أمن المعلومات</h2>
//             <p>يتم تشفير كافة البيانات المدخلة باستخدام تقنيات AES-256 لضمان عدم وصول أي طرف ثالث لتقارير الاستدامة الخاصة بشركتكم.</p>
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }