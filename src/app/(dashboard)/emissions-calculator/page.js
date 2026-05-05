


 'use client';
 import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react'; 
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from "@/Translations";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/apiClient';

// --- المكونات الفرعية (UI Components) ---

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all
              ${i < current ? 'bg-emerald-500 border-emerald-500' : i === current ? 'border-emerald-500 bg-white' : 'border-gray-300 bg-white'}`}>
              {i < current && (
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {i === current && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
            </div>
            <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${i === current ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-1 mb-5 ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function InfoIcon() {
  return (
    <svg className="h-4 w-4 text-gray-300 cursor-pointer hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-2v-4h2m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <InfoIcon />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "number" }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <InfoIcon />
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
      />
    </div>
  );
}

function ToggleButton({ enabled, onChange, isAr }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
          enabled 
            ? (isAr ? '-translate-x-6' : 'translate-x-6') 
            : (isAr ? '-translate-x-1' : 'translate-x-1')
        }`}
      />
    </button>
  );
}

// --- المكون الرئيسي للمحتوى 
 
  function EmissionsCalculatorContent({ isStandalone }) { 
  const router = useRouter();
  const { t, locale, changeLocale } = useLanguage(); 
   const isAr = locale === 'ar';
  

  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');

  useEffect(() => {
    if (langParam && (langParam === 'ar' || langParam === 'en')) {
      if (langParam !== locale) {
        changeLocale(langParam);
      }
    }
  }, [langParam, locale, changeLocale]);

  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // --- حالات مفاتيح التفعيل (Toggles) ---
  const [fuelEnabled, setFuelEnabled] = useState(true);
  const [refrigerantsEnabled, setRefrigerantsEnabled] = useState(true);
  const [electricityEnabled, setElectricityEnabled] = useState(true);
  const [heatEnabled, setHeatEnabled] = useState(true);
  const [travelEnabled, setTravelEnabled] = useState(true);
  const [wasteEnabled, setWasteEnabled] = useState(true);
  const [customEnabled, setCustomEnabled] = useState(false);

  // --- حالات المدخلات (States) ---
  const [fuelType, setFuelType] = useState('diesel');
  const [fuelAmount, setFuelAmount] = useState('1500');
  const [fuelUnit, setFuelUnit] = useState('liter');
  const [refrigerantType, setRefrigerantType] = useState('hfc134a');
  const [leakAmount, setLeakAmount] = useState('50');
  const [leakUnit, setLeakUnit] = useState('kg');

  const [electricityAmount, setElectricityAmount] = useState('25000');
  const [electricityUnit, setElectricityUnit] = useState('kwh');
  const [heatAmount, setHeatAmount] = useState('5000');
  const [heatUnit, setHeatUnit] = useState('mmbtu');

  const [travelMode, setTravelMode] = useState('flight');
  const [travelDistance, setTravelDistance] = useState('5000');
  const [travelUnit, setTravelUnit] = useState('km');
  const [wasteAmount, setWasteAmount] = useState('2000');
  const [wasteUnit, setWasteUnit] = useState('kg');

  const [customEmissions, setCustomEmissions] = useState([
    { id: 1, name: '', amount: '' }
  ]);

  useEffect(() => {
    if (fuelType === 'gas') {
      setFuelUnit('m3');
    } else {
      setFuelUnit('liter');
    }
  }, [fuelType]);

  const addCustomEmission = () => setCustomEmissions([...customEmissions, { id: Date.now(), name: '', amount: '' }]);
  const updateCustomEmission = (id, field, value) => setCustomEmissions(customEmissions.map(c => c.id === id ? { ...c, [field]: value } : c));
  const removeCustomEmission = (id) => setCustomEmissions(customEmissions.filter(c => c.id !== id));

  // --- منطق الحسابات (Calculations) ---
  const totals = useMemo(() => {
    const s1 = (fuelEnabled ? (Number(fuelAmount) || 0) : 0) + 
               (refrigerantsEnabled ? (Number(leakAmount) || 0) : 0);
    
    const s2 = (electricityEnabled ? (Number(electricityAmount) || 0) : 0) + 
               (heatEnabled ? (Number(heatAmount) || 0) : 0);
    
    const customTotal = customEnabled ? customEmissions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) : 0;
    
    const s3 = (travelEnabled ? (Number(travelDistance) || 0) : 0) + 
               (wasteEnabled ? (Number(wasteAmount) || 0) : 0) + 
               customTotal;

    const grandTotal = s1 + s2 + s3;

    return {
      scope1: s1.toLocaleString(),
      scope2: s2.toLocaleString(),
      scope3: s3.toLocaleString(),
      grandTotal: grandTotal.toLocaleString(),
      rawTotal: grandTotal,
      activeStates: { fuelEnabled, refrigerantsEnabled, electricityEnabled, heatEnabled, travelEnabled, wasteEnabled, customEnabled }
    };
  }, [
    fuelAmount, leakAmount, electricityAmount, heatAmount, travelDistance, wasteAmount, customEmissions,
    fuelEnabled, refrigerantsEnabled, electricityEnabled, heatEnabled, travelEnabled, wasteEnabled, customEnabled
  ]);

  // --- التعديل السحري لمنطق التحقق من المحاولات ---
  const handleNextStep = () => {
    if (step === 2 && isStandalone) {
      // 1. استخدام صيغة تاريخ عالمية ثابتة عشان لغة المتصفح متلخبطش السيستم
      const today = new Date().toDateString(); 
      const stored = JSON.parse(localStorage.getItem('carbon_usage_limit') || '{}');
      
      let currentCount = stored.count || 0;
      
      // 2. لو يوم جديد، نصفر العداد فوراً
      if (stored.date !== today) {
        currentCount = 0;
      }

      // 3. التحقق: لو دي المحاولة الرابعة (العداد وصل 3)، نطلع الرسالة
      if (currentCount >= 3) {
        setShowLimitModal(true);
      } else {
        // 4. لو لسه معاه محاولات (0 أو 1 أو 2)، نزود العداد ونحفظه
        localStorage.setItem('carbon_usage_limit', JSON.stringify({ 
          date: today, 
          count: currentCount + 1 
        }));
      }
    }
    
    
    setStep(Math.min(3, step + 1));
  };

