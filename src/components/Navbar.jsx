"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
              Freelance micro-tasks
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
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
              <a
                href="/profile"
                className={themeClasses.link(isActive("/profile"))}
              >
                Profile
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
            <div className="hidden md:flex w-full items-center justify-end gap-3">
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileCard((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full pr-2 transition hover:bg-white/10 text-white"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-200">
                    {avatarSrc && !avatarError ? (
                      <Image
                        src={avatarSrc}
                        alt={avatarLabel}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-full w-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span className="text-sm font-semibold">{avatarInitial}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{avatarLabel}</span>
                </button>

                {showProfileCard ? (
                  <div className={`absolute right-0 top-[calc(100%+0.6rem)] w-64 rounded-2xl border p-4 shadow-xl ${themeClasses.profileCard}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-200">
                        {avatarSrc && !avatarError ? (
                          <Image
                            src={avatarSrc}
                            alt={avatarLabel}
                            width={48}
                            height={48}
                            unoptimized
                            className="h-full w-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span className="text-sm font-semibold">{avatarInitial}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{avatarLabel}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || "Member"}</p>
                      </div>
                    </div>
                    <p className="mt-3 truncate text-sm text-slate-600 dark:text-slate-300">{user?.email || "No email provided"}</p>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition text-white hover:bg-white/10 hover:text-white"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
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
            className={`flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${themeClasses.button}`}
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
        className={`absolute left-0 right-0 top-full border-t shadow-xl md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } ${isDarkMode ? "border-slate-800" : "border-slate-200"} ${themeClasses.panel}`}
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
              <a
                href="/profile"
                className={themeClasses.mobileItem(isActive("/profile"))}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
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
