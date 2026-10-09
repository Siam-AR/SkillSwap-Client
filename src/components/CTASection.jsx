"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
    return (
        <section className="w-full relative z-10 pt-16 lg:pt-24 2xl:pt-32 pb-0 mb-0 bg-white overflow-hidden">
            {/* Full Bleed Background with Taskify Teal Corner Waves */}
            <div className="absolute inset-0 w-full h-full pointer-events-none -z-20">
                {/* Top Left Wave - Taskify Teal Palette */}
                <svg
                    className="absolute top-0 left-0 w-[240px] sm:w-[380px] lg:w-[520px] 2xl:w-[700px] h-[240px] sm:h-[380px] lg:h-[520px] 2xl:h-[700px] pointer-events-none opacity-80"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0,300 C 200,350 300,150 500,0 L0,0 Z" fill="#E6F6F4" />
                    <path d="M0,200 C 150,250 200,100 350,0 L0,0 Z" fill="#A7E4DE" opacity="0.65" />
                </svg>

                {/* Bottom Right Wave - Taskify Teal Palette */}
                <svg
                    className="absolute bottom-0 right-0 w-[240px] sm:w-[380px] lg:w-[520px] 2xl:w-[700px] h-[240px] sm:h-[380px] lg:h-[520px] 2xl:h-[700px] pointer-events-none transform rotate-180 opacity-80"
                    viewBox="0 0 500 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0,300 C 200,350 300,150 500,0 L0,0 Z" fill="#E6F6F4" />
                    <path d="M0,200 C 150,250 200,100 350,0 L0,0 Z" fill="#A7E4DE" opacity="0.65" />
                </svg>
            </div>

            <div className="max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 pb-16 lg:pb-24 2xl:pb-32 relative z-10 text-center">
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
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl 2xl:max-w-4xl mx-auto text-center">
                        <span className="block">Ready to turn your ideas into</span>
                        <span className="block text-[#009689] whitespace-nowrap">completed tasks?</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-4 text-slate-600 text-sm sm:text-base lg:text-lg 2xl:text-xl max-w-xl 2xl:max-w-2xl mx-auto leading-relaxed">
                        Join thousands of businesses and skilled freelancers getting micro-tasks done faster with verified talent and zero payment risk.
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <Link
                            href="/post-task"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 lg:px-8 lg:py-3.5 2xl:px-9 2xl:py-4 text-sm lg:text-base 2xl:text-lg font-semibold rounded-xl 2xl:rounded-2xl bg-[#009689] lg:hover:bg-[#238B81] text-white shadow-lg shadow-teal-900/15 lg:hover:shadow-teal-900/25 lg:hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
                        >
                            Post a Task Free
                            <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" />
                        </Link>

                        <Link
                            href="/browse-tasks"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 lg:px-8 lg:py-3.5 2xl:px-9 2xl:py-4 text-sm lg:text-base 2xl:text-lg font-semibold rounded-xl 2xl:rounded-2xl bg-white border border-teal-200 text-[#009689] lg:hover:bg-teal-50 lg:hover:-translate-y-0.5 transition-all duration-300 shadow-sm min-h-[44px]"
                        >
                            Browse Open Tasks
                        </Link>
                    </div>

                    {/* Trust Guarantees */}
                    <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm 2xl:text-base text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#2CA99F]" />
                            <span>Free to post tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#2CA99F]" />
                            <span>Escrow protected funds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#2CA99F]" />
                            <span>No subscription required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}