// const handleSaveReport = async () => {
//   setIsSaving(true);
  
//   // 1. تجميع الداتا بالتفصيل الممل عشان التقرير
//   const reportDetails = {
//     id: `report_${new Date().getTime()}`,
//     projectName: isAr ? "مشروع تقييم الاستدامة" : "Sustainability Assessment Project",
//     date: new Date().toISOString(),
//     locale: locale,
//     stats: {
//       scope1: totals.scope1,
//       scope2: totals.scope2,
//       scope3: totals.scope3,
//       total: totals.grandTotal,
//       rawTotal: totals.rawTotal
//     },
//     // تفاصيل إضافية للذكاء الاصطناعي في التقرير
//     inputs: {
//       fuel: fuelEnabled ? { type: fuelType, amount: fuelAmount, unit: fuelUnit } : null,
//       electricity: electricityEnabled ? { amount: electricityAmount, unit: electricityUnit } : null,
//       travel: travelEnabled ? { mode: travelMode, distance: travelDistance } : null
//     }
//   };

//   try {
//     await new Promise(resolve => setTimeout(resolve, 800)); 
    
//     // 2. الحفظ في السجل العام (Log)
//     const existingLogs = JSON.parse(localStorage.getItem('carbon_emission_reports') || '[]');
//     localStorage.setItem('carbon_emission_reports', JSON.stringify([reportDetails, ...existingLogs]));
    
   
//     localStorage.setItem('active_ecovision_report', JSON.stringify(reportDetails));

//     // 4. الانتقال لصفحة التقارير
//     router.push('/esg-reports'); 

