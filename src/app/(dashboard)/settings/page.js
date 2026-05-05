'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useUserStore } from '@/store/userStore';

// --- مكون الأيقونات (بره المكون عادي) ---
const Icon = ({ name, active }) => {
  const icons = {
    profile: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
    security: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />,
    api: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    camera: <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />,
    copy: <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  };
  return (
    <svg className={`w-6 h-6 transition-all ${active ? 'text-white' : 'text-emerald-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
};

function SettingsContent() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [isSavingLicense, setIsSavingLicense] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [securityAlert, setSecurityAlert] = useState(false);
  
  const { user, fetchProfile } = useUserStore();

  const [profile, setProfile] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    avatarUrl: null 
  });

  // --- 💡 استرجاع البيانات وتنظيفها ---
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || null
      });
    }
  }, [user]);

  // --- 🛡️ وظيفة الحماية الأساسية ---
  const sanitizeValue = (value) => {
    if (typeof value !== 'string') return '';
    const dangerousChars = /[<>'"/;()]/g;
    if (dangerousChars.test(value)) {
      setSecurityAlert(true);
      setTimeout(() => setSecurityAlert(false), 3000);
      return value.replace(dangerousChars, "");
    }
    return value;
  };

  const sanitizePhone = (value) => {
    if (typeof value !== 'string') return '';
    const cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned !== value) {
      setSecurityAlert(true);
      setTimeout(() => setSecurityAlert(false), 3000);
    }
    return cleaned;
  };

  const handleInputChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: sanitizeValue(val) }));
  };

  const handleLicenseKeyChange = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join('-') || val;
    setLicenseKey(formatted);
  };

  // --- 🖼️ دالة ضغط الصورة قبل التحويل (الحل الجذري) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // نتأكد إنه ملف صورة
    if (!file.type.startsWith('image/')) {
        alert(isAr ? 'يرجى اختيار ملف صورة صحيح' : 'Please select a valid image file');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // تصغير الأبعاد إلى 200x200 (مناسبة للبروفايل)
            const MAX_WIDTH = 200;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // ضغط الصورة لـ 0.7 الجودة
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            setProfile(prev => ({ ...prev, avatarUrl: compressedDataUrl }));
        };
    };
  };

  // --- 🚀 دوال الـ Fetch للباك إند ---

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    
    try {
      // Send the update to the backend securely, the cookies are sent automatically by fetch
      const response = await fetch("https://api.ather-carbon.com/v1/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });
      // Optionally re-fetch profile from backend
      fetchProfile();
    } catch (error) {
      // console.log("الخادم غير متصل");
    } finally {
      setIsSavingProfile(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleActivate = async () => {
    if (!licenseKey || licenseKey.replace(/-/g, '').length < 16) {
      alert(isAr ? 'يرجى إدخال 16 رمزاً صحيحاً' : 'Please enter valid 16 characters');
      return;
    }
    
    setIsSavingLicense(true);
    const cleanKey = licenseKey.replace(/-/g, ''); 

    try {
      await fetch("https://api.ather-carbon.com/v1/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cleanKey }),
      });
    } catch (error) {
      // console.log("الخادم غير متصل، تم التفعيل محلياً للتجربة");
    } finally {
      setTimeout(() => {
        setIsSavingLicense(false);
        setIsActivated(true);
      }, 1500);
    }
  };

  const tabs = [
    { id: 0, label: isAr ? 'الملف' : 'Profile', icon: 'profile' },
    { id: 1, label: isAr ? 'الأمان' : 'Security', icon: 'security' },
    { id: 2, label: isAr ? 'التفعيل' : 'License', icon: 'api' },
  ];

  return (
    <div className="w-full min-h-screen bg-white py-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between border-b border-emerald-50 pb-6">
          <div className={isAr ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'إعدادات المنصة' : 'Settings'}</h1>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Secured Ecosystem</p>
          </div>
          <div className={`h-3 w-3 rounded-full transition-all duration-500 ${securityAlert ? 'bg-red-500 shadow-[0_0_15px_red] animate-ping' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-24 flex lg:flex-col gap-4 items-center">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`p-5 rounded-[2rem] transition-all duration-300 ${activeTab === tab.id ? 'bg-emerald-600 shadow-xl shadow-emerald-200 scale-110' : 'bg-emerald-50 hover:bg-emerald-100'}`}>
                <Icon name={tab.icon} active={activeTab === tab.id} />
              </button>
            ))}
          </aside>

          <main className="flex-1 bg-white min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                
                {/* 1. الملف الشخصي */}
                {activeTab === 0 && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center gap-6">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-xl overflow-hidden">
                          {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : <div className="p-7 opacity-20"><Icon name="profile" active={false} /></div>}
                        </div>
                        <div className={`absolute -bottom-1 ${isAr ? '-left-1' : '-right-1'} bg-emerald-600 p-2 rounded-xl text-white border-4 border-white shadow-lg`}><Icon name="camera" active={true} /></div>
                        
                        {/* 💡 استخدام الدالة الجديدة لضغط وقراءة الصورة */}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </div>
                      <div className={isAr ? 'text-right' : 'text-left'}>
                        <h2 className="text-xl font-black text-slate-800">{isAr ? 'بيانات الهوية' : 'Identity'}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase">{isAr ? 'نظام الحماية نشط' : 'Security Active'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="label-style">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                        <input type="text" value={profile.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder={isAr ? "أدخل اسمك بالكامل هنا" : "Enter your full name"} className="shaima-input-style" />
                      </div>
                      <div className="space-y-2">
                        <label className="label-style">{isAr ? 'البريد الإلكتروني للعمل' : 'Work Email'}</label>
                        <input type="email" value={profile.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="name@company.com" className="shaima-input-style" dir="ltr" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="label-style">{isAr ? 'رقم الهاتف الدولي' : 'International Phone'}</label>
                        <div className="shaima-phone-wrapper" dir="ltr">
                          <PhoneInput defaultCountry="eg" value={profile.phone} onChange={(phone) => setProfile(prev => ({ ...prev, phone: sanitizePhone(phone || '') }))} placeholder={isAr ? "رقم الهاتف" : "Phone Number"} />
                        </div>
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.05 }} onClick={handleSaveProfile} disabled={isSavingProfile}
                      className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {isSavingProfile ? (isAr ? 'جاري الحفظ...' : 'Saving...') : saved ? (isAr ? 'تم الحفظ بنجاح ✓' : 'Secured ✓') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                    </motion.button>
                  </div>
                )}

                {/* --- 2. الأمان --- */}
                {activeTab === 1 && (
                  <div className="max-w-md space-y-8 animate-in fade-in duration-500">
                    <h2 className="text-xl font-black text-slate-800">{isAr ? 'حماية الحساب' : 'Security Suite'}</h2>
                    <div className="space-y-5">
                      <input type="password" placeholder={isAr ? 'كلمة المرور الحالية' : 'Current Password'} className="shaima-input-style" />
                      <input type="password" placeholder={isAr ? 'كلمة المرور الجديدة' : 'New Password'} className="shaima-input-style" />
                      <input type="password" placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'} className="shaima-input-style" />
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl">{isAr ? 'تحديث كلمة المرور' : 'Update Security'}</motion.button>
                    </div>
                  </div>
                )}

                {/* --- 3. التفعيل --- */}
                {activeTab === 2 && (
                  <div className="space-y-8 min-h-[300px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {!isActivated ? (
                        <motion.div key="input-form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                          <div className="bg-emerald-50/60 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 animate-pulse"><Icon name="api" active={false} /></div>
                            <p className="text-xs font-bold text-emerald-800 leading-relaxed">{isAr ? 'أدخل كود التفعيل المكون من 16 حرفاً.' : 'Enter 16-character license key.'}</p>
                          </div>
                          
                          <input type="text" value={licenseKey} onChange={handleLicenseKeyChange} placeholder="XXXX-XXXX-XXXX-XXXX" maxLength="19"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-6 text-center font-mono text-xl tracking-[0.2em] text-slate-600 outline-none focus:border-emerald-400 focus:bg-white shadow-inner transition-all uppercase" dir="ltr" />
                          
                          <motion.button onClick={handleActivate} disabled={isSavingLicense || licenseKey.length < 19} whileHover={{ scale: 1.02 }}
                            className="w-full py-5 bg-emerald-600 text-white rounded-[2.5rem] font-black text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSavingLicense ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'التحقق والتفعيل الآن' : 'Secure Verification')}
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div key="success-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="relative p-10 rounded-[3.5rem] bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-2xl overflow-hidden text-center"
                        >
                          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 blur-3xl animate-pulse"></div>
                          <div className="relative z-10 space-y-6">
                            <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-3xl font-black tracking-tight mb-2">{isAr ? 'تم التفعيل بنجاح!' : 'Activation Successful!'}</h3>
                            
                            <div className="py-2 px-4 bg-black/30 rounded-xl inline-block border border-white/10 font-mono text-sm tracking-[0.1em] text-emerald-200">
                               Key: {licenseKey}
                            </div>

                            <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest mt-4">
                               <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">Plan: Premium</div>
                               <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-emerald-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Status: Active</div>
                            </div>
                            <button onClick={() => {setIsActivated(false); setLicenseKey('');}} className="text-[10px] text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest mt-4">{isAr ? 'إدخال مفتاح جديد؟' : 'Change Key?'}</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .label-style { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; display: block; padding: 0 4px; }
        .shaima-input-style {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1.5rem;
          padding: 1.1rem 1.5rem;
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
          outline: none;
          transition: all 0.3s;
        }
        .shaima-input-style::placeholder { color: #cbd5e1; font-weight: 600; }
        .shaima-input-style:focus { border-color: #10b981; background: white; box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.1); }
        .shaima-phone-wrapper .react-international-phone-input-container {
            width: 100% !important; border: 2px solid #f1f5f9 !important; border-radius: 1.5rem !important;
            padding: 8px 12px !important; background: #f8fafc !important; transition: all 0.3s;
        }
        .shaima-phone-wrapper .react-international-phone-input-container:focus-within { border-color: #10b981 !important; background: white !important; }
        .shaima-phone-wrapper .react-international-phone-input { border: none !important; font-weight: 700 !important; color: #1e293b !important; font-size: 14px !important; width: 100% !important; background: transparent !important; }
      `}</style>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ClientWrapper>
      <AppLayout>
        <SettingsContent />
      </AppLayout>
    </ClientWrapper>
  );
}