'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// --- الأيقونات الزمردية ---
const SparklesIcon = () => <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const TrendUpIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L5 23M21 21l-5-5" /></svg>;
const LeafIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

function AIInsightsContent() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    // بيانات الـ 8 كروت بتنسيق الزمردي
    setTimeout(() => {
      setData({
        cards: [
          { id: '1', title: isAr ? 'كفاءة الاستدامة' : 'Eco Efficiency', val: '92%', color: 'bg-emerald-950 text-emerald-50', icon: 'spark' },
          { id: '2', title: isAr ? 'التوفير الكربوني' : 'Carbon Savings', val: '18.4', color: 'bg-white border-2 border-emerald-100 text-emerald-900', icon: 'leaf' },
          { id: '3', title: isAr ? 'تحليل المخاطر' : 'Risk Analysis', val: 'Low', color: 'bg-emerald-50 border-2 border-emerald-100 text-emerald-800', icon: 'spark' },
          { id: '4', title: isAr ? 'كثافة الطاقة' : 'Energy Intensity', val: '310', color: 'bg-emerald-800 text-white', icon: 'trend' },
          { id: '5', title: isAr ? 'بصمة المياه' : 'Water Footprint', val: '840', color: 'bg-emerald-100/50 border-2 border-emerald-200 text-emerald-900', icon: 'leaf' },
          { id: '6', title: isAr ? 'جودة الموردين' : 'Supplier Grade', val: 'A+', color: 'bg-emerald-900 text-emerald-100', icon: 'spark' },
          { id: '7', title: isAr ? 'نسبة التدوير' : 'Recycling Rate', val: '74%', color: 'bg-white border-2 border-emerald-100 text-emerald-900', icon: 'trend' },
          { id: '8', title: isAr ? 'توقعات النمو' : 'Future Outlook', val: '+22%', color: 'bg-emerald-600 text-white', icon: 'spark' },
        ],
        details: {
          '1': isAr ? "تحليل الكفاءة: وصلت منظمتك لمستوى متقدم جداً في استخدام الموارد." : "Efficiency: Your organization has reached an advanced level in resource utilization.",
          '2': isAr ? "التوفير: نجحت في تقليل 18.4 طن كربون هذا الشهر بفضل تحسين النقل." : "Savings: You reduced 18.4 tons of carbon this month via transport optimization.",
          '3': isAr ? "المخاطر: لا توجد مخاطر قانونية حالياً، التزامك بالمعايير مثالي." : "Risk: No legal risks detected; your compliance is perfect.",
          '4': isAr ? "الطاقة: انخفض استهلاك الكهرباء بنسبة 5% بعد تركيب الحساسات الذكية." : "Energy: Consumption dropped 5% after installing smart sensors.",
          '5': isAr ? "المياه: استخدامك للمياه مستقر، لكن ننصح بتركيب فلاتر ترشيد إضافية." : "Water: Stable usage; additional saving filters recommended.",
          '6': isAr ? "الموردين: جميع مورديك حصلوا على شهادات الاستدامة الخضراء." : "Suppliers: All your vendors are now green certified.",
          '7': isAr ? "التدوير: ارتفعت نسبة التدوير بفضل نظام فرز النفايات الجديد." : "Recycling: Rates increased due to the new waste sorting system.",
          '8': isAr ? "التوقعات: يتوقع الذكاء الاصطناعي توفيراً إضافياً بنسبة 22% العام القادم." : "Future: AI predicts an additional 22% savings next year."
        }
      });
      setLoading(false);
    }, 1000);
  }, [isAr]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-14 h-14 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p className="text-emerald-700 font-black tracking-widest text-xs uppercase animate-pulse">Syncing Emerald Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-12 py-10 px-4 max-w-[1400px] mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Header - Emerald Style */}
      <header className="flex items-center gap-6 border-b-2 border-emerald-50 pb-10">
        <div className="p-5 bg-emerald-600 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-200 animate-pulse">
          <SparklesIcon />
        </div>
        <div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">{isAr ? 'رؤى إيكو فيجن الزمردية' : 'EcoVision Emerald Insights'}</h1>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.3em] mt-1">Advanced 8-Point Environmental Analytics</p>
        </div>
      </header>

      {/* --- Grid Layout (4 top, 4 bottom) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => setSelectedCard(card.id)}
            whileHover={{ y: -12, scale: 1.03 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`cursor-pointer p-10 min-h-[260px] rounded-[3.5rem] flex flex-col justify-between relative overflow-hidden group transition-all shadow-lg hover:shadow-emerald-200/50 ${card.color}`}
          >
            {/* تأثير إضاءة خلفي لكل كارت */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-[60px] group-hover:bg-white/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{card.title}</span>
                <div className="opacity-50 group-hover:opacity-100 transition-opacity scale-110">
                  {card.icon === 'spark' ? <SparklesIcon /> : card.icon === 'trend' ? <TrendUpIcon /> : <LeafIcon />}
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-5xl font-black tracking-tighter leading-none mb-2">{card.val}</h3>
                <div className="h-1.5 w-16 bg-current opacity-20 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Detail Modal (Emerald Theme) --- */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-emerald-950/40 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-16 relative shadow-[0_30px_100px_rgba(6,78,59,0.3)] border border-emerald-50"
            >
              <button onClick={() => setSelectedCard(null)} className="absolute top-10 right-10 text-emerald-200 hover:text-emerald-600 transition-colors">
                <CloseIcon />
              </button>
              
              <div className="space-y-8">
                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl w-fit shadow-inner"><LeafIcon /></div>
                <h4 className="text-3xl font-black text-emerald-950 tracking-tight">{isAr ? 'التحليل الاستراتيجي' : 'Strategic Breakdown'}</h4>
                <p className="text-emerald-900/70 font-medium leading-relaxed text-xl">
                  {data.details[selectedCard]}
                </p>
                <div className="pt-8">
                  <button 
                    onClick={() => setSelectedCard(null)}
                    className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all"
                  >
                    {isAr ? 'العودة للوحة البيانات' : 'Back to Dashboard'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function AIInsightsPage() {
  return (
    <ClientWrapper>
      <AppLayout>
        <div className="min-h-screen bg-[#fcfdfd]"><AIInsightsContent /></div>
      </AppLayout>
    </ClientWrapper>
  );
}
// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ClientWrapper from '@/components/ClientWrapper';
// import AppLayout from '@/components/AppLayout';
// import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// // --- الأيقونات ---
// const SparklesIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
// const TrendUpIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L5 23M21 21l-5-5" /></svg>;
// const WarnIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
// const CloseIcon = () => <svg className="h-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// function AIInsightsContent() {
//   const { locale } = useLanguage();
//   const isAr = locale === 'ar';
  
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCard, setSelectedCard] = useState(null); // للتحكم في المودال

//   useEffect(() => {
//     // محاكاة جلب البيانات
//     setTimeout(() => {
//       setData({
//         score: "85%",
//         savings: "14.2",
//         risk: isAr ? "غرامات الانبعاثات" : "Carbon Penalties",
//         details: {
//           score: isAr ? "تحليلك ممتاز! أنت تسبق 80% من الشركات في منطقتك بفضل استخدامك للطاقة المتجددة." : "Great analysis! You lead 80% of local firms due to renewable energy use.",
//           savings: isAr ? "توفير 14.2 طن يعادل زراعة 235 شجرة سنوياً. يمكنك تحسين ذلك بتقليل استهلاك الكهرباء في الصيف." : "Saving 14.2 tons equals planting 235 trees yearly. Improve this by cutting summer peak energy.",
//           risk: isAr ? "خطر مرتفع: اللوائح الجديدة في 2026 تتطلب تقليل الانبعاثات بنسبة 5% إضافية لتجنب الضرائب." : "High Risk: 2026 regulations require an extra 5% reduction to avoid taxes."
//         }
//       });
//       setLoading(false);
//     }, 1000);
//   }, [isAr]);

//   if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-emerald-600 font-bold">{isAr ? 'جاري التحليل...' : 'Analyzing...'}</div>;

//   return (
//     <div className="space-y-12 py-8 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      
//       {/* Header */}
//       <header className="flex items-center gap-4 border-b border-emerald-50 pb-8">
//         <div className="p-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-xl shadow-emerald-200">
//           <SparklesIcon />
//         </div>
//         <div>
//           <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isAr ? 'مركز رؤى الذكاء الاصطناعي' : 'AI Insights Center'}</h1>
//           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{isAr ? 'اضغط على الكروت للتفاصيل' : 'Click cards for details'}</p>
//         </div>
//       </header>

//       {/* --- Dashboard Cards --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* Card 1: Score */}
//         <motion.div 
//           onClick={() => setSelectedCard('score')}
//           whileHover={{ y: -10, scale: 1.02 }}
//           className="cursor-pointer relative p-10 rounded-[3.5rem] bg-emerald-950 text-white shadow-2xl overflow-hidden group"
//         >
//           <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
//           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">{isAr ? 'كفاءة الاستدامة' : 'Eco Efficiency'}</p>
//           <h3 className="text-7xl font-black tracking-tighter mb-4">{data.score}</h3>
//           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
//              <div className="h-full bg-emerald-500 w-[85%]"></div>
//           </div>
//         </motion.div>

//         {/* Card 2: Savings */}
//         <motion.div 
//           onClick={() => setSelectedCard('savings')}
//           whileHover={{ y: -10, scale: 1.02 }}
//           className="cursor-pointer bg-white border-2 border-emerald-50 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all"
//         >
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? 'التوفير المتوقع' : 'Projected Savings'}</p>
//           <h3 className="text-5xl font-black text-slate-900 leading-none">{data.savings}</h3>
//           <span className="text-xs font-bold text-emerald-600 block mt-2 uppercase tracking-widest">Tons CO2e</span>
//           <div className="mt-8 flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
//              <TrendUpIcon />
//              <p className="text-[10px] font-black text-emerald-800 leading-tight">{isAr ? 'عرض التفاصيل والفرص' : 'View details & opportunities'}</p>
//           </div>
//         </motion.div>

