"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Mail, MessageSquare, MapPin, ArrowRight, ChevronUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0B1320] border-t border-slate-800/80 overflow-hidden">
      {/* Ambient Teal Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-24 bg-gradient-to-b from-teal-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="w-full max-w-[1500px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 2xl:px-16 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 items-start">
          
          {/* Column 1: Brand & Value Prop */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#009689]/20 shadow-[0_0_15px_rgba(0,150,137,0.15)] overflow-hidden">
                <img src="/logo.svg" alt="Taskify Logo" className="h-8 w-8 object-contain" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Taskify
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              Connect clients and freelancers for fast, reliable task delivery with a polished and secure experience.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009689] hover:bg-[#008075] text-white text-sm font-semibold transition-all shadow-md shadow-teal-950/20"
            >
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase mb-1">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Browse Tasks", href: "/browse-tasks" },
                  { label: "Browse Freelancers", href: "/browse-freelancers" },
                  { label: "FAQ", href: "/#faq" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-block min-h-[44px] py-1 text-sm text-slate-400 lg:hover:text-teal-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase mb-1">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@taskify.com" className="group flex items-center gap-3 min-h-[44px] py-1 text-sm text-slate-400 lg:hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-slate-500 lg:group-hover:text-teal-400 transition-colors" />
                    hello@taskify.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/8801885373186" target="_blank" rel="noreferrer" className="group flex items-center gap-3 min-h-[44px] py-1 text-sm text-slate-400 lg:hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4 text-slate-500 lg:group-hover:text-teal-400 transition-colors" />
                    +880 1885 373186
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400 min-h-[44px] py-1">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Dhaka, Bangladesh
                </li>
                <li className="pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/80 text-xs font-medium text-slate-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Platform Operational
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <p className="text-xs text-slate-500 shrink-0">
            © {new Date().getFullYear()} Taskify. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 flex-1">
            <Link href="#" className="flex items-center text-xs text-slate-500 lg:hover:text-slate-300 transition-colors min-h-[44px]">Privacy Policy</Link>
            <Link href="#" className="flex items-center text-xs text-slate-500 lg:hover:text-slate-300 transition-colors min-h-[44px]">Terms of Service</Link>
            <Link href="#" className="flex items-center text-xs text-slate-500 lg:hover:text-slate-300 transition-colors min-h-[44px]">Trust & Safety</Link>
          </div>
          
          <button 
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/80 lg:hover:bg-[#009689] text-slate-400 lg:hover:text-white transition-all duration-300 shadow-sm border border-slate-800 lg:hover:border-[#009689] group shrink-0"
          >
            <ChevronUp className="w-5 h-5 lg:group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
