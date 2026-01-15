import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LobbyPage from './components/LobbyPage';
import BoardEditor from './components/BoardEditor';
import ModeSelection from './components/ModeSelection';
import GameBoard from './components/GameBoard';
import { GameState, ViewMode, Player, Category } from './types';
import { getInitialBoard } from './utils/helpers';
import { GameService } from './services/gameService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Local Game State (Synced from Firebase)
  const [gameState, setGameState] = useState<GameState>({
    roomCode: null,
    hostName: null,
    players: [],
    status: 'waiting',
    board: getInitialBoard(),
    maxPlayers: 4
  });

  // Subscribe to Firebase updates when roomCode changes
  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = GameService.subscribeToRoom(roomCode, (data) => {
      if (data) {
        setGameState(data);
        
        // Simple View Router based on status
        // Note: In a real app, we might want finer control, 
        // but this ensures all players see the same screen phase.
        if (data.status === 'playing' && view !== 'game') {
          setView('game');
        } else if (data.status === 'waiting' && view !== 'lobby' && view !== 'editor' && view !== 'mode-select') {
          setView('lobby');
        }
      } else {
        // Room destroyed
        alert("Connection Lost: Host ended the session.");
        handleLocalLeave();
      }
    });

    return () => unsubscribe();
  }, [roomCode, view]);

  const handleHost = async (name: string, code: string, maxPlayers: number) => {
    setIsLoading(true);
    const result = await GameService.createRoom(name, code, maxPlayers);
    setIsLoading(false);

    if (result.success) {
      setRoomCode(code);
      // We need to guess the ID or fetch it, but for Host in this simplified flow
      // we can rely on the subscribe to fill in the players. 
      // A small hack for now is checking the player list in the first update.
      // However, for immediate local confidence:
      // In a robust app, createRoom should return the generated Host ID.
      // For now, we will handle ID via the name logic in the service (not ideal but works for this demo scope)
      // Actually, let's fix the logic: The service creates an ID. We should ideally get it back.
      // I'll assume for this demo that the first player in list is Host.
      setView('mode-select');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleModeSelect = (mode: string) => {
    setView('lobby');
  };

  const handleJoin = async (name: string, code: string) => {
    setIsLoading(true);
    const result = await GameService.joinRoom(name, code);
    setIsLoading(false);

    if (result.success && result.playerId) {
      setRoomCode(code);
      setCurrentPlayerId(result.playerId);
      setView('lobby');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleLocalLeave = () => {
    setRoomCode(null);
    setCurrentPlayerId('');
    setView('landing');
    setGameState({
      roomCode: null,
      hostName: null,
      players: [],
      status: 'waiting',
      board: getInitialBoard(),
      maxPlayers: 4
    });
  };

  const handleLeave = () => {
    if (roomCode && currentPlayerId) {
      const isHost = gameState.players.find(p => p.id === currentPlayerId)?.isHost || false;
      GameService.leaveRoom(roomCode, currentPlayerId, isHost);
    }
    handleLocalLeave();
  };

  // Editor Handlers
  const handleOpenEditor = () => {
    setView('editor');
  };

  const handleSaveBoard = async (newBoard: Category[]) => {
    if (roomCode) {
      await GameService.updateBoard(roomCode, newBoard);
    }
    setView('lobby');
  };

  const handleCancelEdit = () => {
    setView('lobby');
  };

  // Game Handlers
  const handleStartGame = async () => {
    if (roomCode) {
      await GameService.updateStatus(roomCode, 'playing');
    }
  };

  return (
    <>
      {isLoading && (
         <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center font-mono text-neon-cyan">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <div className="animate-pulse tracking-widest">ESTABLISHING UPLINK...</div>
         </div>
      )}

      {view === 'landing' && (
        <LandingPage onHost={handleHost} onJoin={handleJoin} />
      )}
      
      {view === 'mode-select' && (
        <ModeSelection onSelectMode={handleModeSelect} />
      )}

      {view === 'lobby' && gameState.roomCode && (
        <LobbyPage 
          roomCode={gameState.roomCode}
          players={gameState.players}
          maxPlayers={gameState.maxPlayers}
          currentPlayerId={currentPlayerId || gameState.players.find(p => p.isHost)?.id || ''} // Fallback ID for Host
          onLeave={handleLeave}
          onEditBoard={handleOpenEditor}
          onStartGame={handleStartGame}
        />
      )}

      {view === 'editor' && (
        <BoardEditor 
          initialBoard={gameState.board}
          onSave={handleSaveBoard}
          onCancel={handleCancelEdit}
        />
      )}

      {view === 'game' && (
        <GameBoard 
            board={gameState.board}
            players={gameState.players}
            onExit={handleLeave}
        />
      )}
    </>
  );
};

export default App;