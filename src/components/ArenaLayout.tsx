"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Zap, RotateCcw, Swords } from "lucide-react";
import type { GameState } from "@/lib/game-engine";
import CharacterSelect from "@/components/CharacterSelect";
import BattleHUD from "@/components/BattleHUD";
import type { CharacterClass } from "@/lib/characters";
import { CHARACTERS } from "@/lib/characters";

interface ArenaLayoutProps {
  title: string;
  subtitle: string;
  color: string;
  colorClass: string;
  bgClass: string;
  arenaNumber: string;
  state: GameState;
  onSelectCharacter: (charId: CharacterClass) => void;
  onUseAbility: () => void;
  onReset: () => void;
  children: ReactNode;
}

export default function ArenaLayout({
  title,
  subtitle,
  color,
  colorClass,
  bgClass,
  arenaNumber,
  state,
  onSelectCharacter,
  onUseAbility,
  onReset,
  children,
}: ArenaLayoutProps) {
  const char = state.character ? CHARACTERS[state.character] : null;

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto px-6 h-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">{arenaNumber}</span>
        </Link>
        <div className="flex items-center gap-4">
          {state.status !== "idle" && state.status !== "character-select" && (
            <>
              <div className="flex items-center gap-1.5 text-sm">
                <Trophy size={14} className={colorClass} />
                <span className="text-zinc-300 font-medium">{state.score}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Zap size={14} className="text-zinc-500" />
                <span className="text-zinc-400">Round {state.round}/{state.maxRounds}</span>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${bgClass}`}
            style={{ borderColor: `${color}33` }}
          >
            <span className="text-xs" style={{ color }}>{arenaNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-2">
            {title}
          </h1>
          <p className="text-zinc-500">{subtitle}</p>
        </div>

        {/* Character select */}
        {state.status === "character-select" && (
          <CharacterSelect onSelect={onSelectCharacter} />
        )}

        {/* Loading (fetching first puzzle) */}
        {state.status === "loading" && !state.aiResponse && !state.aiThinking && (
          <div className="text-center py-16">
            <div className="glass max-w-md mx-auto p-8">
              <div className="flex justify-center gap-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "600ms" }} />
              </div>
              <p className="text-sm text-zinc-400">Preparing battle arena...</p>
            </div>
          </div>
        )}

        {/* Battle active */}
        {(state.status === "playing" || state.status === "loading") && state.character && (
          <>
            <BattleHUD
              character={state.character}
              battle={state.battle}
              combo={state.battle.combo}
              abilityCooldown={state.battle.abilityCooldown}
              abilityActive={state.abilityActive}
              skipNextDamage={state.skipNextDamage}
              doubleNextScore={state.doubleNextScore}
              onUseAbility={onUseAbility}
              roundResult={state.roundResult}
            />
            {children}
          </>
        )}

        {/* Game over */}
        {(state.status === "won" || state.status === "lost") && char && (
          <div className="text-center py-12">
            <div className="glass max-w-lg mx-auto p-8">
              <div className="text-5xl mb-4">{state.status === "won" ? "Victory" : "Defeated"}</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-1">
                {state.status === "won" ? `${char.name} Wins!` : "MiMo Core Wins"}
              </h3>
              <p className="text-zinc-500 text-sm mb-6">
                {state.status === "won"
                  ? "You outsmarted the machine. The gauntlet is conquered."
                  : "MiMo adapted too fast. Train harder and return."}
              </p>

              {/* Battle stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-xs text-zinc-500 mb-1">Final Score</div>
                  <div className="text-2xl font-bold gradient-text">{state.score}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-xs text-zinc-500 mb-1">Max Combo</div>
                  <div className="text-2xl font-bold text-orange-400">{state.battle.combo}x</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-xs text-zinc-500 mb-1">Damage Dealt</div>
                  <div className="text-lg font-bold text-emerald-400">{state.battle.totalDamageDealt}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-xs text-zinc-500 mb-1">Damage Taken</div>
                  <div className="text-lg font-bold text-red-400">{state.battle.totalDamageTaken}</div>
                </div>
              </div>

              {/* Character + AI HP summary */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-6 px-4">
                <span style={{ color: char.color }}>{char.name}: {state.battle.playerHp} HP</span>
                <Swords size={12} className="text-zinc-600" />
                <span className="text-violet-400">MiMo Core: {state.battle.aiHp} HP</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
                >
                  <RotateCcw size={14} />
                  Battle Again
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                >
                  Back to Arenas
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
