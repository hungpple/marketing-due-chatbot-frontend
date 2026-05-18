import type { Metadata } from "next";
import Link from "next/link";
import { aboutFeatureCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Giới thiệu mục đích và chức năng của Marketing-DUE Chatbot, trợ lý tư vấn tuyển sinh Khoa Marketing, Trường Đại học Kinh tế - Đại học Đà Nẵng.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#fffaf7] transition-colors dark:bg-[#120b08]">
      <section className="marketing-orange-bg px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-100">
            Giới thiệu
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            Marketing-DUE Chatbot
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-orange-50 sm:text-lg">
            Không gian hỗ trợ thí sinh tìm kiếm thông tin tuyển sinh một cách
            nhanh chóng, thân thiện và có định hướng.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ee6224]">
              Mục đích xây dựng
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-zinc-950 dark:text-orange-50">
              Hỗ trợ thí sinh tiếp cận thông tin tuyển sinh dễ hơn
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-zinc-700 dark:text-orange-100/85">
            <p>
              Marketing-DUE Chatbot được xây dựng để hỗ trợ thí sinh, phụ huynh và người quan
              tâm tiếp cận thông tin tuyển sinh của Khoa Marketing-DUE.
            </p>
            <p>
              Hệ thống giúp giảm thời gian tra cứu, gợi ý câu hỏi thường gặp và
              tạo trải nghiệm tư vấn trực tuyến thuận tiện. Khi kết nối dữ liệu
              chính thức, chatbot có thể bổ sung nguồn tham khảo để người dùng
              kiểm chứng thông tin quan trọng.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fff4ed] px-4 py-16 transition-colors dark:bg-[#160f0b] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ee6224]">
              Chức năng chính
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-zinc-950 dark:text-orange-50">
              Một trợ lý tập trung vào hành trình chọn ngành
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {aboutFeatureCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-lg border border-[#ee6224]/15 bg-white p-6 shadow-sm shadow-[#9f3512]/5 dark:border-[#ee6224]/20 dark:bg-[#1f1510]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#ee6224]/10 text-sm font-black text-[#ee6224]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-black leading-7 text-zinc-950 dark:text-orange-50">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-650 dark:text-orange-100/80">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-lg border border-[#ee6224]/15 bg-white p-8 shadow-sm shadow-[#9f3512]/5 dark:border-[#ee6224]/20 dark:bg-[#1f1510] md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-zinc-950 dark:text-orange-50">
              Sẵn sàng đặt câu hỏi?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-650 dark:text-orange-100/80">
              Mở Marketing-DUE Chatbot để được hỗ trợ tra cứu thông tin tuyển sinh Khoa
              Marketing DUE.
            </p>
          </div>
          <Link
            href="/chatbot-ai"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#ee6224] px-6 py-3 text-sm font-black text-white transition hover:bg-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20"
          >
            Trò chuyện với Marketing-DUE Chatbot
          </Link>
        </div>
      </section>
    </main>
  );
}
