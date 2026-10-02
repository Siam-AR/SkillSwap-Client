"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does micro-task posting work on Taskify?",
    answer: "Simply create an account, click 'Post a Task', and describe what you need done. Set your budget and timeframe, and your task will instantly be visible to thousands of qualified freelancers ready to submit their proposals."
  },
  {
    question: "When do freelancers get paid for completed tasks?",
    answer: "Payment is held securely in escrow when the task is awarded. Once the employer reviews and approves the submitted work, funds are immediately released to the freelancer's Taskify wallet."
  },
  {
    question: "Is there a platform fee for employers or talent?",
    answer: "Employers can post tasks for free. We charge a small, transparent service fee on the freelancer side upon successful completion of a task to keep the platform running smoothly."
  },
  {
    question: "How does Taskify protect my payment and funds?",
    answer: "All transactions are secured using bank-level encryption. Our built-in milestone and escrow system ensures that clients only pay for approved work, and freelancers are guaranteed payment for completed tasks."
  },
  {
    question: "Can I hire freelancers for ongoing hourly projects?",
    answer: "Yes! While we specialize in fixed-price micro-tasks, you can easily negotiate ongoing hourly contracts with freelancers you've built trust with through our platform."
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="w-full py-16 sm:py-24 relative z-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#009689] mb-3">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-center text-base sm:text-lg">
            Everything you need to know about getting work done and hiring top talent securely on Taskify.
          </p>
        </div>

        {/* FAQ Items Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(isActive ? null : index)}
              >
                <div
                  className={`bg-white/80 backdrop-blur-md border rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer 
                  ${isActive 
                    ? "border-[#2CA99F]/70 shadow-[0_8px_25px_rgba(0,150,137,0.08)]" 
                    : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                      {faq.question}
                    </h3>
                    <div 
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300
                      ${isActive ? "bg-teal-50" : "bg-slate-50 group-hover:bg-slate-100"}`}
                    >
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 
                        ${isActive ? "text-[#009689] rotate-180" : "text-slate-400 group-hover:text-slate-600"}`} 
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100/80 mt-4 pt-3">
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
