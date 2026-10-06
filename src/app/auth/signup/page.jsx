"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSession, signIn, signUp } from "@/lib/auth-client";
import { ArrowLeft, CheckCircle2, Mail, Lock, Eye, EyeOff, Loader2, User, ImageIcon } from "lucide-react";

function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const [formData, setFormData] = useState({ name: "", email: "", image: "", password: "" });
    const [role, setRole] = useState("Client");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [showPassword, setShowPassword] = useState(false);

    const isSignUp = true;

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
                image: formData.image || undefined,
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
        <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                
                {/* Brand Hero Side Banner */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-10 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#009689]/20 rounded-full blur-2xl pointer-events-none" />

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

                    <div className="relative z-10 my-auto py-8 space-y-4">
                        <span className="text-[11px] font-bold tracking-widest text-[#009689] uppercase bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-full inline-block">
                            SMART FREELANCE ECOSYSTEM
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                            Find top talent or discover high-value contracts.
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            A decentralized workflow engine equipped with secure escrow settlements, milestone approvals, and verified contractor ratings.
                        </p>

                        <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#009689] shrink-0"/>
                                <span>Instant escrow protection for every milestone</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#009689] shrink-0"/>
                                <span>Direct proposal submissions with verified skills</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#009689] shrink-0"/>
                                <span>Transparent client & freelancer review scores</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Trusted by top developers</span>
                        <Link className="hover:text-white font-medium transition-colors" href="/browse-tasks">
                            Browse Tasks →
                        </Link>
                    </div>
                </div>

                {/* Form Canvas */}
                <div className="p-8 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center">
                    <div className="mb-7">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#009689] uppercase bg-teal-50 px-2.5 py-1 rounded-md inline-block mb-2">
                            START YOUR JOURNEY
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Create your Taskify account
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pick your role and unlock our verified freelance marketplace.
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

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
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
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Profile Image URL <span className="font-normal text-slate-400">(Optional)</span></label>
                            <div className="relative">
                                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://example.com/photo.jpg"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009689] focus:bg-white focus:ring-3 focus:ring-teal-500/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">At least 6 characters.</p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold text-slate-700">Select Account Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Client Option */}
                                <div
                                    onClick={() => setRole("Client")}
                                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                                        role === "Client"
                                            ? "border-[#009689] bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-extrabold text-sm text-slate-900">Client</span>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                            role === "Client" ? "border-[#009689] bg-[#009689]" : "border-slate-300"
                                        }`}>
                                            {role === "Client" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-tight">
                                        Post projects, hire talent, and manage milestone escrows.
                                    </p>
                                </div>

                                {/* Freelancer Option */}
                                <div
                                    onClick={() => setRole("Freelancer")}
                                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                                        role === "Freelancer"
                                            ? "border-[#009689] bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-extrabold text-sm text-slate-900">Freelancer</span>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                            role === "Freelancer" ? "border-[#009689] bg-[#009689]" : "border-slate-300"
                                        }`}>
                                            {role === "Freelancer" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-tight">
                                        Submit bids, deliver work, and get paid securely.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-bold shadow-md shadow-teal-900/15 hover:shadow-lg hover:shadow-teal-900/25 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Create Free Account"}
                            </button>
                        </div>
                    </form>

                    <div className="relative my-6 flex items-center justify-center">
                        <div className="w-full border-t border-slate-200" />
                        <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
                            Or continue with
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        className="w-full inline-flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-6 font-medium">
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