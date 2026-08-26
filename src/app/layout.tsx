import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "flmo — 메타 광고 리포트",
  description: "무신사 상품 이미지로 메타 광고를 만들고 성과를 추적하는 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand">
              flmo<span>.</span>
            </Link>
            <nav className="nav">
              <Link href="/studio">광고 만들기</Link>
              <Link href="/report">리포트</Link>
              <Link href="/settings">설정</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
