import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json();

    const apiKey = process.env.MIMO_API_KEY;
    const baseUrl = process.env.MIMO_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1";
    const model = process.env.MIMO_MODEL || "mimo-v2.5-pro";

    if (!apiKey) {
      return NextResponse.json({ error: "MIMO_API_KEY not configured" }, { status: 500 });
    }

    const allMessages = [];
    if (systemPrompt) {
      allMessages.push({ role: "system", content: systemPrompt });
    }
    allMessages.push(...messages);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `MiMo API error: ${err}` }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        let buffer = "";
        try {
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
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const json = JSON.parse(data);
                const content =
                  json.choices?.[0]?.delta?.content ??
                  json.choices?.[0]?.delta?.reasoning_content ??
                  "";
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {}
            }
          }
          if (buffer.startsWith("data: ") && buffer.slice(6) !== "[DONE]") {
            try {
              const json = JSON.parse(buffer.slice(6));
              const content =
                json.choices?.[0]?.delta?.content ??
                json.choices?.[0]?.delta?.reasoning_content ??
                "";
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            } catch {}
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 }
    );
  }
}
