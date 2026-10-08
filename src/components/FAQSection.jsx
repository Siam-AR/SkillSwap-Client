"use client";

import { useState } from "react";
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
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-16 sm:py-24 relative z-10 bg-transparent">
      <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
            Frequently Asked <span className="text-[#009689]">Questions</span>
          </h2>
          <p className="mt-3 text-slate-600 text-center text-sm sm:text-base max-w-xl mx-auto">Everything you need to know about getting work done and hiring top talent securely on Taskify.</p>
        </div>

        {/* FAQ Items Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFAQ(index)}
                  className={`w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-in-out cursor-pointer 
                  ${isOpen 
                    ? "bg-[#009689] text-white shadow-lg shadow-teal-900/10 border-teal-600" 
                    : "bg-white/90 lg:hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm lg:hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base lg:text-lg font-semibold transition-colors duration-300 ease-in-out ${isOpen ? "text-white" : "text-slate-900"}`}>
                      {faq.question}
                    </h3>
                    <div 
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ease-in-out
                      ${isOpen ? "bg-white/20" : "bg-teal-50/60"}`}
                    >
                      <ChevronDown 
                        className={`w-5 h-5 shrink-0 transition-transform duration-300 ease-in-out 
                        ${isOpen ? "rotate-180 text-white" : "rotate-0 text-slate-400"}`} 
                      />
                    </div>
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mt-4 pt-3 border-t transition-colors duration-300 ease-in-out border-white/20">
                        <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ease-in-out ${isOpen ? "text-teal-50/90" : "text-slate-500"}`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
