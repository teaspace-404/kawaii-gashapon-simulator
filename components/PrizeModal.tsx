import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prize } from '../types';
import { X, Gift, Trash2 } from 'lucide-react';

interface PrizeModalProps {
  isOpen: boolean;
  prize: Prize | null;
  mode: 'new' | 'collection';
  onKeep: () => void;
  onDonate: () => void;
}

const PrizeModal: React.FC<PrizeModalProps> = ({ isOpen, prize, mode, onKeep, onDonate }) => {
  if (!isOpen || !prize) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onKeep} // Clicking backdrop acts as 'Keep/Close'
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-8 border-white"
          style={{ backgroundColor: '#fff' }}
        >
            {/* Header Background */}
            <div className="h-32 w-full absolute top-0 left-0 z-0" style={{ backgroundColor: prize.color }}></div>
            
            {/* Close Button (Acts as Keep) */}
            <button 
                onClick={onKeep}
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
            >
                <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-6">
                {/* Prize Bubble */}
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center text-6xl border-4 mb-6"
                    style={{ borderColor: prize.color }}
                >
                    {prize.emoji}
                </motion.div>

                <h2 className="text-2xl font-black text-gray-800 mb-2 text-center font-kawaii uppercase tracking-wider">
                    {prize.name}
                </h2>
                
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-gray-100 text-gray-500">
                    {prize.rarity}
                </div>

                <p className="text-center text-gray-500 mb-8 font-medium">
                    {prize.description}
                </p>

                <div className="w-full space-y-3">
                    <button
                        onClick={onKeep}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transform transition-transform active:scale-95 flex items-center justify-center gap-2"
                        style={{ backgroundColor: prize.color }}
                    >
                        {mode === 'new' ? (
                           <>
                             <Gift size={20} /> Keep it!
                           </>
                        ) : (
                           'Close'
                        )}
                    </button>

                    <button
                        onClick={onDonate}
                        className="w-full py-3 rounded-xl text-gray-400 font-bold text-sm hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        {mode === 'new' ? 'Donate it away' : (
                            <><Trash2 size={16} /> Donate from collection</>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrizeModal;