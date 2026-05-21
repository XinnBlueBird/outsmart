"use client";

import { useEffect, useState } from "react";
import { Zap, Heart, Swords, Shield as ShieldIcon } from "lucide-react";
import { CharacterClass, CHARACTERS, AI_CHARACTER } from "@/lib/characters";
import type { BattleState } from "@/lib/game-engine";

interface BattleHUDProps {
  character: CharacterClass;
  battle: BattleState;
  combo: number;
  abilityCooldown: number;
  abilityActive: boolean;
  skipNextDamage: boolean;
  doubleNextScore: boolean;
  onUseAbility: () => void;
  roundResult: string | null;
}

function HPBar({ current, max, color, label, icon: Icon, side }: {
  current: number;
  max: number;
  color: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  side: "left" | "right";
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = pct < 30;

  return (
    <div className={`flex items-center gap-3 ${side === "right" ? "flex-row-reverse" : ""}`}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, color }}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-zinc-300">{label}</span>
          <span className={`text-xs font-mono ${isLow ? "text-red-400" : "text-zinc-400"}`}>
            {current}/{max}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: isLow
                ? "linear-gradient(90deg, #ef4444, #f87171)"
                : `linear-gradient(90deg, ${color}, ${color}cc)`,
              boxShadow: isLow ? "0 0 8px rgba(239,68,68,0.4)" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DamageNumber({ value, color, show }: { value: number; color: string; show: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && value > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [show, value]);

  if (!visible || value === 0) return null;

  return (
    <div className="animate-fade-in-up text-center">
      <span className="text-2xl font-bold" style={{ color }}>
        -{value}
      </span>
    </div>
  );
}

export default function BattleHUD({
  character,
  battle,
  combo,
  abilityCooldown,
  abilityActive,
  skipNextDamage,
  doubleNextScore,
  onUseAbility,
  roundResult,
}: BattleHUDProps) {
  const char = CHARACTERS[character];
  const aiEvolvedColor = battle.aiEvolved ? "#ef4444" : AI_CHARACTER.color;
  const aiLabel = battle.aiEvolved ? "MiMo Core [EVOLVED]" : AI_CHARACTER.name;

  return (
    <div className="mb-6">
      {/* Battle field */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 mb-4">
        {/* Damage numbers overlay */}
        <div className="absolute inset-x-0 top-1/4 flex justify-center pointer-events-none">
          <DamageNumber value={battle.lastDamageDealt} color="#22c55e" show={battle.lastDamageDealt > 0} />
        </div>
        <div className="absolute inset-x-0 bottom-1/4 flex justify-center pointer-events-none">
          <DamageNumber value={battle.lastDamageTaken} color="#ef4444" show={battle.lastDamageTaken > 0} />
        </div>

        {/* AI HP (top) */}
        <div className="mb-4">
          <HPBar
            current={battle.aiHp}
            max={battle.aiMaxHp}
            color={aiEvolvedColor}
            label={aiLabel}
            icon={Swords}
            side="right"
          />
        </div>

        {/* VS divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {combo}x COMBO
              </span>
            )}
            <span className="text-xs text-zinc-500 font-medium">VS</span>
            {battle.playerShield > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SHIELD {battle.playerShield}
              </span>
            )}
          </div>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Player HP (bottom) */}
        <HPBar
          current={battle.playerHp}
          max={battle.playerMaxHp}
          color={char.color}
          label={char.name}
          icon={Heart}
          side="left"
        />

        {/* Status effects */}
        {(skipNextDamage || doubleNextScore || abilityActive) && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {skipNextDamage && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                CLOAKED
              </span>
            )}
            {doubleNextScore && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                2x SCORE
              </span>
            )}
            {abilityActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                ABILITY ACTIVE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ability button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onUseAbility}
          disabled={abilityCooldown > 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: abilityCooldown > 0 ? "rgba(255,255,255,0.06)" : `${char.color}33`,
            color: abilityCooldown > 0 ? "#71717a" : char.color,
            background: abilityCooldown > 0 ? "rgba(255,255,255,0.02)" : char.colorDim,
          }}
        >
          <Zap size={14} />
          {char.ability.name}
          {abilityCooldown > 0 && (
            <span className="text-xs opacity-60">({abilityCooldown})</span>
          )}
        </button>
        <span className="text-xs text-zinc-500 hidden sm:block">{char.ability.description}</span>
      </div>
    </div>
  );
}
