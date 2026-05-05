"use client";
import { useState, useRef, Suspense, useEffect } from "react";
import Header from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/contexts/LanguageContext';


const dict = {
  ar: {
    back: "العودة للأسعار",
    title: "إتمام الاشتراك",
    subtitle: "أكمل عملية الدفع للبدء في إدارة انبعاثاتك الكربونية باحترافية.",
    summary: "فاتورة الاشتراك",
    monthly: "اشتراك شهري (Pro)",
    subtotal: "المبلغ الأساسي",
    tax: "ضريبة القيمة المضافة (14%)",
    total: "الإجمالي المستحق",
    promoPlaceholder: "أدخل كود الخصم هنا",
    promoBtn: "تطبيق",
    discountStr: "قيمة الخصم (20%)",
    secure: "دفع آمن وموثوق",
    secureDesc: "تتم معالجة مدفوعاتك ببيئة مشفرة (256-bit SSL).",
    payMethod: "طريقة الدفع",
    card: "بطاقة ائتمان",
    code: "كود مؤسسي",
    wallet: "محافظ إلكترونية",
    cardName: "الاسم على البطاقة",
    cardNumber: "رقم البطاقة",
    exp: "تاريخ الانتهاء",
    cvc: "رمز CVC",
    payBtn: "تأكيد الدفع",
    processing: "جاري المعالجة الآمنة...",
    codeDesc: "إذا تمتلك شركتك ترخيصاً مسبقاً، أدخل الكود المكون من 16 حرفاً للتفعيل الفوري.",
    codePlaceholder: "XXXX-XXXX-XXXX-XXXX",
    codeBtn: "التحقق والتفعيل",
    walletDesc: "قم بالتحويل عبر إنستاباي أو فودافون كاش، ثم أرفق إيصال الدفع لتأكيد اشتراكك.",
    instaTitle: "إنستاباي (InstaPay)",
    walletTitle: "فودافون كاش",
    attach: "صورة إيصال التحويل",
    dropzone: "اضغط للرفع أو اسحب الصورة هنا",
    walletBtn: "تأكيد وإرسال للإدارة",
    otpChoiceTitle: "وسيلة التحقق",
    otpChoiceDesc: "اختر الوسيلة المفضلة لاستلام رمز الأمان الخاص بك:",
    otpEmail: "البريد الإلكتروني",
    otpSms: "رسالة نصية (SMS)",
    otpApp: "تطبيق المصادقة (Auth App)",
    otpTitle: "مصادقة بنكية (3D Secure)",
    otpDesc: "يرجى إدخال رمز الأمان (OTP) المكون من 6 أرقام والمرسل إليك.",
    attempts: "المحاولات المتبقية:",
    timer: "صلاحية الرمز:",
    validateBtn: "تحقق ودفع",
    resend: "إرسال رمز جديد",
    cancel: "إلغاء العملية",
    successTitle: "تمت العملية بنجاح! 🌍",
    successDesc: "مرحباً بك في المستوى الاحترافي. تم تجهيز مساحة العمل الخاصة بك وهي جاهزة الآن للاستخدام.",
    dashboard: "الذهاب للوحة التحكم"
  },
  en: {
    back: "Back to Pricing",
    title: "Secure Checkout",
    subtitle: "Complete your payment to start managing your carbon emissions.",
    summary: "Order Invoice",
    monthly: "Monthly Subscription (Pro)",
    subtotal: "Subtotal",
    tax: "VAT (14%)",
    total: "Total Due",
    promoPlaceholder: "Promo code (e.g., ATHER20)",
    promoBtn: "Apply",
    discountStr: "Discount (20%)",
    secure: "100% Secure Payment",
    secureDesc: "Your payments are processed in a 256-bit SSL encrypted environment.",
    payMethod: "Payment Method",
    card: "Credit Card",
    code: "License Key",
    wallet: "E-Wallets",
    cardName: "Name on Card",
    cardNumber: "Card Number",
    exp: "Expiry Date",
    cvc: "CVC / CVV",
    payBtn: "Confirm Payment",
    processing: "Processing Securely...",
    codeDesc: "If your company has a pre-paid license, enter the 16-character key for instant activation.",
    codePlaceholder: "XXXX-XXXX-XXXX-XXXX",
    codeBtn: "Verify & Activate",
    walletDesc: "Transfer via InstaPay or Vodafone Cash, then attach the receipt to confirm.",
    instaTitle: "InstaPay Account",
    walletTitle: "Vodafone Cash",
    attach: "Payment Receipt",
    dropzone: "Click to upload or drag image here",
    walletBtn: "Submit for Verification",
    otpChoiceTitle: "Verification Method",
    otpChoiceDesc: "Choose your preferred method to receive the security code:",
    otpEmail: "Email Address",
    otpSms: "Text Message (SMS)",
    otpApp: "Authenticator App",
    otpTitle: "Bank Authentication (3D Secure)",
    otpDesc: "Please enter the 6-digit OTP sent to your selected method.",
    attempts: "Attempts left:",
    timer: "Code expires in:",
    validateBtn: "Validate & Pay",
    resend: "Resend Code",
    cancel: "Cancel",
    successTitle: "Payment Successful! 🌍",
    successDesc: "Welcome to the Pro tier. Your workspace has been provisioned and is ready to use.",
    dashboard: "Go to Dashboard"
  }
};

