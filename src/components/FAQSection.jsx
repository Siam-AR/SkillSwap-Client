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
        
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
            Frequently Asked <span className="text-[#009689]">Questions</span>
          </h2>
          <p className="mt-3 text-slate-600 text-center text-sm sm:text-base max-w-xl mx-auto">Everything you need to know about getting work done and hiring top talent securely on Taskify.</p>
        </div>

        {/* FAQ Items Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(isActive ? null : index)}
              >
                <div
                  className={`backdrop-blur-md border rounded-2xl p-5 sm:p-6 transition-all duration-700 ease-out cursor-pointer 
                  ${isActive 
                    ? "bg-gradient-to-r from-[#009689] to-[#2CA99F] border-[#009689] shadow-lg shadow-teal-900/15 -translate-y-0.5" 
                    : "bg-white/80 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`font-semibold text-base sm:text-lg transition-colors duration-700 ease-out ${isActive ? "text-white" : "text-slate-900"}`}>
                      {faq.question}
                    </h3>
                    <div 
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-700 ease-out
                      ${isActive ? "bg-white/20" : "bg-teal-50/60"}`}
                    >
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-700 ease-out 
                        ${isActive ? "text-white rotate-180" : "text-teal-600"}`} 
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isActive ? "auto" : 0, 
                      opacity: isActive ? 1 : 0 
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.55, ease: "easeInOut" }
                    }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 pt-3 border-t transition-colors duration-700 ease-out ${isActive ? "border-white/20" : "border-slate-100/80"}`}>
                      <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-700 ease-out ${isActive ? "text-teal-50" : "text-slate-600"}`}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
