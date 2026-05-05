"use client";
import Header from '@/components/LandingHeader';
import HowItWorks from '@/components/AboutSection'; // ده البديل لـ كيف نعمل
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <HowItWorks />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}