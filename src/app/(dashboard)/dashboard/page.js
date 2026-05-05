'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; 
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, XAxis, CartesianGrid } from 'recharts'; 
import translations from "@/Translations";

// --- مكون الأرقام الحية (نفس كودك) ---
function LiveNumber({ value, locale }) {
  const [num, setNum] = useState(0);
  const target = useMemo(() => {
    return typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  }, [value]);

  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const steps = duration / 16;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setNum(target);
        clearInterval(timer);
      } else {
        setNum(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]); 

  return <span>{num.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>;
}

// --- كارت الإحصائيات (Stat Card) ---
const PremiumStatCard = ({ label, value, change, positive, index, locale, unit }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`bg-white border border-gray-100 p-5 rounded-[28px] shadow-sm hover:shadow-md transition-all relative overflow-hidden ${locale === 'ar' ? 'text-right' : 'text-left'}`}
  >
    <div className="relative z-10">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className={`flex items-baseline gap-1 ${locale === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
         <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">
            <LiveNumber value={value} locale={locale} />
         </h3>
         <span className="text-[10px] font-bold text-gray-400">{unit}</span>
      </div>
      <div className={`mt-3 flex items-center gap-2 ${locale === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
          {positive ? '↓' : '↑'} {change}
        </span>
      </div>
    </div>
    <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-3xl opacity-10 ${positive ? 'bg-emerald-400' : 'bg-orange-400'}`} />
  </motion.div>
);

function DashboardContent() {
  const { locale } = useLanguage();
  const isArabic = locale === 'ar';
  const router = useRouter(); 
  const [timeRange, setTimeRange] = useState('6M');
  const [isMounted, setIsMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // ✅ 1. إعداد حالة البيانات (Data State)
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setIsMounted(true), []);

  // دالة الترجمة
  const t = (key) => {
    try {
      return key.split('.').reduce((obj, i) => obj?.[i], translations[locale || 'ar']) || key;
    } catch (e) { return key; }
  };

  //  2. دالة الـ Fetch مع الـ Fallback (القيم الافتراضية)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        //  استبدل هذا الرابط برابط الـ API الحقيقي بتاعك
        const response = await fetch(`/api/dashboard/stats?range=${timeRange}`);
        if (!response.ok) throw new Error('Backend not connected');
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        // 🛡️ لو السيرفر مش شغال.. نستخدم الحسابات الافتراضية اللي كنت عاملها
        console.warn("Using Fallback Data:", error.message);
        
        const multiplier = timeRange === '1M' ? 1 : timeRange === '6M' ? 5.8 : 11.5;
        const fallbackStats = [
          { label: t('dashboard.totalEmissions'), value: (12450 * multiplier).toFixed(0), change: '2.4%', positive: false },
          { label: t('dashboard.scope1'), value: (3120 * multiplier).toFixed(0), change: '0.8%', positive: true },
          { label: t('dashboard.scope2'), value: (4890 * multiplier).toFixed(0), change: '1.5%', positive: false },
          { label: t('dashboard.scope3'), value: (4440 * multiplier).toFixed(0), change: '2.1%', positive: true },
        ];
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) fetchDashboardData();
  }, [timeRange, locale, isMounted]);

  const aiInsights = useMemo(() => ({
    '1M': { desc: isArabic ? "لاحظنا زيادة في انبعاثات النطاق 2 خلال ساعات الذروة." : "Peak hours show Scope 2 surge.", status: isArabic ? "تحسين مطلوب" : "Action Needed" },
    '6M': { desc: isArabic ? "أداء الطاقة الشمسية تحسن بنسبة 18%. أنت توفر 420 طن كربون." : "Solar yield improved by 18%. Offsetting 420 tons.", status: isArabic ? "أداء مستقر" : "Stable Growth" },
    '1Y': { desc: isArabic ? "أنت تقترب من تحقيق هدف التصفير لعام 2030 قبل الموعد." : "On track to hit 2030 Net Zero goals ahead of schedule.", status: isArabic ? "إنجاز ممتاز" : "Top Tier" }
  }), [isArabic]);

  const handleGeneratePlan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      router.push(`/chatbot?action=generate_plan`);
    }, 2000);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] w-full overflow-x-hidden">
      <div className={`max-w-[1600px] mx-auto px-4 py-6 md:p-8 lg:p-10 space-y-8 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: isArabic ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-orange-400' : 'bg-emerald-500'}`}></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {loading ? (isArabic ? 'جاري التحديث...' : 'Updating Data...') : (isArabic ? 'ذكاء بيئي نشط' : 'Active Eco-Intelligence')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-tight">
              {isArabic ? <>انبعاثات <span className="text-emerald-500 font-light italic">الكربون</span></> : <>Carbon <span className="text-emerald-500 font-light italic">Emissions</span></>}
            </h1>
          </motion.div>
          
          <div className="flex bg-white shadow-sm p-1 rounded-xl border border-gray-100">
             {['1M', '6M', '1Y'].map((r) => (
               <button
                 key={r}
                 onClick={() => setTimeRange(r)}
                 className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${timeRange === r ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {r === '1M' ? (isArabic ? 'شهر' : '1M') : r === '6M' ? (isArabic ? '٦ أشهر' : '6M') : (isArabic ? 'سنة' : '1Y')}
               </button>
             ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <PremiumStatCard key={i} index={i} {...s} locale={locale} unit={t('dashboard.tons_co2')} />
          ))}
        </div>

        {/* Analytics Section (باقي الكود كما هو) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden h-full">
             <div className={`flex justify-between items-center mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-lg font-black text-gray-900 tracking-tight italic">
                    {isArabic ? 'تحليل التدفق الزمني' : 'Temporal Flow Analysis'}
                </h3>
                <span className="text-[9px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase">Live</span>
             </div>
             <div className="h-[280px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyChartData}>
                    <defs>
                      <linearGradient id="wave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" reversed={isArabic} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={4} fill="url(#wave)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* AI Hub Card */}
          <motion.div 
            className="lg:col-span-5 xl:col-span-4 bg-gradient-to-br from-emerald-600 to-green-900 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <div className="relative z-10">
              <div className={`flex items-center gap-4 mb-8 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                  <span className="text-xl">✨</span>
                </div>
                <div>
                  <h4 className="font-black text-xl tracking-tight">{isArabic ? 'المساعد الذكي' : 'AI Hub'}</h4>
                  <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest opacity-70 italic">Strategic Analysis</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={timeRange}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  <div className="p-5 bg-white/10 rounded-[24px] border border-white/10 backdrop-blur-md">
                      <span className="px-3 py-1 bg-white text-emerald-700 text-[9px] font-black rounded-full uppercase mb-3 inline-block">
                          {aiInsights[timeRange].status}
                      </span>
                      <p className="text-sm font-medium leading-relaxed text-emerald-50">
                          {aiInsights[timeRange].desc}
                      </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button 
              onClick={handleGeneratePlan}
              disabled={isAnalyzing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10 w-full py-4 bg-white text-emerald-900 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-emerald-50 transition-all mt-8"
            >
              {isAnalyzing ? (isArabic ? 'جاري التحليل...' : 'Analyzing...') : (isArabic ? 'خطة تحسين ذكية' : 'Generate AI Plan')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const dummyChartData = [ { name: 'P1', val: 400 }, { name: 'P2', val: 300 }, { name: 'P3', val: 600 }, { name: 'P4', val: 800 }, { name: 'P5', val: 500 }, { name: 'P6', val: 900 }];

export default function DashboardPage() {
  return (
    <ClientWrapper>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ClientWrapper>
  );
}