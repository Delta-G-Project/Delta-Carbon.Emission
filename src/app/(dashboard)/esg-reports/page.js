// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import AppLayout from '@/components/AppLayout';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export default function ESGReportPage() {
//   const { locale } = useLanguage();
//   const isAr = locale === 'ar';
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true); // حالة التحميل
//   const [isExporting, setIsExporting] = useState(false);
//   const reportRef = useRef(null);

//   useEffect(() => {
//     const getReportData = async () => {
//       try {
//         // 1. محاولة جلب البيانات من الباك إيند (Fetch) مع توقيت محدد
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 2000); // اقطع الانتظار بعد ثانيتين

//         const response = await fetch('http://localhost:5000/api/reports/active', { signal: controller.signal });
        
//         if (response.ok) {
//           const result = await response.json();
//           setData(result);
//           setLoading(false);
//           return;
//         }
//       } catch (err) {
//         console.log("السيرفر مش متاح حالياً، بنجرب الـ LocalStorage...");
//       }

//       // 🛡️ 2. الخطة البديلة: لو مفيش سيرفر، شوف اللي اتحفظ من الحاسبة
//       const saved = localStorage.getItem('active_ecovision_report');
//       if (saved) {
//         setData(JSON.parse(saved));
//       } else {
//         // ✨ 3. لو مفيش خالص.. اعرض داتا "انبعاثات كربونية" احترافية فوراً
//         setData({
//           id: 'EV-2026-X89',
//           name: isAr ? 'تقرير الاستدامة للمجمع الصناعي' : 'Industrial Complex Sustainability Report',
//           date: new Date().toISOString(),
//           stats: { total: '45,800', scope1: '20,000', scope2: '15,800', scope3: '10,000' }
//         });
//       }
//       setLoading(false); // وقف التحميل مهما حصل
//     };

//     getReportData();
//   }, [locale]);

//   const handleDownload = async () => {
//     setIsExporting(true);
//     const element = reportRef.current;
//     const canvas = await html2canvas(element, { scale: 3, useCORS: true });
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
//     pdf.save(`Carbon-Emission-Official-Report.pdf`);
//     setIsExporting(false);
//   };

//   // شاشة التحميل الذكية (بتختفي بسرعة)
//   if (loading) return (
//     <AppLayout>
//       <div className="flex flex-col items-center justify-center min-h-[60vh] font-cairo text-emerald-600">
//         <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
//         <p className="font-bold italic">Authenticating Carbon Data...</p>
//       </div>
//     </AppLayout>
//   );

//   return (
//     <AppLayout>
//       <div className="max-w-5xl mx-auto py-10 px-6 font-cairo" dir={isAr ? 'rtl' : 'ltr'}>
        
//         {/* أزرار التحكم */}
//         <div className="flex justify-between items-center mb-8 no-print">
//           <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Carbon <span className="text-emerald-600">Emission</span></h2>
//           <button 
//             onClick={handleDownload} 
//             className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2"
//           >
//             {isExporting ? '...' : (isAr ? 'تحميل الوثيقة الرسمية 📄' : 'Download Official Report 📄')}
//           </button>
//         </div>

//         {/* جسم الوثيقة (تصميم حقيقي 100%) */}
//         <div ref={reportRef} className="bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          
//           <div className="border-b-2 border-emerald-50 pb-10 mb-10 text-center md:text-right">
//              <h3 className="font-black text-2xl tracking-tighter text-slate-900 mb-2">Carbon <span className="text-emerald-500 font-light italic">Emission</span></h3>
//              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
//                 {isAr ? 'وثيقة تحليل الاستدامة الرسمية' : 'Official Sustainability Analysis Document'}
//              </h1>
//              <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em]">
//                 {isAr ? 'كود التوثيق:' : 'Doc ID:'} {data.id} • {new Date(data.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
//              </p>
//           </div>

