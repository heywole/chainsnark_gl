import { NextRequest, NextResponse } from 'next/server'

const GENLAYER_RPC    = 'https://rpc-bradbury.genlayer.com'
const ORACLE_CONTRACT = process.env.NEXT_PUBLIC_ORACLE_CONTRACT!
const PRIVATE_KEY     = process.env.DEPLOYER_PRIVATE_KEY!

async function rpc(method: string, params: any[]) {
  const res = await fetch(GENLAYER_RPC, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.result
}

async function sendTx(contractMethod: string, args: any[]) {
  return await rpc('gen_sendTransaction', [{
    from:  undefined,
    to:    ORACLE_CONTRACT,
    value: '0x0',
    data:  JSON.stringify({ method: contractMethod, args }),
    private_key: PRIVATE_KEY,
  }])
}

async function readContract(contractMethod: string, args: any[] = []) {
  return await rpc('gen_call', [{
    to:   ORACLE_CONTRACT,
    data: JSON.stringify({ method: contractMethod, args }),
  }, 'latest'])
}

async function waitForTx(txHash: string, maxTries = 60) {
  for (let i = 0; i < maxTries; i++) {
    await new Promise(r => setTimeout(r, 5000))
    try {
      const receipt = await rpc('eth_getTransactionReceipt', [txHash])
      if (receipt && receipt.status === '0x1') return receipt
    } catch { /* keep polling */ }
  }
  throw new Error('Transaction timed out after 5 minutes')
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    if (!question?.trim()) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    let txHash: string
    try {
      txHash = await sendTx('ask_oracle', [question.trim()])
    } catch (e: any) {
      console.error('Send tx error:', e)
      return NextResponse.json({ error: `GenLayer tx failed: ${e.message}` }, { status: 500 })
    }

    if (!txHash) {
      return NextResponse.json({ error: 'No transaction hash returned' }, { status: 500 })
    }

    await waitForTx(txHash)

    const answer = await readContract('get_last_answer')

    return NextResponse.json({
      answer:    answer ?? 'The oracle has spoken but the answer was lost.',
      txHash,
      question:  question.trim(),
      explorer:  `https://explorer-bradbury.genlayer.com/tx/${txHash}`,
      timestamp: new Date().toISOString(),
    })

  } catch (err: any) {
    console.error('Oracle error:', err)
    return NextResponse.json({ error: err.message ?? 'Something went wrong' }, { status: 500 })
  }
}
