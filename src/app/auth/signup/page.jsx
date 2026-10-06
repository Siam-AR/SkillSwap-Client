"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSession, signIn, signUp } from "@/lib/auth-client";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Briefcase, 
  UserCheck, 
  Loader2 
} from "lucide-react";

function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [role, setRole] = useState("Client");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [showPassword, setShowPassword] = useState(false);

    const redirectByRole = (selectedRole) => {
        if (selectedRole === "Freelancer") return "/dashboard/freelancer";
        if (selectedRole === "Admin") return "/dashboard/admin";
        return "/dashboard/client";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            await signUp.email({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role,
                callbackURL: redirectTo,
            });

            const sessionResponse = await getSession();
            const selectedRole = sessionResponse?.data?.user?.role || role;
            setMessage("Account created successfully. Redirecting...");
            router.replace(redirectByRole(selectedRole));
            router.refresh();
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Unable to create your account right now.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            await signIn.social({
                provider: "google",
                callbackURL: redirectTo,
                requestSignUp: true,
                additionalData: { role: "Client" },
            });
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Google sign up failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            
            <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                
                {/* 1. Left Minimal Brand Banner (Span 5) */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-8 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#009689]/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Top Logo & Exit */}
                    <div className="relative z-10 flex items-center justify-between">
                        <Link className="inline-flex items-center gap-2 group" href="/">
                            <div className="w-8 h-8 rounded-xl bg-[#009689] flex items-center justify-center font-black text-white text-base shadow-sm">
                                T
                            </div>
                            <span className="font-extrabold text-lg tracking-tight">Taskify</span>
                        </Link>
                        <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-all" href="/">
                            <ArrowLeft className="w-3.5 h-3.5"/>
                            <span>Website</span>
                        </Link>
                    </div>

                    {/* Center Value Pitch */}
                    <div className="relative z-10 my-auto py-8 space-y-3">
                        <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-full inline-block">
                            JOIN THE WORKSPACE
                        </span>
                        <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-snug">
                            Work with top talent or find great contracts.
                        </h2>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Safe milestone escrows, transparent reviews, and zero onboarding hassle.
                        </p>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Taskify Platform</span>
                        <Link className="hover:text-white font-medium transition-colors" href={`/auth/signin${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}>
                            Sign In →
                        </Link>
                    </div>
                </div>

                {/* 2. Right Compact Form Canvas (Span 7) */}
                <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-center">
                    
                    {/* Header */}
                    <div className="mb-5">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#009689] uppercase bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1">
                            GET STARTED
                        </span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Choose your account type and start collaborating.
                        </p>
                    </div>

                    {message ? (
                        <div
                            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                                messageType === "error"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-teal-200 bg-teal-50 text-teal-800"
                            }`}
                        >
                            {message}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* 1. ROLE SELECTION (Moved to Top) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">I want to</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Client Button */}
                                <button
                                    type="button"
                                    onClick={() => setRole("Client")}
                                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                                        role === "Client"
                                            ? "border-[#009689] bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl shrink-0 ${
                                        role === "Client" ? "bg-[#009689] text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                        <UserCheck className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-xs text-slate-900 leading-tight">Hire Talent</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Client account</p>
                                    </div>
                                </button>

                                {/* Freelancer Button */}
                                <button
                                    type="button"
                                    onClick={() => setRole("Freelancer")}
                                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                                        role === "Freelancer"
                                            ? "border-[#009689] bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl shrink-0 ${
                                        role === "Freelancer" ? "bg-[#009689] text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                        <Briefcase className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-xs text-slate-900 leading-tight">Work as Talent</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Freelancer account</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* 2. FULL NAME & EMAIL (2-Column Grid on sm+) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. PASSWORD */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                                </button>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-900/15 hover:shadow-lg hover:shadow-teal-900/25 transition-all disabled:opacity-50 mt-1"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Create Free Account"}
                        </button>

                        {/* DIVIDER */}
                        <div className="relative my-3 flex items-center justify-center">
                            <div className="absolute w-full border-t border-slate-200" />
                            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
                                Or sign up with
                            </span>
                        </div>

                        {/* GOOGLE OAUTH BUTTON */}
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                    </form>

                    {/* Bottom Switcher */}
                    <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                        Already have an account?{" "}
                        <Link className="font-bold text-[#009689] hover:underline" href={`/auth/signin${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}>
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return <Suspense fallback={<div className="p-6 text-center text-sm text-slate-600">Loading sign up page...</div>}><SignUpContent /></Suspense>;
}