"use client";

import { useState } from "react";
import { Brain, Eye, Shield, Sparkles, ChevronRight } from "lucide-react";
import { CharacterClass, CHARACTERS } from "@/lib/characters";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Brain,
  Eye,
  Shield,
  Sparkles,
};

interface CharacterSelectProps {
  onSelect: (charId: CharacterClass) => void;
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [selected, setSelected] = useState<CharacterClass | null>(null);
  const [hovered, setHovered] = useState<CharacterClass | null>(null);

  const chars = Object.values(CHARACTERS);

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-2">Choose Your Fighter</h2>
      <p className="text-sm text-zinc-500 mb-10">Each class has unique stats, abilities, and playstyles.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
        {chars.map((char) => {
          const Icon = ICON_MAP[char.icon] || Brain;
          const isSelected = selected === char.id;
          const isHovered = hovered === char.id;

          return (
            <button
              key={char.id}
              onClick={() => setSelected(char.id)}
              onMouseEnter={() => setHovered(char.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative text-left p-5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "border-violet-500/50 bg-violet-500/[0.08]"
                  : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/80 hover:border-zinc-700"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              )}

              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: char.colorDim }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-200">{char.name}</h3>
                  <p className="text-xs text-zinc-500">{char.title}</p>
                </div>
              </div>

              {/* Stat bars */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                {(["int", "agi", "def", "cha"] as const).map((stat) => (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 w-6">
                      {stat}
                    </span>
                    <div className="flex-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            background:
                              i < Math.round(char.stats[stat] / 2)
                                ? char.color
                                : "rgba(255,255,255,0.06)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-400 w-4 text-right">{char.stats[stat]}</span>
                  </div>
                ))}
              </div>

              {/* Ability */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: char.color, background: char.colorDim }}>
                  {char.ability.name}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">{char.ability.description}</span>
              </div>

              {/* HP + Damage */}
              <div className="flex items-center gap-4 mt-3 text-[10px] text-zinc-500">
                <span>HP: {char.hp}</span>
                <span>DMG: {char.baseDamage}</span>
                <span>Best: {char.bestArena}</span>
              </div>

              {/* Hover glow */}
              {(isHovered || isSelected) && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.03]"
                  style={{ background: `radial-gradient(circle at center, ${char.color}, transparent 70%)` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => selected && onSelect(selected)}
        disabled={!selected}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Enter Battle
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
