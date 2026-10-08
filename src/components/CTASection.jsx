"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
    return (
        <section className="w-full relative z-10 pt-16 lg:pt-24 pb-0 mb-0 bg-white overflow-hidden">
            {/* Full Bleed Background with Taskify Teal Corner Waves */}
            <div className="absolute inset-0 w-full h-full pointer-events-none -z-20">
                {/* Top Left Wave - Taskify Teal Palette */}
                <svg
                    className="absolute top-0 left-0 w-[240px] sm:w-[380px] lg:w-[520px] h-[240px] sm:h-[380px] lg:h-[520px] pointer-events-none opacity-80"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0,300 C 200,350 300,150 500,0 L0,0 Z" fill="#E6F6F4" />
                    <path d="M0,200 C 150,250 200,100 350,0 L0,0 Z" fill="#A7E4DE" opacity="0.65" />
                </svg>

                {/* Bottom Right Wave - Taskify Teal Palette */}
                <svg
                    className="absolute bottom-0 right-0 w-[240px] sm:w-[380px] lg:w-[520px] h-[240px] sm:h-[380px] lg:h-[520px] pointer-events-none transform rotate-180 opacity-80"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0,300 C 200,350 300,150 500,0 L0,0 Z" fill="#E6F6F4" />
                    <path d="M0,200 C 150,250 200,100 350,0 L0,0 Z" fill="#A7E4DE" opacity="0.65" />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 lg:pb-24 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Tagline Badge */}
                    {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-[#009689] text-xs sm:text-sm font-semibold tracking-wide mb-6">
                        <Sparkles className="w-4 h-4 text-[#2CA99F]" />
                        <span>START SMARTER WITH TASKIFY</span>
                    </div> */}

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
                        Ready to turn your ideas into{" "}
                        <span className="text-[#009689]">completed tasks?</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                        Join thousands of businesses and skilled freelancers getting micro-tasks done faster with verified talent and zero payment risk.
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <Link
                            href="/post-task"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[44px] rounded-xl bg-[#009689] lg:hover:bg-[#238B81] text-white font-semibold text-sm sm:text-base shadow-lg shadow-teal-900/15 lg:hover:shadow-teal-900/25 lg:hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Post a Task Free
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/browse-tasks"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[44px] rounded-xl bg-white border border-teal-200 text-[#009689] lg:hover:bg-teal-50 font-semibold text-sm sm:text-base lg:hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                        >
                            Browse Open Tasks
                        </Link>
                    </div>

                    {/* Trust Guarantees */}
                    <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#2CA99F]" />
                            <span>Free to post tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#2CA99F]" />
                            <span>Escrow protected funds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#2CA99F]" />
                            <span>No subscription required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}