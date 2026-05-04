'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWalletClient, usePublicClient, useChainId, useSwitchChain } from 'wagmi'
import ShareCard from '@/components/ShareCard'
import Thinking  from '@/components/Thinking'
import { ROAST_CONTRACT, GL_RPC } from '@/lib/config'

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
  return { valid: false, chain: '', error: 'ERR: unrecognized format (EVM=0x+42chars, Solana=32-44chars, SUI=0x+66chars)' }
}

export default function RoastPage() {
  const [address, setAddress] = useState('')
  const [stage,   setStage]   = useState<Stage>('input')
  const [result,  setResult]  = useState<any>(null)
  const [errMsg,  setErrMsg]  = useState('')

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const validation = validateAddress(address)
  const isConnected = !!walletClient
  const isWrongNetwork = chainId !== 4221

  async function handleRoast() {
    if (!validation.valid) return
    if (!walletClient) { setErrMsg('ERR: connect your wallet first'); return }

    if (isWrongNetwork) {
      try { switchChain({ chainId: 4221 }) } catch {}
      return
    }

    setStage('loading')
    setErrMsg('')

    try {
      const chain = validation.chain

      // Encode calldata as UTF-8 hex — GenLayer format
      const calldata = JSON.stringify({ method: 'roast_wallet', args: [address.trim(), chain] })
      const data = ('0x' + Buffer.from(calldata).toString('hex')) as `0x${string}`

      // Send tx signed by user's MetaMask
      const txHash = await walletClient.sendTransaction({
        to:    ROAST_CONTRACT,
        data,
        value: 0n,
      })

      console.log('TX sent:', txHash)

      // Poll for receipt
      let roast = ''
      for (let i = 0; i < 80; i++) {
        await new Promise(r => setTimeout(r, 5000))
        try {
          const receipt = await publicClient!.getTransactionReceipt({ hash: txHash })
          if (receipt?.status === 'success') {
            // Read result via GenLayer RPC
            const res = await fetch(GL_RPC, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0', id: 1,
                method: 'gen_call',
                params: [{
                  to:   ROAST_CONTRACT,
                  data: ('0x' + Buffer.from(JSON.stringify({ method: 'get_last_roast', args: [] })).toString('hex')),
                  type: 'read',
                }],
              }),
            })
            const d = await res.json()
            roast = d.result ?? ''
            break
          }
        } catch { /* keep polling */ }
      }

      if (!roast) roast = 'The chain has spoken but the roast was lost. Try again!'

      setResult({ roast, txHash, chain, address: address.trim(), explorer: `https://explorer-bradbury.genlayer.com/tx/${txHash}`, timestamp: new Date().toISOString() })
      setStage('result')

    } catch (err: any) {
      console.error(err)
      setErrMsg(err?.shortMessage ?? err?.message ?? 'ERR: transaction failed')
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/oracle" style={{ fontSize: 10, color: 'var(--dimmer)', textDecoration: 'none' }}>$ ./oracle.sh →</Link>
          <ConnectButton />
        </div>
      </nav>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ width: '100%', maxWidth: 560, marginBottom: 24 }} className="animate-slide-up">
          <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.15em', marginBottom: 6 }}>CHAINSNARK::MODULE — ROAST_ENGINE v1.0</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span className="glow-green" style={{ color: 'var(--green)' }}>$</span>
            <span style={{ color: 'var(--white)', marginLeft: 8 }}>roast_wallet</span>
            <span style={{ color: 'var(--dimmer)' }}>(address)</span>
          </h1>
          <p style={{ fontSize: 11, color: 'var(--dimmer)', lineHeight: 1.7 }}>
            // Submit any EVM, Solana, or SUI wallet. GenLayer AI roasts every bad decision on-chain. Connect wallet to sign the transaction.
          </p>
        </div>

        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-fade-in">

            {/* Wallet status */}
            {!isConnected && (
              <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(255,179,0,0.06)', border: '1px solid rgba(255,179,0,0.25)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.06em' }}>
                ⚠ Connect your wallet to sign the GenLayer transaction. Get free GEN at testnet-faucet.genlayer.foundation
              </div>
            )}
            {isConnected && isWrongNetwork && (
              <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(255,60,0,0.06)', border: '1px solid rgba(255,60,0,0.25)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.06em' }}>
                ✗ Wrong network. Click Roast to auto-switch to GenLayer Bradbury (Chain 4221)
              </div>
            )}
            {isConnected && !isWrongNetwork && (
              <div style={{ marginBottom: 12, padding: '8px 14px', background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.06em' }}>
                ✓ Wallet connected · GenLayer Bradbury · Ready
              </div>
            )}

            {/* Window chrome */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>roast.sh — input</span>
              {validation.valid && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--green)' }}>
                  [{validation.chain.toUpperCase()}] DETECTED ✓
                </span>
              )}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>
              <div style={{ marginBottom: 10, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.12em' }}>
                # WALLET_ADDRESS — EVM (0x+42) · SOLANA (32-44) · SUI (0x+66)
              </div>
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <span style={{ padding: '10px 12px', background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border2)', borderRight: 'none', fontSize: 12, color: 'var(--green)' }}>&gt;_</span>
                <input
                  type="text"
                  placeholder="0x... or Solana address"
                  value={address}
                  onChange={e => setAddress(e.target.value.trim())}
                  onKeyDown={e => e.key === 'Enter' && validation.valid && handleRoast()}
                  className="term-input"
                  style={{ borderRadius: 0 }}
                />
              </div>

              {address && !validation.valid && (
                <div style={{ marginBottom: 8, fontSize: 10, color: 'var(--red)' }}>✗ {validation.error}</div>
              )}
              {validation.valid && (
                <div style={{ marginBottom: 8, fontSize: 10, color: 'var(--green)' }}>✓ valid {validation.chain.toUpperCase()} address</div>
              )}

              {errMsg && (
                <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(255,60,0,0.06)', border: '1px solid rgba(255,60,0,0.2)', fontSize: 10, color: 'var(--red)' }}>
                  ✗ {errMsg}
                </div>
              )}

              <button onClick={handleRoast} disabled={!validation.valid} className="btn-exec" style={{ width: '100%', fontSize: 11, padding: '12px' }}>
                {!isConnected ? '$ CONNECT_WALLET --then-roast' :
                 isWrongNetwork ? '$ SWITCH_NETWORK --chain=bradbury' :
                 `$ EXECUTE ROAST_ENGINE --target ${address ? address.slice(0,8)+'...' : '<address>'}`}
              </button>

              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['ETH','BSC','Base','Polygon','Arbitrum','Avalanche','Optimism','Solana','SUI'].map(c => (
                  <span key={c} style={{ fontSize: 9, padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--dimmer)' }}>{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.08em' }}>
                // REQUIRES METAMASK + GEN TOKENS · GET FREE AT testnet-faucet.genlayer.foundation
              </div>
            </div>
          </div>
        )}

        {stage === 'loading' && <div style={{ width: '100%', maxWidth: 560 }}><Thinking type="roast" /></div>}

        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-slide-up">
            <div style={{ marginBottom: 10, fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
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
