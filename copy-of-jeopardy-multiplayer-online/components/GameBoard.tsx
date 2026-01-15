import React, { useState } from 'react';
import { Category, Clue, Player } from '../types';
import NeonButton from './NeonButton';
import { ArrowLeft, Check, X, Shield, Star } from 'lucide-react';

interface GameBoardProps {
  board: Category[];
  players: Player[];
  onExit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, players, onExit }) => {
  const [activeClue, setActiveClue] = useState<{catIndex: number, clueIndex: number} | null>(null);
  const [answeredClues, setAnsweredClues] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  // Get current active clue data
  const currentClue = activeClue ? board[activeClue.catIndex].clues[activeClue.clueIndex] : null;

  const handleClueClick = (catIndex: number, clueIndex: number) => {
    const clueId = board[catIndex].clues[clueIndex].id;
    if (answeredClues.has(clueId)) return;
    
    setActiveClue({ catIndex, clueIndex });
    setShowAnswer(false);
  };

  const handleCloseClue = () => {
    if (currentClue) {
        setAnsweredClues(prev => new Set(prev).add(currentClue.id));
    }
    setActiveClue(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col relative overflow-hidden">
      {/* HUD / Header */}
      <div className="bg-dark-surface border-b border-white/10 p-4 flex justify-between items-center z-20 shadow-lg">
         <NeonButton variant="pink" onClick={onExit} className="py-2 px-4 text-xs">
            <ArrowLeft className="w-3 h-3 mr-2 inline" /> Abort
         </NeonButton>
         <div className="flex gap-4 overflow-x-auto">
            {players.map(p => (
                <div key={p.id} className="bg-black/40 border border-white/20 p-2 min-w-[120px] rounded flex flex-col items-center relative">
                     {p.isHost && <Shield className="w-3 h-3 text-neon-pink absolute top-1 right-1" />}
                    <span className="text-xs font-mono text-gray-400">{p.name}</span>
                    <span className="text-xl font-mono font-bold text-neon-cyan">${p.score}</span>
                </div>
            ))}
         </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-auto">
         <div className="flex gap-4 w-full max-w-6xl justify-center">
            {board.map((category, catIndex) => (
                <div key={category.id} className="flex-1 flex flex-col gap-3 min-w-[140px]">
                    {/* Category Header */}
                    <div className="h-24 bg-neon-cyan/5 border border-neon-cyan/30 flex items-center justify-center p-2 text-center shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                        <h3 className="text-neon-cyan font-mono font-bold text-sm md:text-lg uppercase break-words leading-tight">
                            {category.title}
                        </h3>
                    </div>
                    
                    {/* Clues */}
                    {category.clues.map((clue, clueIndex) => {
                        const isAnswered = answeredClues.has(clue.id);
                        return (
                            <div 
                                key={clue.id}
                                onClick={() => handleClueClick(catIndex, clueIndex)}
                                className={`
                                    h-20 md:h-28 flex items-center justify-center border transition-all duration-300 relative overflow-hidden
                                    ${isAnswered 
                                        ? 'bg-black/20 border-white/5 cursor-default' 
                                        : 'glass-panel bg-neon-cyan/5 border-neon-cyan/20 hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] cursor-pointer group'}
                                `}
                            >
                                {!isAnswered && (
                                    <span className="font-mono text-2xl md:text-4xl font-bold text-neon-yellow drop-shadow-md group-hover:scale-110 transition-transform">
                                        ${clue.value}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
         </div>
      </div>

      {/* Active Clue Modal */}
      {currentClue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
             <div className="w-full max-w-3xl glass-panel p-8 md:p-12 border border-neon-pink/50 shadow-[0_0_100px_rgba(255,0,255,0.2)] text-center relative flex flex-col items-center">
                
                <div className="text-neon-pink font-mono text-xl mb-8 tracking-widest uppercase border-b border-neon-pink/30 pb-2">
                    For ${currentClue.value}
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold font-sans text-white mb-12 leading-tight">
                    {currentClue.question}
                </h2>

                {showAnswer ? (
                    <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <p className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-2">CORRECT RESPONSE</p>
                        <p className="text-3xl font-mono text-neon-yellow font-bold">{currentClue.answer}</p>
                    </div>
                ) : (
                    <div className="mb-10 h-20" /> // Spacer
                )}

                <div className="flex gap-4 mt-auto">
                    {!showAnswer ? (
                        <NeonButton variant="cyan" onClick={() => setShowAnswer(true)}>
                            Reveal Data
                        </NeonButton>
                    ) : (
                        <div className="flex gap-4">
                            <NeonButton variant="pink" onClick={handleCloseClue}>
                                Close Node
                            </NeonButton>
                            {/* Host only feature usually, keeping simple for now */}
                            <button className="px-6 py-3 border border-green-500/50 text-green-400 hover:bg-green-500/20 font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                                <Check size={16} /> Correct
                            </button>
                        </div>
                    )}
                </div>

             </div>
          </div>
      )}
    </div>
  );
};

export default GameBoard;
