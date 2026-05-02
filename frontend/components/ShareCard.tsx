'use client'
import { useRef } from 'react'

interface ShareCardProps {
  type:      'roast' | 'oracle'
  content:   string
  subject:   string   // wallet address or question
  chain?:    string
  timestamp: string
}

function chainLabel(chain?: string) {
  const map: Record<string, string> = {
    evm: 'EVM (Multi-chain)', solana: 'Solana', sui: 'SUI'
  }
  return chain ? (map[chain] ?? chain) : ''
}

export default function ShareCard({ type, content, subject, chain, timestamp }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isRoast = type === 'roast'
  const accent  = isRoast ? '#ff3c00' : '#00ff94'
  const verdict = !isRoast && (content.startsWith('YES') ? 'YES' : content.startsWith('NO') ? 'NO' : null)
  const date    = new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  async function downloadCard() {
    if (!cardRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0f0f0f',
      scale: 2,
      useCORS: true,
      logging: false,
    })
    const link = document.createElement('a')
    link.download = `chainsnark-${type}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function shareOnX() {
    const text = isRoast
      ? `💀 My wallet just got DESTROYED by ChainSnark AI\n\n"${content.slice(0, 160)}..."\n\nVerified on Ritual Chain 🔥\n\ntry yours → chainsnark.vercel.app`
      : `🎱 I asked ChainSnark: "${subject.slice(0, 80)}"\n\nThe chain said: ${verdict ?? 'See below'}\n\nVerified on Ritual Chain ⛓\n\ntry it → chainsnark.vercel.app`
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">

      {/* ── The card (captured as image) ── */}
      <div ref={cardRef} className="share-card p-7" style={{ fontFamily: 'monospace' }}>

        {/* Corner brackets */}
        {['top-3 left-3 border-t border-l','top-3 right-3 border-t border-r',
          'bottom-3 left-3 border-b border-l','bottom-3 right-3 border-b border-r'].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: accent }} />
        ))}

        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${accent}18 0%, transparent 70%)` }} />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 18 }}>{isRoast ? '💬' : '🎱'}</span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
                {isRoast ? 'THE ROAST' : 'THE ORACLE'}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ChainSnark · Ritual Chain
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 22, color: accent,
            textShadow: `0 0 20px ${accent}80` }}>⛓</div>
        </div>

        {/* Subject */}
        <div className="mb-4 px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 11 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>{isRoast ? 'WALLET:' : 'Q:'} </span>
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>
            {isRoast
              ? (subject.slice(0, 8) + '...' + subject.slice(-6))
              : `"${subject.slice(0, 80)}${subject.length > 80 ? '…' : ''}"`}
          </span>
          {chain && <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 8 }}>· {chainLabel(chain)}</span>}
        </div>

        {/* Verdict badge (oracle) */}
        {verdict && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
            style={{
              border: `1px solid ${verdict === 'YES' ? '#00ff94' : '#ff3c00'}`,
              background: verdict === 'YES' ? 'rgba(0,255,148,0.08)' : 'rgba(255,60,0,0.08)',
            }}>
            <span style={{ color: verdict === 'YES' ? '#00ff94' : '#ff3c00', fontWeight: 'bold', fontSize: 20,
              textShadow: `0 0 15px ${verdict === 'YES' ? '#00ff94' : '#ff3c00'}` }}>
              {verdict}
            </span>
          </div>
        )}

        {/* Main content */}
        <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          {content}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>
              Powered by Ritual AI
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{date}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display), serif', letterSpacing: '0.12em', color: accent,
              fontSize: 15, textShadow: `0 0 15px ${accent}60` }}>
              CHAINSNARK
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>chainsnark.vercel.app</div>
          </div>
        </div>
      </div>

      {/* ── Action buttons (not in screenshot) ── */}
      <div className="mt-4 flex gap-3">
        <button onClick={shareOnX} className="btn-red flex-1 py-3 text-sm flex items-center justify-center gap-2" style={{ fontSize: 14 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
        <button onClick={downloadCard} className="btn-ghost px-5 py-3 text-sm">
          ↓ Save
        </button>
      </div>
    </div>
  )
}
