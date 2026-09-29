import type { Race, Snail } from "../types/race";

export const snails: Snail[] = [
  { id: "snail-1", name: "Rayo" },
  { id: "snail-2", name: "Turbo" },
  { id: "snail-3", name: "Relámpago" },
  { id: "snail-4", name: "Trueno" },
  { id: "snail-5", name: "Flash" },
  { id: "snail-6", name: "Centella" },
];

export const races: Race[] = [
  {
    id: "race-1",
    name: "Carrera 1",
    results: [
      { raceId: "race-1", snailId: "snail-3", position: 1 },
      { raceId: "race-1", snailId: "snail-1", position: 2 },
      { raceId: "race-1", snailId: "snail-5", position: 3 },
      { raceId: "race-1", snailId: "snail-2", position: 4 },
      { raceId: "race-1", snailId: "snail-6", position: 5 },
      { raceId: "race-1", snailId: "snail-4", position: 6 },
    ],
  },
  {
    id: "race-2",
    name: "Carrera 2",
    results: [
      { raceId: "race-2", snailId: "snail-1", position: 1 },
      { raceId: "race-2", snailId: "snail-4", position: 2 },
      { raceId: "race-2", snailId: "snail-2", position: 3 },
      { raceId: "race-2", snailId: "snail-6", position: 4 },
      { raceId: "race-2", snailId: "snail-3", position: 5 },
      { raceId: "race-2", snailId: "snail-5", position: 6 },
    ],
  },
  {
    id: "race-3",
    name: "Carrera 3",
    results: [
      { raceId: "race-3", snailId: "snail-5", position: 1 },
      { raceId: "race-3", snailId: "snail-2", position: 2 },
      { raceId: "race-3", snailId: "snail-6", position: 3 },
      { raceId: "race-3", snailId: "snail-1", position: 4 },
      { raceId: "race-3", snailId: "snail-4", position: 5 },
      { raceId: "race-3", snailId: "snail-3", position: 6 },
    ],
  },
  {
    id: "race-4",
    name: "Carrera 4",
    results: [
      { raceId: "race-4", snailId: "snail-2", position: 1 },
      { raceId: "race-4", snailId: "snail-6", position: 2 },
      { raceId: "race-4", snailId: "snail-4", position: 3 },
      { raceId: "race-4", snailId: "snail-3", position: 4 },
      { raceId: "race-4", snailId: "snail-5", position: 5 },
      { raceId: "race-4", snailId: "snail-1", position: 6 },
    ],
  },
  {
    id: "race-5",
    name: "Carrera 5",
    results: [
      { raceId: "race-5", snailId: "snail-6", position: 1 },
      { raceId: "race-5", snailId: "snail-3", position: 2 },
      { raceId: "race-5", snailId: "snail-1", position: 3 },
      { raceId: "race-5", snailId: "snail-5", position: 4 },
      { raceId: "race-5", snailId: "snail-2", position: 5 },
      { raceId: "race-5", snailId: "snail-4", position: 6 },
    ],
  },
  {
    id: "race-6",
    name: "Carrera 6",
    results: [
      { raceId: "race-6", snailId: "snail-4", position: 1 },
      { raceId: "race-6", snailId: "snail-5", position: 2 },
      { raceId: "race-6", snailId: "snail-2", position: 3 },
      { raceId: "race-6", snailId: "snail-1", position: 4 },
      { raceId: "race-6", snailId: "snail-6", position: 5 },
      { raceId: "race-6", snailId: "snail-3", position: 6 },
    ],
  },
];