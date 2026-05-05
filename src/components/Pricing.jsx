"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from "@/Translations"; // تأكدي إن الحرف t صغير أو كبير حسب اسم الفولدر عندك
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 

export default function Pricing() {
    const { language, locale } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter(); 

    //  منع الـ Hydration Error عشان الموقع يفتح فوراً
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const activeLang = language || locale || 'ar';
    
    //  صمام الأمان: لو ملقاش الترجمة، بياخد مصفوفة فاضية عشان الموقع ميفصلش
    const t = translations?.[activeLang]?.pricing || translations?.ar?.pricing || { plans: [] };

    const handlePlanClick = (plan) => {
        if (plan?.featured) {
            router.push('/checkout?plan=pro');
        } else if (plan?.price === 'مجاني' || plan?.price === 'Free' || plan?.price === '0') {
            router.push(`/emissions-calculator?mode=standalone&lang=${activeLang}`);
        } else {
            router.push('/contact?subject=Enterprise%20Plan%20Inquiry');
        }
    };

    if (!isMounted) return null;

    return (
        <section 
            id="pricing" 
            className="scroll-mt-16 min-h-screen flex flex-col justify-center pt-24 pb-20 bg-[#fcfdfd] overflow-hidden font-cairo"
        >
            <div className="max-w-5xl mx-auto px-6">

                {/* Heading - نفس الأنيميشن بتاعك */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-black text-gray-900 mb-4 font-cairo">
                        {/* استخدام الـ ? حمايتك من الـ Undefined */}
                        {t?.title || "خطط الأسعار"}
                    </h2>
                    <p className="text-gray-500 text-base max-w-xl mx-auto">
                        {t?.subtitle}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {(t?.plans || []).map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2, ease: "backOut" }}
                            whileHover={{ y: -8 }}
                            className={`relative p-[2px] rounded-[2.2rem] overflow-hidden transition-all duration-500 ${plan.featured ? 'scale-110 z-10 shadow-2xl' : 'scale-100 shadow-sm border border-gray-100'}`}
                        >
                            {/* التصميم اللي بيلف (Glow) اللي إنتي عملتيه */}
                            {plan.featured && (
                                <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#d1fae5_50%,#10b981_100%)]" />
                            )}

                            <div className="relative p-7 rounded-[2.1rem] bg-white h-full flex flex-col justify-between z-10">
                                <div>
                                    <div className="text-center mt-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-cairo">{plan.name}</h3>
                                        <div className="mb-5">
                                            <span className="text-4xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
                                            {plan.period && <span className="text-gray-400 text-sm font-medium"> /{plan.period}</span>}
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8 text-right">
                                        {(plan.features || []).map((feature, i) => (
                                            <li key={i} className={`flex items-center gap-3 ${activeLang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <span className="text-gray-600 text-sm font-medium flex-1 leading-tight">{feature}</span>
                                                <div className="bg-[#ecfdf5] text-[#10b981] rounded-full p-1 shrink-0">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <motion.button
                                    onClick={() => handlePlanClick(plan)} 
                                    whileHover={{
                                        backgroundColor: "#ffffff",
                                        color: "#10b981",
                                        border: "2px solid #10b981"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-2.5 rounded-full font-bold text-white text-sm transition-all duration-200 shadow-sm bg-[#10b981] border-2 border-transparent"
                                >
                                    {t?.buttonText || "ابدأ الآن"}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}