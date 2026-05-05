"use client";
import { useState } from 'react';
import Header from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useLanguage } from '@/contexts/LanguageContext';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function ContactPage() {
  const { language, locale } = useLanguage();
  const activeLang = language || locale || 'ar';
  const isAr = activeLang === 'ar';

  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', company: '', message: '' 
  });
  const [errors, setErrors] = useState({}); // ضيفنا دي للحماية
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 🛡️ دالة كشف "الهبد" (Anti-Gibberish) ---
  const isGibberish = (text) => {
    const repeatedPattern = /(.)\1{3,}/; 
    return repeatedPattern.test(text);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // الحماية اللي إنت كنت عاملها (Sanitization)
    let sanitizedValue = value;
    if (name === 'name' || name === 'company') {
      sanitizedValue = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, '');
    } else if (name === 'email') {
      sanitizedValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    } else if (name === 'message') {
      sanitizedValue = value.replace(/[<>{}[\\]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // فحص الجودة قبل الإرسال
    let newErrors = {};
    if (isGibberish(formData.name)) {
      newErrors.name = isAr ? 'برجاء إدخال اسم حقيقي' : 'Invalid name';
    }
    if (isGibberish(formData.company)) {
      newErrors.company = isAr ? 'اسم الشركة غير منطقي' : 'Invalid company name';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // وقف الإرسال لو فيه هبد
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen bg-white text-slate-800">
        
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-col items-center text-center">
            <span className="px-5 py-2 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-black mb-4 tracking-[0.2em] animate-pulse">
              {isAr ? 'تواصل مباشر' : 'Get in Touch'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h1>
            <p className="max-w-2xl text-slate-500 text-lg font-medium leading-relaxed">
              {isAr ? 'سواء كان لديك استفسار تقني أو ترغب في بدء رحلة الاستدامة، فريقنا جاهز للرد عليك.' 
                   : 'Whether you have a technical query or want to start your sustainability journey, our team is ready to respond.'}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* كارت المعلومات - رجعتهولك زي ما هو بالظبط */}
            <div className="lg:col-span-4 space-y-6">
  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-[#10b981]/10 shadow-sm relative overflow-hidden">
    <h3 className="text-2xl font-black text-slate-900 mb-8 px-4">
      {isAr ? 'بيانات التواصل' : 'Contact Info'}
    </h3>

    <div className="space-y-4">
      {/* البريد الإلكتروني */}
      <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
        <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
          <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]">info@carbon-emission.com</p>
        </div>
      </div>

      {/* رقم الهاتف */}
      <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
        <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
          <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]" dir="ltr">+20 100 123 4567</p>
        </div>
      </div>

      {/* الموقع الجغرافي - التعديل الجديد هنا */}
      <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
        <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">
            {isAr ? 'المقر الرئيسي' : 'Headquarters'}
          </p>
         <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981] text-xs leading-snug">
       {isAr 
    ? 'المنصورة - طلخا - طريق جمصة الدولي - معهد الدلتا' 
    : 'Mansoura - Talkha - International Gamasa Road - Delta Institute'}
       </p>
        </div>
      </div>
    </div>
  </div>
</div>
            {/* فورم التواصل */}
            <div className="lg:col-span-8">
              <div className="bg-gray-50/50 p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm relative">
                
                {isSuccess && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-[#10b981]/20">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">{isAr ? 'تم الإرسال بنجاح' : 'Sent Successfully'}</h2>
                    <p className="text-slate-500 font-bold mt-2">{isAr ? 'سنقوم بالرد عليك في أقرب وقت' : 'We will get back to you soon'}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* الاسم */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الاسم' : 'Name'}</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange} required 
                      className={`w-full px-6 py-4 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm ${errors.name ? 'border-red-500' : 'border-transparent focus:border-[#10b981]'}`}
                      placeholder={isAr ?"الاسم كامل " : "Full Name"}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold px-1">{errors.name}</p>}
                  </div>

                  {/* اسم الشركة */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'اسم الشركة' : 'Company'}</label>
                    <input 
                      type="text" name="company" value={formData.company} onChange={handleChange} required 
                      className={`w-full px-6 py-4 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm ${errors.company ? 'border-red-500' : 'border-transparent focus:border-[#10b981]'}`}
                      placeholder={isAr ? "اسم المؤسسة" : "Company Name"}
                    />
                    {errors.company && <p className="text-red-500 text-[10px] font-bold px-1">{errors.company}</p>}
                  </div>

                  {/* الهاتف */}
                  <div className="space-y-3 custom-phone-wrapper">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                    <PhoneInput
                      defaultCountry="eg"
                      value={formData.phone}
                      onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                      className="w-full"
                    />
                  </div>

                  {/* الإيميل */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange} required 
                      className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
                      placeholder="example@mail.com" dir="ltr"
                    />
                  </div>

                  {/* الرسالة */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الرسالة' : 'Message'}</label>
                    <textarea 
                      name="message" value={formData.message} onChange={handleChange} required rows="4" 
                      className="w-full px-6 py-5 bg-white border-2 border-transparent rounded-[2rem] outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm resize-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
                      placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "Describe your request..."}
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 pt-4">
                     <button type="submit" disabled={isSubmitting} className="group relative w-full md:w-max px-16 py-5 bg-[#10b981] hover:bg-[#0da371] text-white font-black rounded-2xl transition-all duration-500 shadow-xl shadow-[#10b981]/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-70">
                       {isSubmitting ? (
                         <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                       ) : (
                         <>
                           <span>{isAr ? 'إرسال طلب الاستشارة' : 'Send Request'}</span>
                           <svg className={`w-6 h-6 transition-transform duration-500 group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                         </>
                       )}
                     </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
      <ScrollToTop />
      <Footer />

      <style jsx global>{`
        .custom-phone-wrapper .react-international-phone-input-container {
          width: 100% !important;
          border: 2px solid transparent !important;
          background-color: white !important;
          border-radius: 1rem !important;
          padding: 4px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .custom-phone-wrapper .react-international-phone-input-container:focus-within {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05) !important;
        }
        .custom-phone-wrapper .react-international-phone-input {
          width: 100% !important;
          border: none !important;
          font-weight: 700 !important;
          font-family: inherit !important;
          height: 50px !important;
        }
        .custom-phone-wrapper .react-international-phone-country-selector-button {
          border: none !important;
          background: transparent !important;
        }
      `}</style>
    </>
  );  
}
// "use client";
// import { useState } from 'react';
// import Header from '@/components/LandingHeader';
// import Footer from '@/components/Footer';
// import ScrollToTop from '@/components/ScrollToTop';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { PhoneInput } from 'react-international-phone';
// import 'react-international-phone/style.css';

// export default function ContactPage() {
//   const { language } = useLanguage();
//   const isAr = language === 'ar';

//   const [formData, setFormData] = useState({ 
//     name: '', email: '', phone: '', company: '', message: '' 
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   // --- منطق الحماية والتحقق من البيانات (Security Validation) ---
//   const handleChange = (e) => {
//     const { name, value } = e.target;

   
//     if (name === 'name' || name === 'company') {
//       // يمنع الأرقام والرموز الخاصة تماماً
//       const sanitizedValue = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, '');
//       setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
//       return;
//     }

//     // 2. حماية خانة الإيميل (حروف لاتينية وأرقام وعلامات الإيميل فقط)
//     if (name === 'email') {
//       // يمنع الحروف العربية والرموز الغريبة
//       const sanitizedEmail = value.replace(/[^a-zA-Z0-9@._-]/g, '');
//       setFormData(prev => ({ ...prev, [name]: sanitizedEmail }));
//       return;
//     }

//     // 3. حماية خانة الرسالة (منع الأقواس والرموز البرمجية الخطيرة)
//     if (name === 'message') {
//       // يمنع < > { } [ ] لمنع حقن أكواد Script أو HTML
//       const sanitizedMessage = value.replace(/[<>{}[\\]/g, '');
//       setFormData(prev => ({ ...prev, [name]: sanitizedMessage }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // محاكاة إرسال البيانات للسيرفر
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSuccess(true);
//       setFormData({ name: '', email: '', phone: '', company: '', message: '' });
//       setTimeout(() => setIsSuccess(false), 5000);
//     }, 1500);
//   };

//   return (
//     <>
//       <Header />
//       <main className="pt-32 pb-24 min-h-screen bg-white font-cairo text-slate-800" dir={isAr ? 'rtl' : 'ltr'}>
        
//         {/* العنوان الرئيسي */}
//         <section className="max-w-7xl mx-auto px-6 mb-16">
//           <div className="flex flex-col items-center text-center">
//             <span className="px-5 py-2 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-black mb-4 tracking-[0.2em] animate-pulse">
//               {isAr ? 'تواصل مباشر' : 'Get in Touch'}
//             </span>
//             <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
//               {isAr ? 'تواصل معنا' : 'Contact Us'}
//             </h1>
//             <p className="max-w-2xl text-slate-500 text-lg font-medium leading-relaxed">
//               {isAr ? 'سواء كان لديك استفسار تقني أو ترغب في بدء رحلة الاستدامة، فريقنا جاهز للرد عليك.' 
//                    : 'Whether you have a technical query or want to start your sustainability journey, our team is ready to respond.'}
//             </p>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
//             {/* كارت المعلومات */}
//             <div className="lg:col-span-4 space-y-6">
//               <div className="bg-white p-6 rounded-[2.5rem] border-2 border-[#10b981]/10 shadow-sm relative overflow-hidden">
//                 <h3 className="text-2xl font-black text-slate-900 mb-8 px-4">{isAr ? 'بيانات التواصل' : 'Contact Info'}</h3>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
//                     <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
//                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
//                       <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]">info@carbon-emission.com</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
//                     <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
//                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
//                       <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]" dir="ltr">+20 100 123 4567</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* فورم التواصل */}
//             <div className="lg:col-span-8">
//               <div className="bg-gray-50/50 p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                
//                 {isSuccess && (
//                   <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-500">
//                     <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-[#10b981]/20">
//                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
//                     </div>
//                     <h2 className="text-2xl font-black text-slate-900">{isAr ? 'تم الإرسال بنجاح' : 'Sent Successfully'}</h2>
//                     <p className="text-slate-500 font-bold mt-2">{isAr ? 'سنقوم بالرد عليك في أقرب وقت' : 'We will get back to you soon'}</p>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
//                   {/* الاسم */}
//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الاسم' : 'Name'}</label>
//                     <input 
//                       type="text" name="name" value={formData.name} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ?"الاسم كامل " : "Full Name"}
//                     />
//                   </div>

//                   {/* اسم الشركة */}
//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'اسم الشركة' : 'Company'}</label>
//                     <input 
//                       type="text" name="company" value={formData.company} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ? "اسم المؤسسة" : "Company Name"}
//                     />
//                   </div>

//                   {/* الهاتف */}
//                   <div className="space-y-3 custom-phone-wrapper">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
//                     <PhoneInput
//                       defaultCountry="eg"
//                       value={formData.phone}
//                       onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
//                       className="w-full"
//                     />
//                   </div>

//                   {/* الإيميل */}
//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
//                     <input 
//                       type="email" name="email" value={formData.email} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder="example@mail.com" dir="ltr"
//                     />
//                   </div>

//                   {/* الرسالة */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الرسالة' : 'Message'}</label>
//                     <textarea 
//                       name="message" value={formData.message} onChange={handleChange} required rows="4" 
//                       className="w-full px-6 py-5 bg-white border-2 border-transparent rounded-[2rem] outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm resize-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "Describe your request..."}
//                     ></textarea>
//                   </div>

//                   <div className="md:col-span-2 pt-4">
//                      <button type="submit" disabled={isSubmitting} className="group relative w-full md:w-max px-16 py-5 bg-[#10b981] hover:bg-[#0da371] text-white font-black rounded-2xl transition-all duration-500 shadow-xl shadow-[#10b981]/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-70">
//                        {isSubmitting ? (
//                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
//                        ) : (
//                          <>
//                            <span>{isAr ? 'إرسال طلب الاستشارة' : 'Send Request'}</span>
//                            <svg className={`w-6 h-6 transition-transform duration-500 group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
//                          </>
//                        )}
//                      </button>
//                   </div>
//                 </form>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//       <ScrollToTop />
//       <Footer />

//       <style jsx global>{`
//         .custom-phone-wrapper .react-international-phone-input-container {
//           width: 100% !important;
//           border: 2px solid transparent !important;
//           background-color: white !important;
//           border-radius: 1rem !important;
//           padding: 4px !important;
//           box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
//           transition: all 0.3s ease;
//         }
//         .custom-phone-wrapper .react-international-phone-input-container:focus-within {
//           border-color: #10b981 !important;
//           box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05) !important;
//         }
//         .custom-phone-wrapper .react-international-phone-input {
//           width: 100% !important;
//           border: none !important;
//           font-weight: 700 !important;
//           font-family: inherit !important;
//           height: 50px !important;
//         }
//         .custom-phone-wrapper .react-international-phone-country-selector-button {
//           border: none !important;
//           background: transparent !important;
//         }
//       `}</style>
//     </>
//   );
// }

// "use client";
// import { useState } from 'react';
// import Header from '@/components/LandingHeader';
// import Footer from '@/components/Footer';
// import ScrollToTop from '@/components/ScrollToTop';
// import { useLanguage } from '.@/contexts/LanguageContext';
// import { PhoneInput } from 'react-international-phone';
// import 'react-international-phone/style.css';

// export default function ContactPage() {
//   const { language } = useLanguage();
//   const isAr = language === 'ar';

//   const [formData, setFormData] = useState({ 
//     name: '', email: '', phone: '', company: '', message: '' 
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'email') {
//       const latinOnly = value.replace(/[\u0600-\u06FF]/g, '');
//       setFormData(prev => ({ ...prev, [name]: latinOnly }));
//       return;
//     }
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSuccess(true);
//       setFormData({ name: '', email: '', phone: '', company: '', message: '' });
//       setTimeout(() => setIsSuccess(false), 5000);
//     }, 1500);
//   };

//   return (
//     <>
//       <Header />
//       <main className="pt-32 pb-24 min-h-screen bg-white font-cairo text-slate-800" dir={isAr ? 'rtl' : 'ltr'}>
        
//         {/* العنوان الرئيسي  */}
//         <section className="max-w-7xl mx-auto px-6 mb-16">
//             <div className="flex flex-col items-center text-center">
//                 <span className="px-5 py-2 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-black mb-4 tracking-[0.2em] animate-pulse">
//                     {isAr ? 'تواصل مباشر' : 'Get in Touch'}
//                 </span>
//                 <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
//                     {isAr ? 'تواصل معنا' : 'Contact Us'}
//                 </h1>
//                 <p className="max-w-2xl text-slate-500 text-lg font-medium leading-relaxed">
//                     {isAr ? 'سواء كان لديك استفسار تقني أو ترغب في بدء رحلة الاستدامة، فريقنا جاهز للرد عليك.' 
//                          : 'Whether you have a technical query or want to start your sustainability journey, our team is ready to respond.'}
//                 </p>
//             </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
//             {/* كارت المعلومات - مع تأثير الهوفر الملون */}
//             <div className="lg:col-span-4 space-y-6">
//               <div className="bg-white p-6 rounded-[2.5rem] border-2 border-[#10b981]/10 shadow-sm relative overflow-hidden">
//                 <h3 className="text-2xl font-black text-slate-900 mb-8 px-4">{isAr ? 'بيانات التواصل' : 'Contact Info'}</h3>
                
//                 <div className="space-y-4">
//                   {/* البريد - تأثير لون عند الهوفر */}
//                   <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
//                     <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
//                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                     </div>
//                     <div>
//                         <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
//                         <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]">info@carbon-emission.com</p>
//                     </div>
//                   </div>

//                   {/* الهاتف - تأثير لون عند الهوفر */}
//                   <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
//                     <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
//                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
//                     </div>
//                     <div>
//                         <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
//                         <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]" dir="ltr">+20 100 123 4567</p>
//                     </div>
//                   </div>

//                {/* العنوان */}
//                   <div className="flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group cursor-pointer hover:bg-[#10b981]/5 active:scale-95">
//                     <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:rotate-12 shadow-sm">
//                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
//                     </div>
//                     <div>
//                          <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
//                         <p className="font-bold text-slate-700 transition-colors group-hover:text-[#10b981]">
//                        {isAr ? 'المنصورة، طلخا، أول طريق المنصورة' : 'Mansoura, Talkha, First of Mansoura Rd'}
//                            </p>

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* فورم التواصل */}
//             <div className="lg:col-span-8">
//               <div className="bg-gray-50/50 p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm relative">
                
//                 {isSuccess && (
//                   <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-500">
//                     <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-[#10b981]/20">
//                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
//                     </div>
//                     <h2 className="text-2xl font-black text-slate-900">{isAr ? 'تم الإرسال بنجاح' : 'Sent Successfully'}</h2>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
//                   {/* السطر الأول: الاسم وبجانبه اسم الشركة */}
//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الاسم' : 'Name'}</label>
//                     <input 
//                       type="text" name="name" value={formData.name} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ?"الاسم كامل " : "Full Name"}
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'اسم الشركة' : 'Company'}</label>
//                     <input 
//                       type="text" name="company" value={formData.company} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ? "اسم المؤسسة" : "Company Name"}
//                     />
//                   </div>

//                   {/* السطر الثاني: الفون وبجانبه الإيميل */}
//                   <div className="space-y-3 custom-phone-wrapper">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
//                     <PhoneInput
//                       defaultCountry="eg"
//                       value={formData.phone}
//                       onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
//                     <input 
//                       type="email" name="email" value={formData.email} onChange={handleChange} required 
//                       className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder="example@mail.com" dir="ltr"
//                     />
//                   </div>

//                   {/* الرسالة */}
//                   <div className="md:col-span-2 space-y-3">
//                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? 'الرسالة' : 'Message'}</label>
//                     <textarea 
//                       name="message" value={formData.message} onChange={handleChange} required rows="4" 
//                       className="w-full px-6 py-5 bg-white border-2 border-transparent rounded-[2rem] outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm resize-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/5"
//                       placeholder={isAr ? "كيف يمكننا مساعدتك؟" : "Describe your request..."}
//                     ></textarea>
//                   </div>

//                   <div className="md:col-span-2 pt-4">
//                      <button type="submit" disabled={isSubmitting} className="group relative w-full md:w-max px-16 py-5 bg-[#10b981] hover:bg-[#0da371] text-white font-black rounded-2xl transition-all duration-500 shadow-xl shadow-[#10b981]/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-70">
//                        {isSubmitting ? (
//                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
//                        ) : (
//                          <>
//                            <span>{isAr ? 'إرسال طلب الاستشارة' : 'Send Request'}</span>
//                            <svg className={`w-6 h-6 transition-transform duration-500 group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
//                          </>
//                        )}
//                      </button>
//                   </div>
//                 </form>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//       <ScrollToTop />
//       <Footer />

      
//       <style jsx global>{`
//         .custom-phone-wrapper .react-international-phone-input-container {
//           width: 100% !important;
//           border: 2px solid transparent !important;
//           background-color: white !important;
//           border-radius: 1rem !important;
//           padding: 4px !important;
//           box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
//           transition: all 0.3s ease;
//         }
//         .custom-phone-wrapper .react-international-phone-input-container:focus-within {
//           border-color: #10b981 !important;
//           box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05) !important;
//         }
//         .custom-phone-wrapper .react-international-phone-input {
//           width: 100% !important;
//           border: none !important;
//           font-weight: 700 !important;
//           font-family: inherit !important;
//           height: 50px !important;
//         }
//         .custom-phone-wrapper .react-international-phone-country-selector-button {
//           border: none !important;
//           background: transparent !important;
//         }
//       `}</style>
//     </>
//   );
// }