//         {/* Card 3: Risk */}
//         <motion.div 
//           onClick={() => setSelectedCard('risk')}
//           whileHover={{ y: -10, scale: 1.02 }}
//           className="cursor-pointer bg-rose-50 border-2 border-rose-100 p-10 rounded-[3.5rem] relative group"
//         >
//           <div className="flex items-center gap-3 mb-6">
//              <div className="p-2.5 bg-rose-600 text-white rounded-2xl animate-bounce"><WarnIcon /></div>
//              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{isAr ? 'تنبيه المخاطر' : 'Risk Alert'}</span>
//           </div>
//           <h3 className="text-2xl font-black text-rose-900 leading-tight mb-4">{data.risk}</h3>
//           <p className="text-[10px] text-rose-400 font-bold uppercase">{isAr ? 'اضغط للحلول المقترحة' : 'Click for mitigation'}</p>
//         </motion.div>
//       </div>

//       {/* --- Detail Modal (النافذة المنبثقة) --- */}
//       <AnimatePresence>
//         {selectedCard && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative shadow-2xl border border-emerald-50"
//             >
//               <button 
//                 onClick={() => setSelectedCard(null)}
//                 className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
//               >
//                 <CloseIcon />
//               </button>

//               <div className="space-y-6">
//                 <div className="inline-block p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
//                   {selectedCard === 'score' ? <SparklesIcon /> : selectedCard === 'savings' ? <TrendUpIcon /> : <WarnIcon />}
//                 </div>
//                 <h4 className="text-2xl font-black text-slate-900">
//                   {selectedCard === 'score' ? (isAr ? 'تحليل الكفاءة' : 'Efficiency Analysis') : 
//                    selectedCard === 'savings' ? (isAr ? 'تفاصيل التوفير' : 'Savings Breakdown') : 
//                    (isAr ? 'إدارة المخاطر' : 'Risk Management')}
//                 </h4>
//                 <p className="text-slate-600 font-medium leading-relaxed text-lg">
//                   {data.details[selectedCard]}
//                 </p>
//                 <div className="pt-6 border-t border-slate-50">
//                   <button 
//                     onClick={() => setSelectedCard(null)}
//                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200"
//                   >
//                     {isAr ? 'فهمت، شكراً' : 'Got it, thanks'}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }

