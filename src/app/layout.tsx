import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WelcomeToast from "@/components/welcome-toast";

export const metadata: Metadata = {
  title: "ZERO STORE | سوق ليبيا المفتوح",
  description:
    "أول سوق ليبي مفتوح مجاني ليعرض فيه الجميع منتجاتهم وخدماتهم. أنشئ متجرك، أضف رقم هاتفك، وتفاوض مع المشترين عبر دردشة فورية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-body text-slate-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WelcomeToast />
      </body>
    </html>
  );
}
