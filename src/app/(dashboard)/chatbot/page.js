'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ClientWrapper from '@/components/ClientWrapper';
import AppLayout from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';

// --- 1. دالة التواصل مع السيرفر (مع الرد الاحتياطي للعرض) ---

async function askBot(question) {

  const q = question.toLowerCase().trim();

  try {
   
    const response = await fetch('http://127.0.0.1:5000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question })
    });
    
    if (!response.ok) throw new Error("Server down");
    
    const data = await response.json();
    return data.reply;

  } catch (error) {

    
    
    if (q.includes("سلام") || q.includes("أهلا") || q.includes("صباح") || q.includes("مساء") || q.includes("hello") || q.includes("hi")) {
      return "وعليكم السلام! أهلاً بك في منصة EcoVision. أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم في تتبع أو تقليل انبعاثاتك؟";
    }

    
    if (q.includes("مشكله") || q.includes("مشكلة") || q.includes("غلط") || q.includes("ساعدني") || q.includes("help")) {
      return "أنا معك! لا تقلق، هل المشكلة في حسابات الانبعاثات أم في تحميل تقرير الـ ESG؟ يمكنني مساعدتك في توضيح أي جزء.";
    }

    // ردود عن الكربون والاستدامة
    if (q.includes("كربون") || q.includes("carbon") || q.includes("انبعاثات")) {
      return "انبعاثات الكربون هي البصمة التي نتركها خلفنا نتيجة استهلاك الطاقة. في مشروعنا EcoVision، بنركز على قياسها بدقة عشان نساعد الكوكب.";
    }

   
    if (q.includes("تقرير") || q.includes("خطة") || q.includes("report") || q.includes("plan")) {
      return "بالتأكيد! لقد قمت بمراجعة بياناتك، وأنا جاهز الآن لإصدار تقرير ESG شامل لك. اضغط على الزرار بالأسفل عشان تشوفه.";
    }


    if (q.includes("مشروع") || q.includes("أنت مين") || q.includes("مين عملك") || q.includes("ecovision")) {
      return "أنا مساعد EcoVision الذكي، تم تطويري بواسطة فريق عمل مبدع لمساعدة الشركات في التحول نحو الاستدامة الرقمية.";
    }

    return "سؤال ممتاز! بصفتي مساعدك في EcoVision، أنصحك دائماً بمراقبة 'Scope 2' (استهلاك الكهرباء) لأنه الأسهل في التوفير والتحسين حالياً. هل تحب نلقي نظرة على تقريرك؟";
  }
}

// --- 2. مكون فقاعة الرسالة ---
function ChatMessage({ message, isUser }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-emerald-500 shadow-lg' : 'bg-gray-100 border border-gray-200'
      }`}>
        {isUser ? <span className="text-white text-[10px] font-black">YOU</span> : 
          <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
        isUser ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed font-medium">{message.text}</p>
        <span className="text-[9px] mt-1 block opacity-60 italic">{message.time}</span>
      </div>
    </motion.div>
  );
}

function ChatbotContent() {
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const searchParams = useSearchParams();
  const router = useRouter();
  const triggerAction = searchParams.get('action');

  const [messages, setMessages] = useState([
    {
      text: t('chatbot.welcome_message'),
      isUser: false,
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- 1. لازم تعريف handleAutoPlan يكون هنا (قبل استخدامه) ---
  const handleAutoPlan = async () => {
    // قراءة الأرقام من اللينك
    const s1 = searchParams.get('s1') || "0";
    const s2 = searchParams.get('s2') || "0";
    const s3 = searchParams.get('s3') || "0";

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    let advice = "";
    if (parseFloat(s2.replace(/,/g, '')) > parseFloat(s1.replace(/,/g, ''))) {
      advice = isAr 
        ? `أهلاً بك! لقد حللت بياناتك، وأرى أن انبعاثات الطاقة (Scope 2) عندك مرتفعة ووصلت لـ ${s2} طن. الأفضل البدء بخطة لتركيب ألواح شمسية.`
        : `Hello! I've analyzed your data. Your Scope 2 emissions are high at ${s2} tons. Consider a solar energy plan.`;
    } else {
      advice = isAr 
        ? `بناءً على أرقامك، انبعاثات النطاق الأول (Scope 1) هي الأعلى بـ ${s1} طن. ننصح بتحسين كفاءة المحركات واستهلاك الوقود.`
        : `Based on your numbers, Scope 1 emissions are dominant at ${s1} tons. We recommend improving fuel efficiency.`;
    }

    setMessages(prev => [...prev, { 
      text: advice, 
      isUser: false, 
      time: new Date().toLocaleTimeString(), 
      showReportBtn: true,
      reportParams: `?s1=${s1}&s2=${s2}&s3=${s3}`
    }]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const s1 = searchParams.get('s1') || "0";
    const s2 = searchParams.get('s2') || "0";
    const s3 = searchParams.get('s3') || "0";

    const text = inputValue;
    setInputValue('');

    setMessages(prev => [...prev, { 
      text, 
      isUser: true, 
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) 
    }]);
    
    setIsLoading(true);
    const reply = await askBot(text);

    // --- المنطق الذكي هنا ---
    // هل السؤال أو الرد فيه سيرة "تقرير" أو "خطة"؟
    const needsReport = text.includes("تقرير") || text.includes("خطة") || 
                        text.includes("report") || text.includes("plan");

    setMessages(prev => [...prev, { 
      text: reply, 
      isUser: false, 
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      
      showReportBtn: needsReport, 
      reportParams: `?s1=${s1}&s2=${s2}&s3=${s3}`
    }]);

    setIsLoading(false);
  };
  

  
  useEffect(() => {
    if (triggerAction === 'generate_plan' && messages.length === 1) {
      handleAutoPlan();
    }
  }, [triggerAction, messages.length]); // ضفنا messages.length هنا للتأكيد

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 font-cairo">
      <div className="bg-white rounded-t-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 leading-none mb-1">{t('chatbot.title')}</h2>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{t('chatbot.online')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/50 backdrop-blur-sm border-x border-gray-100 p-5 overflow-y-auto space-y-4 min-h-[450px]">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-3">
            <ChatMessage message={msg} isUser={msg.isUser} />
            {msg.showReportBtn && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${isAr ? 'justify-start mr-11' : 'justify-start ml-11'}`}>
                <button 
                  onClick={() => router.push('/esg-reports')} 
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  {isAr ? "📑 عرض تقرير ESG وتحميل PDF" : "📑 View ESG Report & Download PDF"}
                </button>
              </motion.div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 p-3 bg-gray-50 rounded-2xl w-fit">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-b-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-cairo"
          />
          <button onClick={handleSend} className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <ClientWrapper>
      <AppLayout>
        <div className="py-6 h-[calc(100vh-100px)]">
          <Suspense fallback={<div>Loading...</div>}>
            <ChatbotContent />
          </Suspense>
        </div>
      </AppLayout>
    </ClientWrapper>
  );
}