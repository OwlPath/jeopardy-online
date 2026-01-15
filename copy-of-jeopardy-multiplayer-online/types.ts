export type ViewMode = 'landing' | 'mode-select' | 'lobby' | 'editor' | 'game';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
}

export interface Clue {
  id: string;
  value: number;
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  title: string;
  clues: Clue[];
}

export interface GameState {
  roomCode: string | null;
  hostName: string | null;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  board: Category[];
  maxPlayers: number;
}
