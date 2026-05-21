export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  systemPrompt?: string
): AsyncGenerator<string> {
  const res = await fetch("/api/mimo/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `API error ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        if (json.content) yield json.content;
      } catch {}
    }
  }

  if (buffer.startsWith("data: ") && buffer.slice(6) !== "[DONE]") {
    try {
      const json = JSON.parse(buffer.slice(6));
      if (json.content) yield json.content;
    } catch {}
  }
}

export async function sendMessage(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  let result = "";
  for await (const chunk of streamChat(messages, systemPrompt)) {
    result += chunk;
  }
  return result;
}
