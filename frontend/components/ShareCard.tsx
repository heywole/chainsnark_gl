'use client'
import { useRef } from 'react'

interface ShareCardProps {
  type:      'roast' | 'oracle'
  content:   string
  subject:   string
  chain?:    string
  timestamp: string
}

function truncate(addr: string) {
  if (!addr || addr.length < 12) return addr
  return addr.slice(0, 8) + '...' + addr.slice(-6)
}

const CHAIN_LABELS: Record<string, string> = {
  evm: 'EVM', solana: 'SOL', sui: 'SUI'
}

export default function ShareCard({ type, content, subject, chain, timestamp }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isRoast = type === 'roast'
  const accent  = isRoast ? '#00ff41' : '#00e5ff'
  const verdict = !isRoast && (content.startsWith('YES') ? 'YES' : content.startsWith('NO') ? 'NO' : null)
  const date    = new Date(timestamp).toISOString().split('T')[0]
  const time    = new Date(timestamp).toISOString().split('T')[1].split('.')[0]

  async function downloadCard() {
    if (!cardRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0a0a0a',
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
      ? `💀 My wallet got ROASTED on-chain by ChainSnark AI\n\n"${content.slice(0, 140)}..."\n\nVerified on GenLayer forever 🔗\n\nchainsnark-gl.vercel.app`
      : `🤖 I asked ChainSnark Oracle: "${subject.slice(0, 60)}"\n\nVerdict: ${verdict ?? 'See below'}\n\nStored on GenLayer blockchain ⛓\n\nchainsnark-gl.vercel.app`
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div style={{ width: '100%' }}>

      {/* The card */}
      <div ref={cardRef} className="share-card" style={{ padding: '20px', fontFamily: "'JetBrains Mono', monospace" }}>

        {/* Scanline effect on card */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.012) 3px, rgba(0,255,65,0.012) 4px)', pointerEvents: 'none' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid rgba(${isRoast ? '0,255,65' : '0,229,255'},0.15)` }}>
          <div style={{ display: 'flex', align: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginLeft: 6, letterSpacing: '0.1em' }}>
              {isRoast ? 'roast.sh' : 'oracle.sh'} — output
            </span>
          </div>
          <span style={{ fontSize: 9, color: accent, letterSpacing: '0.1em', opacity: 0.7 }}>
            CHAINSNARK
          </span>
        </div>

        {/* Command line */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 12, letterSpacing: '0.06em' }}>
          <span style={{ color: accent, opacity: 0.6 }}>$ </span>
          {isRoast
            ? `roast_wallet("${truncate(subject)}"${chain ? `, "${CHAIN_LABELS[chain] || chain}"` : ''})`
            : `ask_oracle("${subject.slice(0, 50)}${subject.length > 50 ? '...' : ''}")`
          }
        </div>

        {/* Verdict badge for oracle */}
        {verdict && (
          <div style={{ marginBottom: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', border: `1px solid ${verdict === 'YES' ? '#00ff41' : '#ff3c00'}`, background: verdict === 'YES' ? 'rgba(0,255,65,0.06)' : 'rgba(255,60,0,0.06)' }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>VERDICT:</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: verdict === 'YES' ? '#00ff41' : '#ff3c00', letterSpacing: '0.15em' }}>
              {verdict}
            </span>
          </div>
        )}

        {/* Output label */}
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 8 }}>
          OUTPUT:
        </div>

        {/* Content */}
        <div style={{ fontSize: 12, color: '#e8e8e8', lineHeight: 1.75, marginBottom: 16, paddingLeft: 12, borderLeft: `2px solid ${accent}40` }}>
          {content}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em', marginBottom: 2 }}>
              STORED ON GENLAYER CHAIN · PERMANENT
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>
              {date} {time} UTC
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.15em', opacity: 0.8 }}>
              CHAINSNARK
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>chainsnark-gl.vercel.app</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button onClick={shareOnX} className="btn-exec" style={{ flex: 1, fontSize: 11, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          $ share --platform=x
        </button>
        <button onClick={downloadCard} className="btn-ghost" style={{ padding: '10px 16px', fontSize: 11 }}>
          ↓ save.png
        </button>
      </div>
    </div>
  )
}
