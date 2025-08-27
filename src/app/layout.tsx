import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "../config/fonts";
import { AuthProvider } from "@/components";


export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop'
  },
  description: "Tienda virtual de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>          
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
