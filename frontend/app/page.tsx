'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function TypeWriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const t = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)) }
      else clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return <span>{displayed}<span className="cursor" /></span>
}

function Counter({ end }: { end: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const step = Math.ceil(end / 40)
    const t = setInterval(() => setN(p => { if (p + step >= end) { clearInterval(t); return end } return p + step }), 30)
    return () => clearInterval(t)
  }, [end])
  return <>{n.toLocaleString()}</>
}

export default function Home() {
  const [booted, setBooted] = useState(false)
  useEffect(() => { setTimeout(() => setBooted(true), 800) }, [])

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--green)', fontSize: 11, opacity: 0.5 }}>~/</span>
          <span className="glow-green animate-flicker" style={{ color: 'var(--green)', fontSize: 14, fontWeight: 700, letterSpacing: '0.15em' }}>CHAINSNARK</span>
          <span style={{ color: 'var(--border2)', fontSize: 11 }}>v1.0.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 10, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>
          <span style={{ color: 'var(--green)', opacity: 0.6 }}>●</span>
          <span>GENLAYER BRADBURY</span>
          <span style={{ color: 'var(--border2)' }}>|</span>
          <span>CHAIN 4221</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', position: 'relative' }}>

        {/* Boot sequence */}
        <div style={{ width: '100%', maxWidth: 560, marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: 'var(--dimmer)', letterSpacing: '0.15em', marginBottom: 20 }}>
            {booted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  '[OK] GenLayer consensus engine loaded',
                  '[OK] AI validators connected',
                  '[OK] Blockchain memory initialized',
                  '[OK] Roast engine armed and dangerous',
                ].map((line, i) => (
                  <div key={i} style={{ color: i < 3 ? 'var(--dimmer)' : 'var(--green)', opacity: 0.7, fontSize: 10 }}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main title */}
          <div style={{ marginBottom: 6, fontSize: 10, color: 'var(--dimmer)', letterSpacing: '0.15em' }}>
            SYSTEM::IDENTIFY
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            <span className="glow-green animate-flicker" style={{ color: 'var(--green)' }}>CHAIN</span>
            <span style={{ color: 'var(--white)' }}>SNARK</span>
            <span style={{ color: 'var(--green)', fontSize: '0.4em', verticalAlign: 'top', marginLeft: 6, opacity: 0.6 }}>_</span>
          </h1>

          <div style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 8, letterSpacing: '0.05em' }}>
            {booted ? <TypeWriter text="// The blockchain that judges you." /> : ''}
          </div>
          <div style={{ fontSize: 11, color: 'var(--dimmer)', lineHeight: 1.7, maxWidth: 420 }}>
            Paste any wallet. Ask anything. GenLayer AI runs on-chain.
            Results stored permanently. No wallet needed. No filter.
          </div>
        </div>

        {/* Terminal window */}
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Window chrome */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>chainsnark — bash</span>
          </div>

          {/* Terminal body */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '20px' }}>
            <div style={{ fontSize: 11, color: 'var(--dimmer)', marginBottom: 16, lineHeight: 1.8 }}>
              <span style={{ color: 'var(--green)' }}>chainsnark@genlayer</span>
              <span style={{ color: 'var(--white)' }}>:</span>
              <span style={{ color: 'var(--cyan)' }}>~</span>
              <span style={{ color: 'var(--white)' }}>$ </span>
              <span style={{ color: 'var(--white)' }}>./chainsnark --help</span>
            </div>

            <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 2, marginBottom: 20 }}>
              <div><span style={{ color: 'var(--amber)' }}>COMMANDS:</span></div>
              <div style={{ paddingLeft: 16 }}>
                <span style={{ color: 'var(--green)' }}>roast</span>
                <span style={{ color: 'var(--dimmer)', margin: '0 8px' }}>·····</span>
                <span>Submit wallet address → AI destroys it on-chain</span>
              </div>
              <div style={{ paddingLeft: 16 }}>
                <span style={{ color: 'var(--cyan)' }}>oracle</span>
                <span style={{ color: 'var(--dimmer)', margin: '0 8px' }}>····</span>
                <span>Ask yes/no → brutal honest verdict on-chain</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/roast" style={{ textDecoration: 'none', flex: 1 }}>
                <button className="btn-exec" style={{ width: '100%', fontSize: 11 }}>
                  $ ./roast.sh
                </button>
              </Link>
              <Link href="/oracle" style={{ textDecoration: 'none', flex: 1 }}>
                <button className="btn-exec" style={{ width: '100%', background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--cyan)', fontSize: 11, boxShadow: 'none' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(0,229,255,0.08)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,229,255,0.3)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.boxShadow = 'none' }}>
                  $ ./oracle.sh
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 40, display: 'flex', gap: 32, fontSize: 11 }}>
          {[
            { label: 'wallets_roasted', val: 4721, color: 'var(--green)' },
            { label: 'questions_answered', val: 9103, color: 'var(--cyan)' },
            { label: 'stored_forever', val: '∞', color: 'var(--amber)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: s.color, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {typeof s.val === 'number' ? <Counter end={s.val} /> : s.val}
              </div>
              <div style={{ color: 'var(--dimmer)', fontSize: 9, letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>
        <span>CHAINSNARK v1.0.0</span>
        <span>POWERED BY GENLAYER AI · CHAIN 4221</span>
        <a href="https://explorer-bradbury.genlayer.com" target="_blank" rel="noreferrer" style={{ color: 'var(--green)', textDecoration: 'none' }}>EXPLORER →</a>
      </footer>
    </main>
  )
}
