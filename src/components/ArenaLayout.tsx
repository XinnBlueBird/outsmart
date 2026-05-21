"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Zap, RotateCcw } from "lucide-react";
import type { GameState } from "@/lib/game-engine";

interface ArenaLayoutProps {
  title: string;
  subtitle: string;
  color: string;
  colorClass: string;
  bgClass: string;
  arenaNumber: number;
  state: GameState;
  onStart: () => void;
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
  onStart,
  onReset,
  children,
}: ArenaLayoutProps) {
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
          <span className="text-zinc-500">Arena {arenaNumber}</span>
        </Link>
        <div className="flex items-center gap-4">
          {state.status !== "idle" && (
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
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${bgClass}`}
            style={{ borderColor: `${color}33` }}
          >
            <span className="text-xs" style={{ color }}>Arena {arenaNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-2">
            {title}
          </h1>
          <p className="text-zinc-500">{subtitle}</p>
        </div>

        {/* Idle state */}
        {state.status === "idle" && (
          <div className="text-center py-16">
            <div className="glass max-w-md mx-auto p-8 mb-8">
              <h3 className="text-lg font-medium text-zinc-200 mb-3">Ready?</h3>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                You have {state.maxRounds} rounds to prove yourself. MiMo will adapt to your
                strategy. Score points by outsmarting the AI.
              </p>
              <button
                onClick={onStart}
                className="px-6 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
              >
                Begin
              </button>
            </div>
          </div>
        )}

        {/* Game active */}
        {(state.status === "playing" || state.status === "loading") && children}

        {/* Game over */}
        {(state.status === "won" || state.status === "lost") && (
          <div className="text-center py-16">
            <div className="glass max-w-md mx-auto p-8">
              <div className="text-5xl mb-4">{state.status === "won" ? "🏆" : "💀"}</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                {state.status === "won" ? "Gauntlet Conquered" : "Outsmarted"}
              </h3>
              <p className="text-zinc-500 mb-2">Final Score</p>
              <p className="text-4xl font-bold gradient-text mb-6">{state.score}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
                >
                  <RotateCcw size={14} />
                  Play Again
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
