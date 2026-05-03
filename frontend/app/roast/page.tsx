'use client'
import { useState } from 'react'
import Link from 'next/link'
import ShareCard from '@/components/ShareCard'
import Thinking  from '@/components/Thinking'

type Stage = 'input' | 'loading' | 'result' | 'error'

function validateAddress(addr: string): { valid: boolean; chain: string; error: string } {
  const a = addr.trim()
  if (!a) return { valid: false, chain: '', error: 'ERR: address cannot be empty' }
  // EVM
  if (a.startsWith('0x')) {
    if (a.length === 42) return { valid: true, chain: 'evm', error: '' }
    if (a.length === 66) return { valid: true, chain: 'sui', error: '' }
    return { valid: false, chain: '', error: `ERR: invalid address length (got ${a.length}, expected 42 for EVM or 66 for SUI)` }
  }
  // Solana (base58, 32-44 chars)
  if (a.length >= 32 && a.length <= 44) return { valid: true, chain: 'solana', error: '' }
  return { valid: false, chain: '', error: 'ERR: unrecognized address format (EVM starts with 0x, Solana is 32-44 chars)' }
}

export default function RoastPage() {
  const [address, setAddress] = useState('')
  const [stage,   setStage]   = useState<Stage>('input')
  const [result,  setResult]  = useState<any>(null)
  const [errMsg,  setErrMsg]  = useState('')

  const validation = validateAddress(address)
  const chainBadge: Record<string, string> = { evm: '[EVM]', solana: '[SOL]', sui: '[SUI]', '': '' }

  async function handleRoast() {
    if (!validation.valid) return
    setStage('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/roast', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setErrMsg(data.error ?? 'error'); setStage('error'); return }
      setResult(data)
      setStage('result')
    } catch {
      setErrMsg('ERR: network error. check connection and try again.')
      setStage('error')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--green)', fontSize: 11, opacity: 0.5 }}>~/</span>
          <span className="animate-flicker" style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em' }}>CHAINSNARK</span>
        </Link>
        <Link href="/oracle" style={{ fontSize: 10, color: 'var(--dimmer)', textDecoration: 'none', letterSpacing: '0.1em' }}>
          $ ./oracle.sh →
        </Link>
      </nav>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Header */}
        <div style={{ width: '100%', maxWidth: 560, marginBottom: 28 }} className="animate-slide-up">
          <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.15em', marginBottom: 6 }}>
            CHAINSNARK::MODULE — ROAST_ENGINE v1.0
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>
            <span className="glow-green" style={{ color: 'var(--green)' }}>$</span>
            <span style={{ color: 'var(--white)', marginLeft: 8 }}>roast_wallet</span>
            <span style={{ color: 'var(--dimmer)' }}>(address)</span>
          </h1>
          <p style={{ fontSize: 11, color: 'var(--dimmer)', lineHeight: 1.7 }}>
            // Submit any EVM, Solana, or SUI wallet. GenLayer AI fetches
            your entire on-chain history and roasts every bad decision.
            Stored permanently on-chain. No filter.
          </p>
        </div>

        {/* Input */}
        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-fade-in">

            {/* Window chrome */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>roast.sh — input</span>
              {validation.valid && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--green)', letterSpacing: '0.1em' }}>
                  {chainBadge[validation.chain]} DETECTED ✓
                </span>
              )}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>

              {/* Address input */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--dimmer)', letterSpacing: '0.12em', marginBottom: 6 }}>
                  # WALLET_ADDRESS — EVM (0x...) · SOLANA · SUI
                </div>
                <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                  <span style={{ padding: '10px 12px', background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border2)', borderRight: 'none', fontSize: 12, color: 'var(--green)', whiteSpace: 'nowrap' }}>
                    &gt;_
                  </span>
                  <input
                    type="text"
                    placeholder="0x... or Solana address or SUI address"
                    value={address}
                    onChange={e => setAddress(e.target.value.trim())}
                    onKeyDown={e => e.key === 'Enter' && validation.valid && handleRoast()}
                    className="term-input"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                {/* Validation feedback */}
                {address && !validation.valid && (
                  <div style={{ marginTop: 6, fontSize: 10, color: 'var(--red)', letterSpacing: '0.05em' }}>
                    ✗ {validation.error}
                  </div>
                )}
                {validation.valid && (
                  <div style={{ marginTop: 6, fontSize: 10, color: 'var(--green)', letterSpacing: '0.05em' }}>
                    ✓ valid {validation.chain.toUpperCase()} address detected
                  </div>
                )}
              </div>

              {/* Error */}
              {errMsg && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(255,60,0,0.06)', border: '1px solid rgba(255,60,0,0.2)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.05em' }}>
                  ✗ {errMsg}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleRoast}
                disabled={!validation.valid}
                className="btn-exec"
                style={{ width: '100%', fontSize: 12, padding: '12px' }}
              >
                $ EXECUTE ROAST_ENGINE --target {address ? address.slice(0, 8) + '...' : '<address>'}
              </button>

              {/* Supported chains */}
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['ETH', 'BSC', 'Base', 'Polygon', 'Arbitrum', 'Avalanche', 'Optimism', 'Solana', 'SUI'].map(c => (
                  <span key={c} style={{ fontSize: 9, padding: '2px 7px', border: '1px solid var(--border)', color: 'var(--dimmer)', letterSpacing: '0.08em' }}>
                    {c}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.08em' }}>
                // FREE · AI RUNS ON GENLAYER CHAIN · CONSENSUS TAKES 2-5 MIN
              </div>
            </div>
          </div>
        )}

        {stage === 'loading' && <div style={{ width: '100%', maxWidth: 560 }}><Thinking type="roast" /></div>}

        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-slide-up">
            <div style={{ marginBottom: 12, fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              ROAST DELIVERED · STORED ON GENLAYER CHAIN
            </div>
            <ShareCard type="roast" content={result.roast} subject={result.address} chain={result.chain} timestamp={result.timestamp} />
            {result.explorer && (
              <a href={result.explorer} target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 9, color: 'var(--dimmer)', textDecoration: 'none', letterSpacing: '0.1em' }}>
                VIEW TX ON GENLAYER EXPLORER →
              </a>
            )}
            <button onClick={() => { setAddress(''); setStage('input'); setResult(null) }}
              className="btn-ghost" style={{ width: '100%', marginTop: 10, fontSize: 10 }}>
              $ ./roast.sh --new
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
