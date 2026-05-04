'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWalletClient, usePublicClient, useChainId, useSwitchChain } from 'wagmi'
import ShareCard from '@/components/ShareCard'
import Thinking  from '@/components/Thinking'
import { ORACLE_CONTRACT, GL_RPC } from '@/lib/config'

type Stage = 'input' | 'loading' | 'result' | 'error'

const EXAMPLES = [
  'Should I quit my job and trade crypto full time?',
  'Will Bitcoin hit $200k this year?',
  'Is my business idea going to work?',
  'Should I sell my ETH now?',
  'Am I going to make it in crypto?',
  'Is my co-founder trustworthy?',
]

export default function OraclePage() {
  const [question, setQuestion] = useState('')
  const [stage,    setStage]    = useState<Stage>('input')
  const [result,   setResult]   = useState<any>(null)
  const [errMsg,   setErrMsg]   = useState('')

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isConnected  = !!walletClient
  const isWrongNetwork = chainId !== 4221
  const isValid = question.trim().length >= 10

  async function handleAsk() {
    if (!isValid || !walletClient) return
    if (isWrongNetwork) { try { switchChain({ chainId: 4221 }) } catch {}; return }

    setStage('loading')
    setErrMsg('')

    try {
      const calldata = JSON.stringify({ method: 'ask_oracle', args: [question.trim()] })
      const data = ('0x' + Buffer.from(calldata).toString('hex')) as `0x${string}`

      const txHash = await walletClient.sendTransaction({ chain: undefined,
        to:    ORACLE_CONTRACT,
        data,
        value: 0n,
      })

      console.log('TX sent:', txHash)

      let answer = ''
      for (let i = 0; i < 80; i++) {
        await new Promise(r => setTimeout(r, 5000))
        try {
          const receipt = await publicClient!.getTransactionReceipt({ hash: txHash })
          if (receipt?.status === 'success') {
            const res = await fetch(GL_RPC, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0', id: 1,
                method: 'gen_call',
                params: [{
                  to:   ORACLE_CONTRACT,
                  data: ('0x' + Buffer.from(JSON.stringify({ method: 'get_last_answer', args: [] })).toString('hex')),
                  type: 'read',
                }],
              }),
            })
            const d = await res.json()
            answer = d.result ?? ''
            break
          }
        } catch { /* keep polling */ }
      }

      if (!answer) answer = 'The oracle has spoken but the answer was lost. Try again!'

      setResult({ answer, txHash, question: question.trim(), explorer: `https://explorer-bradbury.genlayer.com/tx/${txHash}`, timestamp: new Date().toISOString() })
      setStage('result')

    } catch (err: any) {
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
          <Link href="/roast" style={{ fontSize: 10, color: 'var(--dimmer)', textDecoration: 'none' }}>$ ./roast.sh →</Link>
          <ConnectButton />
        </div>
      </nav>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ width: '100%', maxWidth: 560, marginBottom: 24 }} className="animate-slide-up">
          <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.15em', marginBottom: 6 }}>CHAINSNARK::MODULE — ORACLE_ENGINE v1.0</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span className="glow-cyan" style={{ color: 'var(--cyan)' }}>$</span>
            <span style={{ color: 'var(--white)', marginLeft: 8 }}>ask_oracle</span>
            <span style={{ color: 'var(--dimmer)' }}>(question)</span>
          </h1>
          <p style={{ fontSize: 11, color: 'var(--dimmer)', lineHeight: 1.7 }}>
            // Ask anything. GenLayer AI delivers a brutal honest verdict on-chain. Connect wallet to sign.
          </p>
        </div>

        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-fade-in">

            {!isConnected && (
              <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(255,179,0,0.06)', border: '1px solid rgba(255,179,0,0.25)', fontSize: 10, color: 'var(--amber)' }}>
                ⚠ Connect your wallet to sign the GenLayer transaction
              </div>
            )}
            {isConnected && !isWrongNetwork && (
              <div style={{ marginBottom: 12, padding: '8px 14px', background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.15)', fontSize: 10, color: 'var(--green)' }}>
                ✓ Wallet connected · GenLayer Bradbury · Ready
              </div>
            )}

            {/* Window chrome */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderBottom: 'none', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.1em' }}>oracle.sh — input</span>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.12em', marginBottom: 8 }}># EXAMPLE QUERIES:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {EXAMPLES.map(ex => (
                    <button key={ex} onClick={() => setQuestion(ex)}
                      style={{ fontSize: 9, padding: '3px 8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--dimmer)', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--cyan)'; (e.target as HTMLElement).style.color = 'var(--cyan)' }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--dimmer)' }}>
                      {ex.length > 38 ? ex.slice(0, 38) + '…' : ex}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.12em', marginBottom: 6 }}># QUERY_STRING (min 10 chars)</div>
                <div style={{ display: 'flex' }}>
                  <span style={{ padding: '10px 12px', background: 'rgba(0,229,255,0.04)', border: '1px solid var(--border2)', borderRight: 'none', fontSize: 12, color: 'var(--cyan)' }}>?_</span>
                  <textarea
                    placeholder="Ask the chain anything..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    rows={3}
                    className="term-textarea"
                    style={{ borderRadius: 0, borderColor: 'var(--border2)', color: 'var(--cyan)' }}
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: 9, color: question.length < 10 && question.length > 0 ? 'var(--red)' : 'var(--dimmer)', marginTop: 3 }}>
                  {question.length}/200{question.length < 10 && question.length > 0 ? ' — TOO SHORT' : ''}
                </div>
              </div>

              {errMsg && (
                <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(255,60,0,0.06)', border: '1px solid rgba(255,60,0,0.2)', fontSize: 10, color: 'var(--red)' }}>
                  ✗ {errMsg}
                </div>
              )}

              <button onClick={handleAsk} disabled={!isValid} className="btn-exec"
                style={{ width: '100%', fontSize: 11, padding: '12px', background: 'var(--cyan)', color: '#000' }}>
                {!isConnected ? '$ CONNECT_WALLET --then-ask' :
                 `$ EXECUTE ORACLE_ENGINE --query "${question.slice(0,20)}${question.length > 20 ? '...' : ''}"`}
              </button>

              <div style={{ marginTop: 8, fontSize: 9, color: 'var(--dimmer)', letterSpacing: '0.08em' }}>
                // REQUIRES METAMASK + GEN TOKENS · FREE AT testnet-faucet.genlayer.foundation
              </div>
            </div>
          </div>
        )}

        {stage === 'loading' && <div style={{ width: '100%', maxWidth: 560 }}><Thinking type="oracle" /></div>}

        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 560 }} className="animate-slide-up">
            <div style={{ marginBottom: 10, fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block' }} />
              ORACLE HAS SPOKEN · STORED ON GENLAYER CHAIN
            </div>
            <ShareCard type="oracle" content={result.answer} subject={result.question} timestamp={result.timestamp} />
            {result.explorer && (
              <a href={result.explorer} target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 9, color: 'var(--dimmer)', textDecoration: 'none', letterSpacing: '0.1em' }}>
                VIEW TX ON GENLAYER EXPLORER →
              </a>
            )}
            <button onClick={() => { setQuestion(''); setStage('input'); setResult(null) }}
              className="btn-ghost" style={{ width: '100%', marginTop: 10, fontSize: 10 }}>
              $ ./oracle.sh --new
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
