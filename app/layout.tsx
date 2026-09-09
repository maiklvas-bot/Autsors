import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DNS · Внешний персонал",
  description: "Управление сменами и табелем внешнего персонала РРС Тюмень",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