//           <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white mb-10 relative overflow-hidden shadow-2xl shadow-emerald-100">
//              <div className="relative z-10">
//                 <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-4">{isAr ? 'إجمالي الأثر الكربوني السنوي' : 'Total Annual Carbon Impact'}</p>
//                 <h2 className="text-7xl font-black tracking-tighter mb-2">{data.stats?.total}</h2>
//                 <p className="text-lg font-bold text-emerald-100 italic">tCO₂e <span className="opacity-60">/ Per Year</span></p>
//              </div>
//              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//              {[
//                { label: 'Scope 1', val: data.stats?.scope1, name: isAr ? 'انبعاثات مباشرة' : 'Direct Emissions', color: 'text-emerald-600' },
//                { label: 'Scope 2', val: data.stats?.scope2, name: isAr ? 'طاقة مشتراة' : 'Purchased Energy', color: 'text-teal-600' },
//                { label: 'Scope 3', val: data.stats?.scope3, name: isAr ? 'سلسلة التوريد' : 'Value Chain', color: 'text-emerald-700' }
//              ].map((s, i) => (
//                <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center transition-transform hover:scale-105 hover:bg-white hover:shadow-lg">
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
//                   <h4 className="text-3xl font-black text-slate-900 mb-1">{s.val}</h4>
//                   <p className={`text-[11px] font-bold ${s.color}`}>{s.name}</p>
//                </div>
//              ))}
//           </div>

//           <div className="bg-emerald-800 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
//              <h4 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
//                 <span className="p-2 bg-white/20 rounded-xl">✨</span>
//                 {isAr ? 'التحليل الاستراتيجي (AI Insights)' : 'Strategic AI Insights'}
//              </h4>
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
//                 <div className="space-y-3">
//                    <p className="text-xs font-black text-emerald-300 uppercase tracking-widest">{isAr ? 'فرص التحسين' : 'Reduction Plan'}</p>
//                    <p className="text-sm font-medium leading-relaxed opacity-90">
//                       {isAr 
//                         ? `بناءً على رقم النطاق 1 (${data.stats?.scope1})، نقترح استخدام وقود حيوي لخفض الانبعاثات بنسبة 12% سنوياً.`
//                         : `Based on Scope 1 (${data.stats?.scope1}), we suggest biofuel transition to cut emissions by 12% annually.`}
//                    </p>
//                 </div>
//                 <div className="border-r border-white/10 pr-8 space-y-3">
//                    <p className="text-xs font-black text-emerald-300 uppercase tracking-widest">{isAr ? 'التأثير البيئي' : 'Eco-Impact'}</p>
//                    <p className="text-sm font-medium leading-relaxed opacity-90">
//                       {isAr 
//                         ? 'تعتبر هذه المنشأة من الفئة المستدامة وفقاً لمعايير انبعاثات الكربون الدولية لعام 2026.'
//                         : 'This facility is classified as sustainable according to 2026 international carbon standards.'}
//                    </p>
//                 </div>
//              </div>
//              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
  

//   }
'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AppLayout from '@/components/AppLayout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { apiClient } from '@/lib/api/apiClient';

