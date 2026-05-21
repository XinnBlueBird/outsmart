"use client";

import { useState, useCallback, useRef } from "react";
import { streamChat, ChatMessage } from "@/lib/mimo-client";
import { stripThinking } from "@/lib/utils";
import { CharacterClass, CHARACTERS, AI_CHARACTER } from "@/lib/characters";

export type GameStatus = "idle" | "character-select" | "playing" | "won" | "lost" | "loading";

export interface BattleState {
  playerHp: number;
  playerMaxHp: number;
  aiHp: number;
  aiMaxHp: number;
  playerShield: number; // damage reduction rounds
  aiConfused: boolean; // trickster bluff active
  abilityCooldown: number;
  combo: number;
  lastDamageDealt: number;
  lastDamageTaken: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  aiEvolved: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  round: number;
  maxRounds: number;
  messages: ChatMessage[];
  aiThinking: string;
  aiResponse: string;
  humanInput: string;
  roundResult: string | null;
  difficulty: number;
  character: CharacterClass | null;
  battle: BattleState;
  abilityActive: boolean;
  skipNextDamage: boolean;
  doubleNextScore: boolean;
}

const INITIAL_BATTLE: BattleState = {
  playerHp: 100,
  playerMaxHp: 100,
  aiHp: AI_CHARACTER.hp,
  aiMaxHp: AI_CHARACTER.hp,
  playerShield: 0,
  aiConfused: false,
  abilityCooldown: 0,
  combo: 0,
  lastDamageDealt: 0,
  lastDamageTaken: 0,
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  aiEvolved: false,
};

