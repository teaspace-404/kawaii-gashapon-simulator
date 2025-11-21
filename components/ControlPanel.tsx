import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CrankHandle from './CrankHandle';
import { GameState } from '../types';

interface ControlPanelProps {
  gameState: GameState;
  isCrankDisabled: boolean;
  onCrankUpdate: (angle: number) => void;
  onCrankComplete: () => void;
  dispensedBallColor: string | null;
  onCapsuleClick: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  isCrankDisabled,
  onCrankUpdate,
  onCrankComplete,
  dispensedBallColor,
  onCapsuleClick
}) => {
  const [showHint, setShowHint] = useState(false);

  // Smart Tooltip Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (dispensedBallColor) {
      // Reset hint initially when a new ball appears
      setShowHint(false);
      
      // Set timer to show hint if user is slow (3 seconds)
      timer = setTimeout(() => {
        setShowHint(true);
      }, 3000);
    } else {
      setShowHint(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [dispensedBallColor]);

  // Trigger hint immediately if user tries to crank while disabled (and ball is waiting)
  const handleCrankWrapperClick = () => {
    if (isCrankDisabled && dispensedBallColor) {
      setShowHint(true);
    }
  };

  // Determine label based on state
  let buttonLabel = "Click to Spin";
  if (gameState === GameState.CRANKING) buttonLabel = "Mixing...";
  if (gameState === GameState.DISPENSING) buttonLabel = "Dispensing...";
  if (gameState === GameState.REVEALING) buttonLabel = "Open Capsule!";

  return (
    <div className="w-full bg-white/90 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-sm">
       {/* Plate */}
       <div className="absolute top-0 left-0 w-full h-4 bg-gray-100 border-b border-gray-200"></div>

       {/* Crank */}
       <div 
         className="mb-8 mt-2 z-20 relative"
         onClickCapture={handleCrankWrapperClick}
       >
         <CrankHandle 
            disabled={isCrankDisabled}
            onCrankUpdate={onCrankUpdate}
            onCrankComplete={onCrankComplete}
            label={buttonLabel}
         />
       </div>

       {/* Dispense Chute */}
       <div className="w-28 h-24 bg-gray-800 rounded-xl border-b-4 border-gray-600 shadow-inner relative flex items-center justify-center overflow-hidden group">
          <div className="absolute top-0 w-full h-full bg-black/20 z-10 pointer-events-none"></div>
          
          {/* Chute Flap */}
          <div className="absolute top-0 w-24 h-20 bg-gray-700/90 rounded-b-xl transform origin-top border-t border-gray-600 z-20 shadow-lg"></div>
          
          {/* Interactive Falling Ball */}
          <AnimatePresence>
          {dispensedBallColor && (
            <motion.button
              key={dispensedBallColor} 
              initial={{ y: -80, rotate: 0 }}
              animate={{ y: 15, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="absolute z-30 w-12 h-12 rounded-full border-2 border-white/20 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
              style={{ backgroundColor: dispensedBallColor }}
              onClick={onCapsuleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
               {/* Shine on ball */}
               <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full pointer-events-none"></div>
               
               {/* Smart Click hint tooltip */}
               <AnimatePresence>
                 {showHint && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.8 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="absolute -top-10 -left-6 w-24 bg-white text-gray-800 text-[10px] font-bold py-1 px-2 rounded shadow-lg pointer-events-none z-40"
                   >
                     TAKE ME!
                     <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.button>
          )}
          </AnimatePresence>
       </div>
    </div>
  );
};

export default ControlPanel;
