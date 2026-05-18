"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { quickQuestions } from "@/lib/content";

type Source = {
  id: string;
  document: string;
  chunkIndex: number;
  snippet: string;
  score: number;
};

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  sources?: Source[];
  warning?: string;
  isTyping?: boolean;
};

type ApiChatbotResponse = {
  answer?: string;
  sources?: Source[];
  warning?: string;
  error?: string;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Xin chào. Tôi là Marketing-DUE Chatbot. Bạn có thể hỏi tôi về ngành học, phương thức xét tuyển, học phí, học bổng, hoạt động sinh viên và cơ hội nghề nghiệp tại Khoa Marketing-DUE.",
  },
];

const processingSteps = [
  {
    title: "Tìm kiếm thông tin",
    activeTitle: "Đang tìm kiếm thông tin",
    description:
      "Đang rà soát dữ liệu tuyển sinh và các đoạn thông tin có liên quan đến câu hỏi...",
  },
  {
    title: "Phân tích câu hỏi",
    activeTitle: "Đang phân tích câu hỏi",
    description:
      "Đang xác định nhu cầu của thí sinh và chọn cách trả lời dễ hiểu nhất...",
  },
  {
    title: "Soạn câu trả lời",
    activeTitle: "Đang soạn câu trả lời",
    description:
      "Đang tổng hợp phản hồi thân thiện, rõ ý và sẵn sàng trích nguồn khi backend cung cấp...",
  },
] as const;

const relatedQuestionGroups = [
  {
    keywords: ["ngành", "chuyên ngành", "marketing", "digital", "truyền thông"],
    questions: [
      "Ngành Marketing phù hợp với những bạn có thế mạnh gì?",
      "Khác nhau giữa Marketing, Digital Marketing và Truyền thông Marketing là gì?",
      "Sinh viên Marketing thường học những nhóm môn nào?",
    ],
  },
  {
    keywords: ["xét tuyển", "tổ hợp", "điểm chuẩn", "chỉ tiêu", "hồ sơ"],
    questions: [
      "Em cần chuẩn bị những thông tin nào trước khi đăng ký xét tuyển?",
      "Có thể hỏi chatbot về tổ hợp xét tuyển và mốc thời gian không?",
      "Khi nào nên kiểm tra lại thông tin trên nguồn tuyển sinh chính thức?",
    ],
  },
  {
    keywords: ["học phí", "học bổng", "chi phí", "hỗ trợ"],
    questions: [
      "Chatbot có thể hỗ trợ tra cứu học bổng theo nguồn chính thức không?",
      "Em nên hỏi gì để ước tính chi phí học tập?",
      "Sinh viên có thể nhận những hình thức hỗ trợ nào?",
    ],
  },
  {
    keywords: ["nghề nghiệp", "việc làm", "thực tập", "cơ hội"],
    questions: [
      "Sinh viên Marketing có thể làm những vị trí nghề nghiệp nào?",
      "Kỹ năng nào quan trọng với sinh viên Marketing?",
      "Nên chuẩn bị hồ sơ thực tập từ năm mấy?",
    ],
  },
];

const markdownComponents: Components = {
  p({ children }) {
    return <p className="mb-3 last:mb-0">{children}</p>;
  },
  strong({ children }) {
    return (
      <strong className="font-bold text-[#9f3512] dark:text-orange-100">
        {children}
      </strong>
    );
  },
  em({ children }) {
    return <em className="italic text-zinc-700 dark:text-orange-100/80">{children}</em>;
  },
  ul({ children }) {
    return <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>;
  },
  ol({ children }) {
    return (
      <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>
    );
  },
  li({ children }) {
    return <li className="pl-1">{children}</li>;
  },
  table({ children }) {
    return (
      <div className="my-3 max-w-full overflow-x-auto rounded-md border border-[#ee6224]/15 dark:border-[#ee6224]/20">
        <table className="min-w-[720px] border-collapse text-left text-xs">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return (
      <thead className="bg-[#fff4ed] text-[#9f3512] dark:bg-[#ee6224]/10 dark:text-orange-100">
        {children}
      </thead>
    );
  },
  th({ children }) {
    return (
      <th className="border-b border-[#ee6224]/15 px-3 py-2 font-bold dark:border-[#ee6224]/20">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="border-b border-[#ee6224]/10 px-3 py-2 align-top dark:border-[#ee6224]/15">
        {children}
      </td>
    );
  },
  code({ children, className }) {
    const isBlock = Boolean(className);

    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-md bg-zinc-950 px-3 py-2 text-xs leading-6 text-zinc-50 dark:bg-[#0d0806]">
          {children}
        </code>
      );
    }

    return (
      <code className="rounded bg-[#fff4ed] px-1.5 py-0.5 text-[0.92em] font-semibold text-[#9f3512] dark:bg-[#2a1b14] dark:text-orange-100">
        {children}
      </code>
    );
  },
  pre({ children }) {
    return <pre className="my-3 overflow-x-auto">{children}</pre>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-3 border-l-4 border-[#ee6224] bg-[#fff4ed] px-4 py-3 text-zinc-700 dark:bg-[#ee6224]/10 dark:text-orange-100/85">
        {children}
      </blockquote>
    );
  },
};