export default function ESGReportPage() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const getReportData = async () => {
      try {
        const response = await apiClient('/reports/active');
        if (response && response.success !== false) {
          setData(response);
          setLoading(false);
          return;
        }
      } catch (err) {
        // console.log("Using Local/Mock data...");
      }

      const saved = localStorage.getItem('active_ecovision_report');
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        setData({
          id: 'EV-2026-X89',
          name: isAr ? 'تقرير الاستدامة للمجمع الصناعي' : 'Sustainability Report',
          date: new Date().toISOString(),
          stats: { total: '45,800', scope1: '20,000', scope2: '15,800', scope3: '10,000' }
        });
      }
      setLoading(false);
    };
    getReportData();
  }, [locale, isAr]);

  // --- وظيفة تحميل PDF ---
  const handleDownload = async () => {
    setIsExporting(true);
    const element = reportRef.current;
    if (!element) {
      setIsExporting(false);
      return;
    }
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EcoVision-Official-Report-${data?.id}.pdf`);
    } catch (error) {
      console.error('PDF Error:', error);
      alert(isAr ? 'حدث خطأ أثناء التصدير.' : 'Export error.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- وظيفة المشاركة ---
  const handleShare = async () => {
    const shareText = isAr 
      ? `اطلع على تقرير الاستدامة الخاص بي. إجمالي الانبعاثات: ${data?.stats?.total} tCO2e` 
      : `Check out my sustainability report. Total Impact: ${data?.stats?.total} tCO2e`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EcoVision Report',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // console.log('Error sharing');
      }
    } else {
      // لو المتصفح مبيفتحش مشاركة، ينسخ الرابط
      navigator.clipboard.writeText(window.location.href);
      alert(isAr ? 'تم نسخ رابط التقرير!' : 'Report link copied!');
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-cairo text-emerald-600">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="font-bold italic">Authenticating Carbon Data...</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-10 px-6 font-cairo" dir={isAr ? 'rtl' : 'ltr'}>
        
        {/* أزرار التحكم الجديدة */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 no-print">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">
            Carbon <span className="text-emerald-600">Emission</span>
          </h2>
          
          <div className="flex gap-3">
            {/* زر المشاركة */}
            <button 
              onClick={handleShare}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-200"
            >
              <span className="text-lg">🔗</span>
              {isAr ? 'مشاركة' : 'Share'}
            </button>

            {/* زر تحميل PDF */}
            <button 
              onClick={handleDownload} 
              disabled={isExporting}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>{isAr ? 'جاري التصدير...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <span className="text-lg">📥</span>
                  {isAr ? 'تحميل PDF' : 'Download PDF'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* جسم الوثيقة */}
        <div ref={reportRef} className="bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          
          <div className="border-b-2 border-emerald-50 pb-10 mb-10 text-center md:text-right">
             <h3 className="font-black text-2xl tracking-tighter text-slate-900 mb-2">Carbon <span className="text-emerald-500 font-light italic">Emission</span></h3>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                {isAr ? 'وثيقة تحليل الاستدامة الرسمية' : 'Official Sustainability Analysis Document'}
             </h1>
             <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em]">
                {isAr ? 'كود التوثيق:' : 'Doc ID:'} {data?.id} • {new Date(data?.date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
             </p>
          </div>

          <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white mb-10 relative overflow-hidden shadow-2xl shadow-emerald-100">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-4">{isAr ? 'إجمالي الأثر الكربوني السنوي' : 'Total Annual Carbon Impact'}</p>
                <h2 className="text-7xl font-black tracking-tighter mb-2">{data?.stats?.total}</h2>
                <p className="text-lg font-bold text-emerald-100 italic">tCO₂e <span className="opacity-60">/ Per Year</span></p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             {[
               { label: 'Scope 1', val: data?.stats?.scope1, name: isAr ? 'انبعاثات مباشرة' : 'Direct Emissions', color: 'text-emerald-600' },
               { label: 'Scope 2', val: data?.stats?.scope2, name: isAr ? 'طاقة مشتراة' : 'Purchased Energy', color: 'text-teal-600' },
               { label: 'Scope 3', val: data?.stats?.scope3, name: isAr ? 'سلسلة التوريد' : 'Value Chain', color: 'text-emerald-700' }
             ].map((s, i) => (
               <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center transition-transform hover:scale-105 hover:bg-white hover:shadow-lg">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                  <h4 className="text-3xl font-black text-slate-900 mb-1">{s.val}</h4>
                  <p className={`text-[11px] font-bold ${s.color}`}>{s.name}</p>
               </div>
             ))}
          </div>

          <div className="bg-emerald-800 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
             <h4 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                <span className="p-2 bg-white/20 rounded-xl">✨</span>
                {isAr ? 'التحليل الاستراتيجي (AI Insights)' : 'Strategic AI Insights'}
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-3">
                   <p className="text-xs font-black text-emerald-300 uppercase tracking-widest">{isAr ? 'فرص التحسين' : 'Reduction Plan'}</p>
                   <p className="text-sm font-medium leading-relaxed opacity-90">
                      {isAr 
                        ? `بناءً على رقم النطاق 1 (${data?.stats?.scope1})، نقترح استخدام وقود حيوي لخفض الانبعاثات بنسبة 12% سنوياً.`
                        : `Based on Scope 1 (${data?.stats?.scope1}), we suggest biofuel transition to cut emissions by 12% annually.`}
                   </p>
                </div>
                <div className="border-r border-white/10 pr-8 space-y-3">
                   <p className="text-xs font-black text-emerald-300 uppercase tracking-widest">{isAr ? 'التأثير البيئي' : 'Eco-Impact'}</p>
                   <p className="text-sm font-medium leading-relaxed opacity-90">
                      {isAr 
                        ? 'تعتبر هذه المنشأة من الفئة المستدامة وفقاً لمعايير انبعاثات الكربون الدولية لعام 2026.'
                        : 'This facility is classified as sustainable according to 2026 international carbon standards.'}
                   </p>
                </div>
             </div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full"></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}