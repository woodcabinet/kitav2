// Shared "chrome" for the onboarding flow: the animated card wrapper
// that every step sits inside, the progress dots at the top, and the
// ambient steam decor that drifts up behind the card.
//
// Kept in one file because all three are tiny and always used together.

import { motion } from 'framer-motion'

export function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="paper-card rounded-3xl p-6 sm:p-8 shadow-warm-lg"
    >
      {children}
    </motion.div>
  )
}

export function ProgressDots({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i <= current ? '#D94545' : '#E8DDCB',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

export function SteamDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute w-2 h-10 bg-gradient-to-t from-transparent via-[#D94545]/10 to-transparent rounded-full animate-steam"
          style={{
            left: `${15 + i * 30}%`,
            bottom: '20%',
            animationDelay: `${i * 0.8}s`,
            filter: 'blur(4px)',
          }}
        />
      ))}
    </div>
  )
}
