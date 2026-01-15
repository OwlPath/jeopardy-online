import React, { useState } from 'react';
import { generateRoomCode } from '../utils/helpers';
import { Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onHost: (name: string, roomCode: string, maxPlayers: number) => void;
  onJoin: (name: string, roomCode: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onHost, onJoin }) => {
  // Host State
  const [hostName, setHostName] = useState('');
  const [customRoomCode, setCustomRoomCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState<string | number>(4);

  // Join State
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setError("Host Identity Required.");
      return;
    }

    let limit = typeof maxPlayers === 'string' ? parseInt(maxPlayers) : maxPlayers;
    if (isNaN(limit) || limit < 1) limit = 1;
    if (limit > 8) limit = 8;

    const finalCode = customRoomCode.trim() 
      ? customRoomCode.toUpperCase().substring(0, 8) 
      : generateRoomCode();

    onHost(hostName, finalCode, limit);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) {
      setError("Credentials Incomplete.");
      return;
    }
    onJoin(joinName, joinCode.toUpperCase());
  };

  const handleMaxPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
        setMaxPlayers('');
        return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
        if (num > 8) setMaxPlayers(8);
        else if (num < 1) setMaxPlayers(1);
        else setMaxPlayers(num);
    }
  };

  const handleMaxPlayersBlur = () => {
    if (maxPlayers === '' || maxPlayers === 0) setMaxPlayers(4);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#050510] font-sans py-8">
      
      {/* Background & Grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container - Compact Width */}
      <div className="z-10 w-full max-w-[850px] px-4 flex flex-col items-center gap-6">
        
        {/* Title Section */}
        <div className="text-center relative mb-4 flex items-center justify-center gap-3">
          <Zap className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] fill-current animate-pulse-fast" />
          <h1 className="flex flex-col items-start leading-none select-none">
            <span className="text-5xl md:text-7xl font-black font-mono tracking-tighter bg-gradient-to-b from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,255,0.3)]">
              JEOPARDY
            </span>
            <span className="text-xl md:text-2xl text-cyan-100 tracking-[0.6em] font-light opacity-80 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] font-mono ml-1">
              MULTIPLAYER
            </span>
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-md text-center bg-red-950/30 border border-red-500/50 text-red-400 py-2 px-4 rounded font-mono text-xs uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            ⚠ [SYSTEM ERROR]: {error}
          </div>
        )}

        {/* Split Card Layout - Fixed Alignment */}
        <div id="lobby" className="w-full relative flex flex-col md:flex-row gap-6 items-stretch justify-center">
          
          {/* HOST PANEL (Left) */}
          <div className="flex-1 bg-[#0a050a]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-pink-500/30 shadow-[0_0_30px_rgba(255,0,255,0.1)] flex flex-col relative overflow-hidden group hover:border-pink-500/50 transition-colors duration-500">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-70" />
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-mono font-black tracking-widest uppercase bg-gradient-to-r from-[#ff00ff] to-[#bc13fe] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,0,255,1)] filter brightness-125">
                HOST GAME
              </h2>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] mt-1 opacity-70">
                Initialize new protocol
              </p>
            </div>
            
            <form onSubmit={handleHostSubmit} className="flex flex-col gap-5 flex-1 h-full">
              <div className="space-y-1">
                <label htmlFor="host-name" className="text-pink-400 font-sans font-bold text-xs uppercase tracking-widest ml-1">
                  HOST CALLSIGN
                </label>
                <input 
                  id="host-name"
                  type="text" 
                  placeholder="Enter your name..."
                  className="w-full bg-[#050510] border border-pink-900/50 focus:border-pink-500 text-white font-sans font-medium text-base py-3 px-4 rounded outline-none transition-all placeholder-gray-600 focus:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  maxLength={12}
                />
              </div>

              {/* Side-by-Side Container: Room Code (75%) & Agents (25%) */}
              <div className="flex flex-row gap-3">
                  <div className="basis-3/4 space-y-1">
                      <label htmlFor="host-room" className="text-pink-400 font-sans font-bold text-xs uppercase tracking-widest ml-1">
                        CUSTOM ROOM CODE (OPTIONAL)
                      </label>
                      <input 
                        id="host-room"
                        type="text" 
                        placeholder="AUTO-GEN"
                        className="w-full bg-[#050510] border border-pink-900/50 focus:border-pink-500 text-white font-sans font-medium text-base py-3 px-4 rounded outline-none transition-all placeholder-gray-600 uppercase tracking-widest focus:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                        value={customRoomCode}
                        onChange={(e) => setCustomRoomCode(e.target.value)}
                        maxLength={8}
                      />
                  </div>

                  <div className="basis-1/4 space-y-1">
                     <label htmlFor="max-agents" className="text-pink-400 font-sans font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1">
                       AGENTS
                     </label>
                      <input 
                        id="max-agents"
                        type="number" 
                        min="1"
                        max="8"
                        className="w-full bg-[#050510] border border-pink-900/50 focus:border-pink-500 text-white font-sans font-medium text-base py-3 px-4 rounded outline-none transition-all text-center focus:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                        value={maxPlayers}
                        onChange={handleMaxPlayersChange}
                        onBlur={handleMaxPlayersBlur}
                      />
                  </div>
              </div>

              <div className="mt-auto pt-2">
                <button 
                    type="submit"
                    className="w-full bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-mono font-bold uppercase py-3 tracking-[0.2em] transition-all duration-300 shadow-[0_0_10px_rgba(255,0,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] rounded flex items-center justify-center gap-2 group"
                >
                    <Zap size={18} className="group-hover:fill-current transition-colors" /> CREATE ROOM
                </button>
              </div>
            </form>
          </div>

          {/* DIVIDER */}
          <div className="relative flex items-center justify-center md:flex-col">
            <div className="w-10 h-10 rounded-full bg-[#050510] border border-gray-700 flex items-center justify-center shadow-2xl relative z-10">
              <span className="text-gray-400 font-mono font-bold text-[10px]">OR</span>
            </div>
            {/* Horizontal line for mobile, Vertical for Desktop */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -z-0 md:hidden" />
            <div className="absolute top-0 left-1/2 h-full w-[1px] bg-gray-800 -z-0 hidden md:block" />
          </div>


          {/* JOIN PANEL (Right) */}
          <div className="flex-1 bg-[#050a10]/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] flex flex-col relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-500">
             {/* Top Glow */}
             <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-cyan-500 to-transparent opacity-70" />

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-mono font-black tracking-widest uppercase bg-gradient-to-r from-[#00ffff] to-[#0099ff] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,255,1)] filter brightness-125">
                JOIN GAME
              </h2>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] mt-1 opacity-70">
                Connect to existing node
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="flex flex-col gap-5 flex-1 h-full">
              <div className="space-y-1">
                <label htmlFor="player-name" className="text-cyan-400 font-sans font-bold text-xs uppercase tracking-widest ml-1">
                  PLAYER CALLSIGN
                </label>
                <input 
                  id="player-name"
                  type="text" 
                  placeholder="Enter your name..."
                  className="w-full bg-[#050510] border border-cyan-900/50 focus:border-cyan-500 text-white font-sans font-medium text-base py-3 px-4 rounded outline-none transition-all placeholder-gray-600 focus:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  maxLength={12}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="player-room" className="text-cyan-400 font-sans font-bold text-xs uppercase tracking-widest ml-1">
                  ACCESS CODE
                </label>
                <input 
                  id="player-room"
                  type="text" 
                  placeholder="Enter Room Code"
                  className="w-full bg-[#050510] border border-cyan-900/50 focus:border-cyan-500 text-white font-sans font-medium text-base py-3 px-4 rounded outline-none transition-all placeholder-gray-600 uppercase tracking-widest focus:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  maxLength={8}
                />
              </div>

              <div className="mt-auto pt-2">
               <button 
                type="submit"
                className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-mono font-bold uppercase py-3 tracking-[0.2em] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] rounded flex items-center justify-center gap-2"
              >
                ENTER LOBBY <ArrowRight size={20} />
              </button>
              </div>
            </form>
          </div>

        </div>

        {/* Updated Footer Status Bar */}
        <footer className="w-full mt-10 border-t border-white/10 pt-4 pb-2 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono tracking-[0.15em] text-gray-500 uppercase opacity-80 gap-3 md:gap-0">
          
          {/* Left: Copyright */}
          <div className="flex-1 flex justify-center md:justify-start">
            <span>© 2026 All Rights Reserved</span>
          </div>

          {/* Center: System Status */}
          <div className="flex-1 flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#00ff00] animate-pulse" />
            <span className="text-green-500/90 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">SYSTEM ONLINE</span>
          </div>

          {/* Right: Version & Credit */}
          <div className="flex-1 flex flex-col md:flex-row justify-center md:justify-end items-center gap-2 md:gap-6 text-cyan-500/40">
            <span>Version 1.0</span>
            <span className="text-gray-400 font-bold border-t md:border-t-0 md:border-l border-white/10 pt-1 md:pt-0 md:pl-6">
              Created by Vincent
            </span>
          </div>
          
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;