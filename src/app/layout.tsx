import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "./ReactQueryProvider";
import Header from "@/components/custom/Header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Create your resume for next job using AI Resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ClerkProvider>
            <Header />
            {children}
            <Toaster />
          </ClerkProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
