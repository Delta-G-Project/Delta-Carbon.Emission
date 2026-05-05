"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext"; 
import Link from "next/link";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import { Check, X, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/apiClient";

export default function RegisterPage() {
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (e) {
    languageContext = { language: 'ar' }; 
  }

  const { language } = languageContext;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [legalModal, setLegalModal] = useState({ open: false, type: null }); // type: 'privacy' | 'terms'
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState({
    companyName: "",
    employees: "",
    sector: "",
    email: ""
  });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState({ length: false, upper: false, number: false, symbol: false });
  const [isLoading, setIsLoading] = useState(false);
  
  // --- نظام التنبيهات (Toast) ---
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // --- فلاتر الإدخال الصارمة لكل خانة (Strict Validation) ---
  const handleCompanyNameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF0-9\s]/g, '');
    setFormData({ ...formData, companyName: val });
  };

  const handleEmployeesChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, employees: val });
  };

  const handleSectorChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
    setFormData({ ...formData, sector: val });
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setFormData({ ...formData, email: val });
  };

  useEffect(() => {
    setStrength({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const isMatching = password === confirmPassword && confirmPassword !== "";
  const isFormValid = isMatching && Object.values(strength).every(Boolean) && formData.email.includes("@") && formData.companyName.length > 2;

  // --- دالة الفاتش (Backend Ready + Local Storage للتجربة) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    const payload = {
      companyName: formData.companyName,
      employees: Number(formData.employees),
      sector: formData.sector,
      phone: phone,
      email: formData.email,
      password: password
    };

    try {
      // 2. إرسال البيانات للباك إند عبر apiClient 
      const response = await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // apiClient will throw an error or return { success: false } for network errors, but we already catch it
      if (response && response.success !== false) {
        // إشعار نجاح بدلاً من التوجيه المباشر
        showToast(isRtl ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!", "success");
        
        setTimeout(() => {
          window.location.href = "/login?registered=true";
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(isRtl ? "حدث خطأ أثناء التسجيل" : "Registration error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 text-black bg-white placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#10b981]/20 focus:border-[#10b981] outline-none transition-all duration-300 shadow-sm font-bold text-sm md:text-base";
  const focusAnimation = { scale: 1.01, borderColor: "#10b981" };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 md:px-6 font-cairo overflow-x-hidden relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* مكون التنبيه (Toast) */}
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

      <button 
        onClick={() => window.history.back()}
        className={`absolute top-4 md:top-8 ${isRtl ? 'left-4 md:left-12' : 'right-4 md:right-12'} flex items-center gap-2 text-gray-400 hover:text-[#10b981] transition-all font-bold group z-50`}
      >
        <span className="text-xs md:text-sm">{isRtl ? 'السابق' : 'Back'}</span>
        <span className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform`}>
          {isRtl ? '←' : '→'}
        </span>
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-green-900/10 border border-white my-8 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isRtl ? 'إنشاء حساب جديد' : 'Create New Account'}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {isRtl ? 'سجل بيانات شركتك وابدأ رحلة الاستدامة الآن' : 'Register your company and start sustainability now'}
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleRegister}>
          <div className="space-y-5">
            <h2 className="text-center font-black text-gray-800 text-lg tracking-tight">
              {isRtl ? 'معلومات الشركة' : 'Company Information'}
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'اسم الشركة' : 'Company Name'}</label>
              <motion.input 
                whileFocus={focusAnimation} 
                type="text" 
                value={formData.companyName}
                onChange={handleCompanyNameChange}
                placeholder={isRtl ? 'ادخل اسم شركتك' : 'Enter company name'} 
                className={inputStyle} 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'عدد الموظفين' : 'Employees'}</label>
                <motion.input 
                  whileFocus={focusAnimation} 
                  type="text" 
                  value={formData.employees}
                  onChange={handleEmployeesChange}
                  placeholder="0" 
                  className={inputStyle} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'مجال العمل' : 'Sector'}</label>
                <motion.input 
                  whileFocus={focusAnimation} 
                  type="text" 
                  value={formData.sector}
                  onChange={handleSectorChange}
                  placeholder={isRtl ? 'مثال: تصنيع' : 'Ex: Industry'} 
                  className={inputStyle} 
                />
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'رقم الهاتف الدولي' : 'International Phone'}</label>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="phone-container-custom group"
                dir="ltr"
              >
                <PhoneInput
                  placeholder={isRtl ? 'رقم الهاتف' : 'Phone number'}
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="EG"
                  className={inputStyle + " flex items-center group-hover:border-[#10b981]"}
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-5 pt-4 border-t border-gray-50">
            <h2 className="text-center font-black text-gray-800 text-lg pt-2">
              {isRtl ? 'بيانات الاعتماد' : 'Credentials'}
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'البريد الإلكتروني للعمل' : 'Work Email'}</label>
              <motion.input 
                whileFocus={focusAnimation} 
                type="email" 
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="name@company.com" 
                className={inputStyle} 
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <motion.input 
                  whileFocus={focusAnimation} 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" 
                  className={inputStyle} 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? 'left-4' : 'right-4'}`}
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className={`text-[10px] font-bold uppercase ${Object.values(strength).filter(Boolean).length > 2 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isRtl ? (Object.values(strength).filter(Boolean).length > 2 ? 'القوة: جيدة' : 'القوة: ضعيفة') : (Object.values(strength).filter(Boolean).length > 2 ? 'Strength: Good' : 'Strength: Weak')}
                </span>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(Object.values(strength).filter(Boolean).length / 4) * 100}%` }}
                    className={`h-full ${Object.values(strength).filter(Boolean).length > 2 ? 'bg-[#10b981]' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold text-gray-400">
                <div className={`flex items-center gap-1 ${strength.upper ? 'text-emerald-600' : ''}`}>{strength.upper ? '✅' : '❌'} {isRtl ? 'حرف كبير' : 'Uppercase'}</div>
                <div className={`flex items-center gap-1 ${strength.length ? 'text-emerald-600' : ''}`}>{strength.length ? '✅' : '❌'} {isRtl ? '8 أحرف' : '8 Chars'}</div>
                <div className={`flex items-center gap-1 ${strength.symbol ? 'text-emerald-600' : ''}`}>{strength.symbol ? '✅' : '❌'} {isRtl ? 'رمز خاص' : 'One symbol'}</div>
                <div className={`flex items-center gap-1 ${strength.number ? 'text-emerald-600' : ''}`}>{strength.number ? '✅' : '❌'} {isRtl ? 'رقم واحد' : 'One number'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mx-1">{isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="relative">
                <motion.input 
                  whileFocus={focusAnimation} 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********" 
                  className={`${inputStyle} ${confirmPassword !== "" && (isMatching ? "border-emerald-500 bg-emerald-50/10" : "border-rose-400 bg-rose-50/10")}`} 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${isRtl ? 'left-4' : 'right-4'}`}
                >
                  {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {confirmPassword !== "" && !isMatching && (
                <p className="text-[10px] text-rose-500 font-bold px-2 flex items-center gap-1">
                  <ShieldAlert size={12}/> {isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          <div className="pt-7 space-y-6"> 
            <div className="flex items-start gap-2 px-1">
              <input 
                type="checkbox" 
                required 
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#10b981] accent-[#10b981] cursor-pointer" 
              />
              <p className="text-[11px] text-gray-500 font-medium leading-tight">
                {isRtl ? (
                  <>أوافق على <button type="button" onClick={() => setLegalModal({ open: true, type: 'privacy' })} className="text-[#10b981] font-bold hover:underline transition-all">سياسة الخصوصية</button> و <button type="button" onClick={() => setLegalModal({ open: true, type: 'terms' })} className="text-[#10b981] font-bold hover:underline transition-all">شروط الخدمة</button></>
                ) : (
                  <>I agree to <button type="button" onClick={() => setLegalModal({ open: true, type: 'privacy' })} className="text-[#10b981] font-bold hover:underline transition-all">Privacy Policy</button> &amp; <button type="button" onClick={() => setLegalModal({ open: true, type: 'terms' })} className="text-[#10b981] font-bold hover:underline transition-all">Terms of Service</button></>
                )}
              </p>
            </div> 

            <div className="mt-10">
              <motion.button 
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 rounded-xl font-black text-lg shadow-lg transition-all mb-4 flex items-center justify-center gap-2
                  ${isFormValid && !isLoading ? 'bg-[#10b981] text-white shadow-green-100 hover:bg-[#0da371]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (isRtl ? 'إنشاء حساب' : 'Create Account')}
              </motion.button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <Link href="/login" className="text-sm text-[#10b981] font-bold hover:underline">
            {isRtl ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Login'}
          </Link>
        </div>
      </motion.div>

      {/* --- Legal Modal --- */}
      <AnimatePresence>
        {legalModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setLegalModal({ open: false, type: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                <h2 className="text-lg font-black text-slate-800">
                  {legalModal.type === 'privacy'
                    ? (isRtl ? 'سياسة الخصوصية' : 'Privacy Policy')
                    : (isRtl ? 'شروط الخدمة' : 'Terms of Service')}
                </h2>
                <button
                  onClick={() => setLegalModal({ open: false, type: null })}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body — scrollable */}
              <div className="overflow-y-auto flex-1 px-8 py-6 text-sm text-gray-600 leading-relaxed space-y-4">
                {legalModal.type === 'privacy' ? (
                  isRtl ? (
                    <>
                      <p className="font-bold text-slate-700">1. جمع البيانات</p>
                      <p>نلتزم بحماية بياناتك الصناعية. نجمع فقط بيانات استهلاك الطاقة والوقود اللازمة لحساب بصمتك الكربونية بدقة. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة.</p>
                      <p className="font-bold text-slate-700">2. أمن المعلومات</p>
                      <p>تُشفَّر جميع بياناتك باستخدام تقنية AES-256 العالمية، مما يضمن خصوصية تامة لتقارير شركتك وبياناتها الحساسة.</p>
                      <p className="font-bold text-slate-700">3. حقوق المستخدم</p>
                      <p>يحق لك في أي وقت طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالكامل من أنظمتنا عبر التواصل مع فريق الدعم.</p>
                      <p className="font-bold text-slate-700">4. ملفات تعريف الارتباط</p>
                      <p>نستخدم ملفات الكوكيز الآمنة (HttpOnly) لإدارة جلسات المستخدم فقط، ولا نستخدمها لأغراض تتبع إعلانية.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-700">1. Data Collection</p>
                      <p>We are committed to protecting your industrial data. We collect only the energy and fuel consumption data necessary to accurately calculate your carbon footprint. We do not share your data with any third party without your explicit consent.</p>
                      <p className="font-bold text-slate-700">2. Data Security</p>
                      <p>All your data is encrypted using the global AES-256 standard, ensuring complete privacy for your company reports and sensitive data.</p>
                      <p className="font-bold text-slate-700">3. User Rights</p>
                      <p>You have the right at any time to request access to, modification of, or complete deletion of your data from our systems by contacting our support team.</p>
                      <p className="font-bold text-slate-700">4. Cookies</p>
                      <p>We use secure HttpOnly cookies solely for session management. We do not use cookies for advertising or tracking purposes.</p>
                    </>
                  )
                ) : (
                  isRtl ? (
                    <>
                      <p className="font-bold text-slate-700">1. قبول الشروط</p>
                      <p>باستخدامك لمنصة Delta Carbon Emission، فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل إنشاء حسابك.</p>
                      <p className="font-bold text-slate-700">2. الاستخدام المقبول</p>
                      <p>يُلتزم باستخدام المنصة للأغراض القانونية المشروعة المتعلقة بقياس وإدارة الانبعاثات الكربونية. يُحظر استخدامها لأي أغراض تنتهك القوانين المعمول بها.</p>
                      <p className="font-bold text-slate-700">3. دقة البيانات</p>
                      <p>أنت مسؤول عن دقة البيانات التي تدخلها في المنصة. لا تتحمل Delta Carbon Emission أي مسؤولية عن نتائج مبنية على بيانات غير صحيحة.</p>
                      <p className="font-bold text-slate-700">4. إنهاء الخدمة</p>
                      <p>نحتفظ بالحق في تعليق أو إنهاء حسابك في حال انتهاك هذه الشروط، مع إشعار مسبق قدر الإمكان.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-700">1. Acceptance of Terms</p>
                      <p>By using the Delta Carbon Emission platform, you agree to be bound by these terms and conditions. Please read them carefully before creating your account.</p>
                      <p className="font-bold text-slate-700">2. Acceptable Use</p>
                      <p>You agree to use the platform only for lawful purposes related to measuring and managing carbon emissions. Use for any purpose that violates applicable laws is strictly prohibited.</p>
                      <p className="font-bold text-slate-700">3. Data Accuracy</p>
                      <p>You are responsible for the accuracy of the data you enter into the platform. Delta Carbon Emission bears no responsibility for results based on incorrect data.</p>
                      <p className="font-bold text-slate-700">4. Termination</p>
                      <p>We reserve the right to suspend or terminate your account in case of violation of these terms, with prior notice where possible.</p>
                    </>
                  )
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-gray-100">
                <button
                  onClick={() => setLegalModal({ open: false, type: null })}
                  className="w-full py-3 bg-[#10b981] text-white font-bold rounded-2xl hover:bg-[#059669] transition-all text-sm"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
