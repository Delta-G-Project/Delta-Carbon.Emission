"use client";
import Header from '@/components/LandingHeader';
import FeaturesGrid from '@/components/FeaturesGrid';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="pt-24"><FeaturesGrid /></main>
      <ScrollToTop />
      <Footer />
    </>
  );
}