//   } catch (error) {
//     alert(isAr ? 'خطأ في الربط' : 'Linking Error');
//   } finally {
//     setIsSaving(false);
//   }
// };
const handleSaveReport = async () => {
  setIsSaving(true);
  
  // 1. تجميع الداتا بالتفصيل الممل عشان التقرير والباك إيند
  const reportDetails = {
    id: `report_${new Date().getTime()}`,
    projectName: isAr ? "مشروع تقييم الاستدامة" : "Sustainability Assessment Project",
    date: new Date().toISOString(),
    locale: locale,
    stats: {
      scope1: totals.scope1,
      scope2: totals.scope2,
      scope3: totals.scope3,
      total: totals.grandTotal,
      rawTotal: totals.rawTotal
    },
    // تفاصيل المدخلات عشان الباك إيند يخزنها في الداتابيز
    inputs: {
      fuel: fuelEnabled ? { type: fuelType, amount: fuelAmount, unit: fuelUnit } : null,
      refrigerants: refrigerantsEnabled ? { type: refrigerantType, amount: leakAmount, unit: leakUnit } : null,
      electricity: electricityEnabled ? { amount: electricityAmount, unit: electricityUnit } : null,
      travel: travelEnabled ? { mode: travelMode, distance: travelDistance, unit: travelUnit } : null,
      waste: wasteEnabled ? { amount: wasteAmount, unit: wasteUnit } : null,
      custom: customEnabled ? customEmissions : []
    }
  };

  try {
    // الربط مع الباك إيند عبر apiClient
    try {
      const response = await apiClient('/save-emissions', {
        method: 'POST',
        body: JSON.stringify(reportDetails),
      });

      if (response && response.success !== false) {
        // console.log("Data successfully synced with Database:", response);
      }
    } catch (apiError) {
      console.warn("Backend not reached. Saving to LocalStorage instead.", apiError.message);
    }

    // 3. الحفظ المحلي (الخطة البديلة - دايماً شغالة)
    const existingLogs = JSON.parse(localStorage.getItem('carbon_emission_reports') || '[]');
    localStorage.setItem('carbon_emission_reports', JSON.stringify([reportDetails, ...existingLogs]));
    localStorage.setItem('active_ecovision_report', JSON.stringify(reportDetails));

    
    setTimeout(() => {
      setIsSaving(false);
      router.push('/esg-reports'); 
    }, 600);

  } catch (error) {
    console.error("Critical Saving Error:", error);
    alert(isAr ? 'حدث خطأ أثناء الحفظ، جرب مرة أخرى.' : 'Error during saving, please try again.');
    setIsSaving(false);
  }
};
  const handleExportPDF = async () => {
    setIsExporting(true);
    const reportElement = document.getElementById('full-report-print');
    if (!reportElement) {
      setIsExporting(false);
      return;
    }
    
    reportElement.style.display = 'block';
    
    try {
      // 1. Wait for custom fonts to be fully loaded before snapshotting
      await document.fonts.ready;
      
      // 2. High-res capture with CORS for logos
      const canvas = await html2canvas(reportElement, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#ffffff' 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Carbon-Emission-Report-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF Error:', error);
      alert(isAr ? 'حدث خطأ أثناء تصدير التقرير.' : 'Error exporting report.');
    } finally {
      reportElement.style.display = 'none';
      setIsExporting(false);
    }
  };

  const steps = locale === 'ar'
    ? ['النطاق 1: الانبعاثات المباشرة', 'النطاق 2: انبعاثات الطاقة غير المباشرة', 'النطاق 3: انبعاثات سلسلة القيمة', 'المراجعة والنتائج']
    : ['Scope 1: Direct', 'Scope 2: Indirect', 'Scope 3: Value Chain', 'Review & Results'];

  const fuelOptions = locale === 'ar'
    ? [{ value: 'diesel', label: 'ديزل' }, { value: 'gasoline', label: 'بنزين' }, { value: 'gas', label: 'غاز طبيعي' }]
    : [{ value: 'diesel', label: 'Diesel' }, { value: 'gasoline', label: 'Gasoline' }, { value: 'gas', label: 'Natural Gas' }];

    const fuelUnitOptions = useMemo(() => {
      if (fuelType === 'gas') {
        return isAr
          ? [{ value: 'm3', label: 'متر مكعب (m³)' }, { value: 'ft3', label: 'قدم مكعب (ft³)' }, { value: 'mmbtu', label: 'MMBtu' }]
          : [{ value: 'm3', label: 'Cubic Meter (m³)' }, { value: 'ft3', label: 'Cubic Foot (ft³)' }, { value: 'mmbtu', label: 'MMBtu' }];
      }
      return isAr
        ? [{ value: 'liter', label: 'لتر' }, { value: 'gallon', label: 'جالون' }, { value: 'kg', label: 'كيلوجرام' }]
        : [{ value: 'liter', label: 'Liter' }, { value: 'gallon', label: 'Gallon' }, { value: 'kg', label: 'Kilogram' }];
    }, [fuelType, isAr]);

  const refrigerantOptions = [
    { value: 'hfc134a', label: 'HFC-134a' },
    { value: 'hfc410a', label: 'HFC-410A' },
    { value: 'r22',     label: 'R-22' },
  ];

  const leakUnitOptions = locale === 'ar'
    ? [{ value: 'kg', label: 'كيلوجرام' }, { value: 'g', label: 'جرام' }]
    : [{ value: 'kg', label: 'Kilogram' }, { value: 'g', label: 'Gram' }];

  return (
    <div className="max-w-3xl mx-auto relative">
      
      {/* الرسالة المنبثقة (Modal) - دلوقت بتظهر فوق صفحة النتيجة */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-2xl font-black mb-2 text-gray-900">{isAr ? 'عذراً، لقد استنفدت الحد الأقصى اليوم!' : 'Daily Limit Reached!'}</h2>
            <p className="text-gray-600 mb-8 font-bold leading-relaxed">
              {isAr ? 'لقد استنفدت محاولاتك المجانية (3 محاولات) لهذا اليوم. يمكنك المحاولة مرة أخرى غداً، أو الترقية الآن لفتح جميع المميزات بلا حدود.' : 'You have used your 3 free calculations for today. Try again tomorrow or upgrade for unlimited access.'}
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/Pricing" className="w-full bg-[#10b981] text-white py-4 rounded-xl font-black hover:bg-[#059669] transition shadow-lg shadow-green-100">
                {isAr ? 'ترقية وحصول على مميزات 🚀' : 'Upgrade & Get Features 🚀'}
              </Link>
              <button onClick={() => setShowLimitModal(false)} className="w-full text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 py-3 rounded-xl transition">
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">{t('emissions_calculator.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('emissions_calculator.subtitle')}</p>
      </div>

      <StepIndicator steps={steps} current={step} />

      <div id="report-content" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {step === 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('emissions_calculator.scope1_direct')}</h2>
            <p className="text-xs text-gray-400 mb-5">{t('emissions_calculator.scope1_desc')}</p>

            <div className={`border border-gray-100 rounded-lg p-5 mb-4 transition-all ${!fuelEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{t('emissions_calculator.fuel_combustion')}</h3>
                <ToggleButton enabled={fuelEnabled} onChange={setFuelEnabled} isAr={isAr} />
              </div>
              <div className={!fuelEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label={t('emissions_calculator.fuel_type')} value={fuelType} options={fuelOptions} onChange={setFuelType} />
                  <InputField label={t('emissions_calculator.fuel_consumption')} value={fuelAmount} onChange={setFuelAmount} placeholder="1500" />
                </div>
                <div className="mt-4 sm:w-1/2">
                  <SelectField label={t('emissions_calculator.fuel_unit')} value={fuelUnit} options={fuelUnitOptions} onChange={setFuelUnit} />
                </div>
              </div>
            </div>

            <div className={`border border-gray-100 rounded-lg p-5 transition-all ${!refrigerantsEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{t('emissions_calculator.refrigerants')}</h3>
                <ToggleButton enabled={refrigerantsEnabled} onChange={setRefrigerantsEnabled} isAr={isAr} />
              </div>
              <div className={!refrigerantsEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label={t('emissions_calculator.refrigerant_type')} value={refrigerantType} options={refrigerantOptions} onChange={setRefrigerantType} />
                  <InputField label={t('emissions_calculator.leak_quantity')} value={leakAmount} onChange={setLeakAmount} placeholder="50" />
                </div>
                <div className="mt-4 sm:w-1/2">
                  <SelectField label={t('emissions_calculator.leak_unit')} value={leakUnit} options={leakUnitOptions} onChange={setLeakUnit} />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('emissions_calculator.scope2_energy')}</h2>
            <p className="text-xs text-gray-400 mb-5">{isAr ? 'أدخل بيانات الطاقة غير المباشرة المشتراة من قبل شركتك.' : 'Enter data for indirect energy purchased by your company.'}</p>

            <div className={`border border-gray-100 rounded-lg p-5 mb-4 transition-all ${!electricityEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{isAr ? 'استهلاك الكهرباء' : 'Electricity Consumption'}</h3>
                <ToggleButton enabled={electricityEnabled} onChange={setElectricityEnabled} isAr={isAr} />
              </div>
              <div className={!electricityEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={isAr ? 'كمية الكهرباء' : 'Electricity Consumed'} value={electricityAmount} onChange={setElectricityAmount} placeholder="25000" />
                  <SelectField label={isAr ? 'الوحدة' : 'Unit'} value={electricityUnit} options={[{ value: 'kwh', label: 'kWh' }, { value: 'mwh', label: 'MWh' }]} onChange={setElectricityUnit} />
                </div>
              </div>
            </div>

            <div className={`border border-gray-100 rounded-lg p-5 transition-all ${!heatEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{isAr ? 'التدفئة أو البخار' : 'Purchased Heat/Steam'}</h3>
                <ToggleButton enabled={heatEnabled} onChange={setHeatEnabled} isAr={isAr} />
              </div>
              <div className={!heatEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={isAr ? 'الكمية' : 'Amount'} value={heatAmount} onChange={setHeatAmount} placeholder="5000" />
                  <SelectField label={isAr ? 'الوحدة' : 'Unit'} value={heatUnit} options={[{ value: 'mmbtu', label: 'MMBtu' }, { value: 'gj', label: 'GJ' }]} onChange={setHeatUnit} />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('emissions_calculator.scope3_value')}</h2>
            <p className="text-xs text-gray-400 mb-5">{isAr ? 'أدخل بيانات الانبعاثات من سلسلة القيمة.' : 'Enter data for value chain emissions.'}</p>

            <div className={`border border-gray-100 rounded-lg p-5 mb-4 transition-all ${!travelEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{isAr ? 'سفر العمل' : 'Business Travel'}</h3>
                <ToggleButton enabled={travelEnabled} onChange={setTravelEnabled} isAr={isAr} />
              </div>
              <div className={!travelEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label={isAr ? 'وسيلة النقل' : 'Transport Mode'} value={travelMode} options={[{ value: 'flight', label: isAr ? 'طائرة' : 'Flight' }, { value: 'car', label: isAr ? 'سيارة' : 'Car' }]} onChange={setTravelMode} />
                  <InputField label={isAr ? 'المسافة (كم)' : 'Distance (km)'} value={travelDistance} onChange={setTravelDistance} placeholder="12000" />
                </div>
              </div>
            </div>

            <div className={`border border-gray-100 rounded-lg p-5 transition-all ${!wasteEnabled ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">{isAr ? 'النفايات المتولدة' : 'Waste Generated'}</h3>
                <ToggleButton enabled={wasteEnabled} onChange={setWasteEnabled} isAr={isAr} />
              </div>
              <div className={!wasteEnabled ? 'pointer-events-none grayscale' : ''}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={isAr ? 'كمية النفايات' : 'Waste Amount'} value={wasteAmount} onChange={setWasteAmount} placeholder="850" />
                  <SelectField label={isAr ? 'الوحدة' : 'Unit'} value={wasteUnit} options={[{ value: 'kg', label: isAr ? 'كيلوجرام' : 'Kilogram' }, { value: 'tons', label: isAr ? 'طن' : 'Tons' }]} onChange={setWasteUnit} />
                </div>
              </div>
            </div>

            {/* الإضافة الاحترافية: انبعاثات مخصصة */}
            <div className={`border-2 rounded-xl p-6 mt-6 transition-all duration-300 ${!customEnabled ? 'border-dashed border-gray-200 bg-gray-50/50' : 'border-[#10b981]/30 bg-[#10b981]/5 shadow-sm'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${customEnabled ? 'bg-[#10b981] text-white shadow-md shadow-green-100' : 'bg-gray-200 text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">{isAr ? 'انبعاثات كربونية مخصصة' : 'Custom Carbon Emissions'}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-bold">{isAr ? 'أضف مصادر أخرى (الغازات الصناعية، المواد الخام، الشحن البحري)' : 'Add other sources (Industrial gases, Raw materials)'}</p>
                  </div>
                </div>
                <ToggleButton enabled={customEnabled} onChange={setCustomEnabled} isAr={isAr} />
              </div>

              <div className={!customEnabled ? 'hidden' : 'space-y-4 pt-4 border-t border-emerald-100/50'}>
                {customEmissions.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-end bg-white p-4 border border-emerald-100 rounded-xl relative shadow-sm">
                    <div className="w-full sm:w-1/2">
                      <InputField type="text" label={isAr ? 'اسم المصدر التعريفي' : 'Source Name'} value={item.name} onChange={(v) => updateCustomEmission(item.id, 'name', v)} placeholder={isAr ? 'مثال: عمليات الشحن البحري' : 'e.g. Maritime Shipping'} />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <InputField label={isAr ? 'الكمية (kgCO₂e)' : 'Amount (kgCO₂e)'} value={item.amount} onChange={(v) => updateCustomEmission(item.id, 'amount', v)} placeholder="0" />
                    </div>
                    {customEmissions.length > 1 && (
                      <button onClick={() => removeCustomEmission(item.id)} className="absolute top-2 left-2 (rtl:right-2) text-gray-300 hover:text-red-500 transition bg-gray-50 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addCustomEmission} className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 font-black text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  {isAr ? 'إضافة مصدر انبعاث جديد' : 'Add another emission source'}
                </button>
              </div>
            </div>
          </>
        )}
      
        {step === 3 && (
          <div className="py-2">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('emissions_calculator.review')}</h2>
            <p className="text-xs text-gray-400 mb-5">{isAr ? 'مراجعة وتأكيد البيانات المدخلة وعرض النتائج المحسوبة.' : 'Review and confirm entered data and view calculated results.'}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">{isAr ? 'النطاق 1' : 'Scope 1'}</p>
                <p className="text-2xl font-bold text-emerald-700">{totals.scope1}</p>
                <p className="text-xs text-emerald-500 mt-1">{isAr ? 'طن مكافئ CO₂' : 'Tons CO₂e'}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">{isAr ? 'النطاق 2' : 'Scope 2'}</p>
                <p className="text-2xl font-bold text-blue-700">{totals.scope2}</p>
                <p className="text-xs text-blue-500 mt-1">{isAr ? 'طن مكافئ CO₂' : 'Tons CO₂e'}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <p className="text-xs text-purple-600 font-semibold mb-1">{isAr ? 'النطاق 3' : 'Scope 3'}</p>
                <p className="text-2xl font-bold text-purple-700">{totals.scope3}</p>
                <p className="text-xs text-purple-500 mt-1">{isAr ? 'طن مكافئ CO₂' : 'Tons CO₂e'}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{isAr ? 'إجمالي الانبعاثات المحسوبة' : 'Total Calculated Emissions'}</p>
                  <p className="text-xs text-gray-400">{isAr ? 'بناءً على البيانات المدخلة' : 'Based on entered data'}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{totals.grandTotal}</p>
                  <p className="text-xs text-gray-500">{isAr ? 'طن مكافئ ثاني أكسيد الكربون' : 'Tons CO₂ Equivalent'}</p>
                </div>
              </div>
            </div>

            {/* الإضافة: زرار خطة الأسعار في صفحة النتائج */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!isStandalone && (
                <button 
                  onClick={handleSaveReport}
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التقرير' : 'Save Report')}
                </button>
              )}
              
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                )}
                {isExporting ? (isAr ? 'جاري التصدير...' : 'Generating...') : (isAr ? 'تصدير PDF' : 'Export PDF')}
              </button>

              {isStandalone && (
                <Link 
                  href="/Pricing"
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                >
                  {isAr ? 'ترقية وحصول على مميزات ' : 'Upgrade & Get Features '}
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.previous')}
          </button>
          
          {step < 3 && (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
            >
              {t('common.next')}
              <svg className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* --- التنسيق الخاص بالطباعة PDF --- */}
      <div id="full-report-print" style={{ 
        width: '794px', 
        minHeight: '1123px',
        padding: '40px', 
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Alexandria', sans-serif",
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'none' 
      }} dir="rtl">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#10b981', padding: '10px', borderRadius: '12px' }}>
              <img src="/Logo.jpg" alt="Logo" style={{ width: '35px', height: '35px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0', fontWeight: '900' }}>Carbon<span style={{ color: '#10b981' }}>Emission</span></h1>
              <p style={{ fontSize: '10px', color: '#64748b', margin: '0', fontWeight: '600' }}>Sustainability Intelligence Report</p>
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '8px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>تاريخ الإصدار</span>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
          {[
            { t: 'النطاق 1', v: totals.scope1, c: '#10b981', desc: 'Direct' },
            { t: 'النطاق 2', v: totals.scope2, c: '#3b82f6', desc: 'Energy' },
            { t: 'النطاق 3', v: totals.scope3, c: '#8b5cf6', desc: 'Chain' }
          ].map((scope, i) => (
            <div key={i} style={{ 
              padding: '20px 15px', 
              background: '#fff',
              borderRadius: '16px', 
              textAlign: 'center',
              border: `1px solid #f1f5f9`,
              borderTop: `4px solid ${scope.c}` 
            }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{scope.t}</span>
              <strong style={{ fontSize: '24px', color: '#0f172a', display: 'block', margin: '8px 0' }}>{scope.v}</strong>
              <span style={{ fontSize: '10px', color: scope.c, fontWeight: '700', background: '#f8fafc', padding: '2px 8px', borderRadius: '10px' }}>{scope.desc}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '3px', height: '15px', background: '#10b981' }}></div>
            البيانات التفصيلية للمنشأة
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'right' }}>
                <th style={{ padding: '10px', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>المصدر التحليلي</th>
                <th style={{ padding: '10px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>القيمة</th>
                <th style={{ padding: '10px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>الوحدة</th>
              </tr>
            </thead>
            <tbody>
            {[
              { label: isAr ? 'استهلاك الوقود' : 'Fuel Combustion', val: fuelEnabled ? fuelAmount : (isAr ? 'معطل' : 'Disabled'), unit: fuelEnabled ? (fuelUnit === 'm3' ? (isAr ? 'متر مكعب' : 'm³') : (isAr ? (fuelUnit === 'liter' ? 'لتر' : fuelUnit) : fuelUnit)) : '-' },
              { label: isAr ? 'تسرب المبردات' : 'Refrigerants', val: refrigerantsEnabled ? leakAmount : (isAr ? 'معطل' : 'Disabled'), unit: refrigerantsEnabled ? leakUnit : '-' },
              { label: isAr ? 'الكهرباء والتدفئة' : 'Electricity & Heat', val: (electricityEnabled || heatEnabled) ? (Number(electricityAmount || 0) + Number(heatAmount || 0)) : (isAr ? 'معطل' : 'Disabled'), unit: isAr ? 'كيلووات/MMBtu' : 'kWh/MMBtu' },
              { label: isAr ? 'سفر وتنقل الموظفين' : 'Business Travel', val: travelEnabled ? travelDistance : (isAr ? 'معطل' : 'Disabled'), unit: travelEnabled ? travelUnit : '-' },
              { label: isAr ? 'النفايات المتولدة' : 'Waste Generated', val: wasteEnabled ? wasteAmount : (isAr ? 'معطل' : 'Disabled'), unit: wasteEnabled ? wasteUnit : '-' },
              { label: isAr ? 'مصادر كربونية مخصصة' : 'Custom Carbon Sources', val: customEnabled ? customEmissions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) : (isAr ? 'معطل' : 'Disabled'), unit: customEnabled ? 'kgCO₂e' : '-' }
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '12px 10px', fontSize: '13px', borderBottom: '1px solid #f8fafc' }}>{row.label}</td>
                <td style={{ padding: '12px 10px', fontSize: '14px', fontWeight: '700', textAlign: 'center', borderBottom: '1px solid #f8fafc', color: row.val === 'معطل' || row.val === 'Disabled' ? '#94a3b8' : '#0f172a' }}>{row.val}</td>
                <td style={{ padding: '12px 10px', fontSize: '12px', color: '#64748b', textAlign: 'center', borderBottom: '1px solid #f8fafc' }}>{row.unit}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#0f172a', borderRadius: '20px', padding: '35px', color: '#fff', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', margin: '0 0 10px 0' }}>TOTAL CARBON FOOTPRINT</p>
          <h2 style={{ fontSize: '48px', fontWeight: '900', margin: '0' }}>{totals.grandTotal}</h2>
          <p style={{ fontSize: '14px', opacity: 0.7, margin: '5px 0 0' }}>طن مكافئ ثاني أكسيد الكربون (tCO₂e)</p>
        </div>
      </div>
    </div>
  );
}

export default function EmissionsCalculatorPage() {
  const searchParams = useSearchParams();
  const isStandalone = searchParams.get('mode') === 'standalone';
  const langParam = searchParams.get('lang') || 'ar';

  const dir = langParam === 'en' ? 'ltr' : 'rtl';

  return (
    <ClientWrapper>
      {isStandalone ? (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-cairo" dir={dir}>
          <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="bg-emerald-500 p-1.5 rounded-lg">
                   <img src="/Logo.jpg" alt="Logo" className="w-6 h-6 filter brightness-0 invert" />
                </div>
                <span className="font-bold text-xl text-gray-900">Carbon<span className="text-emerald-500">Emission</span></span>
             </div>
             <Link href={`/?lang=${langParam}`} className="text-sm text-gray-500 hover:text-emerald-500 transition font-medium">
                {langParam === 'en' ? '← Back to Home' : 'العودة للرئيسية ←'}
             </Link>
          </div>
          
          <EmissionsCalculatorContent isStandalone={isStandalone} />
        </div>
      ) : (
        <AppLayout>
          <EmissionsCalculatorContent isStandalone={isStandalone} />
        </AppLayout>
      )}
    </ClientWrapper>
  );
}

// 'use client';
// import { useRouter } from 'next/navigation';
// import { useState, useMemo, useEffect } from 'react'; 
// import ClientWrapper from '@/components/ClientWrapper';
// import AppLayout from '@/components/AppLayout';
// import { useLanguage } from '@/contexts/LanguageContext';
// import translations from "@/Translations";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// // --- المكونات الفرعية (UI Components) ---

// function StepIndicator({ steps, current }) {
//   return (
//     <div className="flex items-center justify-center gap-0 w-full mb-8">
//       {steps.map((step, i) => (
//         <div key={i} className="flex items-center">
//           <div className="flex flex-col items-center">
//             <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all
//               ${i < current ? 'bg-emerald-500 border-emerald-500' : i === current ? 'border-emerald-500 bg-white' : 'border-gray-300 bg-white'}`}>
//               {i < current && (
//                 <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               )}
//               {i === current && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
//             </div>
//             <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${i === current ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
//           </div>
//           {i < steps.length - 1 && (
//             <div className={`w-12 h-0.5 mx-1 mb-5 ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// function InfoIcon() {
//   return (
//     <svg className="h-4 w-4 text-gray-300 cursor-pointer hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-2v-4h2m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   );
// }

// function SelectField({ label, value, options, onChange }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <div className="flex items-center justify-between">
//         <label className="text-xs font-medium text-gray-600">{label}</label>
//         <InfoIcon />
//       </div>
//       <select
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none cursor-pointer"
//       >
//         {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//       </select>
//     </div>
//   );
// }

// function InputField({ label, value, onChange, placeholder, type = "number" }) {
//   return (
//     <div className="flex flex-col gap-1.5 w-full">
//       <div className="flex items-center justify-between">
//         <label className="text-xs font-medium text-gray-600">{label}</label>
//         <InfoIcon />
//       </div>
//       <input
//         type={type}
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
//       />
//     </div>
//   );
// }

// function ToggleButton({ enabled, onChange, isAr }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!enabled)}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
//         enabled ? 'bg-emerald-500' : 'bg-gray-300'
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
//           enabled 
//             ? (isAr ? '-translate-x-6' : 'translate-x-6') 
//             : (isAr ? '-translate-x-1' : 'translate-x-1')
//         }`}
//       />
//     </button>
//   );
// }

// // --- المكون الرئيسي ---

// function EmissionsCalculatorContent({ isStandalone }) { 
//   const router = useRouter();
//   const { locale, changeLocale } = useLanguage(); 
//   const isAr = locale === 'ar';
  
//   const searchParams = useSearchParams();
//   const langParam = searchParams.get('lang');

//   useEffect(() => {
//     if (langParam && (langParam === 'ar' || langParam === 'en')) {
//       if (langParam !== locale) {
//         changeLocale(langParam);
//       }
//     }
//   }, [langParam, locale, changeLocale]);

//   const [step, setStep] = useState(0);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showLimitModal, setShowLimitModal] = useState(false);

//   // --- حالات التفعيل (Toggles) ---
//   const [fuelEnabled, setFuelEnabled] = useState(true);
//   const [refrigerantsEnabled, setRefrigerantsEnabled] = useState(true);
//   const [electricityEnabled, setElectricityEnabled] = useState(true);
//   const [heatEnabled, setHeatEnabled] = useState(true);
//   const [travelEnabled, setTravelEnabled] = useState(true);
//   const [wasteEnabled, setWasteEnabled] = useState(true);
//   const [customEnabled, setCustomEnabled] = useState(false);

//   // --- المدخلات ---
//   const [fuelType, setFuelType] = useState('diesel');
//   const [fuelAmount, setFuelAmount] = useState('1500');
//   const [fuelUnit, setFuelUnit] = useState('liter');
//   const [refrigerantType, setRefrigerantType] = useState('hfc134a');
//   const [leakAmount, setLeakAmount] = useState('50');
//   const [leakUnit, setLeakUnit] = useState('kg');
//   const [electricityAmount, setElectricityAmount] = useState('25000');
//   const [electricityUnit, setElectricityUnit] = useState('kwh');
//   const [heatAmount, setHeatAmount] = useState('5000');
//   const [heatUnit, setHeatUnit] = useState('mmbtu');
//   const [travelMode, setTravelMode] = useState('flight');
//   const [travelDistance, setTravelDistance] = useState('5000');
//   const [travelUnit, setTravelUnit] = useState('km');
//   const [wasteAmount, setWasteAmount] = useState('2000');
//   const [wasteUnit, setWasteUnit] = useState('kg');
//   const [customEmissions, setCustomEmissions] = useState([{ id: 1, name: '', amount: '' }]);

//   // --- الحسابات ---
//   const totals = useMemo(() => {
//     const s1 = (fuelEnabled ? (Number(fuelAmount) || 0) : 0) + (refrigerantsEnabled ? (Number(leakAmount) || 0) : 0);
//     const s2 = (electricityEnabled ? (Number(electricityAmount) || 0) : 0) + (heatEnabled ? (Number(heatAmount) || 0) : 0);
//     const customTotal = customEnabled ? customEmissions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) : 0;
//     const s3 = (travelEnabled ? (Number(travelDistance) || 0) : 0) + (wasteEnabled ? (Number(wasteAmount) || 0) : 0) + customTotal;
//     const grandTotal = s1 + s2 + s3;

//     return {
//       scope1: s1.toLocaleString(),
//       scope2: s2.toLocaleString(),
//       scope3: s3.toLocaleString(),
//       grandTotal: grandTotal.toLocaleString(),
//       rawTotal: grandTotal
//     };
//   }, [fuelAmount, leakAmount, electricityAmount, heatAmount, travelDistance, wasteAmount, customEmissions, fuelEnabled, refrigerantsEnabled, electricityEnabled, heatEnabled, travelEnabled, wasteEnabled, customEnabled]);

//   const handleNextStep = () => {
//     if (step === 2 && isStandalone) {
//       const today = new Date().toDateString(); 
//       const stored = JSON.parse(localStorage.getItem('carbon_usage_limit') || '{}');
//       let currentCount = stored.date === today ? (stored.count || 0) : 0;

//       if (currentCount >= 3) {
//         setShowLimitModal(true);
//       } else {
//         localStorage.setItem('carbon_usage_limit', JSON.stringify({ date: today, count: currentCount + 1 }));
//       }
//     }
//     setStep(Math.min(3, step + 1));
//   };

//   // ✅ الدالة المطورة بالـ Fetch
//   const handleSaveReport = async () => {
//     setIsSaving(true);
//     const reportDetails = {
//       id: `report_${new Date().getTime()}`,
//       projectName: isAr ? "مشروع تقييم الاستدامة" : "Sustainability Assessment Project",
//       date: new Date().toISOString(),
//       locale: locale,
//       stats: {
//         scope1: totals.scope1,
//         scope2: totals.scope2,
//         scope3: totals.scope3,
//         total: totals.grandTotal,
//         rawTotal: totals.rawTotal
//       }
//     };

//     try {
//       // 🚀 محاولة الحفظ في الباك إيند
//       const response = await fetch('/api/save-report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(reportDetails),
//       });
//       if (response.ok) // console.log("Saved to Database!");
//     } catch (error) {
//       console.warn("Backend fail, using local fallback");
//     } finally {
//       // الحفظ المحلي لضمان ظهور التقرير فوراً
//       const existingLogs = JSON.parse(localStorage.getItem('carbon_emission_reports') || '[]');
//       localStorage.setItem('carbon_emission_reports', JSON.stringify([reportDetails, ...existingLogs]));
//       localStorage.setItem('active_ecovision_report', JSON.stringify(reportDetails));
      
//       setTimeout(() => {
//         setIsSaving(false);
//         router.push('/esg-reports'); 
//       }, 500);
//     }
//   };

//   const handleExportPDF = async () => {
//     const reportElement = document.getElementById('full-report-print');
//     reportElement.style.display = 'block';
//     try {
//       const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
//       pdf.save(`EcoVision-Report-${new Date().getTime()}.pdf`);
//     } finally {
//       reportElement.style.display = 'none';
//     }
//   };

//   const steps = isAr
//     ? ['النطاق 1: انبعاثات مباشرة', 'النطاق 2: انبعاثات طاقة', 'النطاق 3: سلسلة القيمة', 'النتائج']
//     : ['Scope 1: Direct', 'Scope 2: Energy', 'Scope 3: Value Chain', 'Results'];

//   return (
//     <div className="max-w-3xl mx-auto relative font-cairo">
      
//       {showLimitModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
//           <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl text-center">
//             <h2 className="text-2xl font-black mb-2">{isAr ? 'استنفدت الحد اليومي!' : 'Daily Limit Reached!'}</h2>
//             <p className="text-gray-600 mb-8">{isAr ? 'لقد استخدمت 3 محاولات. جرب غداً أو قم بالترقية.' : '3 free tries used. Try tomorrow or upgrade.'}</p>
//             <Link href="/Pricing" className="block w-full bg-emerald-500 text-white py-4 rounded-xl font-black shadow-lg">Upgrade 🚀</Link>
//           </div>
//         </div>
//       )}

//       <StepIndicator steps={steps} current={step} />

//       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
//         {step === 0 && (
//           <div className="space-y-6">
//             <h2 className="text-xl font-black text-gray-900">{isAr ? 'النطاق 1: الانبعاثات المباشرة' : 'Scope 1: Direct Emissions'}</h2>
//             <div className={`p-6 rounded-2xl border ${fuelEnabled ? 'bg-white' : 'bg-gray-50 opacity-50'}`}>
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold">{isAr ? 'احتراق الوقود' : 'Fuel Combustion'}</h3>
//                 <ToggleButton enabled={fuelEnabled} onChange={setFuelEnabled} isAr={isAr} />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <SelectField label={isAr ? 'نوع الوقود' : 'Fuel Type'} value={fuelType} options={[{value:'diesel', label:'Diesel'}]} onChange={setFuelType} />
//                 <InputField label={isAr ? 'الكمية' : 'Amount'} value={fuelAmount} onChange={setFuelAmount} placeholder="0" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ... بقية خطوات النطاق 2 و 3 بنفس الطريقة ... */}
        
//         {step === 3 && (
//           <div className="space-y-8 py-4">
//             <div className="grid grid-cols-3 gap-4">
//                <div className="bg-emerald-50 p-6 rounded-2xl text-center">
//                   <p className="text-xs font-bold text-emerald-600 mb-2">Scope 1</p>
//                   <p className="text-2xl font-black text-emerald-700">{totals.scope1}</p>
//                </div>
//                <div className="bg-teal-50 p-6 rounded-2xl text-center">
//                   <p className="text-xs font-bold text-teal-600 mb-2">Scope 2</p>
//                   <p className="text-2xl font-black text-teal-700">{totals.scope2}</p>
//                </div>
//                <div className="bg-emerald-900 p-6 rounded-2xl text-center text-white">
//                   <p className="text-xs font-bold opacity-70 mb-2">Scope 3</p>
//                   <p className="text-2xl font-black">{totals.scope3}</p>
//                </div>
//             </div>

//             <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white text-center">
//                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Grand Total Carbon Footprint</p>
//                <h2 className="text-5xl font-black tracking-tighter mb-2">{totals.grandTotal}</h2>
//                <p className="text-emerald-400 font-bold">Metric Tons CO2e</p>
//             </div>

//             <div className="flex gap-4">
//                <button onClick={handleSaveReport} disabled={isSaving} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
//                   {isSaving ? '...' : (isAr ? 'حفظ النتائج' : 'Save Results')}
//                </button>
//                <button onClick={handleExportPDF} className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all">
//                   {isAr ? 'تصدير PDF' : 'Export PDF'}
//                </button>
//             </div>
//           </div>
//         )}

//         {/* التنقل */}
//         {step < 3 && (
//           <div className="mt-10 flex justify-between">
//             <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} className="px-6 py-2 text-sm font-bold text-gray-400">Previous</button>
//             <button onClick={handleNextStep} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-black shadow-lg">Next Step</button>
//           </div>
//         )}
//       </div>

//       {/* قالب الطباعة (مخفي) */}
//       <div id="full-report-print" style={{ display: 'none', width: '800px', padding: '60px', background: '#fff' }}>
//          <h1 style={{ color: '#10b981' }}>EcoVision Sustainability Report</h1>
//          <div style={{ marginTop: '40px', padding: '40px', background: '#f0fdf4', borderRadius: '30px' }}>
//             <h2>Total Emissions: {totals.grandTotal} tCO2e</h2>
//          </div>
//       </div>
//     </div>
//   );
// }

// export default function EmissionsCalculatorPage() {
//   const searchParams = useSearchParams();
//   const isStandalone = searchParams.get('mode') === 'standalone';

//   return (
//     <ClientWrapper>
//       <AppLayout>
//         <EmissionsCalculatorContent isStandalone={isStandalone} />
//       </AppLayout>
//     </ClientWrapper>
//   );
// }