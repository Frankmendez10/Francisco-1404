export interface Snail {
  id: string;
  name: string;
}

export interface RaceResult {
  raceId: string;
  snailId: string;
  position: number;
}

export interface Race {
  id: string;
  name: string;
  results: RaceResult[];
}