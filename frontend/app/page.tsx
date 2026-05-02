'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function Counter({ end }: { end: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const step = Math.ceil(end / 50)
    const t = setInterval(() => setN(p => { if (p + step >= end) { clearInterval(t); return end } return p + step }), 25)
    return () => clearInterval(t)
  }, [end])
  return <>{n.toLocaleString()}</>
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e1e', flexWrap: 'wrap', gap: 8 }}>
        <div className="animate-flicker glow-red" style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.15em', color: '#ff3c00' }}>
          CHAINSNARK
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Powered by GenLayer · Chain 4221
          </div>
          <a href="https://explorer-bradbury.genlayer.com" target="_blank" rel="noreferrer"
            style={{ fontSize: 10, color: '#00ff94', textDecoration: 'none', letterSpacing: '0.1em', border: '1px solid rgba(0,255,148,0.3)', padding: '3px 8px' }}>
            Explorer →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'rgba(255,60,0,0.04)', filter: 'blur(130px)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', border: '1px solid #1e1e1e', fontSize: 10, color: '#00ff94', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff94', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Live on GenLayer Testnet Bradbury · AI Consensus On-Chain
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 16vw, 160px)', lineHeight: 1, letterSpacing: '0.05em', marginBottom: 20 }}>
          <span style={{ color: 'white' }}>CHAIN</span>
          <span className="glow-red" style={{ color: '#ff3c00' }}>SNARK</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 3vw, 21px)', color: 'rgba(255,255,255,0.5)', marginBottom: 10, maxWidth: 500 }}>
          The blockchain that judges you.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', marginBottom: 52, maxWidth: 420, lineHeight: 1.8 }}>
          Paste any wallet. The AI roasts your entire on-chain history across ALL chains.<br />
          Or ask anything. Get a brutal honest answer.<br />
          Everything stored on GenLayer forever. No wallet needed.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 380 }}>
          <Link href="/roast">
            <button className="btn-red" style={{ width: '100%', padding: '18px', fontSize: 22, letterSpacing: '0.08em' }}>
              💬 ROAST MY WALLET
            </button>
          </Link>
          <Link href="/oracle">
            <button className="btn-green" style={{ width: '100%', padding: '18px', fontSize: 22, letterSpacing: '0.08em' }}>
              🎱 ASK THE ORACLE
            </button>
          </Link>
        </div>

        <p style={{ marginTop: 14, fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Free · No wallet · EVM + Solana + SUI · Results on-chain
        </p>

        {/* Stats */}
        <div style={{ marginTop: 60, display: 'flex', gap: 40, textAlign: 'center', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { val: 4721,  color: '#ff3c00', label: 'Wallets Roasted' },
            { val: 9103,  color: '#00ff94', label: 'Questions Answered' },
          ].map((s, i) => (
            <div key={i}>
              <div className={i === 0 ? 'glow-red' : 'glow-green'} style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: s.color }}>
                <Counter end={s.val} />
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 4, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
          <div>
            <div className="glow-yellow" style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: '#ffe44d' }}>∞</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 4, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Stored Forever</div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ borderTop: '1px solid #1e1e1e', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {[
          { href: '/roast', emoji: '💬', title: 'THE ROAST', color: '#ff3c00', cls: 'glow-red',
            desc: 'Paste any EVM, Solana, or SUI wallet. GenLayer AI pulls your history across all chains and roasts every bad decision. Publicly. Forever.' },
          { href: '/oracle', emoji: '🎱', title: 'THE ORACLE', color: '#00ff94', cls: 'glow-green',
            desc: 'Ask any yes/no question. GenLayer\'s AI consensus delivers a verdict with brutal honest reasoning. No filter. Stored permanently.' },
        ].map(f => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '44px 48px', borderRight: '1px solid #1e1e1e', cursor: 'pointer', transition: 'background 0.2s', height: '100%' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.012)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ fontSize: 38, marginBottom: 14 }}>{f.emoji}</div>
              <h2 className={f.cls} style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: f.color, letterSpacing: '0.08em', marginBottom: 12 }}>{f.title}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.8 }}>{f.desc}</p>
              <div style={{ marginTop: 18, fontSize: 10, color: f.color, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Enter →</div>
            </div>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section style={{ borderTop: '1px solid #1e1e1e', padding: '40px 48px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>How It Works</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {['Paste wallet or question', '→', 'GenLayer AI fetches data & reasons on-chain', '→', 'Multiple validators reach consensus', '→', 'Result stored permanently', '→', 'Share card generated'].map((s, i) => (
            <span key={i} style={{ color: s === '→' ? 'rgba(255,60,0,0.5)' : undefined }}>{s}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e1e1e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'rgba(255,255,255,0.18)', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em', fontSize: 14 }}>CHAINSNARK</span>
        <span>Built on GenLayer · Moralis · Helius · Blockberry</span>
        <a href="https://explorer-bradbury.genlayer.com" target="_blank" rel="noreferrer" style={{ color: '#ff3c00', textDecoration: 'none' }}>
          GenLayer Explorer →
        </a>
      </footer>
    </main>
  )
}