// export default function AIInsightsPage() {
//   return (
//     <LanguageProvider>
//       <ClientWrapper>
//         <AppLayout>
//           <div className="min-h-screen bg-[#fcfcfc]"><AIInsightsContent /></div>
//         </AppLayout>
//       </ClientWrapper>
//     </LanguageProvider>
//   );
// }
// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ClientWrapper from '@/components/ClientWrapper';
// import AppLayout from '@/components/AppLayout';
// import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// // --- الأيقونات الاحترافية ---
// const SparklesIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
// const TrendUpIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L5 23M21 21l-5-5" /></svg>;
// const WarnIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

// function AIInsightsContent() {
//   const { locale } = useLanguage();
//   const isAr = locale === 'ar';
  
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [securityAlert, setSecurityAlert] = useState(false);

//   // --- 🛡️ وظيفة الحماية الأمنية (Cybersecurity Guard) ---
//   const sanitize = (val) => {
//     const dangerous = /[<>'"/;()]/g;
//     if (dangerous.test(val)) {
//       setSecurityAlert(true);
//       setTimeout(() => setSecurityAlert(false), 3000);
//       return val.replace(dangerous, "");
//     }
//     return val;
//   };

//   // --- 🌐 الـ Fetch الذكي للبيانات ---
//   useEffect(() => {
//     const getAIData = async () => {
//       try {
//         const response = await fetch('/api/ai/insights'); // سيقوم زميلك ببرمجة هذا المسار
//         if (response.ok) {
//           const result = await response.json();
//           setData(result);
//         } else { throw new Error(); }
//       } catch (err) {
//         // بيانات "Demo" احترافية لمشروع EcoVision
//         setData({
//           score: "85%",
//           savings: "14.2",
//           mainRisk: isAr ? "ضريبة انبعاثات الكربون" : "Carbon Emission Tax",
//           recommendations: [
//             { title: isAr ? "كفاءة الطاقة" : "Energy Efficiency", desc: isAr ? "تحديث أنظمة التبريد يوفر 8% من الطاقة." : "Retrofitting cooling systems saves 8% energy.", impact: "High" },
//             { title: isAr ? "الطاقة المتجددة" : "Renewable Transition", desc: isAr ? "التحول للألواح الشمسية يقلل بصمتك الكربونية." : "Switching to solar panels reduces carbon footprint.", impact: "Medium" }
//           ],
//           riskList: [
//             { title: isAr ? "مخاطر الامتثال" : "Compliance Risk", level: "High", desc: isAr ? "عدم الالتزام بالمعايير قد يؤدي لغرامات مالية." : "Non-compliance may lead to legal fines." }
//           ]
//         });
//       } finally { setLoading(false); }
//     };
//     getAIData();
//   }, [isAr]);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//       <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
//       <p className="text-emerald-600 font-black animate-pulse uppercase text-[10px] tracking-widest">Processing Carbon Intelligence...</p>
//     </div>
//   );

