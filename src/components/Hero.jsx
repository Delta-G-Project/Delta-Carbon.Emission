"use client";

import { useState } from "react";
import Typewriter from "typewriter-effect";
import translations from "@/Translations";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

export default function Hero() {
  // --- 1. State & Context Hooks ---
  // Access the current language from context and fetch the corresponding translations
  const { language } = useLanguage();
  const t = translations[language] || translations.ar;
  
  // State to manage the visibility of the video modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
   
      <section className="min-h-[80vh] flex flex-col justify-center items-center pt-32 pb-20 relative">

      
      {/* --- 2. Main Content Container --- */}
      <div className="w-full max-w-6xl mx-auto px-6 text-center relative z-10">
        
        {/* Hero Title: Main Heading */}
        <h1 className={`text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight ${language === 'ar' ? 'lg:text-[3.4rem]' : 'lg:text-[2.9rem]'}`}>
          {t?.hero?.titleLine1 || "قِس انبعاثاتك ، أدرها بذكاء ، خفّضها بسهولة"}
          <br className="hidden md:block mt-2" />
          {t?.hero?.titleLine2 || "منصتك العالمية لذكاء الاستدامة"}
        </h1>

        {/* Hero Subtitle: Typewriter animation section */}
        <div className="text-lg md:text-xl text-gray-500 mb-10 min-h-[60px] font-medium leading-relaxed max-w-2xl mx-auto px-4">
          <Typewriter
            key={language} // Re-renders the typewriter when language changes
            options={{
              strings: [
                t?.hero?.subtitle1 || "نحو مستقبل مستدام",
                t?.hero?.subtitle2 || "حلول ذكية لبيئة أفضل",
                t?.hero?.subtitle3 || "ابدأ رحلة التغيير اليوم"
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30,
            }}
          />
        </div>

        {/* --- 3. Action Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
          
          {/* Primary CTA: Link to the calculator */}
          <Link 
            href={`/emissions-calculator?mode=standalone&lang=${language}`}
            prefetch={true}
            className="w-full sm:w-auto bg-[#10b981] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#059669] hover:scale-105 transition-all shadow-xl shadow-green-100 flex items-center justify-center group"
          >
            {t?.hero?.button1 || "ابدأ التقييم الآن"}
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Secondary CTA: Button to trigger the video modal */}
          <button
            onClick={() => setIsVideoOpen(true)}
            className="w-full sm:w-auto bg-white border-2 border-[#10b981] text-gray-900 px-10 py-4 rounded-2xl font-black text-lg transition-all hover:bg-green-50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {/* Animated dot indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
            </span>
            {t?.hero?.button2 || "شاهد الفيديو"}
          </button>
        </div>
      </div>

      {/* --- 4. Background Decorative Elements --- */}
      {/* Abstract blurred shapes for visual depth */}
      <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl"></div>
      </div>

      {/* --- 5. Video Modal (Overlay) --- */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-5 right-5 z-20 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-all group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player Container */}
            <div className="aspect-video w-full bg-black">
              <video
                src="/demo-video.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Clickable Backdrop: Closes modal when clicking outside the video */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsVideoOpen(false)}></div>
        </div>
      )}
    </section>
  );
}

// "use client";

// import { useState } from "react";
// import Typewriter from "typewriter-effect";
// import translations from "@/Translations";
// import { useLanguage } from "./LanguageContext";
// import Link from "next/link";

// export default function Hero() {
//   const { language } = useLanguage();
//   const t = translations[language] || translations.ar;
  
//   const [isVideoOpen, setIsVideoOpen] = useState(false);

//   return (
//     <section className="relative w-full bg-gray-50 pt-32 pb-20 font-cairo overflow-hidden">
//       <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
       
//         <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 whitespace-pre-line leading-tight">
//           {t?.hero?.title || "احسب أثرك الكربوني بدقة"}
//         </h1>

        
//         <div className="text-xl md:text-2xl text-gray-700 mb-12 min-h-[40px] font-medium italic">
//           <Typewriter
//             key={language}
//             options={{
//               strings: [
//                 t?.hero?.subtitle1 || "نحو مستقبل مستدام",
//                 t?.hero?.subtitle2 || "حلول ذكية لبيئة أفضل",
//                 t?.hero?.subtitle3 || "ابدأ رحلة التغيير اليوم"
//               ],
//               autoStart: true,
//               loop: true,
//               delay: 50,
//               deleteSpeed: 30,
//             }}
//           />
//         </div>

        
//         <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
          
     
//           <Link 
//             href={`/emissions-calculator?mode=standalone&lang=${language}`}
//             prefetch={true}
//             className="w-full sm:w-auto bg-[#10b981] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#059669] hover:scale-105 transition-all shadow-xl shadow-green-100 flex items-center justify-center group"
//           >
//             {t?.hero?.button1 || "ابدأ التقييم الآن"}
//             <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//             </svg>
//           </Link>

        
//           <button
//             onClick={() => setIsVideoOpen(true)}
//             className="w-full sm:w-auto bg-white border-2 border-[#10b981] text-gray-900 px-10 py-4 rounded-2xl font-black text-lg transition-all hover:bg-green-50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
//           >
//             <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
//             </span>
//             {t?.hero?.button2 || "شاهد الفيديو"}
//           </button>
//         </div>
//       </div>

//       {/* زينة خلفية خفيفة */}
//       <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-10 pointer-events-none">
//          <div className="absolute top-10 left-10 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
//          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl"></div>
//       </div>

//       {/* --(Modal) --- */}
//       {isVideoOpen && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
//           <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            
//             {/* */}
//             <button
//               onClick={() => setIsVideoOpen(false)}
//               className="absolute top-5 right-5 z-20 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full transition-all group"
//             >
//               <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* مشغل الفيديو */}
//             <div className="aspect-video w-full bg-black">
//               <video
//                 src="/demo-video.mp4"
//                 controls
//                 autoPlay
//                 className="w-full h-full object-contain"
//               >
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//           </div>

//           {/* الإغلاق عند الضغط في أي مكان بره */}
//           <div className="absolute inset-0 -z-10" onClick={() => setIsVideoOpen(false)}></div>
//         </div>
//       )}
//     </section>
//   );
// }