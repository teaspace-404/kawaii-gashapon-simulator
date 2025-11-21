
import React from 'react';

interface MachineContainerProps {
  children: React.ReactNode;
}

const MachineContainer: React.FC<MachineContainerProps> = ({ children }) => {
  return (
    <div className="relative bg-machine-red p-4 rounded-[40px] shadow-2xl border-b-8 border-machine-dark w-full flex flex-col items-center max-w-[360px] mt-4">
        
        {/* Decorative Top */}
        <div className="absolute -top-6 w-32 h-12 bg-machine-red rounded-t-full border-t-4 border-l-4 border-r-4 border-machine-dark/20 z-0"></div>

        {/* Main Content (Globe, Controls) */}
        <div className="relative z-10 w-full flex flex-col items-center">
            {children}
        </div>

        {/* Legs */}
        <div className="absolute -bottom-4 left-8 w-6 h-8 bg-machine-dark rounded-b-xl shadow-md"></div>
        <div className="absolute -bottom-4 right-8 w-6 h-8 bg-machine-dark rounded-b-xl shadow-md"></div>
    </div>
  );
};

export default MachineContainer;
