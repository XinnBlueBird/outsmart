"use client";

interface AIThinkingProps {
  content: string;
  isStreaming: boolean;
  label?: string;
}

export default function AIThinking({ content, isStreaming, label = "MiMo is reasoning" }: AIThinkingProps) {
  if (!content && !isStreaming) return null;

  return (
    <div className="thinking-bubble rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "300ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "600ms" }} />
        </div>
        <span className="text-xs text-violet-300/80 font-medium">{label}</span>
        {isStreaming && <span className="text-xs text-zinc-500 ml-auto">streaming...</span>}
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono">
        {content}
        {isStreaming && <span className="inline-block w-2 h-4 bg-violet-400 ml-0.5 animate-pulse" />}
      </div>
    </div>
  );
}
