export interface Prize {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  rarity: 'Common' | 'Rare' | 'Ultra Rare';
}

export interface PhysicsRef {
  agitate: () => void;
  dispense: () => void;
  reset: () => void;
}

export enum GameState {
  IDLE,
  CRANKING,
  DISPENSING,
  REVEALING,
}