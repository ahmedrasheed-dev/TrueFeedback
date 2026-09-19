import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/theme-toggle";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Anonymous conversations with privacy and intention.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f3ef] text-stone-900">
        <AuthProvider>
          <div className="fixed top-4 right-4 z-50 sm:top-6 sm:right-6">
            <ThemeToggle />
          </div>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
