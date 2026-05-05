import { Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/contexts/LanguageContext'; 
import { cookies } from 'next/headers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-readex-pro", // Kept variable name the same so we don't have to change tailwind.config.js
});

export const metadata = {
  title: "Carbon Emission - Track Your Carbon Footprint",
  description: "Track and manage your company's carbon emissions",
  icons: {
    icon: '/Logo.jpg',
  },
};

import { Toaster } from 'react-hot-toast';

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('ecovision_locale')?.value || 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html 
      lang={locale} 
      dir={dir} 
      className={`${plusJakartaSans.variable} ${cairo.variable}`} 
      suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider initialLocale={locale}>
          <Toaster position="top-center" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}