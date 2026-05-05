 "use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from "@/Translations";
import { motion } from "framer-motion";

export default function Testimonials() {
    const [selectedId, setSelectedId] = useState(null);
    const { language, locale } = useLanguage();
    
    const activeLang = language || locale || 'ar';
    const isRtl = activeLang === 'ar';

    const [t, setT] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // جلب البيانات من الملف المحلي
                const localData = translations[activeLang]?.testimonials || translations.ar?.testimonials;
                setT(localData);
            } catch (error) {
                console.error("Error loading testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [activeLang]);

    if (loading) {
        return <div className="py-24 text-center">جاري التحميل...</div>;
    }

    const testimonialsList = t?.list || [];

    return (
        <section className="py-24 bg-[#fcfcfc] font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                
                {/* العنوان الرئيسي */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
                        {t?.title || (isRtl ? "آراء العملاء" : "Testimonials")}
                    </h2>
                    <div className="w-14 h-1 bg-[#10b981] mx-auto rounded-full mb-6"></div>
                </div>

                {/* شبكة الآراء */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {testimonialsList.length > 0 ? (
                        testimonialsList.map((item, index) => {
                            const isSelected = selectedId === item.id;

                            return (
                                <motion.div
                                    key={item.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => setSelectedId(item.id)}
                                    whileHover={{ y: -12 }} // حركة رفع الكارت للأعلى قليلاً عند الهوفر
                                    // تم إضافة كلاس 'group' هنا ليصبح الكارت هو الأب المسؤول عن الهوفر
                                    className={`bg-white p-10 rounded-[2.5rem] relative border transition-all duration-500 flex flex-col justify-between cursor-pointer group
                                        ${isSelected ? 'border-[#10b981] shadow-2xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}
                                >
                                    {/* علامة الاقتباس الخلفية */}
                                    <div className={`absolute top-6 ${isRtl ? 'right-8' : 'left-8'} text-slate-100 text-8xl font-serif select-none opacity-80 z-0`}>
                                        “
                                    </div>

                                    {/* نص الرأي: يتغير لونه عند الهوفر على الكارت */}
                                    {/* تم إضافة group-hover:text-emerald-800 و transition-colors */}
                                    <p className={`text-lg font-medium italic mb-12 relative z-10 pt-4 leading-relaxed transition-colors duration-300
                                        ${isSelected ? 'text-emerald-900' : 'text-slate-500'} group-hover:text-emerald-800`}>
                                        "{item?.text || "..."}"
                                    </p>

                                    {/* بيانات الشخص والصورة */}
                                    <div className="flex items-center gap-5 mt-auto relative z-10">
                                        <div className="relative">
                                            {/* حاوية الصورة: الحركات الزمردية */}
                                            {/* تم إضافة group-hover:scale-110 و group-hover:border-[#10b981] و group-hover:shadow */}
                                            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-md shrink-0 
                                                group-hover:scale-110 group-hover:border-[#10b981] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]
                                                ${isSelected ? 'border-[#10b981]' : 'border-white'}`}>
                                                <img
                                                    src={item?.image || ""}
                                                    alt={item?.name || "User"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { 
                                                        e.target.src = `https://ui-avatars.com/api/?name=${item?.name || 'User'}&background=10b981&color=fff&bold=true` 
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            {/* اسم الشخص: يتغير لونه أيضاً للزمردي عند الهوفر على الكارت */}
                                            <h4 className={`font-bold text-lg leading-tight transition-colors duration-300
                                                ${isSelected ? 'text-[#10b981]' : 'text-slate-700'} group-hover:text-emerald-700`}>
                                                {item?.name || "Unknown User"}
                                            </h4>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                                                {item?.role || ""}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className="text-center col-span-full text-red-500 bg-red-50 p-6 rounded-xl border border-red-100">
                           {isRtl ? "عذراً، لم يتم العثور على بيانات الترجمة. تأكد من ملف Translations." : "Sorry, translation data not found."}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
// "use client";
// import { useState, useEffect } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import translations from "@/Translations"; // تأكد إن المسار ده صح
// import { motion } from "framer-motion";

// export default function Testimonials() {
//     const [selectedId, setSelectedId] = useState(null);
//     const { language, locale } = useLanguage();
    
//     const activeLang = language || locale || 'ar';
//     const isRtl = activeLang === 'ar';

//     // سحب البيانات مباشرة بدون تعقيد useEffect مؤقتاً للتأكد
//     const t = translations?.[activeLang]?.testimonials || translations?.ar?.testimonials;

//     // ده سطر "الكشف" - افتح الـ Console وشوف هيطبع إيه
//     console.log("Current Language:", activeLang);
//     console.log("Translation Object:", translations);
//     console.log("Testimonials Data (t):", t);

//     // لو مفيش بيانات خالص، اعرض رسالة بديلة بدل ما الصفحة تفضل بيضاء
//     if (!t) {
//         return (
//             <div className="py-20 text-center border-2 border-dashed border-red-200">
//                 <p className="text-red-500">عذراً، لم يتم العثور على بيانات الترجمة.</p>
//                 <p className="text-sm text-gray-400">تأكد من ملف Translations وما إذا كان يحتوي على testimonials</p>
//             </div>
//         );
//     }

//     const testimonialsList = t.list || [];

//     return (
//         <section className="py-24 bg-[#fcfcfc] font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
//             <div className="max-w-7xl mx-auto px-6">
                
//                 <div className="text-center mb-20">
//                     <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
//                         {t.title || "Testimonials"}
//                     </h2>
//                     <div className="w-14 h-1 bg-[#10b981] mx-auto rounded-full mb-6"></div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                     {testimonialsList.map((item, index) => {
//                         const isSelected = selectedId === item.id;
//                         return (
//                             <motion.div
//                                 key={item.id || index}
//                                 onClick={() => setSelectedId(item.id)}
//                                 whileHover={{ y: -8 }}
//                                 className={`bg-white p-10 rounded-[2.5rem] relative border transition-all duration-500 flex flex-col justify-between cursor-pointer
//                                     ${isSelected ? 'border-[#10b981] shadow-xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
//                             >
//                                 <p className={`text-lg font-medium italic mb-12 relative z-10 pt-4 leading-relaxed transition-colors duration-300
//                                     ${isSelected ? 'text-[#064e3b]' : 'text-slate-500'}`}>
//                                     "{item.text}"
//                                 </p>

//                                 <div className="flex items-center gap-5 mt-auto">
//                                     <div className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-md shrink-0">
//                                         <img
//                                             src={item.image}
//                                             alt={item.name}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + item.name }}
//                                         />
//                                     </div>
//                                     <div className="flex-1">
//                                         <h4 className={`font-bold text-lg ${isSelected ? 'text-[#10b981]' : 'text-slate-700'}`}>
//                                             {item.name}
//                                         </h4>
//                                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
//                                             {item.role}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>
//     );
// }
//  "use client";
// import { useState } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import translations from "@/Translations";
// import { motion } from "framer-motion"; 

// export default function Testimonials() {
//     const [selectedId, setSelectedId] = useState(null); 
//   const { language, locale } = useLanguage();
//   const activeLang = language || locale || 'ar';
//   const t = translations[activeLang]?.testimonials || translations.ar?.testimonials;
  
//   const isRtl = activeLang === 'ar';

//     return (
//         <section className="py-24 bg-[#fcfcfc] font-cairo" dir={isRtl ? 'rtl' : 'ltr'}>
//             <div className="max-w-7xl mx-auto px-6">
//              <div className="text-center mb-20">
//                      {/* <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
//                          {t.title}
//                      </h2> */}
//                      <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
//                 {t?.title} 
//                 </h2>
//                      <div className="w-14 h-1 bg-[#10b981] mx-auto rounded-full mb-6"></div>
//                 </div>
                

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   
//                       {t?.list?.map((item, index) => {
//                   const isSelected = selectedId === item.id;
    

//                         return (
//                             <motion.div
//                                 key={item.id}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 onClick={() => setSelectedId(item.id)} // تغيير الحالة عند الضغط
//                                 whileHover={{ y: -8 }}
//                                 className={`bg-white p-10 rounded-[2.5rem] relative border transition-all duration-500 flex flex-col justify-between cursor-pointer
//                                     ${isSelected ? 'border-[#10b981] shadow-xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
//                             >
                                
//                                 {/* علامة الاقتباس */}
//                                 <div className={`absolute top-6 ${isRtl ? 'right-8' : 'left-8'} text-slate-100 text-8xl font-serif select-none opacity-80`}>
//                                     “
//                                 </div>

//                                 {/* النص: يتحول لأخضر غامق عند الضغط */}
//                                 <p className={`text-lg font-medium italic mb-12 relative z-10 pt-4 leading-relaxed transition-colors duration-300
//                                     ${isSelected ? 'text-[#064e3b]' : 'text-slate-500'}`}>
//                                     "{item.text}"
//                                 </p>

//                                 <div className="flex items-center gap-5 mt-auto">
//                                     {/* الصورة: حركة ودائرة خضراء عند الهوفر */}
//                                     <div className="group/img relative">
//                                         <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-md shrink-0 
//                                             group-hover/img:scale-110 group-hover/img:border-[#10b981] group-hover/img:shadow-[0_0_15px_rgba(16,185,129,0.4)]
//                                             ${isSelected ? 'border-[#10b981]' : 'border-white'}`}>
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-full h-full object-cover"
//                                                 onError={(e) => { 
//                                                     e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=10b981&color=fff&bold=true` 
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="flex-1">
//                                         <h4 className={`font-bold text-lg leading-tight transition-colors duration-300
//                                             ${isSelected ? 'text-[#10b981]' : 'text-slate-700'}`}>
//                                             {item.name}
//                                         </h4>
//                                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
//                                             {item.role}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>
//     );
// }