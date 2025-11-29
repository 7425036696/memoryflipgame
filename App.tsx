
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './components/Card';
import { GameStats } from './components/GameStats';
import { StartScreen } from './components/StartScreen';
import { Confetti } from './components/Confetti';
import { CardItem, GameState, GameMode, ViewState, Difficulty } from './types';
import { Trophy, Crown, Home, Clock } from 'lucide-react';
import { playSound } from './services/audioService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('start');
  const [isMuted, setIsMuted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    moves: 0,
    scores: { 1: 0, 2: 0 },
    activePlayer: 1,
    gameMode: 'single',
    difficulty: 'medium',
    timer: 0,
    isProcessing: false,
    gameStatus: 'idle',
    theme: '',
  });

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (gameState.gameStatus === 'playing' && gameState.gameMode === 'single') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.gameMode]);

  // Initialize game board
  const initializeGame = useCallback((items: string[], mode: GameMode, themeName: string, difficulty: Difficulty) => {
    // Determine number of pairs based on difficulty
    let pairCount = 8; // Default Medium (4x4)
    if (mode === 'single') {
        if (difficulty === 'easy') pairCount = 6; // 12 cards (3x4)
        if (difficulty === 'hard') pairCount = 10; // 20 cards (4x5)
    }

    // Ensure we have enough items, if not, slice what we have
    const gameItems = items.slice(0, pairCount);
    
    // Duplicate items to create pairs
    const allItems = [...gameItems, ...gameItems];
    
    // Shuffle using Fisher-Yates
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    const newCards: CardItem[] = allItems.map((content, index) => ({
      id: `card-${index}`,
      content,
      isFlipped: false,
      isMatched: false,
      matchedBy: undefined
    }));

    setGameState({
      cards: newCards,
      moves: 0,
      scores: { 1: 0, 2: 0 },
      activePlayer: 1,
      gameMode: mode,
      difficulty: difficulty,
      timer: 0,
      isProcessing: false,
      gameStatus: 'playing',
      theme: themeName,
    });
    
    setView('game');
  }, []);

  const handleStartGame = (mode: GameMode, items: string[], themeName: string, difficulty: Difficulty) => {
    initializeGame(items, mode, themeName, difficulty);
  };

  const handleCardClick = (clickedCard: CardItem) => {
    if (gameState.isProcessing || clickedCard.isMatched || clickedCard.isFlipped || gameState.gameStatus === 'won') return;

    // Play flip sound
    playSound('flip', isMuted);

    // Flip the clicked card
    const updatedCards = gameState.cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );

    // Find currently flipped but unmatched cards
    const flippedCards = updatedCards.filter(c => c.isFlipped && !c.isMatched);

    if (flippedCards.length === 2) {
      // Two cards are flipped, check for match
      setGameState(prev => ({ ...prev, cards: updatedCards, isProcessing: true, moves: prev.moves + 1 }));
      
      const [first, second] = flippedCards;
      
      if (first.content === second.content) {
        // MATCH!
        setTimeout(() => {
          playSound('match', isMuted); // Play match sound

          const matchedCards = updatedCards.map(c => 
            (c.id === first.id || c.id === second.id) 
              ? { ...c, isMatched: true, matchedBy: gameState.activePlayer } 
              : c
          );
          
          // Increment score for active player
          const newScores = { ...gameState.scores, [gameState.activePlayer]: gameState.scores[gameState.activePlayer] + 1 };
          
          const isWon = matchedCards.every(c => c.isMatched);
          let gameStatus = isWon ? 'won' : 'playing';
          
          // Determine winner status for display if won
          if (isWon) {
              playSound('win', isMuted); // Play victory sound
              if (gameState.gameMode === 'multi') {
                  if (newScores[1] > newScores[2]) gameStatus = 'won'; // Player 1 wins
                  else if (newScores[2] > newScores[1]) gameStatus = 'won'; // Player 2 wins
                  else gameStatus = 'draw';
              }
          }

          setGameState(prev => ({
            ...prev,
            cards: matchedCards,
            scores: newScores,
            isProcessing: false,
            gameStatus: gameStatus as any
            // Keep activePlayer same on match in multiplayer!
          }));
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          playSound('mismatch', isMuted); // Play error/mismatch sound

          const resetCards = updatedCards.map(c => 
            (c.id === first.id || c.id === second.id) 
              ? { ...c, isFlipped: false } 
              : c
          );
          
          setGameState(prev => ({
            ...prev,
            cards: resetCards,
            isProcessing: false,
            // Switch turn if mismatched in multiplayer
            activePlayer: prev.gameMode === 'multi' ? (prev.activePlayer === 1 ? 2 : 1) : 1
          }));
        }, 1000);
      }
    } else {
      // First card of the pair
      setGameState(prev => ({ ...prev, cards: updatedCards }));
    }
  };

  const handleRestart = () => {
    // Extract unique items to restart with same theme
    const uniqueItems = Array.from(new Set(gameState.cards.map(c => c.content)));
    initializeGame(uniqueItems, gameState.gameMode, gameState.theme, gameState.difficulty);
  };

  const handleGoHome = () => {
    setView('start');
  };

  const getWinnerMessage = () => {
      if (gameState.gameMode === 'single') {
          return `Cleared in ${formatTime(gameState.timer)}!`;
      } else {
          if (gameState.scores[1] > gameState.scores[2]) return "Player 1 Wins!";
          if (gameState.scores[2] > gameState.scores[1]) return "Player 2 Wins!";
          return "It's a Draw!";
      }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
  };

  // Determine grid class based on card count / difficulty
  const getGridClass = () => {
      if (gameState.gameMode === 'multi') return 'grid-cols-4'; // Standard for multi
      
      switch (gameState.difficulty) {
          case 'easy': return 'grid-cols-3 sm:grid-cols-4'; // 12 cards: 3x4 or 4x3
          case 'medium': return 'grid-cols-4'; // 16 cards: 4x4
          case 'hard': return 'grid-cols-4 sm:grid-cols-5'; // 20 cards: 4x5 or 5x4
          default: return 'grid-cols-4';
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Confetti Animation on Win */}
      {(gameState.gameStatus === 'won') && <Confetti />}

      {/* Content Area */}
      <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center">
        
        {view === 'start' ? (
          <StartScreen onStartGame={handleStartGame} />
        ) : (
          <>
            <GameStats 
              moves={gameState.moves} 
              scores={gameState.scores}
              activePlayer={gameState.activePlayer}
              themeName={gameState.theme} 
              gameStatus={gameState.gameStatus}
              gameMode={gameState.gameMode}
              timer={gameState.timer}
              isMuted={isMuted}
              onReset={handleRestart}
              onHome={handleGoHome}
              onToggleMute={() => setIsMuted(!isMuted)}
            />

            {/* Game Board */}
            <div className={`relative w-full mx-auto aspect-square transition-all duration-300 ${gameState.difficulty === 'easy' ? 'max-w-md' : 'max-w-lg'}`}>
              {/* Win Overlay */}
              {(gameState.gameStatus === 'won' || gameState.gameStatus === 'draw') && (
                 <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-3xl animate-fade-in p-6">
                    <div className="text-center transform scale-110 animate-bounce-slow w-full">
                       <div className="flex justify-center mb-6 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]">
                            {gameState.gameMode === 'multi' && gameState.gameStatus === 'won' ? <Crown size={80} strokeWidth={1.5} /> : <Trophy size={80} strokeWidth={1.5} />}
                       </div>
                       <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 mb-2 drop-shadow-sm">
                         {gameState.gameMode === 'single' ? 'VICTORY' : 'GAME OVER'}
                       </h2>
                       <p className="text-2xl text-slate-300 font-light mb-8">
                         {getWinnerMessage()}
                       </p>
                       <div className="flex flex-col gap-3">
                         <button 
                           onClick={handleRestart}
                           className="w-full py-4 bg-white text-indigo-950 rounded-xl font-bold shadow-xl hover:bg-indigo-50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                         >
                           <Trophy size={18} /> Play Again
                         </button>
                         <button 
                           onClick={handleGoHome}
                           className="w-full py-4 bg-white/5 text-white rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                         >
                           <Home size={18} /> Main Menu
                         </button>
                       </div>
                    </div>
                 </div>
              )}

              {/* Grid */}
              <div className={`grid ${getGridClass()} gap-3 sm:gap-4 p-3 sm:p-5 rounded-3xl bg-slate-900/40 border border-white/5 shadow-2xl backdrop-blur-xl h-full w-full content-center transition-all duration-700 ${gameState.gameStatus === 'won' || gameState.gameStatus === 'draw' ? 'scale-95 opacity-50 blur-[2px]' : ''}`}>
                {gameState.cards.map((card, index) => (
                  <Card 
                    key={card.id} 
                    card={card}
                    index={index}
                    gameStatus={gameState.gameStatus}
                    onClick={handleCardClick} 
                    gameMode={gameState.gameMode}
                  />
                ))}
              </div>
            </div>
            
            {/* Footer Tip */}
            {gameState.gameMode === 'multi' && gameState.gameStatus === 'playing' && (
                <div className="mt-8 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-center">
                   <p className="text-xs text-slate-400 font-medium">✨ Finding a match grants an extra turn!</p>
                </div>
            )}
            
            {gameState.gameMode === 'single' && gameState.gameStatus === 'playing' && (
                <div className="mt-8 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-center flex items-center gap-2">
                   <Clock size={12} className="text-slate-400"/>
                   <p className="text-xs text-slate-400 font-medium">{gameState.difficulty.toUpperCase()} MODE</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