//   return (
//     <div className="space-y-12 py-8 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      
//       {/* Header مع هالة AI المضيئة */}
//       <header className="flex items-center justify-between border-b border-emerald-50 pb-8 relative group">
//         <div className="absolute -inset-2 bg-emerald-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
//         <div className="relative flex items-center gap-4">
//           <div className="p-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-xl shadow-emerald-200 animate-pulse">
//             <SparklesIcon />
//           </div>
//           <div>
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isAr ? 'رؤى الذكاء الاصطناعي' : 'AI Strategic Insights'}</h1>
//             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">EcoVision Predictive Analysis</p>
//           </div>
//         </div>
//         <div className={`h-3 w-3 rounded-full transition-all duration-500 ${securityAlert ? 'bg-red-500 shadow-[0_0_20px_red]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
//       </header>

//       {/* --- Dashboard Cards (The Core) --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* Card 1: Sustainability Score (Premium Glass) */}
//         <motion.div whileHover={{ y: -10 }} className="relative p-10 rounded-[3.5rem] bg-gradient-to-br from-emerald-950 to-slate-900 text-white shadow-2xl overflow-hidden group">
//           <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
//           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">{isAr ? 'كفاءة الاستدامة' : 'Eco Efficiency'}</p>
//           <h3 className="text-7xl font-black tracking-tighter mb-4">{data.score}</h3>
//           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
//              <motion.div initial={{ width: 0 }} animate={{ width: data.score }} transition={{ duration: 2 }} className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></motion.div>
//           </div>
//         </motion.div>

