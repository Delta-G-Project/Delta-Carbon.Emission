import { Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

const translations = {
  ar: {
    siteName: "انبعاثات كربونية",
    login: "تسجيل الدخول",
    signUp: "سجل الآن",
    common: {
      loading: "جاري التحميل...",
      save: "حفظ",
      cancel: "إلغاء",
      next: "التالي",
      previous: "السابق",
      delete: "حذف",
      edit: "تعديل",
      search: "بحث",
      filter: "تصفية"
    },
    // nav:
    nav: {
      // Landing Page Nav
      features: "المميزات",
      howItWorks: "كيف نعمل",
      pricing: "الأسعار",
      contact: "تواصل معنا",
      // Dashboard Sidebar Nav
      dashboard: "لوحة المعلومات",
      emissionsCalculator: "حاسبة الانبعاثات",
      aiInsights: "رؤى الذكاء الاصطناعي",
      esgReports: "تقارير ESG",
      reportsLog: "سجل التقارير",
      chatbot: "المساعد الذكي",
      companyTeam: "إدارة الشركة والفريق",
      settings: "الإعدادات",
      logout: "تسجيل الخروج"
    },
    //  hero: 
    hero: {
      titleLine1: "قِس انبعاثاتك ، أدرها بذكاء ، خفّضها بسهولة",
      titleLine2: "منصتك العالمية لذكاء الاستدامة",
      subtitle1: "المنصة المتكاملة التي تجمع بين حماية البيئة ونمو أعمالك",
      subtitle2: "راقب، حلل، وامتثل للمعايير العالمية بسهولة تامة",
      subtitle3: "ابدأ رحلتك نحو الاستدامة اليوم",
      button1: "ابدأ التقييم المجاني",
      button2: "اطلب عرض توضيحي"
    },
   
    //  howItWorks:
    howItWorks: {
      title: "كيف تعمل المنصة؟",
      subtitle: "خطوات بسيطة نحو إدارة بيئية ذكية ومستدامة لمشروعك",
      list: [
        { id: 1, title: 'تخفيض الأثر البيئي', desc: 'رؤى مدعومة بالذكاء الاصطناعي وتوصيات قابلة للتنفيذ لتقليل البصمة الكربونية.' },
        { id: 2, title: 'إدارة الاستدامة', desc: 'تتبع التقدم، حدد الأهداف، وخطط للمبادرات للتحكم في تأثيرك البيئي بفعالية.' },
        { id: 3, title: 'قياس الانبعاثات', desc: 'نظام قوي لجمع البيانات وتحليلها لحساب انبعاثات النطاق 1 و 2 و 3 بدقة.' }
      ]
    },
     // featuresGrid:
    featuresGrid: {
      title: "ميزات قوية لنتائج مؤثرة",
      subtitle: "صممت المنصة لمساعدتك على التفوق في إدارة الاستدامة",
      list: [
        { id: 4, title: "الآلية ESG تقارير", desc: "بجهد أقل ESG إنشاء تقارير شاملة ومتوافقة مع معايير." },
        { id: 5, title: "رؤى الذكاء الاصطناعي القابلة للتنفيذ", desc: "توصيات مخصصة مدعومة بالذكاء الاصطناعي لفرص خفض الانبعاثات." },
        { id: 6, title: "حاسبة الانبعاثات الذكية", desc: "حساب دقيق لانبعاثات النطاق 1 و 2 و 3، مما يوفر رؤية شاملة لأثرك." },
        { id: 7, title: "معايير الامتثال العالمية", desc: "ضمان التوافق مع أحدث الأطر التنظيمية ومعايير الاستدامة." },
        { id: 8, title: "إدارة الفريق والمهام", desc: "توزيع المهام وتتبع مسؤوليات الاستدامة عبر فريقك بسهولة." },
        { id: 9, title: "تتبع التقدم نحو Net Zero", desc: "مراقبة تقدمك نحو أهداف Net Zero الخاصة بك من خلال لوحات معلومات بديهية." }
      ]
    },
     // testimonials
    testimonials: {
      title: "ماذا يقول عملاؤنا",
      subtitle: "شركات رائدة تثق في Carbon Emissions لتحقيق أهداف الاستدامة",
      list: [
        { id: 1, text: "لقد غيّرت Carbon Emissions طريقة إدارتنا لانبعاثات الكربون لدينا، رؤى الذكاء الاصطناعي لا تقدر بثمن.", name: "ليلى أحمد", role: "مديرة الاستدامة، الشركة الخضراء القابضة", image: "/imag1.png" },
        { id: 2, text: "تجاوزت توقعاتنا سهولة استخدام المنصة وقدرتها على تبسيط تقارير ESG.", name: "محمد سعيد", role: "مدير العمليات، حلول المستقبل", image: "/image2.png" },
        { id: 3, text: "بفضل Carbon Emissions أصبحنا أكثر شفافية وكفاءة في جهودنا البيئية.", name: "فاطمة الزهراء", role: "رئيسة قسم الاستدامة، النخيل للاستثمارات", image: "/image.png" },
        { id: 4, text: "مساعدة لا تقدر بثمن في فهم وتخفيف بصمتنا الكربونية. منصة أساسية لأي شركة.", name: "عمر جاسم", role: "الرئيس التنفيذي، الرواد التقنية", image: "/img4.png" }
      ]
    },
    // Pricing:
    pricing: {
  title: "خطط أسعار مرنة لجميع الأحجام",
  subtitle: "اختر الخطة التي تناسب احتياجات الاستدامة لشركتك",
  buttonText: "ابدأ الآن",
  plans: [
    { 
      name: "الخطة الأساسية", 
      price: "مجاني", 
      features: ["حساب انبعاثات النطاق 1 و 2", "تتبع بسيط للأهداف", "تقارير أساسية PDF"] 
    },
    { 
      name: "الخطة الاحترافية", 
      price: "$99", 
      period: "شهر", 
      featured: true, 
      features: ["جميع ميزات الأساسي", "حساب انبعاثات النطاق 3", "رؤى الذكاء الاصطناعي", "دعم فني"] 
    },
    { 
      name: "خطة المؤسسات", 
      price: "اتصل بنا", 
      features: ["إدارة فرق متعددة", "تكامل API مخصص", "تقارير ESG متقدمة", "دعم 24/7"] 
    }
  ]
},
    //  aiInsightsSection:
    aiInsightsSection: {
      title: "رؤى مدعومة بالذكاء الاصطناعي لتغيير حقيقي",
      description: "تحويل بياناتك الخام إلى ذكاء استدامة قابل للتنفيذ. يحلل محركنا القوي للذكاء الاصطناعي أنماط الانبعاثات ويقترح استراتيجيات مستهدفة.",
      points: ["تحليل تنبؤي لمخاطر الاستدامة", "توصيات مخصصة لتحسين الكفاءة", "نمذجة السيناريوهات لتخطيط الأهداف"]
    },
    //  esgSection:
    esgSection: { 
      title: "أصبح سهلاً ESG الامتثال لمعايير",
      description: "أدوات مبسطة لجمع البيانات وبناء التقارير بثقة...",
      points: [ "جاهزة للاستخدام ESG قوالب تقارير", "تتبع دقيق للبيانات للتدقيق", "تبسيط الامتثال التنظيمي" ]
    },
    // dashboard:
    dashboard: {
      title: "لوحة المعلومات",
      totalEmissions: "إجمالي الانبعاثات",
      scope1: "انبعاثات النطاق 1",
      scope2: "انبعاثات النطاق 2",
      scope3: "انبعاثات النطاق 3",
      vs_last_month: "عن الشهر الماضي",
      tons_co2: "طن مكافئ ثاني أكسيد الكربون",
      emissions_trend: "اتجاه الانبعاثات بمرور الوقت",
      good_progress: "تقدم جيد",
      years_remaining: "باقي 5 سنوات لتحقيق الهدف"
    },
    // chatbot:
    chatbot: {
      title: "مساعد CarbonEmission الذكي",
      online: "متصل الآن",
      welcome_message: "مرحباً! أنا مساعد CarbonEmission الذكي. كيف يمكنني مساعدتك اليوم؟",
      placeholder: "اكتب رسالتك هنا...",
      quick_question_1: "كيف أحسب انبعاثاتي؟",
      quick_question_2: "ما هي تقارير ESG؟",
      quick_question_3: "كيف أقلل الانبعاثات؟"
    },
    //  checkout:
    checkout: {
      back: "العودة للأسعار",
      title: "إتمام الاشتراك",
      subtitle: "أكمل عملية الدفع للبدء في إدارة انبعاثاتك الكربونية باحترافية.",
      summary: "فاتورة الاشتراك",
      monthly: "اشتراك شهري (Pro)",
      subtotal: "المبلغ الأساسي",
      tax: "ضريبة القيمة المضافة (14%)",
      total: "الإجمالي المستحق",
      promoPlaceholder: "أدخل كود الخصم (مثال: ATHER20)",
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
    // footer:
    footer: {
      ctaTitle: "انتقل باستدامتك إلى المستوى التالي",
      ctaSubtitle: "ابدأ اليوم رحلتك نحو صافي انبعاثات صفري مع انبعاثات الكربون",
      ctaButton: "ابدأ التقييم المجاني",
      siteName: "انبعاثات الكربون",
      description: "إدارة انبعاثات الكربون والاستدامة بدعم من الذكاء الاصطناعي لتحقيق مستقبل أخضر.",
      productTitle: "المنتج",
      companyTitle: "الشركة",
      legalTitle: "قانوني",
      aiInsights: "تحليلات الذكاء الاصطناعي",
      aboutUs: "من نحن",
      contact: "اتصل بنا",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة"
    },
    // Terms:
    Terms: {
      dir: "rtl",
      mainTitle: "شروط الخدمة",
      subTitle: "Terms of Service | القواعد التي تنظم استخدامك للمنصة",
      cards: [
        { id: 1, title: "قبول الشروط", desc: "باستخدامك لمنصة Carbon Emission، فإنك توافق على الالتزام بشروط الخدمة والقوانين البيئية المعمول بها.", icon: Scale },
        { id: 2, title: "دقة البيانات", desc: "دقة البيانات المدخلة (استهلاك طاقة، وقود) هي مسؤولية المستخدم لضمان صحة نتائج البصمة الكربونية.", icon: CheckCircle2 },
        { id: 3, title: "الاستخدام المقبول", desc: "يُحظر استخدام التقارير المستخرجة لأغراض تضليلية أو غير قانونية تخالف المعايير الدولية للاستدامة.", icon: AlertTriangle }
      ]
    },
    //  Privacy:
    Privacy: {
      title: "سياسة الخصوصية",
      footerNote: "بياناتك مشفرة ولا تُشارك مع أي جهة خارجية.",
      cards: [
        { title: "جمع البيانات", text: "نلتزم بحماية بياناتك الصناعية، ونجمع استهلاك الطاقة والوقود فقط لحساب بصمتك بدقة." },
        { title: "أمن المعلومات", text: "بياناتك مشفرة بتقنية AES-256 العالمية، مما يضمن خصوصية تامة لتقارير شركتك." }
      ]
    }
  },

  en: {
    siteName: "Carbon Emissions",
    login: "Login",
    signUp: "Sign Up",
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      next: "Next",
      previous: "Previous",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      filter: "Filter"
    },
    //  nav:
    nav: {
      features: "Features",
      howItWorks: "How it Works",
      pricing: "Pricing",
      contact: "Contact Us",
      dashboard: "Dashboard",
      emissionsCalculator: "Emissions Calculator",
      aiInsights: "AI Insights",
      esgReports: "ESG Reports",
      reportsLog: "Reports Log",
      chatbot: "AI Assistant",
      companyTeam: "Company & Team",
      settings: "Settings",
      logout: "Logout"
    },
    //  hero:
    hero: {
      titleLine1: "Measure Emissions, Manage Smartly, Reduce Easily",
      titleLine2: "Your Global Platform for Sustainability Intelligence",
      subtitle1: "The integrated platform combining environmental protection and business growth",
      subtitle2: "Monitor, analyze, and comply with global standards effortlessly",
      subtitle3: "Start your sustainability journey today",
      button1: "Start Free Assessment",
      button2: "Request Demo"
    },
//   howItWorks: 
howItWorks: {
  title: "How it Works?",
  subtitle: "Simple steps toward smart and sustainable environmental management for your project",
  list: [
    { 
      id: 1, 
      title: 'Reduce Environmental Impact', 
      desc: 'AI-powered insights and actionable recommendations to reduce your carbon footprint.' 
    },
    { 
      id: 2, 
      title: 'Sustainability Management', 
      desc: 'Track progress, set goals, and plan initiatives to effectively control your environmental impact.' 
    },
    { 
      id: 3, 
      title: 'Emission Measurement', 
      desc: 'A powerful system for data collection and analysis to accurately calculate Scope 1, 2, and 3 emissions.' 
    }
  ]
},
    //  featuresGrid: 
    featuresGrid: {
      title: "Powerful Features for Impactful Results",
      subtitle: "The platform is designed to help you excel in sustainability management",
      list: [
        { id: 4, title: "Automated ESG Reports", desc: "Create comprehensive ESG reports with less effort and compliance." },
        { id: 5, title: "Actionable AI Insights", desc: "Personalized recommendations powered by AI for emission reduction opportunities." },
        { id: 6, title: "Smart Emissions Calculator", desc: "Accurate calculation of Scope 1, 2, and 3 emissions for full impact visibility." },
        { id: 7, title: "Global Compliance Standards", desc: "Ensure alignment with the latest regulatory frameworks and sustainability standards." },
        { id: 8, title: "Team & Task Management", desc: "Easily distribute tasks and track sustainability responsibilities across your team." },
        { id: 9, title: "Net Zero Progress Tracking", desc: "Monitor your progress toward Net Zero goals through intuitive dashboards." }
      ]
    },
     //  testimonials
    testimonials: {
      title: "What Our Clients Say",
      subtitle: "Leading companies trust Carbon Emissions to achieve sustainability goals",
      list: [
        { id: 1, text: "Carbon Emissions changed the way we manage our emissions, AI insights are invaluable.", name: "Layla Ahmed", role: "Sustainability Manager, Green Holding", image: "/imag1.png" },
        { id: 2, text: "The platform's ease of use and ability to simplify ESG reporting exceeded our expectations.", name: "Mohamed Said", role: "Operations Manager, Future Solutions", image: "/image2.png" },
        { id: 3, text: "We have become more transparent and efficient in our environmental efforts thanks to Carbon Emissions.", name: "Fatma Al-Zahra", role: "Head of Sustainability, Al-Nakheel Investments", image: "/image.png" },
        { id: 4, text: "Invaluable help in understanding and mitigating our carbon footprint. Essential for any company.", name: "Omar Jassim", role: "CEO, Tech Pioneers", image: "/img4.png" }
      ]
    },
    //  pricing:
    pricing: {
  title: "Flexible Pricing Plans",
  subtitle: "Choose the plan that fits your company's sustainability needs",
  buttonText: "Get Started",
  plans: [
    { name: "Basic", price: "Free", features: ["Scope 1 & 2 Calculation", "Simple Goal Tracking", "Basic PDF Reports"] },
    { name: "Professional", price: "$99", period: "mo", featured: true, features: ["All Basic Features", "Scope 3 Calculation", "AI Insights", "Technical Support"] },
    { name: "Enterprise", price: "Contact Us", features: ["Multi-team Management", "Custom API Integration", "Advanced ESG Reports", "24/7 Support"] }
  ]
},
    //  dashboard:
    dashboard: {
      title: "Dashboard",
      totalEmissions: "Total Emissions",
      scope1: "Scope 1 Emissions",
      scope2: "Scope 2 Emissions",
      scope3: "Scope 3 Emissions",
      vs_last_month: "vs last month",
      tons_co2: "Tons CO2e",
      emissions_trend: "Emissions Trend Over Time",
      good_progress: "Good Progress",
      years_remaining: "5 years remaining to achieve target"
    },
    // chatbot:
    chatbot: {
      title: "CarbonEmission AI Assistant",
      online: "Online now",
      welcome_message: "Hello! I'm CarbonEmission AI Assistant. How can I help you today?",
      placeholder: "Type your message here...",
      quick_question_1: "How do I calculate my emissions?",
      quick_question_2: "What are ESG reports?",
      quick_question_3: "How to reduce emissions?"
    },
  //   checkout:
    checkout: {
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
    },

    //  footer:
    footer: {
      ctaTitle: "Take your sustainability to the next level",
      ctaSubtitle: "Start your journey towards Net Zero with Carbon Emission today",
      ctaButton: "Start Free Assessment",
      siteName: "Carbon Emission",
      description: "AI-powered sustainability and carbon emissions management.",
      productTitle: "Product",
      companyTitle: "Company",
      legalTitle: "Legal",
      aiInsights: "AI Insights",
      aboutUs: "About Us",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    },
    //   Terms:
    Terms: {
      dir: "ltr",
      mainTitle: "Terms of Service",
      subTitle: "Rules governing your use of the platform",
      cards: [
        { id: 1, title: "Acceptance of Terms", desc: "By using Carbon Emission, you agree to comply with our terms of service and environmental laws.", icon: Scale },
        { id: 2, title: "Data Accuracy", desc: "Accuracy of input data (energy, fuel) is your responsibility to ensure valid carbon footprint results.", icon: CheckCircle2 },
        { id: 3, title: "Acceptable Use", desc: "Reports may not be used for misleading or illegal purposes violating sustainability standards.", icon: AlertTriangle }
      ]
    },
    //  Privacy
    Privacy: {
      title: "Privacy Policy",
      footerNote: "Your data is encrypted and never shared with third parties.",
      cards: [
        { title: "Data Collection", text: "We protect your industrial data, collecting only energy and fuel usage for accurate footprinting." },
        { title: "Information Security", text: "Your data is encrypted with AES-256 standards, ensuring total privacy for your reports." }
      ]
    }
  }
};

export default translations;