function CheckoutContent() {
  const { language } = useLanguage();
  const t = dict[language] || dict['ar'];
  const isAr = language === 'ar';

  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Pro';
  
  const [method, setMethod] = useState("card"); 
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const inputRefs = useRef([]);

  const [promoCode, setPromoCode] = useState("");
  const [licenseKey, setLicenseKey] = useState(""); // جديد: لإدارة كود المؤسسة
  const [discountRate, setDiscountRate] = useState(0); 
  const [copied, setCopied] = useState(""); 
  
  // --- Payment Form States ---
  const [cardData, setCardData] = useState({ name: '', number: '', exp: '', cvc: '' });

  const basePrice = 99.00;
  const discountAmount = basePrice * discountRate;
  const taxableAmount = basePrice - discountAmount;
  const taxAmount = taxableAmount * 0.14; 
  const finalTotal = taxableAmount + taxAmount;

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ATHER20') {
      setDiscountRate(0.20); 
    } else {
      setDiscountRate(0);
      alert(isAr ? "كود الخصم غير صالح أو منتهي الصلاحية" : "Invalid or expired promo code");
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  // --- دوال تنسيق كارت الدفع (Stripe-like Formatting) ---
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val; 
    setCardData({ ...cardData, number: formatted });
  };

  // --- جديد: دالة تنسيق كود المؤسسة (XXXX-XXXX-XXXX-XXXX) ---
  const handleLicenseKeyChange = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // حذف الرموز والتاجات
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join('-') || val; // إضافة شرطة كل 4 حروف/أرقام
    setLicenseKey(formatted);
  };

  const handleExpChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      let month = val.substring(0, 2);
      if (parseInt(month) > 12) month = '12'; 
      if (parseInt(month) === 0) month = '01'; 
      val = month + (val.length > 2 ? '/' + val.substring(2, 4) : '');
    }
    setCardData({ ...cardData, exp: val });
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.substring(0, 3); 
    setCardData({ ...cardData, cvc: val });
  };

  const isCardFormValid = cardData.name.trim().length > 2 && 
                          cardData.number.length === 19 && 
                          cardData.exp.length === 5 && 
                          cardData.cvc.length === 3;

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!isCardFormValid) return; 
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp-choice"); 
    }, 1000); 
  };

  const handleSelectOtpMethod = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp");
      setTimeLeft(180);
    }, 800);
  };

  const handleValidateOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 2000);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpClick = (index) => {
    const firstEmptyIndex = otp.findIndex(val => val === '');
    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
      inputRefs.current[firstEmptyIndex].focus();
    }
  };

  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const slideUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-emerald-50 font-cairo antialiased p-6" dir={isAr ? "rtl" : "ltr"}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 150 }} className="bg-white p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(16,185,129,0.1)] border border-emerald-100 text-center max-w-lg w-full relative">
          <div className="w-28 h-28 mx-auto mb-8 relative">
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute inset-0 bg-emerald-300 rounded-full"></motion.div>
            <div className="absolute inset-0 bg-emerald-50 rounded-full flex items-center justify-center border-[6px] border-white shadow-lg z-10">
              <svg className="w-12 h-12 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{t.successTitle}</h2>
          <p className="text-gray-500 mb-10 font-bold leading-relaxed">{t.successDesc}</p>
          <Link href={`/emissions-calculator?lang=${language}`} className="flex items-center justify-center w-full bg-[#10b981] text-white py-4.5 rounded-2xl font-black hover:bg-[#059669] transition-all shadow-[0_10px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.35)] hover:-translate-y-1 text-lg">
            {t.dashboard}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-cairo antialiased pt-32 pb-24 selection:bg-[#10b981]/20 selection:text-[#10b981]" dir={isAr ? "rtl" : "ltr"}>
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-100/50 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate="show" variants={staggerContainer} className="mb-12 text-center md:text-start">
          <Link href={`/Pricing?lang=${language}`} className="inline-flex text-sm font-bold text-gray-400 hover:text-[#10b981] items-center gap-2 mb-4 transition-colors group">
            <svg className={`w-4 h-4 transform transition-transform group-hover:-translate-x-1 ${!isAr ? 'rotate-180 group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" transform="scale(-1, 1) translate(-24, 0)"></path></svg>
            {t.back}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">{t.title}</h1>
          <p className="text-gray-500 font-medium">{t.subtitle}</p>
        </motion.div>

        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-start">
          
          <motion.div variants={slideUp} initial="hidden" animate="show" className="w-full lg:w-7/12">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-6 md:p-10 relative z-10">
              
              <h3 className="text-2xl font-black text-gray-900 mb-8">{t.payMethod}</h3>

              <div className="flex bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100 mb-10 relative">
                {[
                  { id: 'card', label: t.card, icon: '💳' },
                  { id: 'code', label: t.code, icon: '🔑' },
                  { id: 'wallet', label: t.wallet, icon: '📱' }
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setMethod(tab.id)} className={`relative flex-1 flex items-center justify-center gap-2 py-4 px-2 rounded-xl font-bold text-sm transition-colors z-10 ${method === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                    {method === tab.id && (
                      <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className="text-xl hidden md:inline-block">{tab.icon}</span>
                    {tab.label}
                  </button>
                  
                ))}
              </div>

              <div className="min-h-[350px]">
                <AnimatePresence mode="wait">
                  
                  {method === "card" && (
                    <motion.form key="card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} onSubmit={handleCardSubmit} className="space-y-6">
                      
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700 px-1">{t.cardName}</label>
                        <input 
                          type="text" value={cardData.name} 
                          onChange={(e) => setCardData({...cardData, name: e.target.value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, '')})}
                          placeholder="Card Holder Name" 
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all font-bold text-gray-900 placeholder-gray-400" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700 px-1">{t.cardNumber}</label>
                        <div className="relative">
                          <input 
                            type="text" value={cardData.number} onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000" dir="ltr" maxLength="19"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all font-bold text-gray-900 tracking-[0.15em] text-left pl-14 placeholder-gray-400" 
                            required 
                          />
                          <svg className={`w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${cardData.number.length === 19 ? 'text-[#10b981]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700 px-1">{t.exp}</label>
                          <input 
                            type="text" value={cardData.exp} onChange={handleExpChange}
                            placeholder="MM/YY" dir="ltr" maxLength="5"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all font-bold text-gray-900 text-center placeholder-gray-400" 
                            required 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700 px-1">{t.cvc}</label>
                          <input 
                            type="password" value={cardData.cvc} onChange={handleCvcChange}
                            placeholder="123" dir="ltr" maxLength="3"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all font-bold text-gray-900 text-center tracking-widest placeholder-gray-400" 
                            required 
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" disabled={isProcessing || !isCardFormValid} 
                        className="relative w-full mt-8 bg-[#2EB67D] text-white rounded-2xl font-black text-lg hover:bg-[#249666] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[60px] overflow-hidden group"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-3"><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t.processing}</span>
                        ) : (
                          <>
                            <span className="relative z-10">{t.payBtn} (${finalTotal.toFixed(2)})</span>
                            {!(!isCardFormValid) && <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}

                  {/* 2. كود المؤسسة - تم إضافة التنسيق التلقائي والتأمين */}
                  {method === "code" && (
                    <motion.form key="code" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} onSubmit={(e) => {e.preventDefault(); setStep("success");}} className="space-y-6">
                      <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-100 p-2 rounded-lg mt-1"><svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                          <p className="text-emerald-800 font-bold text-sm leading-relaxed">{t.codeDesc}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          value={licenseKey}
                          onChange={handleLicenseKeyChange}
                          placeholder={t.codePlaceholder} 
                          dir="ltr" 
                          maxLength="19"
                          className="w-full p-5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#2EB67D]/20 focus:border-[#2EB67D] transition-all outline-none text-center font-mono text-xl uppercase tracking-[0.25em] font-bold text-gray-900 placeholder-gray-400" 
                          required 
                        />
                      </div>
                      <button type="submit" className="w-full bg-[#2EB67D] text-white h-[60px] rounded-2xl font-black text-lg hover:bg-[#249666] transition-all shadow-lg">
                        {t.codeBtn}
                      </button>
                    </motion.form>
                  )}

                  {/* 3. المحافظ الإلكترونية */}
                  {method === "wallet" && (
                    <motion.form key="wallet" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} onSubmit={(e) => {e.preventDefault(); setStep("success");}} className="space-y-6">
                      <p className="text-gray-500 font-bold text-sm mb-2">{t.walletDesc}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-2xl p-4 hover:border-[#10b981] hover:bg-emerald-50/30 transition-all group relative overflow-hidden">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-black text-lg">I</div>
                               <span className="font-bold text-gray-900">{t.instaTitle}</span>
                             </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                            <span className="font-mono text-gray-800 font-bold tracking-wider select-all text-sm" dir="ltr">ather@instapay</span>
                            <button type="button" onClick={() => copyToClipboard('ather@instapay', 'insta')} className="text-gray-400 hover:text-[#2EB67D] transition-colors p-1">
                              {copied === 'insta' ? <svg className="w-5 h-5 text-[#2EB67D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                            </button>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-4 hover:border-[#10b981] hover:bg-emerald-50/30 transition-all group relative overflow-hidden">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-black text-lg">V</div>
                               <span className="font-bold text-gray-900">{t.walletTitle}</span>
                             </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                            <span className="font-mono text-gray-800 font-bold tracking-widest select-all text-sm" dir="ltr">01000000000</span>
                            <button type="button" onClick={() => copyToClipboard('01000000000', 'vf')} className="text-gray-400 hover:text-[#2EB67D] transition-colors p-1">
                              {copied === 'vf' ? <svg className="w-5 h-5 text-[#2EB67D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">{t.attach}</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 hover:border-[#2EB67D] transition-all p-8 text-center cursor-pointer group">
                           <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" required />
                           <motion.div whileHover={{ y: -4 }} className="relative z-0 transition-transform">
                             <svg className="w-10 h-10 mx-auto text-gray-400 group-hover:text-[#2EB67D] mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                             <p className="text-sm font-bold text-gray-600 group-hover:text-[#2EB67D]">{t.dropzone}</p>
                             <p className="text-xs text-gray-400 mt-2 font-medium">PNG, JPG (Max 5MB)</p>
                           </motion.div>
                        </div>
                      </div>

                      {/* زر المحافظ باللون الأخضر المتناسق */}
                      <button type="submit" className="w-full bg-[#2EB67D] text-white h-[60px] rounded-2xl font-black text-lg hover:bg-[#249666] transition-all shadow-lg mt-6">
                        {t.walletBtn}
                      </button>
                    </motion.form>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </motion.div>

          {/* ---------------- الجانب الأيمن: الفاتورة التفاعلية ---------------- */}
          <motion.div variants={slideUp} initial="hidden" animate="show" className="w-full lg:w-5/12 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-10 sticky top-32 z-10">
            <h3 className="text-xl font-black text-gray-900 mb-8">{t.summary}</h3>
            
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-2xl font-black uppercase text-gray-900 tracking-tight">{plan} PLAN</p>
                <p className="text-sm text-gray-500 font-bold mt-1">{t.monthly}</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <svg className="w-6 h-6 text-[#2EB67D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </div>

            <form onSubmit={handleApplyPromo} className="mb-8 flex gap-2">
              <input 
                type="text" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} // تأمين ضد التاجات
                placeholder={t.promoPlaceholder} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2EB67D]/20 focus:border-[#2EB67D] transition-all uppercase placeholder-gray-400"
              />
              <button 
                type="submit" 
                className="bg-[#2EB67D] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-[#249666] hover:shadow-md active:scale-95 whitespace-nowrap"
              >
                {t.promoBtn}
              </button>
            </form>
            <div className="space-y-4 text-sm font-bold text-gray-500 mb-8 pb-8 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span>{t.subtotal}</span>
                <span className="text-gray-900 text-base">${basePrice.toFixed(2)}</span>
              </div>
              
              <AnimatePresence>
                {discountAmount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between items-center text-[#2EB67D] overflow-hidden">
                    <span>{t.discountStr}</span>
                    <span className="text-base">-${discountAmount.toFixed(2)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center">
                <span>{t.tax}</span>
                <span className="text-gray-900 text-base">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-50">
                <span className="text-lg font-black text-gray-900">{t.total}</span>
                <motion.span key={finalTotal} initial={{ scale: 1.2, color: "#249666" }} animate={{ scale: 1, color: "#2EB67D" }} className="text-3xl font-black text-[#2EB67D]">
                  ${finalTotal.toFixed(2)}
                </motion.span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
              <div className="bg-white p-2 rounded-xl shadow-sm shrink-0"><svg className="w-5 h-5 text-[#2EB67D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
              <div className="text-xs leading-relaxed">
                <p className="text-gray-900 font-black text-sm mb-1">{t.secure}</p>
                <p className="text-gray-500 font-bold">{t.secureDesc}</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ---------------- OTP Choice Modal ---------------- */}
        <AnimatePresence>
          {step === "otp-choice" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white w-full max-w-[440px] rounded-[2rem] shadow-2xl p-8 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2EB67D]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{t.otpChoiceTitle}</h3>
                <p className="text-sm font-medium text-gray-500 mb-8">{t.otpChoiceDesc}</p>

                <div className="space-y-3">
                  {[
                    { id: 'email', label: t.otpEmail, icon: '📧' },
                    { id: 'sms', label: t.otpSms, icon: '💬' },
                    { id: 'app', label: t.otpApp, icon: '🛡️' }
                  ].map(method => (
                    <button 
                      key={method.id} onClick={handleSelectOtpMethod} disabled={isProcessing}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 border-2 border-transparent hover:border-[#2EB67D] transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-bold text-gray-700 group-hover:text-[#2EB67D] transition-colors">{method.label}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#2EB67D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep("form")} className="mt-8 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors">
                  {t.cancel}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- OTP Input Modal ---------------- */}
        <AnimatePresence>
          {step === "otp" && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white w-full max-w-[440px] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
              >
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 tracking-tight" dir="ltr">3D Secure</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest" dir="ltr">Bank Verification</p>
                    </div>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EB67D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2EB67D]"></span>
                  </span>
                </div>

                <div className="p-8 text-center">
                  <h4 className="text-lg font-black text-gray-900 mb-2">{t.otpTitle}</h4>
                  <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">{t.otpDesc}</p>
                  
                  <div className="flex justify-center gap-2 mb-8" dir="ltr">
                    {otp.map((digit, index) => (
                      <input
                        key={index} 
                        ref={el => inputRefs.current[index] = el}
                        type="text" 
                        maxLength="1" 
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onClick={() => handleOtpClick(index)}
                        className="w-12 h-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-black text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-[#2EB67D]/20 focus:border-[#2EB67D] outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-8 px-1">
                    <p className="font-bold text-gray-500 text-sm">{t.attempts} <span className="text-gray-900 ml-1">{attempts}</span></p>
                    <p className="font-bold text-sm text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {t.timer} <span className={`font-mono text-base ml-1 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`} dir="ltr">{formatTime(timeLeft)}</span>
                    </p>
                  </div>

                  <button 
                    onClick={handleValidateOTP} 
                    disabled={isProcessing || timeLeft === 0 || otp.join('').length < 6}
                    className="w-full h-[54px] bg-gray-900 text-white rounded-xl font-black text-lg hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : t.validateBtn}
                  </button>

                  <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-5 text-center">
                    <button className="text-gray-400 hover:text-gray-900 font-bold text-sm transition-colors">{t.resend}</button>
                    <button onClick={() => setStep("otp-choice")} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">{t.cancel}</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#2EB67D] font-black text-xl"><svg className="animate-spin h-8 w-8" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}