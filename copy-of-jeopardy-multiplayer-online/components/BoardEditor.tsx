import React, { useState, useEffect } from 'react';
import { Category, Clue } from '../types';
import NeonButton from './NeonButton';
import NeonInput from './NeonInput';
import { Save, Plus, X, Edit3, ArrowLeft } from 'lucide-react';

interface BoardEditorProps {
  initialBoard: Category[];
  onSave: (board: Category[]) => void;
  onCancel: () => void;
}

const BoardEditor: React.FC<BoardEditorProps> = ({ initialBoard, onSave, onCancel }) => {
  const [board, setBoard] = useState<Category[]>(initialBoard);
  
  // Modal State
  const [editingIndices, setEditingIndices] = useState<{ catIndex: number, clueIndex: number } | null>(null);
  const [tempClue, setTempClue] = useState<Clue | null>(null);

  // Auto-init if empty
  useEffect(() => {
    if (board.length === 0) {
      // Should technically be handled by parent, but safe fallback
    }
  }, []);

  const handleCategoryTitleChange = (index: number, newTitle: string) => {
    const newBoard = [...board];
    newBoard[index].title = newTitle;
    setBoard(newBoard);
  };

  const addCategory = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      title: 'NEW SECTOR',
      clues: Array.from({ length: 5 }).map((_, i) => ({
        id: `clue-${Date.now()}-${i}`,
        value: (i + 1) * 100,
        question: 'Enter question here...',
        answer: 'Enter answer here...'
      }))
    };
    setBoard([...board, newCat]);
  };

  const removeCategory = (index: number) => {
    if (confirm('Delete this entire sector?')) {
        const newBoard = board.filter((_, i) => i !== index);
        setBoard(newBoard);
    }
  };

  const openClueModal = (catIndex: number, clueIndex: number) => {
    setEditingIndices({ catIndex, clueIndex });
    setTempClue({ ...board[catIndex].clues[clueIndex] });
  };

  const saveClue = () => {
    if (editingIndices && tempClue) {
      const newBoard = [...board];
      newBoard[editingIndices.catIndex].clues[editingIndices.clueIndex] = tempClue;
      setBoard(newBoard);
      closeModal();
    }
  };

  const closeModal = () => {
    setEditingIndices(null);
    setTempClue(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-surface/90 backdrop-blur-md border-b border-neon-cyan/30 px-6 py-4 flex justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                <Edit3 className="text-neon-pink" />
                BOARD CONFIG
            </h1>
        </div>
        <div className="flex gap-4">
            <button onClick={onCancel} className="text-gray-400 hover:text-white font-mono uppercase text-sm tracking-wider flex items-center gap-2">
                <ArrowLeft size={16} /> Discard
            </button>
            <NeonButton variant="cyan" onClick={() => onSave(board)}>
                <Save className="w-4 h-4 mr-2" /> Save System
            </NeonButton>
        </div>
      </header>

      {/* Main Board Area - Horizontal Scroll */}
      <main className="flex-1 overflow-x-auto p-8 relative">
        <div className="flex gap-6 min-w-max pb-12">
            {board.map((category, catIndex) => (
                <div key={category.id} className="w-64 flex flex-col gap-4">
                    {/* Category Header */}
                    <div className="relative group">
                        <input 
                            value={category.title}
                            onChange={(e) => handleCategoryTitleChange(catIndex, e.target.value)}
                            className="w-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono font-bold text-center py-4 px-2 uppercase tracking-wider focus:outline-none focus:bg-neon-cyan/20 focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all rounded-t-sm"
                        />
                         <button 
                            onClick={() => removeCategory(catIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-10"
                            title="Remove Category"
                        >
                            <X size={12} />
                        </button>
                        <div className="h-0.5 w-full bg-neon-cyan shadow-[0_0_5px_#00ffff]" />
                    </div>

                    {/* Clue Cards */}
                    {category.clues.map((clue, clueIndex) => (
                        <div 
                            key={clue.id}
                            onClick={() => openClueModal(catIndex, clueIndex)}
                            className="h-24 glass-panel border border-white/10 hover:border-neon-pink hover:bg-neon-pink/5 cursor-pointer flex flex-col items-center justify-center group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                        >
                            <span className="font-mono text-3xl font-bold text-neon-yellow group-hover:text-neon-pink drop-shadow-md transition-colors">
                                ${clue.value}
                            </span>
                            {/* Preview small text if needed, usually just value is standard jeopardy style */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 font-mono">
                                EDIT
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* Add Category Button */}
            <div className="w-16 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                <button 
                    onClick={addCategory}
                    className="w-12 h-12 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingIndices && tempClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <div className="relative glass-panel w-full max-w-lg p-8 border border-neon-pink/50 shadow-[0_0_50px_rgba(255,0,255,0.15)] animate-pulse-fast-once">
                <h3 className="text-xl font-mono text-neon-pink mb-6 flex items-center gap-2">
                    <Edit3 size={20} /> EDIT DATA_NODE
                </h3>
                
                <div className="space-y-6">
                    <NeonInput 
                        label="Point Value"
                        type="number"
                        value={tempClue.value}
                        onChange={(e) => setTempClue({...tempClue, value: parseInt(e.target.value) || 0})}
                    />

                    <div className="space-y-1 group">
                        <label className="block text-neon-cyan font-mono text-xs uppercase tracking-widest mb-1 ml-1 opacity-80">
                            The Clue (Question)
                        </label>
                        <textarea 
                            rows={3}
                            className="w-full bg-dark-bg/50 border border-white/20 text-white font-sans text-lg px-4 py-3 outline-none transition-all duration-300 focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] placeholder-white/10"
                            value={tempClue.question}
                            onChange={(e) => setTempClue({...tempClue, question: e.target.value})}
                        />
                    </div>

                    <NeonInput 
                        label="Correct Response"
                        value={tempClue.answer}
                        onChange={(e) => setTempClue({...tempClue, answer: e.target.value})}
                    />

                    <div className="flex gap-4 pt-4">
                        <NeonButton variant="pink" fullWidth onClick={closeModal}>
                            Cancel
                        </NeonButton>
                        <NeonButton variant="cyan" fullWidth onClick={saveClue}>
                            Update Node
                        </NeonButton>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BoardEditor;
