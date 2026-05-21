"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { streamChat, ChatMessage } from "@/lib/mimo-client";

export type GameStatus = "idle" | "playing" | "won" | "lost" | "loading";

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
}

export function useGameEngine(systemPrompt: string, maxRounds: number = 5) {
  const [state, setState] = useState<GameState>({
    status: "idle",
    score: 0,
    round: 0,
    maxRounds,
    messages: [],
    aiThinking: "",
    aiResponse: "",
    humanInput: "",
    roundResult: null,
    difficulty: 1,
  });

  const abortRef = useRef<AbortController | null>(null);

  const startGame = useCallback(() => {
    setState({
      status: "playing",
      score: 0,
      round: 1,
      maxRounds,
      messages: [],
      aiThinking: "",
      aiResponse: "",
      humanInput: "",
      roundResult: null,
      difficulty: 1,
    });
  }, [maxRounds]);

  const sendMove = useCallback(
    async (input: string) => {
      setState((s) => ({ ...s, status: "loading", humanInput: input, aiThinking: "", aiResponse: "", roundResult: null }));

      const newMessages: ChatMessage[] = [
        ...state.messages,
        { role: "user" as const, content: input },
      ];

      let fullResponse = "";
      try {
        const roundInfo = `Round ${state.round}/${state.maxRounds}. Difficulty level: ${state.difficulty}. Current score: ${state.score}.`;
        const fullSystem = `${systemPrompt}\n\n${roundInfo}`;

        for await (const chunk of streamChat(newMessages, fullSystem)) {
          fullResponse += chunk;
          setState((s) => ({ ...s, aiThinking: fullResponse }));
        }

        // Parse AI response for score
        let roundScore = 0;
        let resultText = fullResponse;

        const scoreMatch = fullResponse.match(/\[SCORE:\s*(\d+)\]/i);
        if (scoreMatch) {
          roundScore = parseInt(scoreMatch[1], 10);
          resultText = fullResponse.replace(/\[SCORE:\s*\d+\]/i, "").trim();
        }

        const isWin = roundScore > 0 || fullResponse.toLowerCase().includes("[win]");
        const isLoss = fullResponse.toLowerCase().includes("[lose]");

        const newScore = state.score + roundScore;
        const newRound = state.round + 1;
        const gameOver = newRound > state.maxRounds || isLoss;

        setState((s) => ({
          ...s,
          status: gameOver ? (newScore > s.maxRounds * 3 ? "won" : "lost") : "playing",
          score: newScore,
          round: newRound,
          messages: [...newMessages, { role: "assistant", content: resultText }],
          aiThinking: "",
          aiResponse: resultText,
          roundResult: isWin ? "Correct!" : isLoss ? "You've been outsmarted." : "Round complete.",
          difficulty: Math.min(5, s.difficulty + (isWin ? 0.5 : 0)),
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
    [state.messages, state.round, state.maxRounds, state.score, state.difficulty, systemPrompt]
  );

  const resetGame = useCallback(() => {
    abortRef.current?.abort();
    setState({
      status: "idle",
      score: 0,
      round: 0,
      maxRounds,
      messages: [],
      aiThinking: "",
      aiResponse: "",
      humanInput: "",
      roundResult: null,
      difficulty: 1,
    });
  }, [maxRounds]);

  return { state, startGame, sendMove, resetGame };
}
