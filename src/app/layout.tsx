import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blood Bank Management System",
  description: "Online Blood Bank Management System for donors, recipients, and administrators",
  keywords: ["Blood Bank", "Donation", "Healthcare", "Management System"],
  authors: [{ name: "Blood Bank Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Blood Bank Management System",
    description: "Online Blood Bank Management System for donors, recipients, and administrators",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Bank Management System",
    description: "Online Blood Bank Management System for donors, recipients, and administrators",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
