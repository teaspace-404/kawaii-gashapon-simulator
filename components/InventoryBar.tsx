import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prize } from '../types';
import { PackageOpen, GripHorizontal } from 'lucide-react';

interface InventoryBarProps {
  collection: Prize[];
  onItemClick: (prize: Prize, index: number) => void;
}

const InventoryBar: React.FC<InventoryBarProps> = ({ collection, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* Invisible Trigger Zone at the very top to catch mouse movements easily */}
      <div 
        className="absolute top-0 left-0 right-0 h-6 z-50 bg-transparent" 
        onMouseEnter={() => setIsOpen(true)}
      />

      {/* Backdrop (only visible when open) */}
      <AnimatePresence>
        {isOpen && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/40 backdrop-blur-md z-[-1]"
             onClick={() => setIsOpen(false)}
           />
        )}
      </AnimatePresence>

      {/* The Sliding Drawer */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: isOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="relative w-full bg-white shadow-xl border-b border-gray-100 rounded-b-3xl"
      >
         {/* Signifier / Handle (Attached to bottom of drawer) */}
         <div 
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-28 h-12 bg-white rounded-b-2xl flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-colors group"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
         >
            <div className="flex items-center gap-2">
                <GripHorizontal className="text-gray-300 group-hover:text-gray-400 transition-colors" size={24} />
                {collection.length > 0 && (
                    <span className="bg-machine-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white">
                        {collection.length}
                    </span>
                )}
            </div>
         </div>

         {/* Drawer Content */}
         <div className="relative pt-8 pb-8 px-6 w-full max-h-[60vh] overflow-y-auto custom-scrollbar min-h-[140px] flex flex-col justify-center">
            {collection.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
                  <PackageOpen size={40} className="opacity-50" />
                  <p className="font-kawaii text-sm tracking-widest font-bold">COLLECTION EMPTY</p>
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-4 place-items-center">
                   {collection.map((item, idx) => (
                      <motion.button
                        key={`${item.id}-${idx}`}
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        onClick={() => onItemClick(item, idx)}
                        className="group relative w-14 h-14"
                      >
                          {/* Shelf shadow */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/5 blur-sm rounded-full"></div>
                          
                          {/* Item Orb */}
                          <div className="relative w-full h-full bg-gray-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-gray-200 group-hover:bg-white group-hover:shadow-md transition-all">
                             {item.emoji}
                          </div>
                      </motion.button>
                   ))}
                </div>
            )}
         </div>
      </motion.div>
    </div>
  );
};

export default InventoryBar;