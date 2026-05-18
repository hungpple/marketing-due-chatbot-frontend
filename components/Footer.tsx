import Link from "next/link";
import { navItems } from "@/lib/content";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/MarketingDUE",
    icon: <FacebookIcon />,
  },
  {
    label: "Zalo",
    href: "https://zalo.me/g/vdyxqi085",
    icon: <ZaloIcon />,
  },
] as const;

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.2 8.7V6.9c0-.8.5-1 1-1h1.4V3.3A20 20 0 0 0 14.5 3c-2.1 0-3.6 1.3-3.6 3.7v2H8.5v2.9h2.4V21h3.3v-9.4h2.3l.4-2.9h-2.7Z" />
    </svg>
  );
}

function ZaloIcon() {
  return (
    <span className="text-[11px] font-black leading-none" aria-hidden="true">
      Zalo
    </span>
  );
}

export function Footer() {
  return (
    <footer className="marketing-orange-bg border-t border-white/10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-100">
            Điều hướng
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {navItems
              .filter((item) => !item.external)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-orange-50 transition hover:text-[#ffdfcf]"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>

        <div className="lg:text-right">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-100">
            Liên hệ
          </p>
          <div className="mt-4 space-y-2 text-sm leading-6 text-orange-50">
            <p>Khoa Marketing - Trường Đại học Kinh tế, Đại học Đà Nẵng</p>
            <p>Email: marketing@due.edu.vn</p>
            <p>Website: due.udn.vn</p>
          </div>
          <div className="mt-5 flex gap-3 lg:justify-end">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-orange-50">
        © 2026 Bản quyền thuộc về Khoa Marketing, Trường Đại học Kinh tế - Đại học Đà Nẵng.
      </div>
    </footer>
  );
}
