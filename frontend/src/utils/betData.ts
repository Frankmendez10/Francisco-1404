import type { Bet } from "../types/bet";

export const bets: Bet[] = [
  {
    id: "bet-1",
    raceId: "race-1",
    snailId: "snail-3",
    amount: 100,
    won: true,
  },
  {
    id: "bet-2",
    raceId: "race-2",
    snailId: "snail-2",
    amount: 100,
    won: false,
  },
  {
    id: "bet-3",
    raceId: "race-3",
    snailId: "snail-5",
    amount: 150,
    won: true,
  },
  {
    id: "bet-4",
    raceId: "race-4",
    snailId: "snail-1",
    amount: 100,
    won: false,
  },
  {
    id: "bet-5",
    raceId: "race-5",
    snailId: "snail-6",
    amount: 200,
    won: true,
  },
  {
    id: "bet-6",
    raceId: "race-6",
    snailId: "snail-3",
    amount: 100,
    won: false,
  },
];