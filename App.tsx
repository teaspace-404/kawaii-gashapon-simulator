import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PhysicsRef, Prize, GameState } from './types';
import { PRIZES, RARITY_TABLE } from './constants';
import PhysicsCanvas from './components/PhysicsCanvas';
import PrizeModal from './components/PrizeModal';
import MachineContainer from './components/MachineContainer';
import ControlPanel from './components/ControlPanel';
import InventoryBar from './components/InventoryBar';

// Background Decor Configuration
const WALL_POSTERS = [
  {
    id: 1,
    // Position relative to viewport
    style: { top: '10%', left: '5%', transform: 'rotate(-6deg)' },
    className: 'w-32 h-40 sm:w-40 sm:h-48',
    innerBg: 'bg-[#FFEBEE]',
    svg: (
      <svg viewBox="0 0 12 12" className="w-16 h-16 sm:w-24 sm:h-24" shapeRendering="crispEdges">
        {/* Pixel Heart */}
        <path d="M3 4H5V3H7V4H9V5H10V7H9V8H8V9H7V10H5V9H4V8H3V7H2V5H3V4Z" fill="#FF5252" />
        <path d="M4 5H5V6H4V5Z" fill="white" fillOpacity="0.5" />
      </svg>
    )
  },
  {
    id: 2,
    style: { top: '15%', right: '5%', transform: 'rotate(8deg)' },
    className: 'w-36 h-36 sm:w-44 sm:h-44',
    innerBg: 'bg-[#E3F2FD]',
    svg: (
      <svg viewBox="0 0 14 14" className="w-20 h-20 sm:w-28 sm:h-28" shapeRendering="crispEdges">
        {/* Pixel Ghost/Cloud */}
        <path d="M4 3H10V4H11V5H12V10H11V11H10V10H9V11H7V10H5V11H3V10H2V5H3V4H4V3Z" fill="#4FC3F7" />
        <path d="M5 6H6V7H5V6ZM8 6H9V7H8V6Z" fill="white" />
      </svg>
    )
  },
  {
    id: 3,
    style: { top: '45%', left: '8%', transform: 'rotate(-3deg)' },
    className: 'w-28 h-28 sm:w-32 sm:h-32',
    innerBg: 'bg-[#F9FBE7]',
    svg: (
      <svg viewBox="0 0 12 12" className="w-16 h-16 sm:w-20 sm:h-20" shapeRendering="crispEdges">
        {/* Pixel Mushroom */}
        <path d="M4 2H8V3H9V4H10V6H2V4H3V3H4V2Z" fill="#FF7043" />
        <path d="M5 3H6V4H5V3ZM8 4H9V5H8V4Z" fill="#FFCCBC" />
        <path d="M4 6H8V9H4V6Z" fill="#FFE0B2" />
      </svg>
    )
  }
];

