import React from 'react';
import NeonButton from './NeonButton';
import { Monitor, Cpu, Globe } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: string) => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-dark-bg bg-grid">
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle at center, rgba(0,255,255,0.05) 0%, transparent 70%)" />
      
      <div className="w-full max-w-4xl z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-2">SELECT PROTOCOL</h2>
        <p className="text-neon-cyan font-sans tracking-widest uppercase mb-12">Choose your game configuration</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Classic Mode */}
          <div className="group relative glass-panel p-8 hover:bg-white/5 transition-all duration-500 cursor-pointer border border-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
               onClick={() => onSelectMode('classic')}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark-bg p-3 border border-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]">
                <Monitor className="w-8 h-8 text-neon-cyan" />
            </div>
            <h3 className="text-2xl font-bold font-mono text-white mt-6 mb-4 group-hover:text-neon-cyan transition-colors">CLASSIC JEOPARDY</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Standard grid. 3 Categories. 5 Clues per category. Pure trivia knowledge extraction.
            </p>
            <NeonButton variant="cyan" fullWidth>Initialize</NeonButton>
          </div>

          {/* Locked Mode */}
          <div className="relative glass-panel p-8 opacity-50 border border-white/10 grayscale">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark-bg p-3 border border-gray-700 rounded-full">
                <Cpu className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold font-mono text-gray-400 mt-6 mb-4">CYBER SURVIVAL</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Elimination mode. Incorrect answers drain system integrity. [LOCKED]
            </p>
            <div className="border border-gray-600 text-gray-500 font-mono text-xs uppercase py-2 text-center tracking-widest">Unavailable</div>
          </div>

           {/* Locked Mode */}
           <div className="relative glass-panel p-8 opacity-50 border border-white/10 grayscale">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark-bg p-3 border border-gray-700 rounded-full">
                <Globe className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold font-mono text-gray-400 mt-6 mb-4">GLOBAL WARFARE</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Team-based conquest. Capture nodes by answering correctly. [LOCKED]
            </p>
            <div className="border border-gray-600 text-gray-500 font-mono text-xs uppercase py-2 text-center tracking-widest">Unavailable</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
