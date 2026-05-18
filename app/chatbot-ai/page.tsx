import type { Metadata } from "next";
import { ChatbotUI } from "@/components/ChatbotUI";

export const metadata: Metadata = {
  title: "Marketing-DUE Chatbot",
  description:
    "Marketing-DUE Chatbot hỗ trợ tư vấn và tra cứu thông tin tuyển sinh Khoa Marketing, Trường Đại học Kinh tế - Đại học Đà Nẵng.",
};

export default function ChatbotPage() {
  return (
    <main className="min-h-[calc(100svh-64px)] bg-[#fff4ed] px-4 py-8 transition-colors dark:bg-[#120b08] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <ChatbotUI />
      </div>
    </main>
  );
}
