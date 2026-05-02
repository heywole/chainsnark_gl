'use client'
import { useState } from 'react'
import Link from 'next/link'
import ShareCard from '@/components/ShareCard'
import Thinking  from '@/components/Thinking'

type Stage = 'input' | 'loading' | 'result' | 'error'

export default function RoastPage() {
  const [address, setAddress] = useState('')
  const [stage,   setStage]   = useState<Stage>('input')
  const [result,  setResult]  = useState<any>(null)
  const [errMsg,  setErrMsg]  = useState('')

  async function handleRoast() {
    if (!address.trim()) return
    setStage('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/roast', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ address: address.trim() }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setErrMsg(data.error ?? 'Error'); setStage('error'); return }
      setResult(data)
      setStage('result')
    } catch {
      setErrMsg('Network error. Try again.')
      setStage('error')
    }
  }

  const chains = [
    { icon: '⟠', label: 'ETH' }, { icon: '🟡', label: 'BSC' },
    { icon: '🔵', label: 'Base' }, { icon: '🟣', label: 'Polygon' },
    { icon: '🔷', label: 'Arb' }, { icon: '◎', label: 'Solana' }, { icon: '💧', label: 'SUI' },
  ]

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e1e' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="animate-flicker glow-red" style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.15em', color: '#ff3c00' }}>CHAINSNARK</div>
        </Link>
        <Link href="/oracle" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>🎱 Try The Oracle →</Link>
      </nav>

      <div style={{ flex: 1, padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-slide-up">
          <div style={{ fontSize: 52, marginBottom: 14 }}>💬</div>
          <h1 className="glow-red" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 12vw, 90px)', color: '#ff3c00', letterSpacing: '0.08em', marginBottom: 10 }}>THE ROAST</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
            Paste any wallet. GenLayer AI fetches your history from ALL chains and roasts every mistake you've ever made. Stored on-chain forever.
          </p>
          {/* Chain badges */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {chains.map(c => (
              <span key={c.label} style={{ fontSize: 10, padding: '3px 8px', border: '1px solid #1e1e1e', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>

        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 520 }} className="animate-fade-in">
            <div className="card" style={{ padding: 28 }}>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                Wallet Address — EVM / Solana / SUI (auto-detected)
              </label>
              <input
                type="text"
                placeholder="0x... or Solana address or SUI address"
                value={address}
                onChange={e => setAddress(e.target.value.trim())}
                onKeyDown={e => e.key === 'Enter' && handleRoast()}
                className="input-field"
                style={{ borderRadius: 0, marginBottom: 8 }}
              />
              {errMsg && (
                <div style={{ padding: '10px 12px', background: 'rgba(255,60,0,0.08)', border: '1px solid rgba(255,60,0,0.25)', color: '#ff3c00', fontSize: 12, marginBottom: 12 }}>
                  ⚠ {errMsg}
                </div>
              )}
              <button onClick={handleRoast} disabled={!address.trim()} className="btn-red"
                style={{ width: '100%', padding: '16px', fontSize: 20, marginTop: 6 }}>
                🔥 ROAST THIS WALLET
              </button>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 12, letterSpacing: '0.08em' }}>
                Free · AI runs on GenLayer chain · Takes 30–90 seconds
              </p>
            </div>
          </div>
        )}

        {stage === 'loading' && <Thinking type="roast" />}

        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 520 }} className="animate-slide-up">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', border: '1px solid rgba(255,60,0,0.35)', fontSize: 10, color: '#ff3c00', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3c00', display: 'inline-block' }} />
                Roast Delivered · GenLayer AI Consensus
              </div>
              {result.explorer && (
                <div style={{ marginTop: 8 }}>
                  <a href={result.explorer} target="_blank" rel="noreferrer"
                    style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.08em' }}>
                    View on GenLayer Explorer →
                  </a>
                </div>
              )}
            </div>
            <ShareCard type="roast" content={result.roast} subject={result.address} chain={result.chain} timestamp={result.timestamp} />
            <button onClick={() => { setAddress(''); setStage('input'); setResult(null) }}
              className="btn-ghost" style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 12 }}>
              🔁 Roast Another Wallet
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
