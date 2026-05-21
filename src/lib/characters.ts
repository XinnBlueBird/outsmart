export type CharacterClass = "cipher-mage" | "shadow-agent" | "iron-mind" | "trickster";

export interface Character {
  id: CharacterClass;
  name: string;
  title: string;
  icon: string;
  color: string;
  colorDim: string;
  stats: {
    int: number;
    agi: number;
    def: number;
    cha: number;
  };
  hp: number;
  baseDamage: number;
  ability: {
    name: string;
    description: string;
    cooldown: number; // rounds
  };
  description: string;
  bestArena: string;
}

export const CHARACTERS: Record<CharacterClass, Character> = {
  "cipher-mage": {
    id: "cipher-mage",
    name: "Cipher Mage",
    title: "Master of Decryption",
    icon: "Brain",
    color: "#38bdf8",
    colorDim: "rgba(56, 189, 248, 0.1)",
    stats: { int: 9, agi: 4, def: 5, cha: 3 },
    hp: 100,
    baseDamage: 18,
    ability: {
      name: "Decrypt",
      description: "Reveals a hint for the current puzzle. Skips hard mode for 1 round.",
      cooldown: 3,
    },
    description: "Raw intellect. Solves puzzles faster and hits harder in Cipher Vault.",
    bestArena: "Cipher Vault",
  },
  "shadow-agent": {
    id: "shadow-agent",
    name: "Shadow Agent",
    title: "Silent Operative",
    icon: "Eye",
    color: "#f472b6",
    colorDim: "rgba(244, 114, 182, 0.1)",
    stats: { int: 5, agi: 9, def: 4, cha: 3 },
    hp: 90,
    baseDamage: 15,
    ability: {
      name: "Cloak",
      description: "Skip one question without taking damage. AI wastes its attack.",
      cooldown: 4,
    },
    description: "Fast and elusive. Bonus time on timer rounds. Dodges damage.",
    bestArena: "The Interrogation",
  },
  "iron-mind": {
    id: "iron-mind",
    name: "Iron Mind",
    title: "The Unbreakable",
    icon: "Shield",
    color: "#34d399",
    colorDim: "rgba(52, 211, 153, 0.1)",
    stats: { int: 5, agi: 3, def: 9, cha: 4 },
    hp: 130,
    baseDamage: 12,
    ability: {
      name: "Fortify",
      description: "Double score on next correct answer. Absorbs damage reduction for 2 rounds.",
      cooldown: 4,
    },
    description: "Tank. High HP, damage reduction. Survives longer than anyone.",
    bestArena: "The Negotiation",
  },
  "trickster": {
    id: "trickster",
    name: "Trickster",
    title: "Master of Deception",
    icon: "Sparkles",
    color: "#fb923c",
    colorDim: "rgba(251, 146, 60, 0.1)",
    stats: { int: 4, agi: 5, def: 3, cha: 9 },
    hp: 95,
    baseDamage: 14,
    ability: {
      name: "Bluff",
      description: "AI gives a misleading hint. Confuses MiMo for 1 round, reducing its damage.",
      cooldown: 3,
    },
    description: "Social engineering. Bonus in interrogation and negotiation. Confuses the AI.",
    bestArena: "The Final Duel",
  },
};

export const AI_CHARACTER = {
  name: "MiMo Core",
  title: "Adaptive Intelligence",
  color: "#a78bfa",
  hp: 120,
  baseDamage: 14,
  evolveThreshold: 3, // evolves after taking 3 hits
};

export function getStatBar(value: number, max: number = 10): string {
  const filled = Math.round((value / max) * 5);
  return "█".repeat(filled) + "░".repeat(5 - filled);
}
