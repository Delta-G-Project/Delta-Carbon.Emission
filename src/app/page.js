"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/LandingHeader";
import Hero from "@/components/Hero";

const AboutSection = dynamic(() => import("@/components/AboutSection"));
const FeaturesGrid = dynamic(() => import("@/components/FeaturesGrid"));
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'));
const AIInsights = dynamic(() => import("@/components/AIInsights"));
const ESGCompliance = dynamic(() => import("@/components/ESGCompliance"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function HomePage() {
// Arabic
  const [language, setLanguage] = useState("ar");

  // Rtl-ltr
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
    
      <Header language={language} setLanguage={setLanguage} />
      
      <main>
        <Hero language={language} />
        <AboutSection/>
          <FeaturesGrid />
        <AIInsights />
        <ESGCompliance/>
        <Testimonials />
        <Pricing/>
        <Footer/>

      </main>
      <ScrollToTop />
    </>
    
  );
}