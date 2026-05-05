"use client";
import Header from '@/components/LandingHeader';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-24"><Pricing /></main>
      <ScrollToTop />
      <Footer />
    </>
  );
}