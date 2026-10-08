import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Taskify \u2014 Freelance Micro-Task Marketplace",
  description: "Taskify is a freelance micro-task marketplace built to match clients with freelancers for quick, one-time jobs.",
  openGraph: {
    title: "Taskify \u2014 Freelance Micro-Task Marketplace",
    description: "Taskify is a freelance micro-task marketplace built to match clients with freelancers for quick, one-time jobs.",
    siteName: "Taskify",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased landing-bg`} suppressHydrationWarning>
        <SmoothScrollProvider>
          <main className="flex-grow">
            {children}
          </main>
          <ToastContainer position="bottom-right" />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
