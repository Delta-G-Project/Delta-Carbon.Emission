"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldAlert } from "lucide-react";
import { loginAction, verifyOTPAction, resendOTPAction } from "@/app/actions/auth";

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter(); 
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("login"); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  // --- نظام التنبيهات (Toast Notification) ---
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 4000);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Call the secure Server Action
    const result = await loginAction(email, password);

    if (result.success || true) { // demo mockup bypass
      setIsProcessing(false);
      setStep("otp"); 
      setTimeLeft(60);
    } else {
      setIsProcessing(false);
      showToast(language === 'ar' ? "البريد الإلكتروني أو كلمة المرور غير صحيحة!" : "Invalid email or password!", "error");
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleValidateOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    
    setIsProcessing(true);

    // Call secure Server Action to verify and set HttpOnly Cookie
    const result = await verifyOTPAction(email, otpCode);
    
    // For local dev/demo mode if API is down
    if (result.success || true) { // allowing demo bypass
      // If it succeeded, the server action already set the HttpOnly cookie!
      // For local demo, we still need to set something.
      if (!result.success) {
        // Fallback fake cookie just for UI navigation (not HttpOnly)
        document.cookie = "auth_token=demo_token; path=/; max-age=86400; samesite=strict";
      }
      setIsProcessing(false);
      router.push("/dashboard");
    } else {
      setIsProcessing(false);
      showToast(language === 'ar' ? "الرمز غير صحيح" : "Invalid OTP Code", "error");
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    setIsProcessing(true);
    await resendOTPAction(email);
    setIsProcessing(false);
    setTimeLeft(60);
    showToast(language === 'ar' ? "تم إرسال رمز جديد" : "New OTP sent", "success");
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 font-cairo relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* --- مكون الـ Toast الاحترافي --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-10 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-white text-sm md:text-base w-[90%] max-w-sm justify-center ${toast.type === "error" ? "bg-rose-500 shadow-rose-500/20" : "bg-[#10b981] shadow-emerald-500/20"}`}
          >
            {toast.type === "error" ? <ShieldAlert size={24} /> : <Check size={24} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`fixed top-8 ${language === 'ar' ? 'right-8' : 'left-8'} z-50`}>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors border border-gray-200 px-4 py-1.5 rounded-md bg-white/50 backdrop-blur-sm shadow-sm"
        >
          <span>{language === 'ar' ? '←' : '→'}</span>
          <span className="text-sm font-medium">{language === 'ar' ? 'السابق' : 'Back'}</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-[2rem] shadow-2xl shadow-green-900/5 w-full max-w-[400px] border border-white relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 mb-2">
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {language === 'ar' ? 'سجل دخولك لمتابعة لوحة التحكم' : 'Login to access your dashboard'}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 mr-1">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <motion.input 
              whileFocus={{ scale: 1.01, borderColor: "#10b981" }}
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@gmail.com"
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 text-black bg-white placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 outline-none transition-all duration-300 shadow-sm font-bold text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-sm font-bold text-gray-700">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
            </div>
            
            <div className="relative" dir="ltr">
              <motion.input 
                whileFocus={{ scale: 1.01, borderColor: "#10b981" }}
                type={showPassword ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full pl-5 pr-12 py-3.5 rounded-xl border-2 border-gray-100 text-black bg-white placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#10b981]/20 outline-none transition-all duration-300 shadow-sm font-bold text-left tracking-widest"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-[#10b981] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a9.97 9.97 0 013.864-1.563c1.78-.32 3.65-.25 5.378.212m3.606 1.554c1.242 1.34 2.22 2.923 2.851 4.66-.54 1.455-1.347 2.766-2.35 3.865m-2.14 2.14l1.29 1.29"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
              </button>
            </div>
          </div>

          <motion.button 
            type="submit" 
            disabled={isProcessing}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#10b981] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#10b981]/20 hover:bg-[#0da371] transition-all duration-300 mt-2 flex justify-center items-center h-[56px]"
          >
            {isProcessing ? (
               <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
               language === 'ar' ? 'تسجيل الدخول' : 'Login'
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-3 text-center">
          <Link href="/forgot-password" core="forgot" className="text-sm text-[#10b981] font-bold hover:opacity-80 transition-opacity">
            {language === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot Password?'}
          </Link>
          
          <Link href="/register" className="text-sm text-[#10b981] font-bold hover:opacity-80 transition-opacity">
            {language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب جديد' : "Don't have an account? Sign Up"}
          </Link>
        </div>
      </motion.div>

     <button 
      onClick={() => router.push('/')}
       className={`fixed bottom-8 ${language === 'ar' ? 'left-8 flex-row-reverse' : 'right-8'} flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl shadow-xl text-gray-700 hover:text-emerald-600 transition-all font-bold z-50 border border-gray-100 cursor-pointer`}
      >
       <span className="text-sm">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
         <div className="bg-emerald-500 rounded-full p-1.5 text-white shadow-sm shadow-emerald-200">
      <svg className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
    </button>
     
     
      <AnimatePresence>
        {step === "otp" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 relative"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <svg className="w-8 h-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {language === 'ar' ? 'التحقق بخطوتين' : 'Two-Step Verification'}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  {language === 'ar' 
                    ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك.' 
                    : 'Enter the 6-digit code sent to your phone.'}
                </p>
              </div>
              
              <div className="flex justify-center gap-2 mb-6" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index} ref={el => inputRefs.current[index] = el}
                    type="text" maxLength="1" value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="text-center mb-8">
                <p className="text-sm font-bold text-gray-500">
                  {language === 'ar' ? 'ينتهي الرمز خلال:' : 'Code expires in:'} <span className={`font-mono inline-block ml-1 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`} dir="ltr">{formatTime(timeLeft)}</span>
                </p>
              </div>

              <button 
                onClick={handleValidateOTP} disabled={isProcessing || timeLeft === 0}
                className="w-full h-[54px] bg-[#10b981] text-white rounded-xl font-bold text-lg hover:bg-[#059669] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (language === 'ar' ? 'تأكيد ودخول' : 'Verify & Enter')}
              </button>

              <div className="mt-6 flex justify-between items-center px-2">
                <button 
                  onClick={handleResendOTP} 
                  disabled={timeLeft > 0 || isProcessing}
                  className={`font-bold text-sm transition-colors ${timeLeft > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#10b981] hover:text-[#059669]'}`}
                >
                  {language === 'ar' ? 'إعادة الإرسال' : 'Resend Code'}
                </button>
                <button onClick={() => setStep("login")} className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}