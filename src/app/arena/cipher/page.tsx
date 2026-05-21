"use client";

import { useState } from "react";
import ArenaLayout from "@/components/ArenaLayout";
import AIThinking from "@/components/AIThinking";
import { useGameEngine } from "@/lib/game-engine";
import { Brain, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are MiMo, an advanced AI playing a cipher and puzzle game against a human.

GAME RULES:
- Each round, you present a cipher, riddle, logic puzzle, or pattern challenge
- Start easy (round 1) and get progressively harder
- The human types their answer
- Evaluate their answer: correct or incorrect
- Give a brief explanation of the answer
- Score: [SCORE: 5] for correct, [SCORE: 0] for incorrect
- If the human fails 3 rounds in a row, end with [LOSE]
- Be creative with puzzles: Caesar ciphers, number sequences, logic grids, anagrams, riddles
- Keep challenges concise — 2-4 sentences max for the puzzle description

FORMAT for each round:
1. Present the puzzle clearly
2. Wait for human response
3. After they answer, reveal if correct + explanation + score

Start with round 1 puzzle now. Present it directly, no greeting.`;

export default function CipherArena() {
  const { state, startGame, sendMove, resetGame } = useGameEngine(SYSTEM_PROMPT, 5);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.status === "loading") return;
    sendMove(input.trim());
    setInput("");
  };

  return (
    <ArenaLayout
      title="Cipher Vault"
      subtitle="Decrypt codes, crack patterns, solve logic puzzles."
      color="#38bdf8"
      colorClass="text-sky-400"
      bgClass="bg-sky-500/10"
      arenaNumber={1}
      state={state}
      onStart={startGame}
      onReset={resetGame}
    >
      {/* Previous rounds */}
      {state.aiResponse && state.status !== "loading" && (
        <div className="glass p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-sky-400" />
            <span className="text-xs font-medium text-sky-400">MiMo says</span>
          </div>
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {state.aiResponse}
          </div>
          {state.roundResult && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <span className={`text-sm font-medium ${state.roundResult === "Correct!" ? "text-emerald-400" : "text-red-400"}`}>
                {state.roundResult}
              </span>
            </div>
          )}
        </div>
      )}

      {/* AI thinking */}
      <AIThinking content={state.aiThinking} isStreaming={state.status === "loading"} label="MiMo is crafting a puzzle" />

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          disabled={state.status === "loading"}
          className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.status === "loading"}
          className="px-4 py-3 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:hover:bg-sky-600"
        >
          <Send size={16} />
        </button>
      </form>
    </ArenaLayout>
  );
}
