'use client'
import { useState } from 'react'
import Link from 'next/link'
import ShareCard from '@/components/ShareCard'
import Thinking from '@/components/Thinking'

const ROAST_CONTRACT = process.env.NEXT_PUBLIC_ROAST_CONTRACT!
const GL_RPC = 'https://rpc-bradbury.genlayer.com'

type Stage = 'input' | 'loading' | 'result' | 'error'

function validateAddress(addr: string): { valid: boolean; chain: string; error: string } {
  const a = addr.trim()
  if (!a) return { valid: false, chain: '', error: 'ERR: address cannot be empty' }
  if (a.startsWith('0x')) {
    if (a.length === 42) return { valid: true, chain: 'evm', error: '' }
    if (a.length === 66) return { valid: true, chain: 'sui', error: '' }
    return { valid: false, chain: '', error: `ERR: invalid length (got ${a.length}, EVM=42, SUI=66)` }
  }
  if (a.length >= 32 && a.length <= 44) return { valid: true, chain: 'solana', error: '' }
  return { valid: false, chain: '', error: 'ERR: unrecognized format' }
}

export default function RoastPage() {
  const [address, setAddress] = useState('')
  const [stage,   setStage]   = useState<Stage>('input')
  const [result,  setResult]  = useState<any>(null)
  const [errMsg,  setErrMsg]  = useState('')

  const validation = validateAddress(address)

  async function handleRoast() {
    if (!validation.valid) return
    setStage('loading')
    setErrMsg('')
    try {
      const { createClient, createAccount } = await import('genlayer-js')
      const { testnetBradbury } = await import('genlayer-js/chains')
      const { TransactionStatus } = await import('genlayer-js/types')

      const account = createAccount()
      const client  = createClient({ chain: testnetBradbury, account })

      const txHash = await client.writeContract({
        address:      ROAST_CONTRACT as `0x${string}`,
        functionName: 'roast_wallet',
        args:         [address.trim(), validation.chain],
        value:        0n,
      })

      try {
        await client.waitForTransactionReceipt({
          hash: txHash, status: TransactionStatus.FINALIZED, retries: 80, interval: 5000
        })
      } catch { await new Promise(r => setTimeout(r, 30000)) }

      const roast = await client.readContract({
        address: ROAST_CONTRACT as `0x${string}`,
        functionName: 'get_last_roast',
        args: [],
      })

      setResult({ roast: String(roast), txHash, chain: validation.chain, address: address.trim(), explorer: `https://explorer-bradbury.genlayer.com/tx/${txHash}`, timestamp: new Date().toISOString() })
      setStage('result')
    } catch (err: any) {
      setErrMsg(err?.message ?? 'ERR: something went wrong')
      setStage('error')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--green)', fontSize: 11, opacity: 0.5 }}>~/</span>
          <span className="animate-flicker" style={{ color: 'var(--green)', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em' }}>CHAINSNARK</span>
        </Link>
        <Link href="/oracle" style={{ fontSize: 10, color: 'var(--dimmer)', textDecoration: 'none' }}>$ ./oracle.sh →</Link>
      </nav>
      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560, marginBottom: 24 }}>
          <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.15em', marginBottom: 6 }}>CHAINSNARK::MODULE — ROAST_ENGINE v1.0</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span className="glow-green" style={{ color: 'var(--green)' }}>$</span>
            <span style={{ color: 'var(--white)', marginLeft: 8 }}>roast_wallet</span>
            <span style={{ color: 'var(--dimmer)' }}>(address)</span>
          </h1>
          <p style={{ fontSize: 11, color: 'var(--dimmer)', lineHeight: 1.7 }}>// Submit any EVM, Solana, or SUI wallet. GenLayer AI roasts every bad decision on-chain. No wallet needed.</p>
        </div>
        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--dimmer)' }}>roast.sh — input</span>
              {validation.valid && <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--green)' }}>[{validation.chain.toUpperCase()}] ✓</span>}
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>
              <div style={{ marginBottom: 8, fontSize: 9, color: 'var(--dimmer)' }}># WALLET_ADDRESS — EVM (0x+42) · SOLANA (32-44) · SUI (0x+66)</div>
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <span style={{ padding: '10px 12px', background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border2)', borderRight: 'none', fontSize: 12, color: 'var(--green)' }}>&gt;_</span>
                <input type="text" placeholder="0x... or Solana address" value={address}
                  onChange={e => setAddress(e.target.value.trim())}
                  onKeyDown={e => e.key === 'Enter' && validation.valid && handleRoast()}
                  className="term-input" style={{ borderRadius: 0 }} />
              </div>
              {address && !validation.valid && <div style={{ marginBottom: 8, fontSize: 10, color: 'var(--red)' }}>✗ {validation.error}</div>}
              {validation.valid && <div style={{ marginBottom: 8, fontSize: 10, color: 'var(--green)' }}>✓ valid {validation.chain.toUpperCase()} address</div>}
              {errMsg && <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(255,60,0,0.06)', border: '1px solid rgba(255,60,0,0.2)', fontSize: 10, color: 'var(--red)' }}>✗ {errMsg}</div>}
              <button onClick={handleRoast} disabled={!validation.valid} className="btn-exec" style={{ width: '100%', fontSize: 11, padding: '12px' }}>
                $ EXECUTE ROAST_ENGINE --target {address ? address.slice(0,8)+'...' : '<address>'}
              </button>
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['ETH','BSC','Base','Polygon','Arbitrum','Avalanche','Optimism','Solana','SUI'].map(c => (
                  <span key={c} style={{ fontSize: 9, padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--dimmer)' }}>{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 9, color: 'var(--dimmer)' }}>// FREE · NO WALLET NEEDED · AI RUNS ON GENLAYER · 2-5 MIN</div>
            </div>
          </div>
        )}
        {stage === 'loading' && <div style={{ width: '100%', maxWidth: 560 }}><Thinking type="roast" /></div>}
        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ marginBottom: 10, fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              ROAST DELIVERED · STORED ON GENLAYER CHAIN
            </div>
            <ShareCard type="roast" content={result.roast} subject={result.address} chain={result.chain} timestamp={result.timestamp} />
            {result.explorer && <a href={result.explorer} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 9, color: 'var(--dimmer)', textDecoration: 'none' }}>VIEW TX ON GENLAYER EXPLORER →</a>}
            <button onClick={() => { setAddress(''); setStage('input'); setResult(null) }} className="btn-ghost" style={{ width: '100%', marginTop: 10, fontSize: 10 }}>$ ./roast.sh --new</button>
          </div>
        )}
      </div>
    </main>
  )
}