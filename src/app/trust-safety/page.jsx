import React from "react";

export default function TrustAndSafetyPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50 relative z-10">
      <div className="w-full max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-6 py-16 md:py-20 lg:py-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-[#009689] text-xs font-semibold tracking-wider uppercase mb-4">
            Safety First
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Trust & Safety
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Updated: October 2026
          </p>
          <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
            We build tools and enforce policies to ensure that every task on Taskify is completed securely and fairly.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 md:p-12">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 first:mt-0">Escrow & Milestone Protection</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            Your money is safe. Funds are held securely in escrow prior to project kick-off. Payments are released to the freelancer only upon client milestone approval, ensuring both parties are protected throughout the engagement.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            If things don't go as planned, we're here to help. Taskify features a built-in mediation workflow for deliverable discrepancies or missed deadlines, providing a fair resolution process for both clients and freelancers.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Anti-Fraud & Community Standards</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            We maintain a zero tolerance policy for off-platform payment solicitation, harassment, or fake identities. Our systems actively monitor for suspicious activity to maintain a trustworthy professional environment.
          </p>
          
        </div>
      </div>
    </main>
  );
}
