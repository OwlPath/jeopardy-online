import React from 'react';
import { Player } from '../types';
import NeonButton from './NeonButton';
import { Copy, Users, Play, Radio, Settings } from 'lucide-react';

interface LobbyPageProps {
  roomCode: string;
  players: Player[];
  maxPlayers: number;
  currentPlayerId: string;
  onLeave: () => void;
  onEditBoard: () => void;
  onStartGame: () => void;
}

const LobbyPage: React.FC<LobbyPageProps> = ({ roomCode, players, maxPlayers, currentPlayerId, onLeave, onEditBoard, onStartGame }) => {
  const isHost = players.find(p => p.id === currentPlayerId)?.isHost;
  const canStart = players.length >= 1; // Solo start logic

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-grid">
      
       {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-pink/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scanline" />
      </div>

      <main className="w-full max-w-4xl z-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center relative">
          <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            JEOPARDY
          </h1>
          <div className="text-neon-pink font-sans text-sm tracking-[0.5em] uppercase mt-2 font-bold drop-shadow-[0_0_5px_#ff00ff]">
            LOBBY TERMINAL
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Room Info Panel */}
            <div className="glass-panel p-6 md:col-span-1 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink to-transparent" />
                
                <div className="text-center">
                    <h2 className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-2">Room Code</h2>
                    <div 
                        onClick={copyCode}
                        className="cursor-pointer group relative bg-black/40 border border-neon-cyan/30 p-4 rounded-sm hover:border-neon-cyan transition-all"
                    >
                        <span className="text-4xl font-mono font-bold text-neon-cyan tracking-[0.2em] drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
                            {roomCode}
                        </span>
                        <Copy className="absolute right-2 top-2 w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click code to copy</p>
                </div>

                <div className="flex-1 flex flex-col justify-end gap-3">
                    <div className="flex items-center gap-2 text-neon-pink animate-pulse">
                        <Radio className="w-4 h-4" />
                        <span className="text-xs font-mono uppercase">Waiting for players...</span>
                    </div>
                    
                    {isHost && (
                        <>
                            <NeonButton 
                                variant="cyan" 
                                fullWidth 
                                onClick={onStartGame}
                                disabled={!canStart}
                                className={!canStart ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                            >
                                <Play className="w-4 h-4 inline mr-1" /> START GAME
                            </NeonButton>
                            
                            <button 
                                onClick={onEditBoard}
                                className="group w-full py-3 border border-neon-pink text-neon-pink bg-transparent hover:bg-neon-pink hover:text-black font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,0,255,0.2)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]"
                            >
                                <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform duration-500" /> EDIT BOARD
                            </button>
                        </>
                    )}
                    
                    <NeonButton variant="pink" fullWidth onClick={onLeave}>
                        Leave Lobby
                    </NeonButton>
                </div>
            </div>

            {/* Players List Panel */}
            <div className="glass-panel p-6 md:col-span-2 relative min-h-[400px]">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-neon-cyan to-transparent" />
                
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-3">
                        <Users className="text-neon-pink" />
                        Connected Agents
                    </h2>
                    <span className="bg-neon-cyan/10 text-neon-cyan px-3 py-1 font-mono text-sm rounded border border-neon-cyan/20">
                        {players.length} / {maxPlayers}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.map((player) => (
                        <div 
                            key={player.id} 
                            className={`
                                relative p-4 border transition-all duration-300 group
                                ${player.id === currentPlayerId 
                                    ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.1)]' 
                                    : 'bg-black/30 border-white/10 hover:border-white/30'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${player.id === currentPlayerId ? 'bg-neon-cyan shadow-[0_0_8px_#00ffff]' : 'bg-gray-500'}`} />
                                    <span className={`font-mono text-lg ${player.id === currentPlayerId ? 'text-white' : 'text-gray-300'}`}>
                                        {player.name}
                                    </span>
                                </div>
                                {player.isHost && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neon-pink text-black px-2 py-0.5 rounded-sm">
                                        HOST
                                    </span>
                                )}
                            </div>
                            {/* Decorative corner */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-hover:border-neon-cyan transition-colors" />
                        </div>
                    ))}

                    {/* Empty slots placeholders */}
                    {Array.from({ length: Math.max(0, maxPlayers - players.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-4 border border-white/5 border-dashed bg-black/10 flex items-center justify-center text-gray-600 font-mono text-sm">
                            [ VACANT NODE ]
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default LobbyPage;