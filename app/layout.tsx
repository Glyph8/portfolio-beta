import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "강동윤(Dean) — 풀스택 엔지니어",
    template: "%s | 강동윤",
  },
  description:
    "보안(E2EE)과 인프라(배포/DB) 아키텍처를 깊이 이해하고, Next.js로 구현하는 T자형 풀스택 엔지니어 강동윤의 포트폴리오입니다.",
  keywords: [
    "강동윤",
    "Dean Kang",
    "풀스택 엔지니어",
    "Full-stack Engineer",
    "Next.js",
    "TypeScript",
    "E2EE",
    "End-to-End Encryption",
    "Spring Boot",
    "Nginx",
    "AWS EC2",
    "포트폴리오",
  ],
  authors: [{ name: "강동윤 (Dean Kang)" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "강동윤 포트폴리오",
    title: "강동윤(Dean) — 풀스택 엔지니어",
    description:
      "보안(E2EE)과 인프라(배포/DB) 아키텍처를 깊이 이해하고, Next.js로 구현하는 T자형 풀스택 엔지니어",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
