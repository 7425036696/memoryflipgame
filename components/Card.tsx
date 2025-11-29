
import React from 'react';
import { CardItem } from '../types';

interface CardProps {
  card: CardItem;
  index: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'draw';
  onClick: (card: CardItem) => void;
  gameMode: 'single' | 'multi';
}

export const Card: React.FC<CardProps> = ({ card, index, gameStatus, onClick, gameMode }) => {
  // Determine border and shadow color based on match status and owner
  let borderClass = 'border-white/20';
  let shadowClass = '';
  
  if (card.isMatched) {
    if (gameMode === 'multi') {
        if (card.matchedBy === 1) {
            borderClass = 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]';
        } else if (card.matchedBy === 2) {
            borderClass = 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]';
        }
    } else {
        borderClass = 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]';
    }
  }

  // Calculate delay for wave animation
  const animationDelay = gameStatus === 'won' ? `${index * 50}ms` : '0ms';

  return (
    <div 
      className={`group relative w-full aspect-square [perspective:1000px] cursor-pointer ${gameStatus === 'won' ? 'animate-wave' : ''}`}
      style={{ animationDelay }}
      onClick={() => !card.isFlipped && !card.isMatched && onClick(card)}
    >
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
          card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''
        } ${!card.isFlipped && !card.isMatched && gameStatus === 'playing' ? 'hover:scale-[1.03]' : ''}`}
      >
        {/* Front of Card (Hidden initially) - The "Back" of the card design-wise */}
        <div className="absolute inset-0 h-full w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-900 p-1 [backface-visibility:hidden] flex items-center justify-center border-b-4 border-r-2 border-indigo-900 shadow-xl">
             <div className="h-full w-full border-2 border-dashed border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/5">
                <span className="text-2xl font-bold text-white/20">?</span>
             </div>
        </div>

        {/* Back of Card (Content, Revealed on Flip) - The "Front" face */}
        <div
          className={`absolute inset-0 h-full w-full rounded-xl sm:rounded-2xl bg-slate-800 px-1 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center border-2 transition-colors duration-300 ${borderClass} ${shadowClass}`}
        >
          {/* Background Highlight for matched player */}
          {card.isMatched && gameMode === 'multi' && (
              <div className={`absolute inset-0 opacity-15 ${card.matchedBy === 1 ? 'bg-cyan-400' : 'bg-pink-500'}`}></div>
          )}
          {card.isMatched && gameMode === 'single' && (
               <div className="absolute inset-0 opacity-10 bg-yellow-400"></div>
          )}

          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl select-none filter drop-shadow-sm transform transition-transform">
            {card.content}
          </span>
        </div>
      </div>
    </div>
  );
};
