"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getSession, signIn } from "@/lib/auth-client";
import { ArrowLeft, CheckCircle2, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [showPassword, setShowPassword] = useState(false);

    const isSignUp = false;

    const redirectByRole = (role) => {
        if (role === "Freelancer") return "/dashboard/freelancer";
        if (role === "Admin") return "/dashboard/admin";
        if (role === "Client") return "/dashboard/client";
        return redirectTo;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            await signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: redirectTo,
            });

            const sessionResponse = await getSession();
            const role = sessionResponse?.data?.user?.role || "Client";
            setMessage("Sign in successful. Redirecting...");
            router.replace(redirectByRole(role));
            router.refresh();
        } catch (error) {
            setMessageType("error");
            setMessage(error?.message || "Unable to sign in. Check your email and password.");
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
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
            setMessage(error?.message || "Google sign in failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Brand Banner: Minimal & Elegant */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-10 flex-col justify-between relative overflow-hidden text-white">
                    {/* Ambient decorative glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#009689]/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Top: Logo & Exit to Website */}
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

                    {/* Center: Clean & Punchy Hero Statement */}
                    <div className="relative z-10 my-auto py-10 space-y-4">
                        <span className="text-[10px] font-bold tracking-widest text-[#009689] uppercase bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-full inline-block">
                            FREELANCE WORKSPACE
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                            Where top talent connects with high-impact work.
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                            Safe milestone escrows, direct proposals, and transparent reviews.
                        </p>
                    </div>

                    {/* Bottom: Minimal Footer */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Taskify Platform</span>
                        <Link className="hover:text-white font-medium transition-colors" href="/browse-tasks">
                            Browse Tasks →
                        </Link>
                    </div>
                </div>

                {/* Form Canvas */}
                <div className="p-8 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center">
                    <div className="mb-7">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#009689] uppercase bg-teal-50 px-2.5 py-1 rounded-md inline-block mb-2">
                            SECURE LOGIN
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Welcome back to Taskify
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Enter your credentials or continue with Google to access your dashboard.
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
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700">Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
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
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#009689] hover:bg-[#238B81] text-white text-sm font-bold shadow-md shadow-teal-900/15 hover:shadow-lg hover:shadow-teal-900/25 transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Sign In to Workspace"}
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
                        onClick={handleGoogleSignIn}
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
                        Don't have an account yet?{" "}
                        <Link className="font-bold text-[#009689] hover:underline" href={`/auth/signup${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return <Suspense fallback={<div className="p-6 text-center text-sm text-slate-600">Loading sign in page...</div>}><SignInContent /></Suspense>;
}