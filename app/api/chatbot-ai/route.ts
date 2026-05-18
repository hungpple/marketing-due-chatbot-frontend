export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TIMEOUT_MS = 120_000;
const CHAT_ENDPOINT = "/api/chat";

type ChatbotRequestBody = {
  message?: unknown;
  history?: unknown;
};

export async function GET() {
  return jsonResponse({
    status: "ok",
    service: "due-marketing-chatbot-frontend",
  });
}

export async function POST(request: Request) {
  let bodyText = "";
  let message = "";

  try {
    bodyText = await request.text();
    const body = JSON.parse(bodyText) as ChatbotRequestBody;
    message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return jsonResponse(
        { error: "Vui lòng nhập câu hỏi trước khi gửi." },
        { status: 400 }
      );
    }
  } catch {
    return jsonResponse(
      { error: "Yêu cầu chưa đúng định dạng. Vui lòng thử lại." },
      { status: 400 }
    );
  }

  const baseUrl = getBackendBaseUrl();

  if (!baseUrl) {
    return jsonResponse({
      answer:
        "Hiện hệ thống đang chờ kết nối dữ liệu tuyển sinh chính thức. Bạn có thể cấu hình backend/RAG để Marketing-DUE Chatbot trả lời chính xác hơn và trích nguồn tham khảo cho từng câu hỏi.",
      sources: [],
      warning:
        "Đây là phản hồi fallback của frontend, chưa thay thế thông tin tuyển sinh chính thức từ Khoa Marketing-DUE.",
    });
  }

  return proxyBackendRequest(baseUrl, bodyText);
}

async function proxyBackendRequest(baseUrl: string, body: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), readProxyTimeoutMs());

  try {
    const response = await fetch(new URL(CHAT_ENDPOINT, baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
      signal: controller.signal,
    });
    const contentType = response.headers.get("Content-Type") ?? "application/json";
    const responseText = await response.text();

    if (!response.ok) {
      return jsonResponse(
        {
          error: createFriendlyProxyError(response.status, responseText),
        },
        { status: response.status }
      );
    }

    return new Response(responseText, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("[chatbot-proxy] Backend request failed.", error);

    return jsonResponse(
      {
        error:
          "Hệ thống trợ lý AI tạm thời chưa phản hồi. Vui lòng thử lại sau ít phút.",
      },
      { status: 504 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

function readProxyTimeoutMs() {
  const value = Number(process.env.CHATBOT_PROXY_TIMEOUT_MS);

  if (!Number.isFinite(value) || value < 10_000) {
    return DEFAULT_TIMEOUT_MS;
  }

  return Math.floor(value);
}

function getBackendBaseUrl() {
  const value =
    process.env.CHATBOT_API_BASE_URL ??
    process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL ??
    "";

  if (!value.trim()) {
    return "";
  }

  try {
    const url = new URL(value);

    return `${url.origin}${url.pathname.replace(/\/$/, "")}/`;
  } catch {
    return "";
  }
}

function createFriendlyProxyError(status: number, responseText: string) {
  if (status === 400) {
    const backendMessage = readSimpleValidationMessage(responseText);

    return (
      backendMessage ||
      "Yêu cầu chưa phù hợp. Vui lòng kiểm tra câu hỏi và thử lại."
    );
  }

  if (status === 429) {
    return "Hệ thống đang nhận nhiều yêu cầu. Vui lòng thử lại sau ít phút.";
  }

  return "Hệ thống trợ lý AI tạm thời chưa xử lý được yêu cầu. Vui lòng thử lại sau.";
}

function readSimpleValidationMessage(responseText: string) {
  try {
    const payload = JSON.parse(responseText) as { error?: unknown };
    const error = typeof payload.error === "string" ? payload.error.trim() : "";

    return error;
  } catch {
    return "";
  }
}

function jsonResponse(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}
