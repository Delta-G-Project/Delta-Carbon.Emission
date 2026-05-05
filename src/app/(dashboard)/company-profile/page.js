'use client';
import { useState, useEffect } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// --- إعدادات الروابط (ليقوم مبرمج الباك-إند بتعديلها بسهولة) ---
const API_CONFIG = {
  ENDPOINT: '/api/organization',
  INVITE_ENDPOINT: '/api/organization/invite',
};

// --- الأيقونات ---
const IconLeaf = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const IconUserPlus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>;
const IconEdit = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IconClose = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>;

const animations = `
  @keyframes leafBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
  .animate-breathe { animation: leafBreathe 4s ease-in-out infinite; }
  .organic-card { border-radius: 40px 10px 40px 10px; transition: all 0.4s ease; background: white; border: 1px solid #f0fdf4; }
  .organic-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.1); }
  .input-eco { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 15px; padding: 12px 16px; font-weight: 500; color: #0f172a; width: 100%; transition: all 0.2s; }
  .input-eco:focus { border-color: #10b981; background: white; outline: none; ring: 2px ring-emerald-500/20; }
  .label-eco { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; display: block; padding-left: 4px; }
`;

function CompanyProfileContent() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- البيانات الأساسية ---
  const [info, setInfo] = useState({
    name: isAr ? "إيكو فيجن" : "EcoVision Hub",
    industry: isAr ? "استدامة ذكية" : "Smart Sustainability",
    email: "ops@ecovision.io",
    location: isAr ? "الشرقية، مصر" : "Sharkia, Egypt",
    target: "2040"
  });

  const [members, setMembers] = useState([
    { id: 1, name: "Sarah Ahmed", role: "Owner", email: "sarah@eco.io", color: "from-emerald-400 to-teal-500" },
    { id: 2, name: "Ahmed Kamal", role: "Admin", email: "ahmed@eco.io", color: "from-blue-400 to-indigo-500" },
  ]);

  // --- 1. جلب البيانات (مع معالجة الخطأ لعرض البيانات الوهمية) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(API_CONFIG.ENDPOINT);
        if (res.ok) {
          const data = await res.json();
          setInfo(data.info || data);
          if(data.members) setMembers(data.members);
        }
      } catch (e) { // console.log("Demo Mode: Using Mock Data"); 
    }
    };
    loadData();
  }, [isAr]);

  // --- 2. حفظ التعديلات (Update Info) ---
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // سحب البيانات من الفورم وتحديث الـ State فوراً
    const formData = new FormData(e.target);
    const updatedInfo = {
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        target: formData.get('target'),
        industry: info.industry // الحفاظ على الصناعة
    };

    setInfo(updatedInfo); // تحديث الشاشة فوراً

    try {
      await fetch(API_CONFIG.ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });
    } catch (e) { // console.log("Backend not ready"); 
    }

    setIsSaving(false);
    setIsEditModalOpen(false);
  };

  // --- 3. إضافة شريك (Invite) مع تحديث تلقائي للشاشة ---
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const role = formData.get('role');

    // إضافة العضو محلياً فوراً عشان الشغل يبان شغال
    const newMember = {
        id: Date.now(),
        name: email.split('@')[0], // اسم مؤقت من الإيميل
        email: email,
        role: role,
        color: "from-emerald-400 to-cyan-500"
    };

    setMembers([...members, newMember]);

    try {
      await fetch(API_CONFIG.INVITE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
    } catch (e) { // console.log("Backend not ready"); 
    }

    setIsSaving(false);
    setIsInviteModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
      <style>{animations}</style>

      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isAr ? 'إدارة المنظمة' : 'Org Hub'}</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Sustainability Management</p>
        </div>
        <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 shadow-lg transition-all active:scale-95">
          <IconEdit /> {isAr ? 'تعديل البيانات' : 'Edit Info'}
        </button>
      </header>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 organic-card p-8 shadow-sm border border-emerald-50">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl animate-breathe">
               <IconLeaf />
            </div>
            <div className="text-center md:text-right flex-1">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{info.industry}</span>
               <h2 className="text-4xl font-black text-slate-900 mt-1">{info.name}</h2>
               <div className="flex flex-wrap gap-x-10 gap-y-4 mt-6 justify-center md:justify-start">
                  <div><p className="label-eco">Email</p><p className="text-slate-700 font-bold">{info.email}</p></div>
                  <div><p className="label-eco">HQ Location</p><p className="text-slate-700 font-bold">{info.location}</p></div>
               </div>
            </div>
          </div>
        </div>

