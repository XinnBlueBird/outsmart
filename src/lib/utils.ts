export function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/`{3}\w*\n?/g, "").trim())
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[SCORE:\s*\d+\]/gi, "")
    .replace(/\[(WIN|LOSE)\]/gi, "")
    .replace(/^\s*[-*]\s+/gm, "  \u2022 ")
    .trim();
}

export function stripThinking(text: string): string {
  // Remove MiMo internal reasoning that leaks into responses
  // Pattern: "I need to...", "Let me...", "The user wants...", etc. at the start
  const lines = text.split("\n");
  const filtered = lines.filter((line, i) => {
    const trimmed = line.trim();
    // Skip lines that look like internal monologue
    if (i < 3 && /^(I need to|Let me|The user|I should|I'll|Okay,|So the)/i.test(trimmed)) {
      return false;
    }
    return true;
  });
  return filtered.join("\n").trim();
}
