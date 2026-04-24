// Step 1 — animated "scanning" placeholder shown while the scraper is
// working. The stage text cycles on a 1.2s interval; we don't tie it to
// real scraper progress because the scraper resolves too fast for the
// stages to land visually on a fast connection, but too slow to rely on
// instant completion on a bad one. Fake-but-consistent pacing reads
// better than jittery real progress here.

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, RefreshCw, Coffee } from 'lucide-react'

export function StepScanning() {
  const [stageIdx, setStageIdx] = useState(0)
  const stages = [
    'Starting the scan...',
    'Reading your website...',
    'Checking Instagram vibes...',
    'Importing products...',
    'Scanning imagery...',
    'Finalising your profile...',
  ]

  useEffect(() => {
    const t = setInterval(() => setStageIdx(i => Math.min(i + 1, stages.length - 1)), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="py-6">
      {/* Coffee cup with steam */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Steam puffs */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute w-1.5 h-8 bg-gradient-to-t from-transparent via-[#D94545]/30 to-transparent rounded-full animate-steam"
              style={{ left: `${10 + i * 10}px`, bottom: '70px', animationDelay: `${i * 0.5}s`, filter: 'blur(2px)' }}
            />
          ))}
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-[#D94545] flex items-center justify-center shadow-warm-lg"
          >
            <Coffee size={36} className="text-white" />
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-[#1A1513] mb-1">Scanning...</h2>
        <p className="font-hand text-xl text-[#D94545]">this should take ~30 seconds</p>
      </div>

      <div className="space-y-2">
        {stages.map((msg, i) => (
          <motion.div
            key={msg}
            initial={{ opacity: 0 }}
            animate={{ opacity: i <= stageIdx ? 1 : 0.3 }}
            className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
              i === stageIdx ? 'bg-[#D94545]/5' : ''
            }`}
          >
            {i < stageIdx ? (
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            ) : i === stageIdx ? (
              <RefreshCw size={16} className="text-[#D94545] animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
            )}
            <span className={`text-sm ${i === stageIdx ? 'font-semibold text-[#1A1513]' : 'text-gray-500'}`}>
              {msg}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