<div className="lg:col-span-4 bg-emerald-950 organic-card p-8 text-white shadow-xl border-none relative overflow-hidden">

   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
   
   <div className="relative z-10 flex flex-col justify-between h-full">
      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
         {isAr ? 'سنة الهدف' : 'Target Year'}
      </p>
      

      <h4 className="text-7xl font-black my-2 tracking-tighter text-emerald-400 drop-shadow-sm">
         {info.target || '2040'}
      </h4>
      <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden border border-white/5">
         <div className="bg-emerald-400 h-full w-3/4 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
      </div>
   </div>
</div>
      </div>

      {/* Team Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-2xl font-black text-slate-900">{isAr ? 'فريق الاستدامة' : 'Eco Collaborators'}</h3>
           <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all">
             <IconUserPlus /> {isAr ? 'إضافة شريك' : 'Invite'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="organic-card p-6 border border-slate-50 shadow-sm flex flex-col gap-5">
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-black text-xl shadow-md`}>
                    {member.name?.[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{member.name}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">{member.email}</p>
                  </div>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 rounded-lg text-slate-500">{member.role}</span>
                  <button className="text-slate-300 hover:text-emerald-600 transition-colors"><IconEdit /></button>
               </div>
            </div>
          ))}
        </div>
      </section>

      
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
           <form onSubmit={handleUpdateInfo} className="bg-white w-full max-w-lg organic-card p-8 relative shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-900">{isAr ? 'تعديل بيانات المنظمة' : 'Edit Org Details'}</h3>
                 <button type="button" onClick={() => setIsEditModalOpen(false)}><IconClose /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="label-eco">Name</label><input name="name" defaultValue={info.name} required className="input-eco" /></div>
                 <div><label className="label-eco">Email</label><input name="email" defaultValue={info.email} required className="input-eco" /></div>
                 <div><label className="label-eco">Location</label><input name="location" defaultValue={info.location} className="input-eco" /></div>
                 <div><label className="label-eco">Target Year</label><input name="target" defaultValue={info.target} className="input-eco" /></div>
              </div>
              <button disabled={isSaving} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">
                 {isSaving ? '...' : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
              </button>
           </form>
        </div>
      )}

      {/* --- 2. د إضافة شريك --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
           <form onSubmit={handleInviteSubmit} className="bg-white w-full max-w-md organic-card p-8 relative shadow-2xl animate-in zoom-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-900">{isAr ? 'دعوة شريك جديد' : 'Invite Member'}</h3>
                 <button type="button" onClick={() => setIsInviteModalOpen(false)}><IconClose /></button>
              </div>
              <div className="space-y-4">
                 <div><label className="label-eco">Email Address</label><input name="email" required type="email" placeholder="example@eco.io" className="input-eco" /></div>
                 <div><label className="label-eco">Role</label>
                    <select name="role" className="input-eco appearance-none">
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                    </select>
                 </div>
              </div>
              <button disabled={isSaving} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95">
                 {isSaving ? '...' : (isAr ? 'إرسال الدعوة الآن' : 'Send Invitation')}
              </button>
           </form>
        </div>
      )}
    </div>
  );
}

export default function FinalApp() {
  return (
    <ClientWrapper>
      <AppLayout>
        <div className="min-h-screen bg-[#f8fdfb]">
          <CompanyProfileContent />
        </div>
      </AppLayout>
    </ClientWrapper>
  );
}
// / 'use client';
// import { useState, useEffect } from 'react';
// import ClientWrapper from '@/components/ClientWrapper';
// import AppLayout from '@/components/AppLayout';
// import { useLanguage, LanguageProvider } from '@/contexts/LanguageContext';

// // --- إعدادات الروابط للباك-إند ---
// const API_CONFIG = {
//   ENDPOINT: '/api/organization',
//   INVITE_ENDPOINT: '/api/organization/invite',
// };

// // --- الأيقونات ---
// const IconLeaf = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
// const IconUserPlus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>;
// const IconEdit = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
// const IconClose = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>;

// const animations = `
//   @keyframes leafBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
//   .animate-breathe { animation: leafBreathe 4s ease-in-out infinite; }
//   .organic-card { border-radius: 50px 15px 50px 15px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: white; border: 1px solid #ecfdf5; }
//   .organic-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -12px rgba(16, 185, 129, 0.15); }
//   .input-eco { background: #f0fdf4; border: 2px solid transparent; border-radius: 20px; padding: 14px 20px; font-weight: 600; color: #064e3b; transition: all 0.3s; width: 100%; margin-bottom: 12px; }
//   .input-eco:focus { border-color: #10b981; background: white; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
//   .label-eco { font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 4px; display: block; padding-right: 8px; }
// `;

// function CompanyProfileContent() {
//   const { locale } = useLanguage();
//   const isAr = locale === 'ar';
  
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // البيانات الافتراضية
//   const [info, setInfo] = useState({
//     name: isAr ? "إيكو فيجن" : "EcoVision Hub",
//     industry: isAr ? "استدامة ذكية" : "Smart Sustainability",
//     email: "ops@ecovision.io",
//     location: isAr ? "الشرقية، مصر" : "Sharkia, Egypt",
//     target: "2040"
//   });

//   const [members, setMembers] = useState([
//     { id: 1, name: "Sarah Ahmed", role: "Owner", email: "sarah@eco.io", color: "from-emerald-400 to-teal-500" },
//     { id: 2, name: "Ahmed Kamal", role: "Admin", email: "ahmed@eco.io", color: "from-blue-400 to-indigo-500" },
//     { id: 3, name: "Fatima Zahra", role: "Editor", email: "fatima@eco.io", color: "from-rose-400 to-orange-500" },
//   ]);

//   // محاكاة الـ Fetch لجلب البيانات
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const response = await fetch(API_CONFIG.ENDPOINT);
//         if (response.ok) {
//           const data = await response.json();
//           setInfo(data.info || data);
//           setMembers(data.members || members);
//         }
//       } catch (error) { // console.log("Showing mock data."); }
//     };
//     loadData();
//   }, [isAr]);

//   // وظيفة حفظ التعديلات (اسم، إيميل، عنوان، تاريخ)
//   const handleUpdateInfo = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     try {
//       await fetch(API_CONFIG.ENDPOINT, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(info),
//       });
//       setIsEditModalOpen(false);
//     } catch (e) {
//       setIsEditModalOpen(false);
//     } finally { setIsSaving(false); }
//   };

//   // وظيفة إضافة عضو جديد
//   const handleInviteSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     try {
//       await fetch(API_CONFIG.INVITE_ENDPOINT, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: e.target.email.value, role: e.target.role.value }),
//       });
//       setIsInviteModalOpen(false);
//     } catch (e) { setIsInviteModalOpen(false); }
//     finally { setIsSaving(false); }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-12 py-8 px-4">
//       <style>{animations}</style>

//       {/* Header */}
//       <header className="flex justify-between items-end border-b border-emerald-50 pb-6">
//         <div>
//           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg italic">Hub</span>
//           <h1 className="text-3xl font-black text-emerald-950 mt-2 tracking-tight">{isAr ? 'إدارة المنظمة' : 'Org Profile'}</h1>
//         </div>
//         <button 
//           onClick={() => setIsEditModalOpen(true)}
//           className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 shadow-xl transition-all active:scale-95"
//         >
//           <IconEdit /> {isAr ? 'تعديل البيانات' : 'Edit Info'}
//         </button>
//       </header>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         <div className="lg:col-span-8 organic-card p-10 relative overflow-hidden shadow-lg border-emerald-50">
//           <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
//             <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl animate-breathe">
//                <IconLeaf />
//             </div>
//             <div className="text-center md:text-right">
//                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{info.industry}</span>
//                <h2 className="text-4xl font-black text-emerald-950 mt-1">{info.name}</h2>
//                <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start text-sm">
//                   <div><p className="label-eco">Email</p><p className="text-emerald-900 font-bold">{info.email}</p></div>
//                   <div><p className="label-eco">HQ</p><p className="text-emerald-900 font-bold">{info.location}</p></div>
//                </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-4 bg-[#E2F952] organic-card p-10 text-black shadow-2xl border-none">
//            <div className="relative z-10 h-full flex flex-col justify-between">
//               <div>
//                 <p className="text-[10px] font-black text-black/50 uppercase tracking-widest">{isAr ? 'هدف الصفر انبعاثات' : 'Target Year'}</p>
//                 <h4 className="text-7xl font-black mt-2 tracking-tighter text-black">{info.target}</h4>
//               </div>
//               <div className="pt-6">
//                  <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
//                     <div className="h-full bg-black rounded-full w-[85%]"></div>
//                  </div>
//               </div>
//            </div>
//         </div>
//       </div>

