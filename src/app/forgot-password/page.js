
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext"; // تم تصحيح المسار
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  // --- 🛡️ منطق الحماية (Cybersecurity Logic) ---
  const isGibberish = (text) => {
    const repeatedPattern = /(.)\1{3,}/;
    return repeatedPattern.test(text.split('@')[0]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Sanitization: منع الرموز والحروف العربي في الإيميل
    const sanitizedEmail = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmail(sanitizedEmail);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // دي اللي بتخلي الصفحة م تعملش Refresh وتشتغل "أوتوماتيك"
    
    
    if (isGibberish(email)) {
      setError(isAr ? "برجاء إدخال بريد إلكتروني حقيقي" : "Please enter a valid email");
      return;
    }

    setIsProcessing(true);

    // محاكاة الإرسال
    setTimeout(() => {
      setIsProcessing(false);
      setIsSent(true); // هنا بنغير الحالة عشان تظهر رسالة النجاح
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 font-cairo" dir={isAr ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/5 w-full max-w-[450px] border border-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 mb-2">
            {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {isAr ? 'أدخل عنوان بريدك الإلكتروني لتتلقى رابط إعادة تعيين كلمة المرور' 
                 : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form 
              key="form" onSubmit={handleSubmit} className="space-y-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 px-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input 
                  type="email" required value={email} 
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-300 font-bold text-left ${error ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-[#10b981] focus:bg-white'}`}
                  dir="ltr"
                />
                {error && <p className="text-red-500 text-[10px] font-bold px-2">{error}</p>}
              </div>

              <button 
                type="submit" disabled={isProcessing}
                className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-200/50 hover:bg-[#0da371] transition-all active:scale-95 flex justify-center items-center h-[60px]"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (isAr ? 'إرسال رابط الإعادة' : 'Send Reset Link')}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <svg className="w-10 h-10 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="text-slate-600 font-bold leading-relaxed px-4">
                {isAr 
                  ? 'إذا كان هذا البريد مسجلاً لدينا، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً. يرجى التحقق من صندوق الوارد.' 
                  : 'If this email is registered, you will receive a reset link shortly. Please check your inbox.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center pt-6 border-t border-gray-50">
          <Link href="/login" className="text-sm text-[#10b981] font-black hover:opacity-80 transition-opacity">
            {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}