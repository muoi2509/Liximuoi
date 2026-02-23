import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Envelope } from './components/Envelope';
import { playTing, playShuffle, playCelebration } from './audio';

type GameState = 'INITIAL' | 'SHUFFLING' | 'SELECTING' | 'WAITING_TO_OPEN' | 'OPENING' | 'CELEBRATING';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('INITIAL');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [envelopes, setEnvelopes] = useState([
    { id: 0, text: '5k', position: 0 },
    { id: 1, text: '50k', position: 1 },
    { id: 2, text: '100k', position: 2 },
  ]);

  const triggerShuffleParticles = () => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ffaa00'],
      gravity: 0.5,
      scalar: 0.8,
      ticks: 100,
      zIndex: 0
    });
  };

  const triggerCelebrationConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffd700', '#ff8c00'],
        zIndex: 100
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffd700', '#ff8c00'],
        zIndex: 100
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleReady = () => {
    setGameState('SHUFFLING');
    playShuffle();
    triggerShuffleParticles();
    
    let shuffles = 0;
    const interval = setInterval(() => {
      setEnvelopes(prev => {
        const newEnv = [...prev];
        const idx1 = Math.floor(Math.random() * 3);
        let idx2 = Math.floor(Math.random() * 3);
        while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);
        
        const temp = newEnv[idx1].position;
        newEnv[idx1].position = newEnv[idx2].position;
        newEnv[idx2].position = temp;
        
        return newEnv;
      });
      shuffles++;
      if (shuffles >= 7) {
        clearInterval(interval);
        setTimeout(() => {
          setGameState('SELECTING');
        }, 400);
      }
    }, 400);
  };

  const handleSelect = (id: number) => {
    if (gameState !== 'SELECTING') return;
    setSelectedId(id);
    setGameState('WAITING_TO_OPEN');
  };

  const handleOpen = () => {
    if (gameState !== 'WAITING_TO_OPEN') return;
    setGameState('OPENING');
    playTing();
    
    setTimeout(() => {
      setGameState('CELEBRATING');
      playCelebration();
      triggerCelebrationConfetti();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex flex-col items-center justify-center overflow-hidden relative font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 to-transparent"></div>
      
      <div className="z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* Title / Header area */}
        <div className="h-24 mb-8 flex items-end justify-center">
          <AnimatePresence mode="wait">
            {gameState === 'INITIAL' && (
              <motion.h1 
                key="title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl sm:text-5xl font-extrabold font-poppins text-red-700 text-center tracking-wide drop-shadow-lg"
              >
                🧧 Lì Xì 🧧
              </motion.h1>
            )}
            {gameState === 'SELECTING' && (
              <motion.h2
                key="select"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl sm:text-3xl font-bold text-red-700 text-center drop-shadow-sm"
              >
                🤑 Chọn Một Bao Lì Xì 🤑
              </motion.h2>
            )}
            {gameState === 'WAITING_TO_OPEN' && (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-yellow-600 font-bold text-2xl sm:text-3xl drop-shadow-md"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  😀 Mở Lì Xì Thôi 😀
                </motion.span>
              </motion.div>
            )}
            {gameState === 'CELEBRATING' && (
              <motion.div
                key="celebrating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2 -mt-4 drop-shadow-lg">
                  🎉 Chúc Mừng :) 🎉
                </h2>
                <motion.div 
                  className="text-4xl sm:text-5xl font-extrabold text-yellow-500 -mt-4 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  50.000đ!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Envelopes Area */}
        <div className="relative h-64 sm:h-80 w-full flex justify-center items-center">
          <div className="flex justify-center items-center gap-4 sm:gap-8 absolute">
            <AnimatePresence mode="popLayout">
              {envelopes.sort((a, b) => a.position - b.position).map(env => {
                const isSelected = selectedId === env.id;
                const isHidden = (gameState === 'WAITING_TO_OPEN' || gameState === 'OPENING' || gameState === 'CELEBRATING') && !isSelected;
                
                if (isHidden) return null;

                return (
                  <motion.div 
                    key={env.id}
                    layout 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: isSelected ? 1.2 : 1 }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={isSelected ? "z-50" : "z-10"}
                  >
                    <Envelope 
                      text={env.text}
                      showText={gameState === 'INITIAL'}
                      isOpen={gameState === 'OPENING' || gameState === 'CELEBRATING'}
                      isShuffling={gameState === 'SHUFFLING'}
                      isSelected={isSelected && gameState === 'WAITING_TO_OPEN'}
                      onClick={() => {
                        if (gameState === 'SELECTING') handleSelect(env.id);
                        else if (gameState === 'WAITING_TO_OPEN' && isSelected) handleOpen();
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Action Area */}
        <div className="h-24 mt-8 flex items-start justify-center">
          <AnimatePresence mode="wait">
            {gameState === 'INITIAL' && (
              <motion.button
                key="btn-ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReady}
                className="px-8 py-4 bg-red-600 text-yellow-300 font-bold text-xl rounded-full shadow-lg border-2 border-yellow-400 hover:bg-red-700 transition-colors"
              >
                Bắt Đầu
              </motion.button>
            )}
            {gameState === 'CELEBRATING' && (
              <motion.button
                key="btn-ok"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
                className="px-10 py-3 bg-yellow-300 text-red-700 font-bold text-xl rounded-full shadow-lg border-2 border-red-600 hover:bg-yellow-500 transition-colors"
              >
                Chụp Màn Hình Gửi Toi 🧐
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