//       {/* --- قسم فريق الاستدامة --- */}
//       <section className="space-y-6">
//         <div className="flex justify-between items-center px-4">
//            <div className="flex items-center gap-3">
//               <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
//               <h3 className="text-2xl font-black text-emerald-950">{isAr ? 'فريق الاستدامة' : 'Eco Collaborators'}</h3>
//            </div>
//            {/* زر إضافة شريك جديد - الآن يعمل ويفتح المودال */}
//            <button 
//              onClick={() => setIsInviteModalOpen(true)}
//              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
//            >
//              <IconUserPlus /> {isAr ? 'إضافة شريك جديد' : 'Invite Member'}
//            </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {members.map((member) => (
//             <div key={member.id} className="organic-card p-6 flex flex-col gap-6 group hover:border-emerald-200">
//                <div className="flex items-center gap-4">
//                   <div className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br ${member.color} shadow-lg flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform`}>
//                     {member.name[0]}
//                   </div>
//                   <div>
//                     <h5 className="font-black text-emerald-950 text-lg leading-tight">{member.name}</h5>
//                     <p className="text-xs text-slate-400 font-medium">{member.email}</p>
//                   </div>
//                </div>
//                <div className="flex justify-between items-center border-t border-emerald-50 pt-4">
//                   <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${member.role === 'Owner' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
//                     {member.role}
//                   </span>
//                   <button className="text-slate-300 hover:text-emerald-600"><IconEdit /></button>
//                </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* --- 1. مودال التعديل (اسم، إيميل، تاريخ، عنوان) --- */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
//            <form onSubmit={handleUpdateInfo} className="bg-white w-full max-w-lg organic-card p-10 relative z-10 shadow-2xl animate-in zoom-in">
//               <div className="flex justify-between items-center mb-6">
//                  <h3 className="text-2xl font-black text-emerald-950">{isAr ? 'تعديل البيانات' : 'Update Org'}</h3>
//                  <button type="button" onClick={() => setIsEditModalOpen(false)}><IconClose /></button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                  <div>
//                     <label className="label-eco">{isAr ? 'اسم المنظمة' : 'Name'}</label>
//                     <input required type="text" value={info.name} onChange={(e) => setInfo({...info, name: e.target.value})} className="input-eco" />
//                  </div>
//                  <div>
//                     <label className="label-eco">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
//                     <input required type="email" value={info.email} onChange={(e) => setInfo({...info, email: e.target.value})} className="input-eco" />
//                  </div>
//                  <div>
//                     <label className="label-eco">{isAr ? 'العنوان / المقر' : 'Location'}</label>
//                     <input type="text" value={info.location} onChange={(e) => setInfo({...info, location: e.target.value})} className="input-eco" />
//                  </div>
//                  <div>
//                     <label className="label-eco">{isAr ? 'سنة الهدف (التاريخ)' : 'Target Year'}</label>
//                     <input type="text" value={info.target} onChange={(e) => setInfo({...info, target: e.target.value})} className="input-eco" />
//                  </div>
//               </div>

