'use client'
import { useState } from 'react'
import Link from 'next/link'
import ShareCard from '@/components/ShareCard'
import Thinking  from '@/components/Thinking'

type Stage = 'input' | 'loading' | 'result' | 'error'

const EXAMPLES = [
  'Should I quit my job and trade crypto full time?',
  'Will Bitcoin hit $200k this year?',
  'Is my business idea going to work?',
  'Should I sell my ETH now?',
  'Am I going to make it in crypto?',
  'Is my co-founder trustworthy?',
  'Will I regret this decision in 5 years?',
  'Should I invest in this altcoin?',
]

export default function OraclePage() {
  const [question, setQuestion] = useState('')
  const [stage,    setStage]    = useState<Stage>('input')
  const [result,   setResult]   = useState<any>(null)
  const [errMsg,   setErrMsg]   = useState('')

  async function handleAsk() {
    if (!question.trim()) return
    setStage('loading')
    setErrMsg('')
    try {
      const res  = await fetch('/api/oracle', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question: question.trim() }),
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

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #1e1e1e' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="animate-flicker glow-red" style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.15em', color: '#ff3c00' }}>CHAINSNARK</div>
        </Link>
        <Link href="/roast" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>💬 Try The Roast →</Link>
      </nav>

      <div style={{ flex: 1, padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-slide-up">
          <div style={{ fontSize: 52, marginBottom: 14 }}>🎱</div>
          <h1 className="glow-green" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 12vw, 90px)', color: '#00ff94', letterSpacing: '0.08em', marginBottom: 10 }}>THE ORACLE</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>
            Ask anything. GenLayer's AI validators reach consensus on your question and deliver a brutal honest verdict. Stored permanently on-chain.
          </p>
        </div>

        {(stage === 'input' || stage === 'error') && (
          <div style={{ width: '100%', maxWidth: 520 }} className="animate-fade-in">
            <div className="card" style={{ padding: 28 }}>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Try asking:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EXAMPLES.map(ex => (
                    <button key={ex} onClick={() => setQuestion(ex)}
                      style={{ fontSize: 10, padding: '4px 10px', border: '1px solid #1e1e1e', background: 'transparent',
                        color: 'rgba(255,255,255,0.32)', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#00ff94'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#1e1e1e'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.32)' }}>
                      {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Your Question
              </label>
              <textarea
                placeholder="Ask the chain anything..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={3}
                className="input-field"
                style={{ resize: 'none', borderRadius: 0, marginBottom: 4 }}
              />
              <div style={{ textAlign: 'right', fontSize: 10, color: 'rgba(255,255,255,0.18)', marginBottom: 12 }}>
                {question.length}/200
              </div>

              {errMsg && (
                <div style={{ padding: '10px 12px', background: 'rgba(255,60,0,0.08)', border: '1px solid rgba(255,60,0,0.25)', color: '#ff3c00', fontSize: 12, marginBottom: 12 }}>
                  ⚠ {errMsg}
                </div>
              )}

              <button onClick={handleAsk} disabled={!question.trim()} className="btn-green"
                style={{ width: '100%', padding: '16px', fontSize: 20 }}>
                🎱 ASK THE CHAIN
              </button>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 12, letterSpacing: '0.08em' }}>
                Free · AI consensus on GenLayer · Takes 30–90 seconds
              </p>
            </div>
          </div>
        )}

        {stage === 'loading' && <Thinking type="oracle" />}

        {stage === 'result' && result && (
          <div style={{ width: '100%', maxWidth: 520 }} className="animate-slide-up">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', border: '1px solid rgba(0,255,148,0.35)', fontSize: 10, color: '#00ff94', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff94', display: 'inline-block' }} />
                Oracle Has Spoken · GenLayer AI Consensus
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
            <ShareCard type="oracle" content={result.answer} subject={result.question} timestamp={result.timestamp} />
            <button onClick={() => { setQuestion(''); setStage('input'); setResult(null) }}
              className="btn-ghost" style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 12 }}>
              🔁 Ask Another Question
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
