import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, remove, child, push } from 'firebase/database';
import { firebaseConfig } from '../firebaseConfig';
import { GameState, Player, Category } from '../types';
import { getInitialBoard } from '../utils/helpers';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper to convert object of players to array
const playersToArray = (playersObj: Record<string, Player> | undefined): Player[] => {
  if (!playersObj) return [];
  return Object.values(playersObj);
};

export const GameService = {
  // Create a new room
  async createRoom(hostName: string, roomCode: string, maxPlayers: number): Promise<{ success: boolean; error?: string }> {
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      const snapshot = await get(roomRef);

      if (snapshot.exists()) {
        return { success: false, error: 'ROOM CODE ALREADY IN USE' };
      }

      const hostId = `host-${Date.now()}`;
      const hostPlayer: Player = {
        id: hostId,
        name: hostName,
        isHost: true,
        score: 0
      };

      // Initial Game State
      const initialState: any = { // Using any for DB stricture mapping
        hostName,
        roomCode,
        status: 'waiting',
        maxPlayers,
        board: getInitialBoard(),
        players: {
          [hostId]: hostPlayer
        },
        currentView: 'lobby'
      };

      await set(roomRef, initialState);
      return { success: true };
    } catch (error: any) {
      console.error("Firebase Error:", error);
      return { success: false, error: error.message || 'CONNECTION FAILED' };
    }
  },

  // Join an existing room
  async joinRoom(playerName: string, roomCode: string): Promise<{ success: boolean; playerId?: string; error?: string }> {
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        return { success: false, error: 'ROOM NOT FOUND' };
      }

      const roomData = snapshot.val();
      const players = roomData.players || {};
      const currentCount = Object.keys(players).length;

      if (currentCount >= roomData.maxPlayers) {
        return { success: false, error: 'ROOM IS FULL' };
      }

      // Check for duplicate names
      const nameTaken = Object.values(players).some((p: any) => p.name.toLowerCase() === playerName.toLowerCase());
      if (nameTaken) {
        return { success: false, error: 'CALLSIGN TAKEN' };
      }

      const playerId = `player-${Date.now()}`;
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        isHost: false,
        score: 0
      };

      // Add player to DB
      await update(ref(db, `rooms/${roomCode}/players`), {
        [playerId]: newPlayer
      });

      return { success: true, playerId };
    } catch (error: any) {
       return { success: false, error: error.message || 'CONNECTION FAILED' };
    }
  },

  // Listen to room updates
  subscribeToRoom(roomCode: string, onUpdate: (data: GameState | null) => void) {
    const roomRef = ref(db, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Transform DB data to App State
        const appState: GameState = {
          roomCode: data.roomCode,
          hostName: data.hostName,
          status: data.status,
          maxPlayers: data.maxPlayers,
          board: data.board || [],
          players: playersToArray(data.players)
        };
        onUpdate(appState);
      } else {
        onUpdate(null); // Room deleted
      }
    });

    return unsubscribe; // Return cleanup function
  },

  // Update Game Board (for Editor)
  async updateBoard(roomCode: string, newBoard: Category[]) {
    await update(ref(db, `rooms/${roomCode}`), {
      board: newBoard
    });
  },

  // Start Game
  async updateStatus(roomCode: string, status: 'waiting' | 'playing' | 'finished') {
    await update(ref(db, `rooms/${roomCode}`), {
      status
    });
  },

  // Leave Room
  async leaveRoom(roomCode: string, playerId: string, isHost: boolean) {
    if (isHost) {
      // If host leaves, destroy the room (or handle migration, but simpler to destroy)
      await remove(ref(db, `rooms/${roomCode}`));
    } else {
      await remove(ref(db, `rooms/${roomCode}/players/${playerId}`));
    }
  }
};
