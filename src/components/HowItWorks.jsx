"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Post a Task",
    description: "Describe your micro-task requirements, set your budget, and publish it instantly for skilled freelancers to see.",
    cornerDecor: "top-left",
  },
  {
    number: "02",
    title: "Get Proposals",
    description: "Receive competitive proposals and bids from qualified freelance professionals ready to work on your project.",
    cornerDecor: "card2",
  },
  {
    number: "03",
    title: "Choose Freelancer",
    description: "Review profiles, portfolios, and ratings, then hire the best-fit talent for your specific job.",
    cornerDecor: "card3",
  },
  {
    number: "04",
    title: "Secure Payment & Complete",
    description: "Release payments securely upon successful task completion and download your deliverables.",
    cornerDecor: "bottom-right",
  },
];

export default function HowItWorks() {
  return (
    <section id="working-process" className="w-full bg-white relative z-10 py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header Structure */}
        <div className="flex flex-col items-center">
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-semibold text-[#009689] uppercase tracking-wider">
              WORKING PROCESS
            </h3>
            <div className="relative flex items-center justify-center mt-2 w-48 mx-auto">
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#009689] to-transparent"></div>
              <div className="absolute w-2 h-2 rounded-full bg-[#009689] ring-[3px] ring-[#F0FDF9]"></div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1A1A1A] text-center mt-6 tracking-tight">
            Get Work Done in <span className="text-[#009689]">4 Simple Steps</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 text-center max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
            A simple and efficient process designed to deliver fast and reliable results. Just post your task, and our platform handles the rest to help you achieve your goals smoothly.
          </p>
        </div>

      {/* Grid & Central Orbit Layout */}
      <div className="relative max-w-4xl mx-auto my-16 lg:my-24">
        
        {/* Center Graphic Hub */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-56 lg:h-56 items-center justify-center pointer-events-none z-20">
          <Image alt="Working Process Hub" className="object-contain" fill priority src="/icons/processLogo.svg"/>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-28 md:gap-y-12 items-stretch">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative overflow-hidden p-8 lg:p-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,150,137,0.12)]
                ${step.cornerDecor === "top-left" ? "rounded-3xl rounded-br-[42px] bg-gradient-to-br from-white/95 via-[#F0FDF9] to-[#E6F4F1] border border-teal-100/70" : ""}
                ${step.cornerDecor === "bottom-right" ? "rounded-3xl rounded-tl-[42px] bg-gradient-to-br from-[#E6F4F1] via-[#F0FDF9] to-white/95 border border-teal-100/70" : ""}
                ${step.cornerDecor === "card2" ? "rounded-3xl bg-gradient-to-tr from-teal-50/70 via-emerald-50/40 to-teal-100/50 border border-teal-200/70 shadow-[0_15px_40px_rgba(0,0,0,0.03)]" : ""}
                ${step.cornerDecor === "card3" ? "rounded-3xl bg-gradient-to-bl from-teal-50/70 via-emerald-50/40 to-teal-100/50 border border-teal-200/70 shadow-[0_15px_40px_rgba(0,0,0,0.03)]" : ""}
              `}
            >
              {/* Top-Left Card Fading Borders */}
              {step.cornerDecor === "top-left" && (
                <>
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#5EEAD4] to-transparent pointer-events-none" />
                  <div className="absolute top-1/4 bottom-1/4 right-0 w-[2px] bg-gradient-to-b from-transparent via-[#5EEAD4] to-transparent pointer-events-none" />
                </>
              )}

              {/* Bottom-Right Card Fading Borders */}
              {step.cornerDecor === "bottom-right" && (
                <>
                  <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#5EEAD4] to-transparent pointer-events-none" />
                  <div className="absolute top-1/4 bottom-1/4 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#5EEAD4] to-transparent pointer-events-none" />
                </>
              )}

              {/* Dot Pattern Decor */}
              {step.cornerDecor === "top-left" && (
                <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 pointer-events-none opacity-80">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-[#009689]" />
                  ))}
                </div>
              )}
              {step.cornerDecor === "bottom-right" && (
                <div className="absolute bottom-4 right-4 grid grid-cols-4 gap-1.5 pointer-events-none opacity-80">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-[#009689]" />
                  ))}
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full justify-center pt-8 sm:pt-6">
                <h4 className="text-4xl lg:text-5xl font-black text-[#009689] mb-3 tracking-tighter">
                  {step.number}
                </h4>
                <h5 className="text-lg lg:text-xl font-bold text-[#009689] mb-3">
                  {step.title}
                </h5>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        </div>
      </div>
    </section>
  );
}