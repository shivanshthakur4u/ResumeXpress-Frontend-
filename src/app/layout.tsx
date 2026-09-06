import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/custom/Header";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthProvider } from "@/context/authUserContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/custom/Footer";

const inter = localFont({ src: "./fonts/Inter.ttf", weight: "100 900", display: "swap" });
export const metadata: Metadata = {
  title: "ResumeXpress | AI Career Studio",
  description:
    "Turn your real experience into tailored resumes, cover letters and interview preparation in one AI career workspace.",
  keywords:
    "Free Resume Builder, AI Resume Builder, Online Resume Maker, ResumeXpress, Create Resume for Free, AI-Powered Resume Tool, Best Resume Builder, Free CV Maker, AI Resume Generator, Build Resume Online, Free Resume Templates, Professional Resume Builder, AI CV Builder, Free Resume Creator, AI Resume Assistance, Resume Builder for Job Seekers, Online Resume Generator, Free Resume Design, AI Resume Writing, Simple Resume Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //  console.log("pathname:", pathname)

  return (
    <html lang="en">
      <body className={`${inter.className} w-full min-h-[90dvh]`}>
        <ReactQueryProvider>
          <AuthProvider>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <header id="no-print-area" className="sticky top-0 z-40">
              <Header />
            </header>
            <main id="main-content" className="w-full h-full"> {children}</main>
            <footer className="self-end" id="no-print-area">
              <Footer />
            </footer>
            <Toaster toastOptions={{ style: { background: "#141e2c", color: "#edf2f7", border: "1px solid #2a3748", borderRadius: "12px" }, duration: 4500 }} />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