export function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [latestSources, setLatestSources] = useState<Source[]>([]);
  const [isReferencePanelOpen, setIsReferencePanelOpen] = useState(false);
  const chatShellRef = useRef<HTMLDivElement>(null);
  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const processingTimersRef = useRef<number[]>([]);
  const typingTimerRef = useRef<number | null>(null);
  const referencePanelTouchedRef = useRef(false);

  const isBusy = isProcessing || typingMessageId !== null;
  const showInitialSuggestions = messages.length === 1 && !isProcessing;

  const clearProcessingTimers = useCallback(() => {
    for (const timer of processingTimersRef.current) {
      window.clearTimeout(timer);
    }

    processingTimersRef.current = [];
  }, []);

  const scrollPanelToBottom = useCallback((behavior: ScrollBehavior) => {
    const panel = scrollPanelRef.current;

    if (!panel) {
      return;
    }

    panel.scrollTo({
      top: panel.scrollHeight,
      behavior,
    });
  }, []);

  const scrollMessageToTop = useCallback((messageId: string) => {
    const panel = scrollPanelRef.current;
    const message = panel?.querySelector<HTMLElement>(
      `[data-message-id="${messageId}"]`
    );

    if (!panel || !message) {
      return;
    }

    panel.scrollTo({
      top: Math.max(0, message.offsetTop - 16),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const shell = chatShellRef.current;

      if (!shell) {
        return;
      }

      const rect = shell.getBoundingClientRect();
      const shellCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const delta = shellCenter - viewportCenter;

      if (Math.abs(delta) > 72) {
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      scrollPanelToBottom("smooth");
    }
  }, [isProcessing, processingStep, scrollPanelToBottom]);

  useEffect(() => {
    return () => {
      clearProcessingTimers();

      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, [clearProcessingTimers]);

  async function sendMessage(value: string) {
    const trimmed = value.trim();

    if (!trimmed || isBusy) {
      return;
    }

    const history = messages.slice(-8).map((message) => ({
      role: message.role === "bot" ? "assistant" : "user",
      content: message.content,
    }));

    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    clearProcessingTimers();
    setLatestSources([]);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setProcessingStep(0);
    setIsProcessing(true);
    scheduleProcessingSteps();

    window.requestAnimationFrame(() => scrollPanelToBottom("smooth"));

    try {
      const response = await fetch("/api/chatbot-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });
      const payload = (await response.json()) as ApiChatbotResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể xử lý câu hỏi.");
      }

      const sources = payload.sources ?? [];
      const botMessageId = createId();
      const fullAnswer =
        payload.answer ?? "Tôi chưa nhận được nội dung trả lời từ hệ thống.";

      clearProcessingTimers();
      setIsProcessing(false);
      setLatestSources(sources);
      openReferencePanelForNewSources(sources);
      setMessages((current) => [
        ...current,
        {
          id: botMessageId,
          role: "bot",
          content: "",
          sources,
          warning: payload.warning,
          isTyping: true,
        },
      ]);

      window.requestAnimationFrame(() => scrollMessageToTop(botMessageId));
      await revealBotMessage(botMessageId, fullAnswer);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi gửi câu hỏi.";

      clearProcessingTimers();
      setIsProcessing(false);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "bot",
          content: errorMessage,
        },
      ]);
      window.requestAnimationFrame(() => scrollPanelToBottom("smooth"));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function scheduleProcessingSteps() {
    processingTimersRef.current = [
      window.setTimeout(() => setProcessingStep(1), 850),
      window.setTimeout(() => setProcessingStep(2), 1900),
    ];
  }

  function openReferencePanelForNewSources(sources: Source[]) {
    if (sources.length === 0 || referencePanelTouchedRef.current) {
      return;
    }

    if (window.matchMedia("(min-width: 1024px)").matches) {
      setIsReferencePanelOpen(true);
    }
  }

  function toggleReferencePanel() {
    referencePanelTouchedRef.current = true;
    setIsReferencePanelOpen((current) => !current);
  }

  function closeReferencePanel() {
    referencePanelTouchedRef.current = true;
    setIsReferencePanelOpen(false);
  }

  async function revealBotMessage(messageId: string, fullContent: string) {
    setTypingMessageId(messageId);

    await new Promise<void>((resolve) => {
      let visibleLength = 0;
      const charsPerTick = getTypingCharsPerTick(fullContent.length);

      function tick() {
        visibleLength = Math.min(fullContent.length, visibleLength + charsPerTick);

        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: fullContent.slice(0, visibleLength),
                  isTyping: visibleLength < fullContent.length,
                }
              : message
          )
        );

        if (visibleLength >= fullContent.length) {
          resolve();
          return;
        }

        typingTimerRef.current = window.setTimeout(tick, 18);
      }

      tick();
    });

    typingTimerRef.current = null;
    setTypingMessageId(null);
  }

  return (
    <>
      <div
        ref={chatShellRef}
        className={[
          "relative mx-auto flex h-[min(790px,calc(100svh-148px))] min-h-[560px] w-full max-w-[960px] items-stretch transition-transform duration-300",
          isReferencePanelOpen ? "lg:-translate-x-[190px]" : "lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#ee6224]/15 bg-white shadow-xl shadow-[#9f3512]/10 dark:border-[#ee6224]/20 dark:bg-[#1f1510] dark:shadow-[#ee6224]/5">
          <div className="flex items-start gap-4 border-b border-[#ee6224]/15 bg-gradient-to-r from-[#ee6224] to-[#9f3512] px-5 py-4 text-white dark:border-[#ee6224]/20 dark:from-[#2a1b14] dark:to-[#1f1510]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white/15 text-sm font-black">
              AI
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-100">
                Trợ lý tuyển sinh Khoa Marketing-DUE
              </p>
              <h2 className="mt-1 text-xl font-black leading-tight sm:text-2xl">
                Marketing-DUE Chatbot
              </h2>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 bg-[#fffaf7] dark:bg-[#160f0b]">
            <div className="flex min-w-0 flex-1 flex-col">
              <div
                ref={scrollPanelRef}
                aria-live="polite"
                className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
              >
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    disabled={isBusy}
                    showSuggestions={
                      message.role === "bot" && message.id !== "welcome"
                    }
                    onSuggestionClick={sendMessage}
                  />
                ))}

                {showInitialSuggestions ? (
                  <InlineSuggestionGroup
                    title="Câu hỏi gợi ý cho bạn"
                    questions={quickQuestions}
                    disabled={isBusy}
                    onSelect={sendMessage}
                  />
                ) : null}

                {isProcessing ? <ProcessingProgress currentStep={processingStep} /> : null}
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-[#ee6224]/15 bg-white p-4 dark:border-[#ee6224]/20 dark:bg-[#1f1510]"
              >
                <div className="flex gap-3">
                  <textarea
                    value={input}
                    rows={1}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Nhập câu hỏi tuyển sinh..."
                    className="max-h-32 min-h-12 flex-1 resize-none rounded-md border border-[#ee6224]/18 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-[#ee6224] focus:ring-4 focus:ring-[#ee6224]/20 dark:border-[#ee6224]/25 dark:bg-[#2a1b14] dark:text-orange-50 dark:placeholder:text-orange-100/40"
                  />
                  <button
                    type="submit"
                    disabled={isBusy || input.trim().length === 0}
                    className="h-12 rounded-md bg-[#ee6224] px-5 text-sm font-black text-white transition hover:bg-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:disabled:bg-[#2a1b14] dark:disabled:text-orange-100/35"
                  >
                    Gửi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ReferenceSidePanel
        isOpen={isReferencePanelOpen}
        sources={latestSources}
        onClose={closeReferencePanel}
        onToggle={toggleReferencePanel}
      />
    </>
  );
}

