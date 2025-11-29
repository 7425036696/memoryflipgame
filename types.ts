
export interface CardItem {
  id: string;
  content: string; // Emoji or text
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy?: 1 | 2; // Which player matched this card (undefined if not matched)
}

export type GameMode = 'single' | 'multi';
export type ViewState = 'start' | 'game';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  cards: CardItem[];
  moves: number; // Used in single player
  scores: { 1: number; 2: number }; // Used in multiplayer
  activePlayer: 1 | 2;
  gameMode: GameMode;
  difficulty: Difficulty;
  timer: number; // Time in seconds
  isProcessing: boolean;
  gameStatus: 'idle' | 'playing' | 'won' | 'draw';
  theme: string;
}
