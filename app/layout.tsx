import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getThemeBootScript } from "@/lib/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Marketing-DUE Chatbot",
    template: "%s | Marketing-DUE Chatbot",
  },
  description:
    "Website Marketing-DUE Chatbot hỗ trợ tư vấn tuyển sinh cho Khoa Marketing, Trường Đại học Kinh tế - Đại học Đà Nẵng.",
  icons: {
    icon: [{ url: "/images/Logo_DUE.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeBootScript() }} />
      </head>
      <body className="flex min-h-full flex-col bg-[#fffaf7] text-zinc-950 antialiased transition-colors dark:bg-[#120b08] dark:text-orange-50">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
