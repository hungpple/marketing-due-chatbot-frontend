"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/content";
import { useTheme } from "@/components/ThemeProvider";

function isInternalActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isHomeScrolled, setIsHomeScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isHome) {
      return;
    }

    let frameId = window.requestAnimationFrame(() => {
      setIsHomeScrolled(window.scrollY > 12);
    });

    function updateScrolledState() {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setIsHomeScrolled(window.scrollY > 12);
      });
    }

    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, [isHome]);

  const floatingHome = isHome && !isHomeScrolled;

  const headerClass = isHome
    ? [
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        floatingHome
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-[#ee6224]/15 bg-white/88 text-zinc-950 shadow-sm backdrop-blur-xl dark:border-[#ee6224]/20 dark:bg-[#1f1510]/88 dark:text-orange-50",
      ].join(" ")
    : "marketing-orange-bg sticky top-0 z-50 border-b border-white/15 text-white shadow-lg shadow-[#6f240d]/15";

  const logoTextClass = floatingHome
    ? "text-white"
    : isHome
      ? "text-[#9f3512] dark:text-orange-50"
      : "text-white";

  return (
    <header className={headerClass}>
      <nav className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20"
        >
          <Image
            src="/images/Logo FOM White.png"
            alt="Logo Khoa Marketing DUE"
            width={48}
            height={48}
            className={[
              "h-12 w-12 shrink-0 rounded-lg border bg-white object-contain p-1 shadow-sm transition",
              floatingHome
                ? "border-white/35"
                : "border-[#ee6224]/20 dark:border-[#ee6224]/30",
            ].join(" ")}
          />
          <span className={`min-w-0 leading-tight ${logoTextClass}`}>
            <span className="block whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] opacity-85 sm:text-xs">
              TRƯỜNG ĐẠI HỌC KINH TẾ
            </span>
            <span className="site-title block whitespace-nowrap text-base font-black uppercase sm:text-lg">
              KHOA MARKETING
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = !item.external && isInternalActive(pathname, item.href);
            const baseClass =
              "whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20";
            const className = floatingHome
              ? [
                  baseClass,
                  active
                    ? "bg-white text-[#9f3512]"
                    : "text-white hover:bg-white/12",
                ].join(" ")
              : isHome
                ? [
                    baseClass,
                    active
                      ? "bg-[#ee6224] text-white"
                      : "text-zinc-700 hover:bg-[#fff4ed] hover:text-[#ee6224] dark:text-orange-100 dark:hover:bg-[#2a1b14]",
                  ].join(" ")
                : [
                    baseClass,
                    active
                      ? "bg-white text-[#9f3512]"
                      : "text-white/90 hover:bg-white/12 hover:text-white",
                  ].join(" ");

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Chuyển sang light mode" : "Chuyển sang dark mode"
            }
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-md border transition focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20",
              floatingHome
                ? "border-white/30 bg-white/12 text-white hover:bg-white/20"
                : isHome
                  ? "border-[#ee6224]/20 bg-white text-[#ee6224] hover:bg-[#fff4ed] dark:bg-[#2a1b14]"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            aria-label="Mở menu điều hướng"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-md border transition focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20 lg:hidden",
              floatingHome
                ? "border-white/30 bg-white/12 text-white hover:bg-white/20"
                : isHome
                  ? "border-[#ee6224]/20 bg-white text-[#ee6224] hover:bg-[#fff4ed] dark:bg-[#2a1b14]"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div
          className={[
            "border-t px-4 pb-4 pt-2 shadow-xl backdrop-blur-xl lg:hidden",
            floatingHome
              ? "border-white/10 bg-[#1f1510]/94 text-white"
              : isHome
                ? "border-[#ee6224]/15 bg-white/96 text-zinc-950 dark:bg-[#1f1510]/96 dark:text-orange-50"
                : "border-white/15 bg-[#9f3512]/96 text-white",
          ].join(" ")}
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => {
              const active = !item.external && isInternalActive(pathname, item.href);
              const className = [
                "rounded-md px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20",
                active
                  ? "bg-[#ee6224] text-white"
                  : floatingHome || !isHome
                    ? "text-white hover:bg-white/12"
                    : "text-zinc-800 hover:bg-[#fff4ed] hover:text-[#ee6224] dark:text-orange-50 dark:hover:bg-[#2a1b14]",
              ].join(" ");

              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={className}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
