"use client";

import { useState } from "react";
import ArenaLayout from "@/components/ArenaLayout";
import AIThinking from "@/components/AIThinking";
import { useGameEngine } from "@/lib/game-engine";
import { Eye, Send } from "lucide-react";

const SYSTEM_PROMPT = `You are MiMo, an advanced AI playing a social deduction game against a human.

GAME RULES:
- Each round, you create 3 NPCs with names and short personality descriptions
- ONE of them is secretly an AI pretending to be human. The other two are genuine humans.
- The human can ask ONE question to each NPC (they type all 3 questions at once, separated by |)
- You respond as each NPC, staying in character. The AI NPC should try to blend in but may slip up subtly.
- After the responses, the human must guess which NPC is the AI
- Score: [SCORE: 5] for correct identification, [SCORE: 2] if they narrow it to 2, [SCORE: 0] for wrong
- After 3 wrong guesses total across all rounds, end with [LOSE]

FORMAT per round:
**Round N — The Suspects:**
1. [Name]: [2-line personality/backstory]
2. [Name]: [2-line personality/backstory]
3. [Name]: [2-line personality/backstory]

Ask your questions (one per suspect, separated by |):

After human asks questions and guesses, respond with NPC answers first, then reveal if correct.

Be creative with NPC scenarios: office workers, gamers, travelers, students, etc.
The AI NPC should be subtly off — too perfect answers, slightly mechanical empathy, or uncanny valley responses.

Start round 1 now. Present the suspects directly.`;

export default function InterrogateArena() {
  const { state, startGame, sendMove, resetGame } = useGameEngine(SYSTEM_PROMPT, 4);
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
      subtitle="Identify the AI hiding among humans. Ask questions. Read between the lines."
      color="#f472b6"
      colorClass="text-pink-400"
      bgClass="bg-pink-500/10"
      arenaNumber={2}
      state={state}
      onStart={startGame}
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
              <span className={`text-sm font-medium ${state.roundResult === "Correct!" ? "text-emerald-400" : "text-red-400"}`}>
                {state.roundResult}
              </span>
            </div>
          )}
        </div>
      )}

      <AIThinking content={state.aiThinking} isStreaming={state.status === "loading"} label="MiMo is observing" />

      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="text-xs text-zinc-500">Ask questions separated by | (e.g. &quot;What did you eat?|Describe your room|What annoys you?&quot;), then guess which is AI.</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your questions or guess (e.g. &quot;NPC 2 is the AI&quot;)..."
            disabled={state.status === "loading"}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.status === "loading"}
            className="px-4 py-3 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </ArenaLayout>
  );
}
