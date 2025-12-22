import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미용실 예약 플랫폼",
  description: "간편한 미용실 예약 및 결제 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
