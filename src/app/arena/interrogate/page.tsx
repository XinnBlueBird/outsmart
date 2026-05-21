"use client";

import { useState } from "react";
import ArenaLayout from "@/components/ArenaLayout";
import AIThinking from "@/components/AIThinking";
import { useGameEngine } from "@/lib/game-engine";
import { Eye, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are MiMo, an advanced AI playing a SOCIAL DEDUCTION BATTLE against a human. Both have HP. Correct guesses deal damage to you. Wrong guesses hurt the player.

GAME RULES:
- Each round, you create 3 NPCs with names and short personality descriptions
- ONE is secretly an AI pretending to be human. The other two are genuine humans.
- The human can ask ONE question to each NPC (separated by |)
- You respond as each NPC, staying in character. The AI NPC tries to blend in but may slip up subtly.
- After the responses, the human must guess which NPC is the AI
- Score: [SCORE: 5] for correct identification, [SCORE: 2] if they narrow to 2, [SCORE: 0] for wrong
- After 3 wrong guesses total, end with [LOSE]

FORMAT per round:
**Round N — The Suspects:**
1. [Name]: [2-line personality/backstory]
2. [Name]: [2-line personality/backstory]
3. [Name]: [2-line personality/backstory]

Ask your questions (one per suspect, separated by |):

After human asks questions and guesses, respond with NPC answers first, then reveal if correct.

Be creative with NPC scenarios. The AI NPC should be subtly off.
Be competitive — reference the player's HP and character when taunting.

Start round 1 now. Present the suspects directly.`;

export default function InterrogateArena() {
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
      title="The Interrogation"
      subtitle="Battle of perception. Find the AI hiding among humans."
      color="#f472b6"
      colorClass="text-pink-400"
      bgClass="bg-pink-500/10"
      arenaNumber="Arena 2"
      state={state}
      onSelectCharacter={selectCharacter}
      onUseAbility={useAbility}
      onReset={resetGame}
    >
      {state.aiResponse && state.status !== "loading" && (
        <div className="glass p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} className="text-pink-400" />
            <span className="text-xs font-medium text-pink-400">Interrogation Report</span>
          </div>
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {state.aiResponse}
          </div>
          {state.roundResult && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <span className={`text-sm font-medium ${
                state.roundResult.includes("damage") && !state.roundResult.includes("Wrong") && !state.roundResult.includes("MiMo deals")
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}>
                {state.roundResult}
              </span>
            </div>
          )}
        </div>
      )}

      <AIThinking content={state.aiThinking} isStreaming={state.status === "loading"} label="MiMo is observing" />

      {state.status === "playing" && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <p className="text-xs text-zinc-500">Ask questions separated by | or guess which NPC is the AI (e.g. &quot;NPC 2 is the AI&quot;).</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your questions or guess..."
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-3 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-500 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </ArenaLayout>
  );
}
