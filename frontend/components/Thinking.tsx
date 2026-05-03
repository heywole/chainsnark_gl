'use client'
import { useEffect, useState } from 'react'

const ROAST_MSGS = [
  "Bribing GenLayer validators with imaginary coins...",
  "Teaching AI what 'savage' means...",
  "Scanning 47 chains for your worst decisions...",
  "Consulting the blockchain ancestors...",
  "Counting how many rugs you survived...",
  "Calculating your total gas fees wasted...",
  "Finding your most embarrassing transaction...",
  "AI is writing. Then deleting. Then writing again...",
  "Validators arguing about how hard to roast you...",
  "Almost done... probably... maybe...",
]

const ORACLE_MSGS = [
  "Consulting the blockchain gods...",
  "Decoding the universe for your answer...",
  "Validators debating your life choices...",
  "The chain sees all. It is thinking...",
  "Weighing your question against cosmic truth...",
  "AI is being brutally honest right now...",
  "Almost ready... the oracle doesn't rush...",
  "Cross-referencing with the ancient scrolls...",
  "Preparing a verdict you may not like...",
  "The truth is loading. Brace yourself...",
]

const ROAST_FACTS = [
  "GenLayer uses multiple AI validators to reach consensus",
  "Your roast is being stored permanently on-chain",
  "No one controls the AI — the blockchain does",
  "Every roast is verifiable by anyone forever",
  "GenLayer is the first blockchain with native AI",
]

export default function Thinking({ type }: { type: 'roast' | 'oracle' }) {
  const msgs    = type === 'roast' ? ROAST_MSGS : ORACLE_MSGS
  const accent  = type === 'roast' ? '#ff3c00' : '#00ff94'
  const [msgIdx,   setMsgIdx]   = useState(0)
  const [factIdx,  setFactIdx]  = useState(0)
  const [elapsed,  setElapsed]  = useState(0)
  const [progress, setProgress] = useState(0)
  const [dots,     setDots]     = useState('')

  useEffect(() => {
    const t1 = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 3000)
    const t2 = setInterval(() => setFactIdx(i => (i + 1) % ROAST_FACTS.length), 5000)
    const t3 = setInterval(() => setElapsed(p => p + 1), 1000)
    const t4 = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    // Progress bar — reaches 90% in 4 mins then stays
    const t5 = setInterval(() => setProgress(p => p < 90 ? p + (90 / 240) : p), 1000)
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); clearInterval(t5) }
  }, [msgs.length])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }} className="animate-fade-in">
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>

        {/* Spinner */}
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px' }}>
          <svg style={{ position: 'absolute', inset: 0, animation: 'spin 2s linear infinite' }}
            viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke={accent} strokeWidth="1.5"
              strokeDasharray="60 180" strokeLinecap="round"/>
          </svg>
          <svg style={{ position: 'absolute', inset: 0, animation: 'spin 3s linear infinite reverse' }}
            viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="26" stroke={accent} strokeWidth="0.5"
              strokeDasharray="25 150" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
            {type === 'roast' ? '🔥' : '🎱'}
          </div>
        </div>

        {/* Status */}
        <div style={{ fontSize: 11, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 'bold' }}>
          {type === 'roast' ? 'ROASTING IN PROGRESS' : 'ORACLE CONSULTING'}
        </div>

        {/* Timer */}
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
          ⏱ {timeStr} elapsed
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accent}80, ${accent})`,
            borderRadius: 4,
            transition: 'width 1s linear',
          }} />
        </div>

        {/* Funny message */}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {msgs[msgIdx]}{dots}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {['TX Sent', 'AI Running', 'Consensus', 'Done'].map((step, i) => {
            const done = (i === 0 && elapsed > 5) || (i === 1 && elapsed > 20) || (i === 2 && elapsed > 60)
            const active = (i === 1 && elapsed > 5 && elapsed <= 20) || (i === 2 && elapsed > 20 && elapsed <= 60) || (i === 3 && elapsed > 60)
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: `1px solid ${done || active ? accent : '#1e1e1e'}`,
                  background: done ? accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: done ? '#000' : active ? accent : 'rgba(255,255,255,0.2)',
                  fontWeight: 'bold',
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 9, color: done ? accent : 'rgba(255,255,255,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {step}
                </div>
              </div>
            )
          })}
        </div>

        {/* Fun fact */}
        <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          💡 {ROAST_FACTS[factIdx]}
        </div>

        {/* Warning after 3 mins */}
        {elapsed > 180 && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(255,228,77,0.08)', border: '1px solid rgba(255,228,77,0.2)', fontSize: 11, color: '#ffe44d' }}>
            Still working... GenLayer validators are reaching consensus. Please don't close this tab!
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}