import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/custom/Header";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthProvider } from "@/context/authUserContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/custom/Footer";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "ResumeXpress",
  description:
    "Create your resume for next job using ResumeXpress an AI Resume builder",
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
            <header id="no-print-area">
              <Header />
            </header>
            <main className="w-full h-full"> {children}</main>
            <footer className="mt-10" id="no-print-area">
              <Footer />
            </footer>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
