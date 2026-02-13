import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muchnik SEO Intelligence",
  description: "SEO tracking and analytics platform for Muchnik Elder Law",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
