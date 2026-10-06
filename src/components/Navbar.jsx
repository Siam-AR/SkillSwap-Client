"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { ChevronDown, User, LayoutDashboard, Briefcase, LogOut } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse-tasks", label: "Browse Tasks" },
  { href: "/browse-freelancers", label: "Browse Freelancers" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const user = sessionData?.user || null;
  const isAuthenticated = Boolean(user);
  const dashboardHref =
    isAuthenticated && user?.role
      ? `/dashboard/${user.role.toLowerCase()}`
      : "/auth/signin";
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileCard(false);
  }, [pathname]);

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialTheme = true;

    setIsDarkMode(initialTheme);
    setHasMounted(true);
    document.documentElement.classList.add("dark");
    window.localStorage.setItem("taskify-theme", "dark");
  }, []);

  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") {
      return;
    }

    document.documentElement.classList.add("dark");
    window.localStorage.setItem("taskify-theme", "dark");
  }, [hasMounted]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const avatarSrc =
    user?.image || user?.avatar || user?.profileImage || user?.picture || "";
  const avatarLabel = user?.name || user?.email || "Account";
  const avatarInitial = avatarLabel.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isHome = pathname === "/";
  const useTransparentTop = isHome && !isScrolled;

  const themeClasses = useMemo(
    () => ({
      shell: useTransparentTop
        ? "bg-transparent text-white border-transparent"
        : "bg-[#009689]/80 backdrop-blur-md border-b border-white/10 shadow-lg text-white",
      panel: isDarkMode ? "bg-slate-900/95" : "bg-white/95",
      profileCard: isDarkMode
        ? "border-slate-700 bg-slate-900 text-slate-100"
        : "border-slate-200 bg-white text-slate-900",
      link: (active) => [
        "relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
        useTransparentTop
          ? "text-white/90 hover:text-white"
          : "text-white/90 hover:text-white"
      ].join(" "),
      button: useTransparentTop
        ? "bg-transparent text-white border-white hover:bg-white/10"
        : "bg-transparent text-white border-white hover:bg-white/10",
      primaryButton: useTransparentTop
        ? "border-0 bg-[#009689] text-white hover:bg-[#008f80]"
        : "border-0 bg-white text-[#009689] shadow-sm hover:bg-slate-100",
      mobileItem: (active) => [
        "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
        active
          ? isDarkMode
            ? "bg-[#009689]/15 text-[#009689]"
            : "bg-[#009689]/10 text-[#009689]"
          : isDarkMode
            ? "text-slate-300 hover:bg-slate-800 hover:text-[#009689]"
            : "text-slate-600 hover:bg-slate-50 hover:text-[#009689]",
      ].join(" "),
      themeToggle: useTransparentTop
        ? "text-white border-transparent hover:bg-white/10"
        : "text-white border-white/20 hover:bg-white/10",
      brandText: useTransparentTop
        ? "text-white/80"
        : "text-white/80",
      titleText: useTransparentTop
        ? "text-white"
        : "text-white",
    }),
    [isDarkMode, useTransparentTop],
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${themeClasses.shell}`}
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
            <Image src="/logo.svg" alt="Taskify Logo" width={48} height={48} className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className={`text-xl font-bold tracking-tight sm:text-2xl transition-colors duration-300 ${themeClasses.titleText}`}>
              Taskify
            </p>
            <p
              className={`text-xs font-medium transition-colors duration-300 ${themeClasses.brandText}`}
            >
              Freelance tasks platform
            </p>
          </div>
        </Link>

        <nav className="desktop-nav-only items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={themeClasses.link(isActive(item.href))}
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-white" />
              ) : null}
            </a>
          ))}

          {isAuthenticated ? (
            <>
              <a
                href={dashboardHref}
                className={themeClasses.link(isActive("/dashboard"))}
              >
                Dashboard
              </a>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-hidden="true"
            tabIndex={-1}
            className={`invisible pointer-events-none flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${themeClasses.themeToggle}`}
          >
            {isDarkMode ? (
              <FiMoon className="h-5 w-5 shrink-0" />
            ) : (
              <FiSun className="h-5 w-5 shrink-0" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="desktop-nav-only w-full items-center justify-end gap-3">
              <div className="relative flex items-center gap-2" ref={profileMenuRef}>
                <div
                  onClick={() => setShowProfileCard((prev) => !prev)}
                  className="group flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200/90 bg-white/95 hover:bg-slate-50 hover:border-[#009689]/40 transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#009689]/30 bg-sky-100 text-sky-700">
                      {avatarSrc && !avatarError ? (
                        <Image
                          src={avatarSrc}
                          alt={avatarLabel}
                          width={32}
                          height={32}
                          unoptimized
                          className="h-full w-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span className="text-xs font-semibold">{avatarInitial}</span>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 tracking-tight max-w-[120px] truncate">
                    {avatarLabel}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#009689] transition-transform duration-200 ${showProfileCard ? "rotate-180" : ""}`} />
                </div>

                {showProfileCard ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-3 mb-1.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#009689] bg-sky-100 text-sky-700">
                        {avatarSrc && !avatarError ? (
                          <Image
                            src={avatarSrc}
                            alt={avatarLabel}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-full w-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span className="text-sm font-semibold">{avatarInitial}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{avatarLabel}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email || "No email provided"}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#009689] border border-teal-200/60 mt-1 capitalize">
                          {user?.role || "Member"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <a href="/profile" className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#009689] hover:bg-teal-50/60 transition-colors">
                        <User className="w-4 h-4 text-slate-400 group-hover:text-[#009689]" />
                        View Profile
                      </a>
                      <a href={dashboardHref} className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#009689] hover:bg-teal-50/60 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-[#009689]" />
                        Dashboard
                      </a>
                    </div>

                    <div className="h-px bg-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="desktop-nav-only items-center gap-2">
              <Link href="/auth/signin">
                <Button
                  className={themeClasses.button}
                  radius="full"
                  size="sm"
                  variant={useTransparentTop ? "light" : "bordered"}
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className={themeClasses.primaryButton}
                  radius="full"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className={`flex lg:hidden h-11 w-11 items-center justify-center rounded-full border ${themeClasses.button}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-full border-t shadow-xl ${isMenuOpen ? "block" : "hidden"} lg:hidden ${isDarkMode ? "border-slate-800" : "border-slate-200"} ${themeClasses.panel}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={themeClasses.mobileItem(isActive(item.href))}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {isAuthenticated ? (
            <>
              <a
                href={dashboardHref}
                className={themeClasses.mobileItem(isActive("/dashboard"))}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className={themeClasses.mobileItem(false)}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className="w-full bg-white text-slate-700 hover:text-[#00A896] dark:bg-slate-900 dark:text-slate-100 dark:hover:text-[#00A896] border border-slate-300 dark:border-slate-700"
                  radius="full"
                  size="sm"
                  variant="bordered"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className="w-full border-0 bg-[#00A896] text-white hover:bg-[#008f80]"
                  radius="full"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
