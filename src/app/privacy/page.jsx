import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50 relative z-10">
      <div className="w-full max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-6 py-16 md:py-20 lg:py-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-[#009689] text-xs font-semibold tracking-wider uppercase mb-4">
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Updated: October 2026
          </p>
          <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
            We are committed to protecting your privacy. This policy outlines how we collect, use, and protect your information to deliver a secure Taskify experience.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 md:p-12">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 first:mt-0">Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            We collect information you provide directly to us when you create an account, update your profile, or interact with others. This includes your account details, profile info, communication logs, and secure payment metadata via Stripe.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Information</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            We use the information we collect to operate, maintain, and improve the Taskify platform. This includes matching clients and freelancers based on skills, processing payouts securely, and authenticating sessions using Better-Auth.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Data Protection & Sharing</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6">
            Your trust is our priority. We enforce strict non-disclosure of personal contact info to unauthorized third parties. We do not sell your personal data. Information is only shared when absolutely necessary to provide our services or comply with legal obligations.
          </p>
          
        </div>
      </div>
    </main>
  );
}
