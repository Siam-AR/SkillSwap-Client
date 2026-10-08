import React from "react";

export default function TermsOfServicePage() {
  return (
    <main className="w-full min-h-screen bg-slate-50 relative z-10">
      <div className="w-full max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-6 py-16 md:py-20 lg:py-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-[#009689] text-xs font-semibold tracking-wider uppercase mb-4">
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Updated: October 2026
          </p>
          <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
            By using Taskify, you agree to these rules and guidelines designed to keep our platform fair, secure, and professional.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 md:p-12">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 first:mt-0">User Accounts & Eligibility</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            Both clients and freelancers must provide accurate representation of their skills, identity, and intent. You are responsible for maintaining the security of your account and all activities that occur under it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tasks & Milestones</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            All tasks must comply with our community standards. We enforce specific rules for posting tasks, submitting work for approvals, fee structures, and cancellations. Payments for milestones are held securely and only released upon verifiable completion.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Intellectual Property</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            Unless otherwise agreed upon in writing, the client assumes full ownership of the completed and approved deliverables only upon final payout to the freelancer. Until final payment is released, the freelancer retains rights to the created work.
          </p>
          
        </div>
      </div>
    </main>
  );
}