export function useGameEngine(systemPrompt: string, maxRounds: number = 7) {
  const [state, setState] = useState<GameState>({
    status: "character-select",
    score: 0,
    round: 0,
    maxRounds,
    messages: [],
    aiThinking: "",
    aiResponse: "",
    humanInput: "",
    roundResult: null,
    difficulty: 1,
    character: null,
    battle: { ...INITIAL_BATTLE },
    abilityActive: false,
    skipNextDamage: false,
    doubleNextScore: false,
  });

  const abortRef = useRef<AbortController | null>(null);

  const selectCharacter = useCallback((charId: CharacterClass) => {
    const char = CHARACTERS[charId];
    setState((s) => ({
      ...s,
      status: "loading" as const,
      character: charId,
      battle: {
        ...INITIAL_BATTLE,
        playerHp: char.hp,
        playerMaxHp: char.hp,
      },
    }));

    // Auto-fetch first puzzle
    (async () => {
      const roundInfo = `Round 1/${maxRounds}. Difficulty level: 1. Current score: 0. The player chose ${char.name}.`;
      const fullSystem = `${systemPrompt}\n\n${roundInfo}`;
      let fullResponse = "";
      try {
        for await (const chunk of streamChat([], fullSystem)) {
          fullResponse += chunk;
          setState((s) => ({ ...s, aiThinking: fullResponse }));
        }
        const cleaned = stripThinking(fullResponse);
        setState((s) => ({
          ...s,
          status: "playing",
          messages: [{ role: "assistant", content: fullResponse }],
          aiThinking: "",
          aiResponse: cleaned,
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          status: "playing",
          aiThinking: "",
          aiResponse: `Error loading puzzle: ${e instanceof Error ? e.message : "Unknown error"}`,
        }));
      }
    })();
  }, [maxRounds, systemPrompt]);

  const useAbility = useCallback(() => {
    setState((s) => {
      if (!s.character || s.battle.abilityCooldown > 0 || s.status !== "playing") return s;
      const char = CHARACTERS[s.character];
      const newBattle = { ...s.battle, abilityCooldown: char.ability.cooldown };

      switch (s.character) {
        case "cipher-mage":
          return { ...s, battle: newBattle, abilityActive: true }; // decrypt hint
        case "shadow-agent":
          return { ...s, battle: newBattle, skipNextDamage: true, abilityActive: true }; // cloak
        case "iron-mind":
          return { ...s, battle: newBattle, doubleNextScore: true, abilityActive: true }; // fortify
        case "trickster":
          return {
            ...s,
            battle: { ...newBattle, aiConfused: true },
            abilityActive: true,
          }; // bluff
        default:
          return s;
      }
    });
  }, []);

  const sendMove = useCallback(
    async (input: string) => {
      setState((s) => ({
        ...s,
        status: "loading",
        humanInput: input,
        aiThinking: "",
        aiResponse: "",
        roundResult: null,
        lastDamageDealt: 0,
        lastDamageTaken: 0,
      }));

      const newMessages: ChatMessage[] = [
        ...state.messages,
        { role: "user" as const, content: input },
      ];

      let fullResponse = "";
      try {
        const roundInfo = [
          `Round ${state.round}/${state.maxRounds}.`,
          `Difficulty: ${state.difficulty}.`,
          `Score: ${state.score}.`,
          `Player HP: ${state.battle.playerHp}/${state.battle.playerMaxHp}.`,
          `Your HP: ${state.battle.aiHp}/${state.battle.aiMaxHp}.`,
          state.battle.aiConfused ? "You are CONFUSED this round." : "",
          state.doubleNextScore ? "Player has DOUBLE SCORE active." : "",
          state.skipNextDamage ? "Player is CLOAKED — your attack misses." : "",
        ].filter(Boolean).join(" ");

        const fullSystem = `${systemPrompt}\n\n${roundInfo}`;

        for await (const chunk of streamChat(newMessages, fullSystem)) {
          fullResponse += chunk;
          setState((s) => ({ ...s, aiThinking: fullResponse }));
        }

        // Parse score
        let roundScore = 0;
        let resultText = fullResponse;
        const scoreMatch = fullResponse.match(/\[SCORE:\s*(\d+)\]/i);
        if (scoreMatch) {
          roundScore = parseInt(scoreMatch[1], 10);
          resultText = fullResponse.replace(/\[SCORE:\s*\d+\]/i, "").trim();
        }
        resultText = stripThinking(resultText);

        const isCorrect = roundScore > 0 || fullResponse.toLowerCase().includes("[win]");
        const isLoss = fullResponse.toLowerCase().includes("[lose]");

        // Apply double score if active
        const finalScore = state.doubleNextScore ? roundScore * 2 : roundScore;

        // Calculate damage
        const char = state.character ? CHARACTERS[state.character] : null;
        const playerDmg = isCorrect && char
          ? Math.round(char.baseDamage + (state.battle.combo * 2) + (char.stats.int * 0.5))
          : 0;

        let aiDmg = 0;
        if (!isCorrect && !isLoss) {
          aiDmg = AI_CHARACTER.baseDamage;
          if (state.battle.playerShield > 0) {
            aiDmg = Math.round(aiDmg * 0.5);
          }
          if (state.skipNextDamage) {
            aiDmg = 0; // cloak absorbs
          }
          if (state.battle.aiConfused) {
            aiDmg = Math.round(aiDmg * 0.3); // bluff reduces
          }
        }

        // Update battle state
        const newAiHp = Math.max(0, state.battle.aiHp - playerDmg);
        const newPlayerHp = Math.max(0, state.battle.playerHp - aiDmg);
        const newCombo = isCorrect ? state.battle.combo + 1 : 0;

        // AI evolves after taking enough hits
        const aiEvolved = state.battle.totalDamageDealt + playerDmg >= AI_CHARACTER.evolveThreshold * 20;

        const gameOver = newPlayerHp <= 0 || newAiHp <= 0 || state.round >= state.maxRounds;
        const playerWon = newAiHp <= 0 || (gameOver && state.score + finalScore > state.maxRounds * 2);

        setState((s) => ({
          ...s,
          status: gameOver ? (playerWon ? "won" : "lost") : "playing",
          score: s.score + finalScore,
          round: s.round + 1,
          messages: [...newMessages, { role: "assistant", content: fullResponse }],
          aiThinking: "",
          aiResponse: resultText,
          roundResult: isCorrect
            ? `+${playerDmg} damage! ${newCombo > 1 ? `${newCombo}x combo!` : ""}`
            : isLoss
            ? `MiMo deals ${aiDmg} damage!`
            : aiDmg > 0
            ? `Wrong! MiMo deals ${aiDmg} damage.`
            : "Round complete.",
          difficulty: Math.min(5, s.difficulty + (isCorrect ? 0.5 : 0)),
          abilityActive: false,
          skipNextDamage: false,
          doubleNextScore: false,
          battle: {
            ...s.battle,
            playerHp: newPlayerHp,
            aiHp: newAiHp,
            combo: newCombo,
            lastDamageDealt: playerDmg,
            lastDamageTaken: aiDmg,
            totalDamageDealt: s.battle.totalDamageDealt + playerDmg,
            totalDamageTaken: s.battle.totalDamageTaken + aiDmg,
            playerShield: Math.max(0, s.battle.playerShield - 1),
            aiConfused: false,
            abilityCooldown: Math.max(0, s.battle.abilityCooldown - 1),
            aiEvolved,
          },
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          status: "playing",
          aiThinking: "",
          aiResponse: `Error: ${e instanceof Error ? e.message : "Unknown error"}`,
          roundResult: "Error occurred. Try again.",
        }));
      }
    },
    [state.messages, state.round, state.maxRounds, state.score, state.difficulty, state.character, state.battle, state.doubleNextScore, state.skipNextDamage, systemPrompt]
  );

  const resetGame = useCallback(() => {
    abortRef.current?.abort();
    setState({
      status: "character-select",
      score: 0,
      round: 0,
      maxRounds,
      messages: [],
      aiThinking: "",
      aiResponse: "",
      humanInput: "",
      roundResult: null,
      difficulty: 1,
      character: null,
      battle: { ...INITIAL_BATTLE },
      abilityActive: false,
      skipNextDamage: false,
      doubleNextScore: false,
    });
  }, [maxRounds]);

  return { state, selectCharacter, useAbility, sendMove, resetGame };
}
