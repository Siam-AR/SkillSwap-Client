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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 items-start">
          
          {/* Column 1: Brand & Value Prop */}
          <div className="flex flex-col items-start space-y-4">
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

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" aria-label="X" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-[#009689] hover:border-[#009689] flex items-center justify-center transition-all duration-300 shadow-sm">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-[#009689] hover:border-[#009689] flex items-center justify-center transition-all duration-300 shadow-sm">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-[#009689] hover:border-[#009689] flex items-center justify-center transition-all duration-300 shadow-sm">
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-[#009689] hover:border-[#009689] flex items-center justify-center transition-all duration-300 shadow-sm">
                <FaGithub className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-1">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Browse Tasks", href: "/browse-tasks" },
                { label: "Top Freelancers", href: "/#top-freelancers" },
                { label: "How It Works", href: "/#working-process" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-1">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@taskify.com" className="group flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-slate-500 group-hover:text-[#2CA99F] transition-colors" />
                  hello@taskify.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/8801885373186" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-[#2CA99F] transition-colors" />
                  +880 1885 373186
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500" />
                Dhaka, Bangladesh
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
          <div className="flex items-center justify-center gap-6 flex-1">
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Trust & Safety</Link>
          </div>
          
          <button 
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/80 hover:bg-[#009689] text-slate-400 hover:text-white transition-all duration-300 shadow-sm border border-slate-800 hover:border-[#009689] group shrink-0"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
