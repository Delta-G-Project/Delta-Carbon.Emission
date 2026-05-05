
export default function DashboardLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

// import { LanguageProvider } from '@/contexts/LanguageContext'; 

// export default function RootLayout({ children }) {
//   return (
//     <html lang="ar" dir="rtl"> 
//       <body>
      
//         <LanguageProvider>
//           {children}
//         </LanguageProvider>
//       </body>
//     </html>
//   );
// }