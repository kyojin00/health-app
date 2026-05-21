import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "특수건강진단 관리",
  description: "근로자 검진 일정 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