//               <button disabled={isSaving} className="w-full mt-4 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all">
//                  {isSaving ? '...' : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
//               </button>
//            </form>
//         </div>
//       )}

//       {/* --- 2. مودال إضافة شريك جديد (Invite Partner) --- */}
//       {isInviteModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
//            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={() => setIsInviteModalOpen(false)}></div>
//            <form onSubmit={handleInviteSubmit} className="bg-white w-full max-w-md organic-card p-10 relative z-10 shadow-2xl animate-in zoom-in">
//               <div className="flex justify-between items-center mb-6">
//                  <h3 className="text-2xl font-black text-emerald-950">{isAr ? 'دعوة شريك جديد' : 'Invite Partner'}</h3>
//                  <button type="button" onClick={() => setIsInviteModalOpen(false)}><IconClose /></button>
//               </div>
//               <div className="space-y-4">
//                  <label className="label-eco">Email Address</label>
//                  <input name="email" required type="email" placeholder="example@eco.io" className="input-eco" />
                 
//                  <label className="label-eco">Role</label>
//                  <select name="role" className="input-eco appearance-none">
//                     <option value="Admin">Admin</option>
//                     <option value="Editor">Editor</option>
//                  </select>
                 
//                  <button disabled={isSaving} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl transition-all">
//                     {isSaving ? '...' : (isAr ? 'إرسال الدعوة' : 'Send Invitation')}
//                  </button>
//               </div>
//            </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function FinalApp() {
//   return (
//     <LanguageProvider>
//       <ClientWrapper>
//         <AppLayout>
//           <div className="min-h-screen bg-[#f8fdfb]">
//             <CompanyProfileContent />
//           </div>
//         </AppLayout>
//       </ClientWrapper>
//     </LanguageProvider>
//   );
// }