export default function App() {
  const physicsRef = useRef<PhysicsRef>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'collection'>('new');
  const [dispensedBallColor, setDispensedBallColor] = useState<string | null>(null);
  const [collection, setCollection] = useState<Prize[]>([]);
  const [selectedPrizeIndex, setSelectedPrizeIndex] = useState<number>(-1);
  
  // Scaling State for responsiveness
  const [scale, setScale] = useState(1);

  // Calculate scale on resize
  useEffect(() => {
    const calculateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth; // We will use a max-width container effectively
      
      // Base dimensions of the machine component
      const BASE_HEIGHT = 750; 
      // If we are on desktop, we constrain width, so scale is mostly height-dependent
      // but we check width just in case of very narrow mobile screens
      
      const availableHeight = vh * 0.85; 
      const availableWidth = Math.min(vw, 480) * 0.95; // 480 is our mobile max-width
      
      const scaleH = availableHeight / BASE_HEIGHT;
      const scaleW = availableWidth / 360; // 360 is machine width
      
      let s = Math.min(scaleH, scaleW);
      
      // Clamp scale
      s = Math.min(Math.max(s, 0.5), 1.1);
      
      setScale(s);
    };

    window.addEventListener('resize', calculateScale);
    calculateScale(); // Initial calculation
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleCrankUpdate = useCallback((angle: number) => {
    if (gameState !== GameState.CRANKING) {
      setGameState(GameState.CRANKING);
    }
    if (physicsRef.current) { 
        physicsRef.current.agitate();
    }
  }, [gameState]);

  const handleCrankComplete = useCallback(() => {
    setGameState(GameState.DISPENSING);
    if (physicsRef.current) {
      physicsRef.current.dispense();
    }
  }, []);

  const handleBallDispensed = useCallback((color: string) => {
    // Ball has fallen out of physics world
    setDispensedBallColor(color);
    setGameState(GameState.REVEALING);
    
    // Identify rarity based on the color of the ball dropped
    const rarityTier = RARITY_TABLE.find(tier => (tier.capsuleColors as readonly string[]).includes(color));
    const rarity = rarityTier ? rarityTier.rarity : 'Common'; 

    // Filter prizes that match this rarity
    const availablePrizes = PRIZES.filter(p => p.rarity === rarity);
    
    // Pick a random prize from that tier
    const pool = availablePrizes.length > 0 ? availablePrizes : PRIZES;
    const randomPrize = pool[Math.floor(Math.random() * pool.length)];

    setWonPrize(randomPrize);
  }, []);

  // Opens modal for a newly won prize
  const handleCapsuleClick = useCallback(() => {
    if (gameState === GameState.REVEALING && wonPrize) {
      setModalMode('new');
      setIsModalOpen(true);
    }
  }, [gameState, wonPrize]);

  // Opens modal for an existing collection item
  const handleInventoryClick = useCallback((prize: Prize, index: number) => {
    setWonPrize(prize);
    setSelectedPrizeIndex(index);
    setModalMode('collection');
    setIsModalOpen(true);
  }, []);

  // User decides to keep the new prize or close the view of an existing one
  const handleKeep = () => {
    if (modalMode === 'new' && wonPrize) {
      setCollection(prev => [...prev, wonPrize]);
    }
    
    // Reset states
    setIsModalOpen(false);
    if (modalMode === 'new') {
        setGameState(GameState.IDLE);
        setDispensedBallColor(null);
    }
  };

  // User decides to donate (discard) the prize
  const handleDonate = () => {
    if (modalMode === 'collection' && selectedPrizeIndex >= 0) {
        setCollection(prev => prev.filter((_, i) => i !== selectedPrizeIndex));
    }
    
    // Reset states
    setIsModalOpen(false);
    if (modalMode === 'new') {
        setGameState(GameState.IDLE);
        setDispensedBallColor(null);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-sky-50 font-kawaii selection:bg-kawaii-pink selection:text-white flex justify-center">
      
      {/* WALL BACKGROUND (Full Screen) */}
      <div className="absolute inset-0 bg-[#FDF2F8] z-0">
         <div className="absolute inset-0 opacity-[0.05]" style={{ 
             backgroundImage: 'radial-gradient(#FFB7B2 3px, transparent 3px)', 
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0'
         }}></div>

         {/* DECORATIVE POSTERS */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {WALL_POSTERS.map((poster) => (
              <div
                key={poster.id}
                className={`absolute bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border-4 border-white transition-transform duration-500 hover:scale-105 ${poster.className}`}
                style={poster.style}
              >
                <div className={`w-full h-full ${poster.innerBg} flex items-center justify-center overflow-hidden`}>
                   {poster.svg}
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* FLOOR BACKGROUND (Full Screen) */}
      <div className="absolute bottom-0 w-full h-[20%] bg-[#F3E5F5] border-t-[6px] border-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-0">
          <div className="absolute inset-0 opacity-40" style={{ 
              backgroundImage: 'linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              transform: 'perspective(500px) rotateX(20deg) scale(2)',
              transformOrigin: 'top center'
          }}></div>
      </div>

      {/* MOBILE FRAME CONTAINER */}
      {/* This constrains the app to a mobile-like width on desktop */}
      <div className="relative w-full max-w-[480px] h-full z-10 flex flex-col">
        
        {/* INVENTORY DRAWER */}
        <InventoryBar 
          collection={collection} 
          onItemClick={handleInventoryClick}
        />

        {/* MACHINE WRAPPER */}
        {/* Centered vertically and horizontally within the mobile frame */}
        <div className="flex-1 flex items-end justify-center pb-[8vh] pointer-events-none">
            <div 
              className="pointer-events-auto origin-bottom transition-transform duration-300 ease-out will-change-transform"
              style={{ transform: `scale(${scale})` }}
            >
                 {/* The Gashapon Machine */}
                <MachineContainer>
                    {/* Glass Globe Container */}
                    <div className="relative z-10 bg-white p-2 rounded-full shadow-inner mb-6 overflow-hidden">
                        <PhysicsCanvas ref={physicsRef} onBallDispensed={handleBallDispensed} />
                        
                        {/* "Glass" Reflection Overlay */}
                        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-white/30 to-transparent opacity-70 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]"></div>
                        <div className="absolute top-[20%] right-[20%] w-16 h-8 bg-white/40 blur-md rounded-full -rotate-45 pointer-events-none"></div>
                    </div>

                    {/* Control Panel (Crank & Chute) */}
                    <ControlPanel 
                      gameState={gameState}
                      isCrankDisabled={gameState === GameState.DISPENSING || gameState === GameState.REVEALING || isModalOpen}
                      onCrankUpdate={handleCrankUpdate}
                      onCrankComplete={handleCrankComplete}
                      dispensedBallColor={dispensedBallColor}
                      onCapsuleClick={handleCapsuleClick}
                    />
                </MachineContainer>
            </div>
        </div>

      </div>
      
      {/* Footer/Credits */}
      <div className="absolute bottom-2 w-full text-center text-[10px] text-gray-400/50 z-20 pointer-events-auto">
        Built with <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-kawaii-pink transition-colors">React</a> & <a href="https://brm.io/matter-js/" target="_blank" rel="noopener noreferrer" className="hover:text-kawaii-pink transition-colors">Matter.js</a>
      </div>

      <PrizeModal 
        isOpen={isModalOpen} 
        prize={wonPrize} 
        mode={modalMode}
        onKeep={handleKeep} 
        onDonate={handleDonate}
      />
    </div>
  );
}