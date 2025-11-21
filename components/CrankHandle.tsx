import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CrankHandleProps {
  onCrankUpdate: (progress: number) => void; 
  onCrankComplete: () => void; 
  disabled: boolean;
  label?: string;
}

const CrankHandle: React.FC<CrankHandleProps> = ({ onCrankUpdate, onCrankComplete, disabled, label }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    if (disabled || isSpinning) return;

    setIsSpinning(true);
    
    // Simulate the cranking process with animation frames
    const totalDuration = 2000; // 2 seconds spin
    const steps = 20;
    const interval = totalDuration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 360; // approximate degrees
      
      // Trigger physics agitation
      onCrankUpdate(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsSpinning(false);
        onCrankComplete();
      }
    }, interval);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
       {/* Backplate */}
       <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300 shadow-inner flex items-center justify-center relative">
         
         {/* The Handle Structure */}
         <motion.div
           className="absolute w-full h-full flex items-center justify-center cursor-pointer"
           animate={{ rotate: isSpinning ? 360 * 3 : 0 }} // Spin 3 times
           transition={{ duration: 2, ease: "easeInOut" }}
           onClick={handleSpin}
           whileHover={{ scale: disabled ? 1 : 1.05 }}
           whileTap={{ scale: 0.95 }}
           style={{ opacity: disabled ? 0.7 : 1 }}
         >
             {/* Center Axis */}
             <div className="w-6 h-6 bg-gray-400 rounded-full z-20 border-2 border-white shadow-sm"></div>
             
             {/* Arm */}
             <div className="absolute w-4 h-16 bg-white rounded-full shadow-md origin-bottom top-4"></div>
             
             {/* Knob with Shine Effect */}
             <div className="absolute top-2 w-10 h-10 bg-machine-red rounded-full border-b-4 border-machine-dark shadow-xl z-30 overflow-hidden">
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shine_2s_infinite]" />
             </div>
         </motion.div>

       </div>
       
       <div className="mt-4 text-gray-400 font-bold text-xs tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full min-w-[100px] text-center transition-all">
          {label || "Click to Spin"}
       </div>

       <style>{`
         @keyframes shine {
           0% { transform: translateX(-150%) skewX(-15deg); }
           50%, 100% { transform: translateX(150%) skewX(-15deg); }
         }
       `}</style>
    </div>
  );
};

export default CrankHandle;
