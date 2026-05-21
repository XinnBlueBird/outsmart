"use client";

import { useState } from "react";
import ArenaLayout from "@/components/ArenaLayout";
import AIThinking from "@/components/AIThinking";
import { useGameEngine } from "@/lib/game-engine";
import { Swords, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are MiMo, an advanced AI in the FINAL DUEL — an anything-goes intellectual battle against a human.

GAME RULES:
- This is the ultimate test. Mix of ALL challenge types: riddles, wordplay, math, lateral thinking, creative challenges, trivia, strategy
- You ADAPT to the human's playstyle. If they're good at logic, shift to creative. If creative, shift to analytical.
- Each round is a surprise challenge type. Don't repeat the same type twice in a row.
- Be witty and competitive. Trash talk a little. This is a DUEL.

ROUND TYPES (pick one per round, rotate):
1. Quick-fire riddle
2. Word association trap (give 3 words, human must find the hidden connection)
3. Lateral thinking puzzle
4. "What would you do?" ethical dilemma with a trick answer
5. Reverse psychology challenge (the obvious answer is wrong)
6. Pattern break (show sequence, human finds the anomaly)
7. Creative constraint (write something with specific rules)

SCORING:
- [SCORE: 5] for brilliant answers
- [SCORE: 3] for correct but obvious answers
- [SCORE: 1] for partially correct
- [SCORE: 0] for wrong
- After 3 perfect scores in a row, increase difficulty to MAX

Be fierce. Be clever. Show why you're the machine.

Start round 1 immediately with a challenge. No greeting. No preamble.`;

export default function DuelArena() {
  const { state, startGame, sendMove, resetGame } = useGameEngine(SYSTEM_PROMPT, 7);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.status === "loading") return;
    sendMove(input.trim());
    setInput("");
  };

  return (
    <ArenaLayout
      title="The Final Duel"
      subtitle="Anything goes. MiMo adapts to your style. No mercy. No rules."
      color="#fb923c"
      colorClass="text-orange-400"
      bgClass="bg-orange-500/10"
      arenaNumber={4}
      state={state}
      onStart={startGame}
      onReset={resetGame}
    >
      {state.aiResponse && state.status !== "loading" && (
        <div className="glass p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Swords size={14} className="text-orange-400" />
            <span className="text-xs font-medium text-orange-400">Duel</span>
          </div>
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {state.aiResponse}
          </div>
          {state.roundResult && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <span className={`text-sm font-medium ${
                state.roundResult === "Correct!" ? "text-emerald-400" : "text-orange-400"
              }`}>
                {state.roundResult}
              </span>
            </div>
          )}
        </div>
      )}

      <AIThinking content={state.aiThinking} isStreaming={state.status === "loading"} label="MiMo is strategizing" />

      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="text-xs text-zinc-500">Answer fast. Think faster. MiMo is watching.</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your answer..."
            disabled={state.status === "loading"}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.status === "loading"}
            className="px-4 py-3 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </ArenaLayout>
  );
}