function ProcessingProgress({ currentStep }: { currentStep: number }) {
  const activeStep = processingSteps[currentStep] ?? processingSteps[0];

  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[88%] rounded-lg border border-[#ee6224]/15 bg-white px-4 py-4 shadow-sm shadow-[#9f3512]/5 dark:border-[#ee6224]/20 dark:bg-[#1f1510]">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-orange-100">
          <span className="rounded bg-[#ee6224]/10 px-2 py-0.5 text-xs font-black text-[#ee6224]">
            AI
          </span>
          <span>Tiến trình xử lý</span>
          <span className="ml-auto text-xs font-semibold text-zinc-400 dark:text-orange-100/45">
            Đang chạy
          </span>
        </div>

        <div className="mt-4 rounded-md border border-[#ee6224]/12 bg-[#fffaf7] px-4 py-4 dark:border-[#ee6224]/20 dark:bg-[#160f0b]">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ee6224] shadow-[0_0_0_6px_rgba(238,98,36,0.12)]" />
            <p className="font-bold text-zinc-950 dark:text-orange-50">
              {activeStep.activeTitle}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-650 dark:text-orange-100/75">
            {activeStep.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            {processingSteps.map((step, index) => {
              const isDone = index <= currentStep;

              return (
                <div key={step.title} className="flex items-center gap-2">
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      isDone ? "bg-[#ee6224]" : "bg-zinc-300 dark:bg-[#2a1b14]",
                    ].join(" ")}
                  />
                  <span
                    className={
                      isDone
                        ? "text-[#9f3512] dark:text-orange-100"
                        : "text-zinc-400 dark:text-orange-100/35"
                    }
                  >
                    {step.title}
                  </span>
                  {index < processingSteps.length - 1 ? (
                    <span className="text-zinc-300 dark:text-orange-100/25">
                      →
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  disabled,
  showSuggestions,
  onSuggestionClick,
}: {
  message: Message;
  disabled: boolean;
  showSuggestions: boolean;
  onSuggestionClick: (question: string) => void;
}) {
  const isUser = message.role === "user";
  const relatedQuestions = getRelatedSuggestions(message.content);

  return (
    <div
      data-message-id={message.id}
      className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}
    >
      <div
        className={[
          "max-w-[88%] rounded-lg px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[86%]",
          isUser
            ? "bg-[#ee6224] text-white"
            : "border border-[#ee6224]/15 bg-white text-zinc-800 dark:border-[#ee6224]/20 dark:bg-[#2a1b14] dark:text-orange-50",
        ].join(" ")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} isTyping={message.isTyping} />
        )}

        {!isUser && showSuggestions && !message.isTyping ? (
          <InlineSuggestionGroup
            title="Câu hỏi gợi ý liên quan"
            questions={relatedQuestions}
            disabled={disabled}
            compact
            onSelect={onSuggestionClick}
          />
        ) : null}

        {!isUser && message.warning ? (
          <p className="mt-3 border-t border-[#ee6224]/15 pt-3 text-xs leading-5 text-[#9f3512] dark:border-[#ee6224]/20 dark:text-orange-100/75">
            {message.warning}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function InlineSuggestionGroup({
  title,
  questions,
  disabled,
  compact = false,
  onSelect,
}: {
  title: string;
  questions: readonly string[];
  disabled: boolean;
  compact?: boolean;
  onSelect: (question: string) => void;
}) {
  return (
    <div
      className={
        compact
          ? "mt-4 border-t border-[#ee6224]/15 pt-3 dark:border-[#ee6224]/20"
          : "ml-0 w-full max-w-4xl rounded-lg border border-[#ee6224]/15 bg-white/88 p-4 shadow-sm shadow-[#9f3512]/5 dark:border-[#ee6224]/20 dark:bg-[#1f1510]"
      }
    >
      <div className="flex items-center gap-2 text-sm font-black text-[#9f3512] dark:text-orange-100">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#ee6224]/20 bg-[#fff4ed] text-xs text-[#ee6224] dark:bg-[#2a1b14]">
          ?
        </span>
        <p>{title}</p>
      </div>
      <div className="mt-4 grid gap-3">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className={[
              "group flex w-full items-center gap-3 rounded-md border border-[#ee6224]/16 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-zinc-700 shadow-sm shadow-[#9f3512]/5 transition hover:border-[#ee6224]/35 hover:bg-[#fff4ed] hover:text-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/18 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#ee6224]/20 dark:bg-[#2a1b14] dark:text-orange-100/82 dark:hover:bg-[#ee6224]/10 dark:hover:text-orange-50",
              compact ? "text-xs sm:text-sm" : "",
            ].join(" ")}
          >
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ee6224]/10 text-xs font-black text-[#ee6224] transition group-hover:bg-[#ee6224] group-hover:text-white">
              i
            </span>
            <span className="min-w-0 flex-1">{question}</span>
            <span className="text-[#ee6224]/55 transition group-hover:text-[#ee6224]">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReferenceSidePanel({
  isOpen,
  sources,
  onClose,
  onToggle,
}: {
  isOpen: boolean;
  sources: Source[];
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <aside
      id="chatbot-reference-panel"
      className={[
        "fixed bottom-0 right-0 top-[72px] z-[40] w-[min(92vw,380px)] transition-transform duration-300 ease-out lg:top-[80px] lg:w-[360px]",
        isOpen ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-0 top-1/2 z-10 h-28 w-11 -translate-x-full -translate-y-1/2 overflow-visible rounded-l-md bg-[#ee6224] text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-[#6f240d]/25 transition hover:bg-[#9f3512] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/25"
        aria-label={isOpen ? "Thu gọn panel nguồn" : "Mở panel nguồn"}
        aria-controls="chatbot-reference-panel"
        aria-expanded={isOpen}
      >
        <span className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap leading-none">
          Nguồn
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm leading-none">
          {isOpen ? ">" : "<"}
        </span>
      </button>

      <div
        className={[
          "h-full overflow-hidden rounded-l-lg border-l border-[#ee6224]/15 bg-white shadow-2xl shadow-[#9f3512]/15 transition-opacity duration-300 dark:border-[#ee6224]/20 dark:bg-[#1f1510]",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="false"
        aria-label="Nguồn tham khảo"
      >
        <ReferencePanel sources={sources} onClose={onClose} />
      </div>
    </aside>
  );
}

function ReferencePanel({
  sources,
  onClose,
}: {
  sources: Source[];
  onClose: () => void;
}) {
  const sourceListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sourceListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sources]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white dark:bg-[#1f1510]">
      <div className="flex min-h-[58px] shrink-0 items-center gap-3 border-b border-[#ee6224]/15 px-4 py-3 dark:border-[#ee6224]/20">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#ee6224]/10 text-[#ee6224]">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H7a3 3 0 0 0-3 3V5.5Z" />
            <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
          </svg>
        </span>
        <h3 className="min-w-0 flex-1 text-base font-black text-zinc-950 dark:text-orange-50">
          Nguồn
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-3xl font-light leading-none text-zinc-400 transition hover:bg-[#fff4ed] hover:text-[#ee6224] focus:outline-none focus:ring-4 focus:ring-[#ee6224]/20 dark:text-orange-100/50 dark:hover:bg-[#2a1b14] dark:hover:text-orange-50"
          aria-label="Đóng panel nguồn"
        >
          ×
        </button>
      </div>

      <div
        ref={sourceListRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-gutter:stable]"
      >
        {sources.length > 0 ? (
          <div className="space-y-3">
            {sources.map((source) => (
              <article
                key={`${source.document}-${source.chunkIndex}`}
                className="rounded-md border border-[#ee6224]/15 bg-white p-3 shadow-sm shadow-[#9f3512]/5 transition hover:border-[#ee6224]/35 dark:border-[#ee6224]/20 dark:bg-[#2a1b14]"
              >
                <div className="flex items-start gap-2">
                  <span className="rounded bg-[#ee6224]/10 px-2 py-1 text-xs font-bold text-[#ee6224]">
                    [{source.id}]
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold leading-5 text-zinc-950 dark:text-orange-50">
                      {source.document}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-orange-100/55">
                      Đoạn {source.chunkIndex} · Điểm {source.score}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-650 dark:text-orange-100/75">
                  {source.snippet}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ee6224]/8 text-[#ee6224]/55">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              >
                <path d="M14 3v5a2 2 0 0 0 2 2h5" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l7 7v9a2 2 0 0 1-2 2h-1" />
                <circle cx="10" cy="15" r="2.5" />
                <path d="m12 17 2 2" />
              </svg>
            </span>
            <p className="mt-4 text-base font-bold text-zinc-500 dark:text-orange-100/60">
              Chưa có nguồn tham khảo.
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-400 dark:text-orange-100/45">
              Khi backend RAG trả nguồn, panel này sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarkdownContent({
  content,
  isTyping,
}: {
  content: string;
  isTyping?: boolean;
}) {
  return (
    <div className="chatbot-markdown">
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      ) : null}
      {isTyping ? (
        <span className="typing-caret ml-0.5 inline-block h-4 w-1 translate-y-0.5 rounded-full bg-[#ee6224]" />
      ) : null}
    </div>
  );
}

function getRelatedSuggestions(content: string) {
  const normalizedContent = normalizeForSuggestions(content);
  const matchedGroup = relatedQuestionGroups.find((group) =>
    group.keywords.some((keyword) =>
      normalizedContent.includes(normalizeForSuggestions(keyword))
    )
  );
  const questions = matchedGroup?.questions ?? quickQuestions;

  return dedupeQuestions([...questions, ...quickQuestions]).slice(0, 4);
}

function dedupeQuestions(questions: readonly string[]) {
  return Array.from(new Set(questions));
}

function getTypingCharsPerTick(contentLength: number) {
  if (contentLength > 12000) {
    return 90;
  }

  if (contentLength > 4000) {
    return 32;
  }

  if (contentLength > 1800) {
    return 8;
  }

  return 5;
}

function normalizeForSuggestions(value: string) {
  return value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
