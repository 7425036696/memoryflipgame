
import React from 'react';
import { GameMode } from '../types';
import { RotateCcw, Home, Swords, Crown, Volume2, VolumeX } from 'lucide-react';

interface GameStatsProps {
  moves: number;
  scores: { 1: number; 2: number };
  activePlayer: 1 | 2;
  themeName: string;
  gameStatus: 'idle' | 'playing' | 'won' | 'draw';
  gameMode: GameMode;
  timer: number;
  isMuted: boolean;
  onReset: () => void;
  onHome: () => void;
  onToggleMute: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  moves, 
  scores, 
  activePlayer, 
  themeName, 
  gameStatus, 
  gameMode, 
  timer,
  isMuted,
  onReset,
  onHome,
  onToggleMute
}) => {
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinner = () => {
      if (gameStatus !== 'won') return null;
      if (gameMode === 'single') return 1;
      return scores[1] > scores[2] ? 1 : 2;
  };

  const winner = getWinner();

  return (
    <div className="w-full max-w-2xl mb-4 sm:mb-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
            <button 
                onClick={onHome}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                title="Back to Menu"
            >
                <Home size={20} />
            </button>
            <button 
                onClick={onToggleMute}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>

        <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400">
                {themeName}
            </h2>
            <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${gameStatus === 'playing' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    {gameMode === 'single' ? 'Solo Run' : '1v1 Duel'}
                </span>
            </div>
        </div>

        <button 
            onClick={onReset}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            title="Restart"
        >
            <RotateCcw size={20} />
        </button>
      </div>

      {/* Scoreboard Area */}
      {gameMode === 'single' ? (
        // Single Player Layout
        <div className="flex justify-center">
            <div className={`bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 sm:px-8 py-4 rounded-2xl shadow-xl flex items-center gap-6 sm:gap-10 transition-all duration-500 ${gameStatus === 'won' ? 'ring-2 ring-yellow-400 scale-105 shadow-yellow-400/20' : ''}`}>
                <div className="text-center w-20">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{moves}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Moves</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="text-center w-24">
                    <div className="flex items-center justify-center gap-2">
                        <span className={`block text-2xl sm:text-3xl font-mono font-bold tabular-nums ${gameStatus === 'won' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {formatTime(timer)}
                        </span>
                    </div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Time</span>
                </div>
            </div>
        </div>
      ) : (
        // Multiplayer Layout
        <div className="relative grid grid-cols-2 gap-4 sm:gap-12">
            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center z-10 shadow-lg">
                <Swords size={14} className="text-slate-400" />
            </div>

            {/* Player 1 Card */}
            <div className={`relative p-4 rounded-2xl border transition-all duration-500 overflow-hidden 
                ${activePlayer === 1 && gameStatus === 'playing' ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-105' : 'bg-slate-900/40 border-white/5 opacity-60 scale-95'}
                ${winner === 1 ? '!bg-cyan-900/60 !border-cyan-400 !opacity-100 !scale-110 shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-bounce-slow' : ''}
            `}>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        {winner === 1 && <Crown size={12} className="text-yellow-400 fill-yellow-400" />}
                        <span className={`text-xs font-bold uppercase tracking-widest ${activePlayer === 1 || winner === 1 ? 'text-cyan-400' : 'text-slate-500'}`}>Player 1</span>
                    </div>
                    <span className="text-4xl font-mono font-bold text-white">{scores[1]}</span>
                </div>
                {(activePlayer === 1 || winner === 1) && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>}
            </div>

            {/* Player 2 Card */}
            <div className={`relative p-4 rounded-2xl border transition-all duration-500 overflow-hidden 
                ${activePlayer === 2 && gameStatus === 'playing' ? 'bg-pink-950/40 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] scale-105' : 'bg-slate-900/40 border-white/5 opacity-60 scale-95'}
                ${winner === 2 ? '!bg-pink-900/60 !border-pink-500 !opacity-100 !scale-110 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-bounce-slow' : ''}
            `}>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        {winner === 2 && <Crown size={12} className="text-yellow-400 fill-yellow-400" />}
                        <span className={`text-xs font-bold uppercase tracking-widest ${activePlayer === 2 || winner === 2 ? 'text-pink-400' : 'text-slate-500'}`}>Player 2</span>
                    </div>
                    <span className="text-4xl font-mono font-bold text-white">{scores[2]}</span>
                </div>
                {(activePlayer === 2 || winner === 2) && <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent pointer-events-none"></div>}
            </div>
        </div>
      )}
    </div>
  );
};
