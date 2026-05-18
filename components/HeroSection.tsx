"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  { src: "/images/hero/hero-1.jpg", positionClass: "object-center" },
  { src: "/images/hero/hero-2.jpg", positionClass: "object-center" },
  { src: "/images/hero/hero-3.jpg", positionClass: "object-[18%_center]" },
  { src: "/images/hero/hero-4.jpg", positionClass: "object-center" },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate h-[calc(100svh-28px)] min-h-[560px] overflow-hidden bg-[#fff4ed] dark:bg-[#120b08]">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={[
              "hero-image-glow object-cover transition-opacity duration-1000 ease-in-out",
              image.positionClass,
              index === activeIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,8,0.82)_0%,rgba(18,11,8,0.50)_42%,rgba(238,98,36,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_34%,rgba(238,98,36,0.36),transparent_28%),linear-gradient(180deg,rgba(18,11,8,0.18)_0%,rgba(18,11,8,0.18)_72%,rgba(255,250,247,0.92)_100%)] dark:bg-[radial-gradient(circle_at_18%_34%,rgba(238,98,36,0.28),transparent_28%),linear-gradient(180deg,rgba(18,11,8,0.16)_0%,rgba(18,11,8,0.28)_72%,rgba(18,11,8,0.95)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-white">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffdfcf]">
            Khoa Marketing-DUE
          </p>
          <h1 className="hero-title mt-5 text-5xl font-black leading-[1.04] sm:text-6xl lg:text-7xl">
            Marketing-DUE Chatbot
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-orange-50 sm:text-lg">
            Hỗ trợ thí sinh tìm hiểu ngành học, phương thức xét tuyển, học phí,
            học bổng và cơ hội nghề nghiệp tại Khoa Marketing.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chatbot-ai"
              className="inline-flex items-center justify-center rounded-md bg-[#ee6224] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#6f240d]/25 transition hover:bg-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/30"
            >
              Trò chuyện ngay
            </Link>
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center justify-center rounded-md border border-white/45 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Tìm hiểu hệ thống
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-14 z-20 flex justify-center gap-2">
        {heroImages.map((image, index) => {
          const active = activeIndex === index;

          return (
            <button
              key={image.src}
              type="button"
              aria-label={`Chuyển tới ảnh hero ${index + 1}`}
              aria-current={active}
              onClick={() => setActiveIndex(index)}
              className={[
                "h-2.5 rounded-full border border-white/75 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#ee6224]/30",
                active
                  ? "w-9 bg-[#ee6224]"
                  : "w-2.5 bg-white/70 hover:bg-[#ffdfcf]",
              ].join(" ")}
            />
          );
        })}
      </div>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[92px] w-full text-[#fffaf7] dark:text-[#120b08]"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 58C162 24 318 28 480 58C654 91 792 100 960 62C1132 24 1288 28 1440 66V100H0V58Z"
          fill="currentColor"
        />
        <path
          d="M0 55C162 21 318 25 480 55C654 88 792 97 960 59C1132 21 1288 25 1440 63"
          fill="none"
          stroke="#ee6224"
          strokeOpacity="0.75"
          strokeWidth="3"
        />
      </svg>
    </section>
  );
}
