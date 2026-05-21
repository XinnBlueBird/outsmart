"use client";

import { useState } from "react";
import ArenaLayout from "@/components/ArenaLayout";
import AIThinking from "@/components/AIThinking";
import { useGameEngine } from "@/lib/game-engine";
import { Handshake, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are MiMo, an advanced AI playing a NEGOTIATION BATTLE against a human. Both have HP. Good deals deal damage to you. Bad deals hurt the player.

GAME RULES:
- This is a resource negotiation game with hidden objectives
- Each round, both you and the human have resources (gems, maps, keys, potions, gold) and a secret goal
- You reveal the shared resource pool and your public offer
- The human makes offers, trades, or strategic moves
- You can accept, counter-offer, or bluff
- Each round has a theme: trade deal, peace treaty, treasure split, alliance formation, etc.

ROUND FLOW:
1. Present the scenario + available resources + your public offer
2. Human responds with their move (offer, bluff, demand, accept, betray)
3. Evaluate: if the deal is fair/smart, they score. If they got bluffed or made a bad deal, they lose points
4. Score: [SCORE: 5] for great deal, [SCORE: 3] for decent deal, [SCORE: 1] for break-even, [SCORE: 0] for bad deal

BLUFFING ELEMENTS:
- You sometimes bluff about your hidden objective
- You sometimes make intentionally bad offers to test the human
- If the human calls your bluff correctly, bonus points [SCORE: 5]
- If they fall for a trap, [SCORE: 0]

Be fierce and strategic. Reference the player's HP and character in your negotiations.

Start round 1 with a compelling negotiation scenario. Be direct, no greeting.`;

export default function NegotiateArena() {
  const { state, selectCharacter, useAbility, sendMove, resetGame } = useGameEngine(SYSTEM_PROMPT, 5);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.status === "loading") return;
    sendMove(input.trim());
    setInput("");
  };

  return (
    <ArenaLayout
      title="The Negotiation"
      subtitle="Battle of strategy. Outthink, outbluff, outlast."
      color="#34d399"
      colorClass="text-emerald-400"
      bgClass="bg-emerald-500/10"
      arenaNumber="Arena 3"
      state={state}
      onSelectCharacter={selectCharacter}
      onUseAbility={useAbility}
      onReset={resetGame}
    >
      {state.aiResponse && state.status !== "loading" && (
        <div className="glass p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Handshake size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">Negotiation Table</span>
          </div>
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {state.aiResponse}
          </div>
          {state.roundResult && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <span className={`text-sm font-medium ${
                state.roundResult.includes("damage") && !state.roundResult.includes("Wrong") && !state.roundResult.includes("MiMo deals")
                  ? "text-emerald-400"
                  : "text-orange-400"
              }`}>
                {state.roundResult}
              </span>
            </div>
          )}
        </div>
      )}

      <AIThinking content={state.aiThinking} isStreaming={state.status === "loading"} label="MiMo is calculating strategy" />

      {state.status === "playing" && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <p className="text-xs text-zinc-500">Make your move: offer, counter-offer, accept, bluff, or call their bluff.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your negotiation move..."
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-3 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </ArenaLayout>
  );
}