//         {/* Card 2: Savings (Clean White) */}
//         <div className="bg-white border-2 border-emerald-50 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all flex flex-col justify-between">
//            <div>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? 'التوفير المتوقع' : 'Projected Savings'}</p>
//               <h3 className="text-5xl font-black text-slate-900 leading-none">{data.savings}</h3>
//               <span className="text-xs font-bold text-emerald-600 block mt-2 uppercase tracking-widest">Metric Tons CO2e</span>
//            </div>
//            <div className="mt-8 flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
//               <TrendUpIcon />
//               <p className="text-[10px] font-black text-emerald-800 leading-tight">{isAr ? 'تم تحليل كافة فرص التحسين بنجاح' : 'Analysis complete for all units'}</p>
//            </div>
//         </div>

//         {/* Card 3: Risk Alert (Red) */}
//         <div className="bg-rose-50 border-2 border-rose-100 p-10 rounded-[3.5rem] relative group">
//            <div className="flex items-center gap-3 mb-6">
//               <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200 animate-bounce"><WarnIcon /></div>
//               <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{isAr ? 'تحليل المخاطر' : 'Risk Alert'}</span>
//            </div>
//            <h3 className="text-2xl font-black text-rose-900 leading-tight mb-4">{data.mainRisk}</h3>
//            <button className="w-full py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-rose-700 transition-all active:scale-95">
//              {isAr ? 'اتخاذ إجراء فوري' : 'Mitigate Immediately'}
//            </button>
//         </div>
//       </div>

//       {/* --- Second Row: Recommendations & Details --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
//         {/* AI Recommendations */}
//         <div className="space-y-6">
//            <div className="flex items-center gap-3 px-4">
//               <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
//               <h4 className="text-xl font-black text-slate-800">{isAr ? 'توصيات ذكية' : 'AI Insights'}</h4>
//            </div>
//            <div className="space-y-4">
//              {data.recommendations.map((rec, i) => (
//                <motion.div whileHover={{ scale: 1.02 }} key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-emerald-200 transition-all">
//                   <div className="flex justify-between items-start mb-3">
//                      <span className="text-sm font-black text-slate-800">{rec.title}</span>
//                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase">{rec.impact} Impact</span>
//                   </div>
//                   <p className="text-xs text-slate-500 leading-relaxed font-medium">{rec.desc}</p>
//                </motion.div>
//              ))}
//            </div>
//         </div>

