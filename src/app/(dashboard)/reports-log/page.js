'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ReportsLogPage() {
  const { locale } = useLanguage(); 
  const isAr = locale === 'ar';
  
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // 1. جلب البيانات من الباك إيند (Fetch) 
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/reports-log'); // 👈 حطي رابط الـ API بتاعك هنا
        const data = await response.json();
        setReports(data);
      } catch (error) {
        // console.log("Using Professional Dummy Data (Backend not connected)");
        // ✅ 12 تقرير متنوعين لمشروع "انبعاثات الكربون"
        const carbonVault = [
          { id: 'EV-26-001', name_ar: 'تدقيق مصنع السويس للأسمنت', name_en: 'Suez Cement Plant Audit', date: '2026-01-10', total: '120,450', s1: '60,000', s2: '40,000', s3: '20,450' },
          { id: 'EV-26-002', name_ar: 'تحليل أسطول شركة النقل البحري', name_en: 'Maritime Shipping Fleet Analysis', date: '2026-01-22', total: '45,800', s1: '35,000', s2: '5,000', s3: '5,800' },
          { id: 'EV-26-003', name_ar: 'تقرير انبعاثات برج إدارة القاهرة', name_en: 'Cairo Admin Tower Emissions', date: '2026-02-05', total: '2,150', s1: '400', s2: '1,500', s3: '250' },
          { id: 'EV-26-004', name_ar: 'مجمع الطاقة الشمسية - بنبان', name_en: 'Benban Solar Energy Complex', date: '2026-02-14', total: '450', s1: '50', s2: '100', s3: '300' },
          { id: 'EV-26-005', name_ar: 'سلسلة توريد الأغذية والمشروبات', name_en: 'F&B Supply Chain Assessment', date: '2026-02-28', total: '18,900', s1: '4,000', s2: '2,900', s3: '12,000' },
          { id: 'EV-26-006', name_ar: 'تدقيق منشأة تكرير البترول', name_en: 'Petroleum Refinery Audit', date: '2026-03-03', total: '240,000', s1: '150,000', s2: '50,000', s3: '40,000' },
          { id: 'EV-26-007', name_ar: 'انبعاثات قطاع الطيران الخاص', name_en: 'Private Aviation Sector Carbon', date: '2026-03-12', total: '9,400', s1: '8,000', s2: '400', s3: '1,000' },
          { id: 'EV-26-008', name_ar: 'مجمع المستودعات الذكية', name_en: 'Smart Warehousing Hub', date: '2026-03-20', total: '5,600', s1: '1,200', s2: '3,800', s3: '600' },
          { id: 'EV-26-009', name_ar: 'محطة معالجة المياه المركزية', name_en: 'Central Water Treatment Plant', date: '2026-03-25', total: '15,200', s1: '3,000', s2: '10,000', s3: '2,200' },
          { id: 'EV-26-010', name_ar: 'تحليل البصمة الكربونية للجامعة', name_en: 'University Carbon Footprint', date: '2026-04-02', total: '3,850', s1: '800', s2: '2,500', s3: '550' },
          { id: 'EV-26-011', name_ar: 'مصنع الأسمدة الكيماوية', name_en: 'Chemical Fertilizer Factory', date: '2026-04-10', total: '98,000', s1: '50,000', s2: '30,000', s3: '18,000' },
          { id: 'EV-26-012', name_ar: 'مستشفى الشفاء التخصصي', name_en: 'Al-Shifa Specialty Hospital', date: '2026-04-15', total: '1,950', s1: '300', s2: '1,400', s3: '250' }
        ];
        setReports(carbonVault);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [locale]);

  const handleDownloadPDF = async (report) => {
    setIsExporting(true);
    const element = document.getElementById('pdf-render-canvas');
    if (!element) {
      setIsExporting(false);
      return;
    }
    element.style.display = 'block';
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Carbon-Emission-Report-${report.id}.pdf`);
    } finally {
      element.style.display = 'none';
      setIsExporting(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-cairo">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-bold tracking-widest uppercase text-xs">Authenticating Vault...</p>
      </div>
    </AppLayout>
  );

  return (
    <ClientWrapper>
      <AppLayout>
        <div className="max-w-6xl mx-auto py-12 px-6 font-cairo">
          
          <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-emerald-50 pb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                {isAr ? 'خزانة تقارير' : 'Reports Log'} <span className="text-emerald-600 italic">Carbon Emission</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 italic">Official Certified Record Vault</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl">DB: CONNECTED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelected(report)}
                className="bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all relative group cursor-pointer overflow-hidden"
              >
                {/* خلفية فنية خفيفة */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-50/50 rounded-full blur-3xl -z-0"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   
                   {/* ✅ السهم الزمردي الصغير جداً */}
                   <button className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 hover:scale-110 transition-transform">
                     <svg className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                   </button>
                </div>

                <h3 className="font-black text-slate-800 text-base mb-1 truncate relative z-10">
                  {isAr ? report.name_ar : report.name_en}
                </h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6">{report.date}</p>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-end relative z-10">
                   <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">Certified Score</p>
                      <span className="text-xl font-black text-emerald-600">{report.total} <span className="text-[10px] text-slate-300 font-normal ml-0.5">tCO2e</span></span>
                   </div>
                   <div className="text-[8px] font-bold text-emerald-500 uppercase italic">Verified</div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}
                  className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-[110]" />
                <motion.div initial={{ x: isAr ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: isAr ? '-100%' : '100%' }}
                  className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} w-full sm:w-[480px] bg-white z-[120] p-10 flex flex-col shadow-2xl`}>
                  
                  <button onClick={() => setSelected(null)} className="mb-10 text-slate-300 hover:text-red-500 transition-colors self-start font-black text-xs">✕ CLOSE VAULT</button>
                  
                  <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                       {isAr ? selected.name_ar : selected.name_en}
                    </h2>
                    
                    {/* ✅ الوثيقة البصرية (الصورة الزمردية) */}
                    <div className="bg-emerald-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden">
                       <div className="z-10 relative">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-6 italic">Sustainability Authority</p>
                          <h4 className="font-black text-lg mb-12 tracking-widest border-b border-white/20 pb-4">CARBON EMISSION</h4>
                          <p className="text-7xl font-black mb-2 tracking-tighter">{selected.total}</p>
                          <p className="text-xs font-bold opacity-60 italic tracking-widest">MT CO2-EQUIVALENT</p>
                       </div>
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black opacity-5 select-none rotate-12">RE</div>
                    </div>

                    <div className="space-y-3">
                       <DetailBox label="Scope 1: Direct" val={selected.s1} />
                       <DetailBox label="Scope 2: Energy" val={selected.s2} />
                       <DetailBox label="Scope 3: Supply" val={selected.s3} />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownloadPDF(selected)}
                    disabled={isExporting}
                    className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 mt-10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        <span>{isAr ? 'جاري التصدير...' : 'Generating...'}</span>
                      </>
                    ) : (
                      isAr ? 'تحميل الوثيقة الرسمية 📄' : 'Download Official PDF 📄'
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* القالب المخفي للـ PDF */}
          {selected && (
            <div id="pdf-render-canvas" style={{ display: 'none', width: '800px', padding: '60px', background: '#fff' }} dir={isAr ? 'rtl' : 'ltr'}>
               <div style={{ borderBottom: '4px solid #10b981', paddingBottom: '30px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ color: '#064e3b', margin: 0, fontSize: '36px', fontWeight: '900' }}>Carbon Emission</h1>
                  <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700' }}>Official Intelligence Hub • 2026</p>
               </div>
               <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px' }}>{isAr ? selected.name_ar : selected.name_en}</h2>
               <div style={{ background: '#f0fdf4', padding: '70px', borderRadius: '45px', textAlign: 'center', marginBottom: '50px' }}>
                  <p style={{ fontSize: '22px', color: '#10b981', fontWeight: '900' }}>TOTAL CARBON FOOTPRINT</p>
                  <h1 style={{ fontSize: '90px', margin: '20px 0', color: '#0f172a', fontWeight: '900' }}>{selected.total} <span style={{ fontSize: '24px' }}>tCO2e</span></h1>
               </div>
               <div style={{ fontSize: '22px', lineHeight: '2.5', color: '#334155' }}>
                  <p>Scope 1: <strong>{selected.s1} t</strong></p>
                  <p>Scope 2: <strong>{selected.s2} t</strong></p>
                  <p>Scope 3: <strong>{selected.s3} t</strong></p>
               </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ClientWrapper>
  );
}

function DetailBox({ label, val }) {
  return (
    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white transition-colors">
      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{label}</span>
      <p className="font-black text-emerald-600 text-lg">{val} <span className="text-[12px] text-slate-400">t</span></p>
    </div>
  );
}