'use client'
import { useEffect, useState } from 'react'

const ROAST_MSGS = [
  'Bribing GenLayer validators with imaginary coins...',
  'Teaching AI the definition of "savage"...',
  'Scanning 47 chains for your worst decisions...',
  'Consulting the blockchain ancestors...',
  'Counting how many rugs you survived...',
  'AI writing... deleting... writing again...',
  'Validators arguing about roast severity...',
  'Cross-referencing with hall of shame...',
  'Almost done. This will hurt...',
]

const ORACLE_MSGS = [
  'Consulting the on-chain gods...',
  'Validators debating your life choices...',
  'The chain sees all. It is thinking...',
  'Weighing your question against reality...',
  'Preparing a verdict you may not like...',
  'AI is being brutally honest right now...',
  'Cross-referencing with cosmic truth...',
  'The oracle does not rush...',
]

const FACTS = [
  'GenLayer uses multiple AI validators to reach consensus',
  'Your result is being stored permanently on-chain',
  'No one controls the AI — the blockchain does',
  'Every result is verifiable by anyone forever',
  'GenLayer is the first blockchain with native AI inference',
]

export default function Thinking({ type }: { type: 'roast' | 'oracle' }) {
  const msgs   = type === 'roast' ? ROAST_MSGS : ORACLE_MSGS
  const accent = type === 'roast' ? 'var(--green)' : 'var(--cyan)'
  const accentRaw = type === 'roast' ? '#00ff41' : '#00e5ff'

  const [msgIdx,   setMsgIdx]   = useState(0)
  const [factIdx,  setFactIdx]  = useState(0)
  const [elapsed,  setElapsed]  = useState(0)
  const [progress, setProgress] = useState(0)
  const [dots,     setDots]     = useState('')
  const [lines,    setLines]    = useState<string[]>([])

  useEffect(() => {
    const t1 = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 3000)
    const t2 = setInterval(() => setFactIdx(i => (i + 1) % FACTS.length), 6000)
    const t3 = setInterval(() => setElapsed(p => p + 1), 1000)
    const t4 = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    const t5 = setInterval(() => setProgress(p => p < 88 ? +(p + 88/240).toFixed(2) : p), 1000)

    // Simulate terminal output lines
    const logLines = [
      '[0.1s] TX submitted to GenLayer mempool',
      '[0.8s] Validator leader selected',
      '[2.1s] AI inference engine started',
      '[5.3s] Processing prompt...',
      '[12s] Validator 1 computed result',
      '[18s] Validator 2 cross-checking...',
      '[25s] Validator 3 verifying...',
      '[40s] Reaching consensus...',
      '[60s] Writing result to chain...',
    ]
    let li = 0
    const t6 = setInterval(() => {
      if (li < logLines.length) setLines(prev => [...prev, logLines[li++]])
    }, 7000)

    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); clearInterval(t5); clearInterval(t6) }
  }, [msgs.length])

  const mins   = Math.floor(elapsed / 60)
  const secs   = elapsed % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  const steps = ['TX_SENT', 'AI_RUNNING', 'CONSENSUS', 'WRITING', 'DONE']
  const stepIdx = elapsed < 5 ? 0 : elapsed < 20 ? 1 : elapsed < 90 ? 2 : elapsed < 150 ? 3 : 4

  return (
    <div style={{ width: '100%' }} className="animate-fade-in">

      {/* Window chrome */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', animation: 'pulse 1s ease-in-out infinite' }} />
        <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>
          {type === 'roast' ? 'roast.sh' : 'oracle.sh'} — running
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: accentRaw, letterSpacing: '0.08em' }}>
          ⏱ {timeStr}
        </span>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em', marginBottom: 6 }}>
            <span>PROGRESS</span>
            <span style={{ color: accentRaw }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', height: 4, width: '100%', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accentRaw}60, ${accentRaw})`,
              transition: 'width 1s linear',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', right: 0, top: -2, width: 8, height: 8, borderRadius: '50%', background: accentRaw, boxShadow: `0 0 8px ${accentRaw}` }} />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `1px solid ${i <= stepIdx ? accentRaw : 'var(--border2)'}`,
                  background: i < stepIdx ? accentRaw : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: i < stepIdx ? '#000' : i === stepIdx ? accentRaw : 'var(--dimmer)',
                  fontWeight: 'bold',
                  animation: i === stepIdx ? 'pulse 1s ease-in-out infinite' : 'none',
                }}>
                  {i < stepIdx ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 7, color: i <= stepIdx ? accentRaw : 'var(--dimmer)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {step}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < stepIdx ? accentRaw : 'var(--border)', margin: '0 4px', marginBottom: 14, opacity: 0.4 }} />
              )}
            </div>
          ))}
        </div>

        {/* Terminal log output */}
        <div style={{ background: '#080808', border: '1px solid var(--border)', padding: '10px 12px', marginBottom: 14, minHeight: 80, fontFamily: 'monospace', fontSize: 10 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ color: i === lines.length - 1 ? accentRaw : 'var(--dimmer)', marginBottom: 2, letterSpacing: '0.04em' }}>
              {line}
            </div>
          ))}
          <div style={{ color: accentRaw, letterSpacing: '0.04em' }}>
            {msgs[msgIdx]}{dots}
            <span style={{ color: accentRaw, animation: 'blink 1s step-end infinite' }}>█</span>
          </div>
        </div>

        {/* Fun fact */}
        <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: 10, color: 'var(--dimmer)', lineHeight: 1.6 }}>
          <span style={{ color: accentRaw, marginRight: 6 }}>//</span>
          {FACTS[factIdx]}
        </div>

        {/* Warning after 3 mins */}
        {elapsed > 180 && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.2)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.04em' }}>
            ⚠ GenLayer validators still reaching consensus. Do not close this tab.
          </div>
        )}
      </div>
    </div>
  )
}
