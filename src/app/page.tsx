"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Shield,
  Handshake,
  Swords,
  ChevronRight,
  Trophy,
  Zap,
  Eye,
  Cpu,
  TrendingUp,
} from "lucide-react";

const ARENAS = [
  {
    id: "cipher",
    title: "Cipher Vault",
    description: "Decrypt codes, crack puzzles. Your logic against MiMo's pattern recognition.",
    icon: Brain,
    color: "#38bdf8",
    colorClass: "text-sky-400",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/20",
    href: "/arena/cipher",
  },
  {
    id: "interrogate",
    title: "The Interrogation",
    description: "Identify the AI among NPCs. Ask questions. Detect deception.",
    icon: Eye,
    color: "#f472b6",
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10",
    borderClass: "border-pink-500/20",
    href: "/arena/interrogate",
  },
  {
    id: "negotiate",
    title: "The Negotiation",
    description: "Hidden objectives. Bluff. Trade. Betray. Strategic mind games.",
    icon: Handshake,
    color: "#34d399",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    href: "/arena/negotiate",
  },
  {
    id: "duel",
    title: "The Final Duel",
    description: "Everything goes. MiMo adapts to your style. No mercy. No rules.",
    icon: Swords,
    color: "#fb923c",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/20",
    href: "/arena/duel",
  },
];

const STATS = [
  { label: "Arenas", value: "4", icon: Trophy },
  { label: "AI Model", value: "MiMo v2.5", icon: Cpu },
  { label: "Rounds", value: "Adaptive", icon: TrendingUp },
  { label: "Engine", value: "Live Reasoning", icon: Zap },
];

export default function Home() {
  const [hoveredArena, setHoveredArena] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative">
      {/* Grid pattern background */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Hero glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/[0.06] blur-[150px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 h-16">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="OUTSMART" width={28} height={28} />
          <span className="text-sm font-semibold tracking-tight text-zinc-200">OUTSMART</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 mr-2">Powered by</span>
          <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
            MiMo v2.5 Pro
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse-glow" />
            <span className="text-xs text-violet-300">Human vs AI Intelligence Arena</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-100 mb-6">
            Can you{" "}
            <span className="gradient-text">outsmart</span>
            <br />
            the machine?
          </h1>

          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Four arenas. One AI opponent. MiMo&apos;s reasoning chain displayed live as it tries to
            outthink you. Each round gets harder.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/arena/cipher"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Start the Gauntlet
              <ChevronRight size={16} />
            </Link>
            <a
              href="#arenas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              View Arenas
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 border-y border-white/[0.04] bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <stat.icon size={16} className="text-zinc-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">{stat.value}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Arenas */}
      <section id="arenas" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-4">
            Choose Your Arena
          </h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Each arena tests a different dimension of intelligence. Complete all four to conquer
            The Gauntlet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARENAS.map((arena, i) => (
            <Link
              key={arena.id}
              href={arena.href}
              onMouseEnter={() => setHoveredArena(arena.id)}
              onMouseLeave={() => setHoveredArena(null)}
              className={`group relative p-6 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/80 transition-all duration-200 animate-fade-in-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-lg ${arena.bgClass} flex items-center justify-center flex-shrink-0`}
                >
                  <arena.icon size={20} style={{ color: arena.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-medium text-zinc-200">{arena.title}</h3>
                    <ChevronRight
                      size={16}
                      className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{arena.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${arena.borderClass} ${arena.colorClass} opacity-60`}
                    >
                      Arena {i + 1}
                    </span>
                    <span className="text-xs text-zinc-600">~5 min per round</span>
                  </div>
                </div>
              </div>

              {/* Subtle hover glow */}
              {hoveredArena === arena.id && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.03]"
                  style={{ background: `radial-gradient(circle at center, ${arena.color}, transparent 70%)` }}
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 border-t border-zinc-800/50 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-4">
            How It Works
          </h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Every move MiMo makes is transparent. Watch the AI reason in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Enter the Arena",
              desc: "Each arena presents a unique challenge — puzzles, deception, strategy, or raw intellect.",
              icon: Shield,
            },
            {
              step: "02",
              title: "Face MiMo",
              desc: "The AI reasons live. You see its thinking chain, strategy shifts, and confidence scores in real-time.",
              icon: Brain,
            },
            {
              step: "03",
              title: "Score & Adapt",
              desc: "MiMo learns your patterns. Each round gets harder. Your score reflects how long you survive.",
              icon: TrendingUp,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-sm font-semibold text-violet-400">{item.step}</span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <item.icon size={16} className="text-zinc-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-zinc-800/50 max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 mb-4">
          Ready to prove your intelligence?
        </h2>
        <p className="text-zinc-500 max-w-lg mx-auto mb-8">
          The Gauntlet awaits. Four arenas. One AI. No second chances.
        </p>
        <Link
          href="/arena/cipher"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
        >
          Enter The Gauntlet
          <ChevronRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" width={18} height={18} />
            <span className="text-xs text-zinc-500">OUTSMART</span>
          </div>
          <span className="text-xs text-zinc-600">Powered by MiMo v2.5 Pro</span>
        </div>
      </footer>
    </div>
  );
}
