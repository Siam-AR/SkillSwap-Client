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
  },
  {
    question: "How does Taskify protect payments and handle disputes?",
    answer: "Funds are held securely in escrow once a milestone begins and are only released when the client approves the completed deliverable. If an issue arises, our resolution team steps in to mediate."
  }
];

export default function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderFAQCard = (faq, index) => {
    const isOpen = !!openIndexes[index];

    return (
      <div key={index} className="relative group">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => toggleFAQ(index)}
          className={`w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out cursor-pointer border backdrop-blur-sm
          ${isOpen 
            ? "bg-white/95 border-teal-300 shadow-[0_8px_30px_rgba(0,150,137,0.12)] -translate-y-[2px]" 
            : "bg-white/60 border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:bg-white/80 hover:border-teal-200 hover:shadow-[0_8px_30px_rgba(0,150,137,0.08)] hover:-translate-y-[2px]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="flex-1 text-left text-base lg:text-lg font-semibold text-slate-800 leading-snug pt-1 transition-colors duration-300">
              {faq.question}
            </h3>
            <div 
              className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300
              ${isOpen ? "bg-teal-50" : "bg-slate-100/80 group-hover:bg-teal-50/60"}`}
            >
              <ChevronDown 
                className={`w-5 h-5 shrink-0 transition-transform duration-300 
                ${isOpen ? "rotate-180 text-teal-600" : "rotate-0 text-slate-400 group-hover:text-teal-500"}`} 
              />
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const midPoint = Math.ceil(faqs.length / 2);

  return (
    <section className="w-full py-16 sm:py-24 relative z-10 bg-transparent">
      <div className="w-full max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
            Frequently Asked <span className="text-[#009689]">Questions</span>
          </h2>
          <p className="mt-3 text-slate-600 text-center text-sm sm:text-base max-w-xl mx-auto">Everything you need to know about getting work done and hiring top talent securely on Taskify.</p>
        </div>

        {/* FAQ Items Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full items-start">
          <div className="flex flex-col gap-4 lg:gap-6">
            {faqs.slice(0, midPoint).map((faq, index) => renderFAQCard(faq, index))}
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            {faqs.slice(midPoint).map((faq, index) => renderFAQCard(faq, index + midPoint))}
          </div>
        </div>
      </div>
    </section>
  );
}