//         {/* Strategic Analysis */}
//         <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
//            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl"></div>
//            <h4 className="text-lg font-black mb-8 flex items-center gap-3">
//              <span className="p-2 bg-white/10 rounded-xl">⚡</span>
//              {isAr ? 'التحليل الاستراتيجي' : 'Strategic Analysis'}
//            </h4>
//            <div className="space-y-8 relative z-10">
//              {data.riskList.map((risk, i) => (
//                <div key={i} className="flex gap-5 border-b border-white/5 pb-8 last:border-0">
//                   <div className="p-4 bg-rose-500/20 text-rose-500 rounded-2xl h-fit shadow-inner"><WarnIcon /></div>
//                   <div>
//                     <h5 className="font-bold text-sm mb-2">{risk.title}</h5>
//                     <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{risk.desc}</p>
//                     <div className="mt-4 flex items-center gap-2">
//                        <span className="h-1 w-12 bg-rose-500 rounded-full"></span>
//                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Priority {risk.level}</span>
//                     </div>
//                   </div>
//                </div>
//              ))}
//            </div>
//         </div>

//       </div>

//     </div>
//   );
// }

// // --- تصدير الصفحة (Final Page Export) ---
// export default function AIInsightsPage() {
//   return (
//     <LanguageProvider>
//       <ClientWrapper>
//         <AppLayout>
//           <div className="min-h-screen bg-[#fcfcfc]"><AIInsightsContent /></div>
//         </AppLayout>
//       </ClientWrapper>
//     </LanguageProvider>
//   );
// }
// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import ClientWrapper from '@/components/ClientWrapper';
// import AppLayout from '@/components/AppLayout';
// import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// // --- الأيقونات (Modern AI Style) ---
// const SparklesIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
// const TrendUpIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L5 23M21 21l-5-5" /></svg>;
// const WarnIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

// function AIInsightsContent() {
//   const { locale } = useLanguage();
//   const isAr = locale === 'ar';
  
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [planTab, setPlanTab] = useState(0);

//   // --- 1. الـ Fetch الذكي (باك-إند + داتا وهمية احتياطية) ---
//   useEffect(() => {
//     const getAIData = async () => {
//       try {
//         const response = await fetch('/api/ai-analysis'); // رابط الباك إيند
//         if (response.ok) {
//           const result = await response.json();
//           setData(result);
//         } else {
//           throw new Error('Fallback to mock');
//         }
//       } catch (err) {
//         // داتا "وهمية" احترافية تظهر لو السيرفر مش شغال
//         setData({
//           score: "82%",
//           totalSaved: "12.5",
//           recommendations: [
//             { title: isAr ? 'تحويل أسطول النقل' : 'Transport Fleet Transition', desc: isAr ? 'استخدام شاحنات كهربائية يقلل الانبعاثات بنسبة 15%' : 'Switching to EV trucks cuts emissions by 15%', impact: 'High' },
//             { title: isAr ? 'ألواح شمسية ذكية' : 'Smart Solar Panels', desc: isAr ? 'تركيب الخلايا الكهروضوئية في المجمع الرئيسي' : 'Installing PV cells in the main complex', impact: 'Medium' }
//           ],
//           risks: [
//             { title: isAr ? 'ضريبة الكربون الجديدة' : 'New Carbon Tax', level: 'High', desc: isAr ? 'تغير التشريعات قد يزيد التكاليف' : 'Regulatory changes may increase costs' }
//           ]
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAIData();
//   }, [isAr]);

//   if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-emerald-600 font-bold animate-pulse">{isAr ? 'جاري تحليل البيانات بالذكاء الاصطناعي...' : 'AI is analyzing your data...'}</div>;

//   return (
//     <div className="space-y-10 py-6" dir={isAr ? 'rtl' : 'ltr'}>
      
