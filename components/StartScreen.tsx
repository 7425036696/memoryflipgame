import React, { useState } from 'react';
import { User, Users, BrainCircuit, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStartGame: (mode: 'single' | 'multi', items: string[], themeName: string, difficulty: Difficulty) => void;
}

const PRESETS = [
  { id: 'fruits', name: 'Fruits', items: ["🍎", "🍌", "🍇", "🍓", "🍒", "🍑", "🍍", "🥝", "🍉", "🍋", "🍐", "🥥"] },
  { id: 'animals', name: 'Animals', items: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮"] },
  { id: 'sports', name: 'Sports', items: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥊", "🥋"] },
  { id: 'space', name: 'Space', items: ["🚀", "🪐", "👽", "☄️", "🌑", "🔭", "🛰️", "🌟", "🌍", "☀️", "🌌", "👨‍🚀"] },
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    onStartGame(mode, preset.items, preset.name, difficulty);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
           <BrainCircuit className="w-12 h-12 text-indigo-400" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-400 tracking-tight mb-2">
          MindFlip 3D
        </h1>
        <p className="text-slate-400 font-medium">The Ultimate Memory Challenge</p>
      </div>

      <div className="space-y-6">
        {/* Game Mode Selection */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 flex">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
              mode === 'single' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={18} /> Solo
          </button>
          <button
            onClick={() => setMode('multi')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
              mode === 'multi' 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={18} /> 1v1 Duel
          </button>
        </div>

        {/* Difficulty Selection (Solo Only) */}
        {mode === 'single' && (
           <div className="animate-fade-in">
             <div className="flex justify-between items-end mb-2 px-1">
                 <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Difficulty</h3>
             </div>
             <div className="grid grid-cols-3 gap-2">
                <button
                   onClick={() => setDifficulty('easy')}
                   className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-300 ${
                       difficulty === 'easy'
                       ? 'bg-green-500/20 border-green-500 text-green-400'
                       : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/5'
                   }`}
                >
                    <SignalLow size={20} />
                    <span className="text-xs font-bold">Easy</span>
                </button>
                <button
                   onClick={() => setDifficulty('medium')}
                   className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-300 ${
                       difficulty === 'medium'
                       ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                       : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/5'
                   }`}
                >
                    <SignalMedium size={20} />
                    <span className="text-xs font-bold">Medium</span>
                </button>
                <button
                   onClick={() => setDifficulty('hard')}
                   className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-300 ${
                       difficulty === 'hard'
                       ? 'bg-red-500/20 border-red-500 text-red-400'
                       : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/5'
                   }`}
                >
                    <SignalHigh size={20} />
                    <span className="text-xs font-bold">Hard</span>
                </button>
             </div>
           </div>
        )}

        {/* Theme Selection */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 ml-1">Select Theme</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 group-hover:text-white">{preset.name}</span>
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{preset.items[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};