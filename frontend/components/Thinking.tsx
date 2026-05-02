'use client'
import { useEffect, useState } from 'react'

const ROAST_LINES = [
  'Scanning all chains for bad decisions...',
  'Counting rug pulls and honeypots...',
  'Calculating total losses across ETH, BSC, Solana...',
  'Consulting the ancient scrolls of financial regret...',
  'Cross-referencing with the hall of shame...',
  'Summoning maximum savagery...',
  'Preparing verdict. This will hurt...',
]
const ORACLE_LINES = [
  'Consulting the on-chain ancestors...',
  'Processing your question through the void...',
  'The chain sees all. It is thinking...',
  'Weighing the evidence...',
  'Formulating an answer you may not want...',
  'Verdict incoming. No take-backs...',
]

export default function Thinking({ type }: { type: 'roast' | 'oracle' }) {
  const lines  = type === 'roast' ? ROAST_LINES : ORACLE_LINES
  const accent = type === 'roast' ? '#ff3c00' : '#00ff94'
  const [idx,  setIdx]  = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const t1 = setInterval(() => setIdx(i => (i + 1) % lines.length), 1800)
    const t2 = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [lines.length])

  return (
    <div className="w-full max-w-lg mx-auto card p-10 text-center animate-fade-in">
      {/* Spinner */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <svg className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke={accent} strokeWidth="1.5" strokeDasharray="60 180" strokeLinecap="round"/>
        </svg>
        <svg className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="26" stroke={accent} strokeWidth="0.5" strokeDasharray="25 150" strokeLinecap="round" opacity="0.4"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          {type === 'roast' ? '🔥' : '🎱'}
        </div>
      </div>

      <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>
        {type === 'roast' ? 'Roasting In Progress' : 'Oracle Consulting'}
      </div>
      <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)', minHeight: 24 }}>
        {lines[idx]}<span style={{ color: 'rgba(255,255,255,0.2)' }}>{dots}</span>
      </div>

      {/* Bars */}
      <div className="flex justify-center gap-1 mb-6">
        {[12,20,28,20,12].map((h, i) => (
          <div key={i} className="w-1 rounded-full animate-pulse-slow"
            style={{ height: h, background: accent, opacity: 0.6, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Powered by Ritual AI · Please wait
      </div>
    </div>
  )
}
