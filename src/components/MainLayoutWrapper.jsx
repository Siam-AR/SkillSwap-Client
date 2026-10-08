"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Do not render global Navbar/Footer on dashboard routes
  // (Dashboard has its own dedicated layouts)
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Navbar key="global-navbar" />
      <div className="flex-grow flex flex-col w-full">
        {children}
      </div>
      <Footer key="global-footer" />
    </div>
  );
}
