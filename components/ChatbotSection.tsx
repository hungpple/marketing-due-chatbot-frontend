import Link from "next/link";
import { chatbotHighlights } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";

export function ChatbotSection() {
  return (
    <section className="bg-[#fffaf7] px-4 py-20 transition-colors dark:bg-[#120b08] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Marketing-DUE Chatbot"
            title="Hỏi nhanh cùng Marketing-DUE Chatbot"
            description="Trợ lý AI của Khoa Marketing-DUE giúp thí sinh tra cứu thông tin tuyển sinh, ngành học, chương trình đào tạo, học phí, học bổng, hoạt động sinh viên và định hướng nghề nghiệp."
          />

          <ul className="mt-7 grid gap-3">
            {chatbotHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm font-semibold leading-7 text-zinc-700 dark:text-orange-100/85"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ee6224]/10 text-[#ee6224]">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/chatbot-ai"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#ee6224] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20"
          >
             Truy cập Chatbot
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-[#ee6224]/15 bg-white p-4 shadow-xl shadow-[#9f3512]/10 dark:border-[#ee6224]/20 dark:bg-[#1f1510] dark:shadow-[#ee6224]/5 sm:p-6">
          <div className="rounded-lg border border-[#ee6224]/15 bg-[#fff4ed] dark:border-[#ee6224]/20 dark:bg-[#160f0b]">
            <div className="flex items-center gap-3 border-b border-[#ee6224]/15 bg-gradient-to-r from-[#ee6224] to-[#9f3512] px-4 py-4 text-white dark:border-[#ee6224]/20 dark:from-[#2a1b14] dark:to-[#1f1510]">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 text-sm font-black">
                AI
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">
                  Marketing-DUE Chatbot
                </p>
                <p className="text-sm font-black">Trợ lý tuyển sinh Khoa Marketing-DUE</p>
              </div>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <div className="max-w-[86%] rounded-lg border border-[#ee6224]/15 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 shadow-sm dark:border-[#ee6224]/20 dark:bg-[#2a1b14] dark:text-orange-50">
                Xin chào, bạn muốn tìm hiểu ngành Marketing, Digital Marketing
                hay Truyền thông Marketing?
              </div>
              <div className="ml-auto max-w-[82%] rounded-lg bg-[#ee6224] px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm">
                Em muốn biết phương thức xét tuyển năm nay.
              </div>
              <div className="max-w-[88%] rounded-lg border border-[#ee6224]/15 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 shadow-sm dark:border-[#ee6224]/20 dark:bg-[#2a1b14] dark:text-orange-50">
                Bạn có thể hỏi về điểm chuẩn, tổ hợp xét tuyển, học phí hoặc
                học bổng. Khi có dữ liệu chính thức, mình sẽ trích nguồn để bạn
                kiểm tra lại.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
