

"use client";
import React from 'react';
import Header from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Target, Lightbulb, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const content = {
    title: isRtl ? "من نحن" : "About Us",
   
    desc: isRtl ? "نحن مهندسو المستقبل الأخضر، ندمج عبقرية الذكاء الاصطناعي مع حلول الاستدامة لنصنع أثراً بيئياً إيجابياً ومستداماً للشركات." : "We are the architects of a green future, merging AI genius with sustainability solutions to create a positive, lasting environmental impact for businesses.",
    cards: [
      { id: 1, title: isRtl ? "الرؤية" : "Vision", icon: <Target size={24} />, text: isRtl ? "الريادة الإقليمية في قيادة التحول البيئي الرقمي." : "Regional leadership in driving digital eco-transformation." },
      { id: 2, title: isRtl ? "المهمة" : "Mission", icon: <Lightbulb size={24} />, text: isRtl ? "تبسيط أعقد البيانات لقرارات استدامة ذكية." : "Simplifying complex data for smart sustainability decisions." },
      { id: 3, title: isRtl ? "القيم" : "Values", icon: <Heart size={24} />, text: isRtl ? "الشفافية المطلقة، الابتكار الجريء، والالتزام بالكوكب." : "Absolute transparency, bold innovation, and planet commitment." }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-cairo overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-48 pb-32 px-6 max-w-7xl mx-auto relative">
        
   
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-28">
       
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8"
          >
            <div className="flex items-center gap-3 text-[#10b981] mb-6">
                <div className="w-10 h-1 bg-[#10b981] rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">
                  Deletacarbo Platform
                </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {content.title}<span className="text-[#10b981]">.</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
              {content.desc}
            </p>
          </motion.div>

          {/* عنصر ديكوري متحرك في الجهة المقابلة */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-4 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 bg-[#10b981]/10 rounded-full flex items-center justify-center">
              <Zap size={100} className="text-[#10b981] opacity-70" />
              <div className="absolute inset-0 border-4 border-[#10b981]/20 rounded-full animate-ping"></div>
            </div>
          </motion.div>
        </div>

        {/* 2. سكشن الكروت - Asymmetric Grid (34% - 33% - 33%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {content.cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 + 0.5 }}
              className={`${i === 0 ? 'md:col-span-4' : 'md:col-span-4'} group`}
            >
              <div className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] flex flex-col gap-6 transition-all duration-500 hover:bg-white hover:border-[#10b981]/30 hover:shadow-2xl hover:shadow-green-900/5 hover:-translate-y-2 relative overflow-hidden">
                
                {/* الأيقونة جنب العنوان سويًا في صف واحد */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white text-[#10b981] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#10b981] group-hover:text-white transition-colors duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-wide">
                    {card.title}
                  </h3>
                </div>

                {/* نص صغير ومقروء - Medium LineHeight */}
                <p className="text-slate-500 text-[15px] leading-relaxed font-medium min-h-[50px]">
                  {card.text}
                </p>

                {/* عنصر زخرفي خلفي */}
                <div className="absolute -right-8 -bottom-8 text-green-500 opacity-5 group-hover:opacity-10 transition-opacity">
                    {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* الخلفية الجمالية الـ Fluid */}
        <div className="absolute top-[30%] left-[-15%] w-[500px] h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#10b981]/3 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      </main>

      <Footer />
    </div>
  );
}
