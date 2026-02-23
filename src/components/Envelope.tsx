import { motion, AnimatePresence } from 'motion/react';

interface EnvelopeProps {
  text?: string;
  isOpen?: boolean;
  onClick?: () => void;
  isShuffling?: boolean;
  isSelected?: boolean;
  showText?: boolean;
}

export function Envelope({ text, isOpen, onClick, isShuffling, isSelected, showText }: EnvelopeProps) {
  return (
    <motion.div 
      className="relative w-28 h-40 sm:w-36 sm:h-52 cursor-pointer"
      onClick={onClick}
      whileHover={(!isShuffling && !isOpen) ? { scale: 1.05 } : {}}
      whileTap={(!isShuffling && !isOpen) ? { scale: 0.95 } : {}}
      animate={
        isSelected && !isOpen ? {
          rotate: [0, -3, 3, -3, 3, 0],
          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        } : isShuffling ? {
          rotate: [0, 5, -5, 0],
          transition: { repeat: Infinity, duration: 0.5 }
        } : {}
      }
    >
      {/* Back */}
      <div className="absolute inset-0 bg-red-900 rounded-md shadow-xl border border-red-950"></div>
      
      {/* Open Flap */}
      {isOpen && (
        <div 
          className="absolute top-0 left-0 w-full h-[40%] bg-red-800 origin-bottom transform -translate-y-full"
          style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
        ></div>
      )}

      {/* Golden glow inside */}
      {isOpen && (
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-full blur-xl z-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1.5 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Banknote */}
      {isOpen && (
        <motion.div 
          className="absolute top-2 left-3 right-3 h-24 sm:h-32 bg-[#e6f2e6] rounded shadow-md border border-[#b3d9b3] flex flex-col items-center justify-center z-10 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <div className="text-[#2e7d32] font-bold text-sm sm:text-base">50.000đ</div>
          <div className="text-[#2e7d32] text-[8px] sm:text-[10px] opacity-80 mt-1 text-center leading-tight">NĂM MƯƠI<br/>NGHÌN ĐỒNG</div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800 to-transparent"></div>
          {/* Banknote details */}
          <div className="absolute top-1 left-1 w-4 h-4 rounded-full border border-green-700/30"></div>
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full border border-green-700/30"></div>
        </motion.div>
      )}

      {/* Front Flaps */}
      <div className="absolute inset-0 z-20 overflow-hidden rounded-md">
        {/* Left */}
        <div className="absolute inset-0 bg-red-600 border-r border-yellow-500/40" style={{ clipPath: 'polygon(0 0, 50% 40%, 0 100%)' }}></div>
        {/* Right */}
        <div className="absolute inset-0 bg-red-600 border-l border-yellow-500/40" style={{ clipPath: 'polygon(100% 0, 50% 40%, 100% 100%)' }}></div>
        {/* Bottom */}
        <div className="absolute inset-0 bg-red-500 border-t border-yellow-500/60" style={{ clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)' }}></div>
      </div>

      {/* Closed Flap */}
      {!isOpen && (
        <div className="absolute inset-0 z-30 overflow-hidden rounded-md">
          <div className="absolute inset-0 bg-red-700 border-b border-yellow-400 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 40%)' }}></div>
          {/* Seal */}
          <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md border-2 border-yellow-500">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-xs sm:text-sm font-bold leading-none">-</span>
            </div>
          </div>
        </div>
      )}

      {/* Text on envelope */}
      <AnimatePresence>
        {showText && text && (
          <motion.div 
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-yellow-300 font-bold text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] mt-12">
              {text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