//       {/* Header مع هالة AI */}
//       <header className="relative flex items-center justify-between group">
//         <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
//         <div className="relative flex items-center gap-4">
//           <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
//             <SparklesIcon />
//           </div>
//           <div>
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isAr ? 'رؤى الذكاء الاصطناعي' : 'AI Strategic Insights'}</h1>
//             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{isAr ? 'تحليل ذكي بناءً على بياناتك الحالية' : 'Deep Analytics Powered by EcoVision AI'}</p>
//           </div>
//         </div>
//       </header>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
//           <div className="relative z-10">
//             <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2">{isAr ? 'مؤشر الاستدامة' : 'Sustainability Score'}</p>
//             <h3 className="text-5xl font-black">{data.score}</h3>
//             <div className="w-full bg-white/10 h-1 rounded-full mt-4"><div className="bg-emerald-400 h-full w-[82%]"></div></div>
//           </div>
//           <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><SparklesIcon /></div>
//         </div>

//         <div className="bg-white border-2 border-emerald-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
//           <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{isAr ? 'التوفير المتوقع' : 'Potential Savings'}</p>
//           <h3 className="text-4xl font-black text-slate-900">{data.totalSaved} <span className="text-lg text-emerald-600">tCO2e</span></h3>
//           <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1"><TrendUpIcon /> {isAr ? 'قابل للتحقيق سنوياً' : 'Achievable annually'}</p>
//         </div>

//         <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2.5rem] relative overflow-hidden">
//           <p className="text-[10px] font-bold text-rose-400 uppercase mb-2">{isAr ? 'أعلى مخاطر الامتثال' : 'Critical Compliance Risk'}</p>
//           <h3 className="text-2xl font-black text-rose-700">{data.risks[0].title}</h3>
//           <div className="mt-4 inline-block px-3 py-1 bg-rose-600 text-white text-[9px] font-bold rounded-full animate-pulse">HIGH ALERT</div>
//         </div>
//       </div>

//       {/* Recommendations & Risks Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* توصيات الـ AI */}
//         <section className="space-y-6">
//            <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
//              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
//              {isAr ? 'خطة العمل المقترحة' : 'Actionable Recommendations'}
//            </h4>
//            <div className="space-y-4">
//              {data.recommendations.map((rec, i) => (
//                <motion.div whileHover={{ x: isAr ? -10 : 10 }} key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:border-emerald-200 transition-all">
//                  <div className="flex justify-between items-start mb-2">
//                    <span className="text-sm font-bold text-slate-800">{rec.title}</span>
//                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg">{rec.impact} Impact</span>
//                  </div>
//                  <p className="text-xs text-slate-500 leading-relaxed">{rec.desc}</p>
//                </motion.div>
//              ))}
//            </div>
//         </section>

//         {/* تحليل المخاطر */}
//         <section className="space-y-6 text-right">
//            <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
//              <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
//              {isAr ? 'تحليل المخاطر المحتملة' : 'Risk & Compliance Analysis'}
//            </h4>
//            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
//               {data.risks.map((risk, i) => (
//                 <div key={i} className="flex gap-4 border-b border-white/5 pb-6 last:border-0 last:pb-0">
//                   <div className="p-3 bg-rose-500/20 text-rose-500 rounded-2xl h-fit"><WarnIcon /></div>
//                   <div>
//                     <h5 className="font-bold text-sm mb-1">{risk.title}</h5>
//                     <p className="text-[11px] text-slate-400 mb-3">{risk.desc}</p>
//                     <span className="text-[9px] font-black text-rose-400 border border-rose-400/30 px-2 py-1 rounded-md uppercase tracking-widest">{risk.level} Priority</span>
//                   </div>
//                 </div>
//               ))}
//            </div>
//         </section>
//       </div>

//     </div>
//   );
// }

// export default function AIInsightsPage() {
//   return (
//     <LanguageProvider>
//       <ClientWrapper>
//         <AppLayout title="EcoVision AI">
//           <div className="min-h-screen bg-white">
//             <AIInsightsContent />
//           </div>
//         </AppLayout>
//       </ClientWrapper>
//     </LanguageProvider>
//   );
// }
