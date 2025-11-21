import { Prize } from './types';

export const GAME_CONFIG = {
  totalBalls: 35, // Adjust this to change the number of balls in the machine
};

export const RARITY_TABLE = [
  {
    rarity: 'Common',
    probability: 0.6, // 60% chance
    capsuleColors: ['#4ECDC4', '#FFE66D', '#00BBF9', '#8AC926'], // Teal, Yellow, Blue, Lime
  },
  {
    rarity: 'Rare',
    probability: 0.3, // 30% chance
    capsuleColors: ['#FF9F1C', '#F15BB5', '#9B5DE5'], // Orange, Pink, Purple
  },
  {
    rarity: 'Ultra Rare',
    probability: 0.1, // 10% chance
    capsuleColors: ['#FF6B6B', '#D90429'], // Red, Dark Red
  },
] as const;

export const PRIZES: Prize[] = [
  // Common (Most frequent)
  { id: '1', name: 'Sheriff Woody', description: "There's a snake in my boot!", emoji: '🤠', color: '#F4A261', rarity: 'Common' },
  { id: '2', name: 'Buzz Lightyear', description: 'To infinity and beyond!', emoji: '👨‍🚀', color: '#70D6FF', rarity: 'Common' },
  { id: '3', name: 'Rex', description: "I don't like confrontations!", emoji: '🦖', color: '#06D6A0', rarity: 'Common' },
  { id: '4', name: 'Hamm', description: 'Evil Dr. Porkchop.', emoji: '🐷', color: '#EF476F', rarity: 'Common' },
  { id: '5', name: 'Slinky Dog', description: 'Golly bob howdy!', emoji: '🐕', color: '#D4A373', rarity: 'Common' },
  { id: '6', name: 'Green Army Man', description: 'Code Red! Recon post!', emoji: '🪖', color: '#386641', rarity: 'Common' },
  { id: '7', name: 'RC Car', description: 'Fastest toy on wheels.', emoji: '🏎️', color: '#118AB2', rarity: 'Common' },
  
  // Rare (Special characters)
  { id: '8', name: 'Jessie', description: 'Yodel-ay-hee-hoo!', emoji: '👒', color: '#E76F51', rarity: 'Rare' },
  { id: '9', name: 'Bullseye', description: 'Ride like the wind!', emoji: '🐎', color: '#A67C52', rarity: 'Rare' },
  { id: '10', name: 'Mr. Potato Head', description: 'Hey, look, I’m a Picasso!', emoji: '🥔', color: '#BC6C25', rarity: 'Rare' },
  { id: '11', name: 'Bo Peep', description: "I'm in charge of these sheep.", emoji: '🐑', color: '#FFC8DD', rarity: 'Rare' },
  { id: '12', name: 'Little Green Man', description: 'The Claw is our master.', emoji: '👽', color: '#9EF01A', rarity: 'Rare' },
  
  // Ultra Rare (Villains & Special Editions)
  { id: '13', name: 'Emperor Zurg', description: 'I am your father.', emoji: '😈', color: '#7209B7', rarity: 'Ultra Rare' },
  { id: '14', name: 'Lotso', description: 'Welcome to Sunnyside.', emoji: '🧸', color: '#C9184A', rarity: 'Ultra Rare' },
  { id: '15', name: 'Forky', description: "I'm... trash?", emoji: '🍴', color: '#E9ECEF', rarity: 'Ultra Rare' },
  { id: '16', name: 'Duke Caboom', description: 'Yes I Canada!', emoji: '🏍️', color: '#D90429', rarity: 'Ultra Rare' },
];

// Visual settings for the Physics Engine
export const PHYSICS_CONFIG = {
  width: 400,
  height: 400,
  wallThickness: 20,
  ballRadius: 22, // Slightly smaller for reliable dispensing
  ballRestitution: 0.6, // Less bouncy so they settle into the funnel better
  ballFriction: 0.002, // Slicker surface
};

// Visual settings for machine parts
export const LEVER_COLOR = '#9ca3af'; // gray-400
export const SENSOR_COLOR = 'transparent';
