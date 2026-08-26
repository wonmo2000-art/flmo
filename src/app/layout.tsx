import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "flmo — 메타 광고 리포트",
  description: "메타 광고 계정을 연결하고 성과 리포트를 받아보는 대시보드",
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
              <Link href="/report">리포트</Link>
              <Link href="/setup">설정</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
