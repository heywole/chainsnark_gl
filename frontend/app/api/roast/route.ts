import { NextRequest, NextResponse } from 'next/server'

const GENLAYER_RPC   = 'https://rpc-bradbury.genlayer.com'
const ROAST_CONTRACT = process.env.NEXT_PUBLIC_ROAST_CONTRACT!
const PRIVATE_KEY    = process.env.DEPLOYER_PRIVATE_KEY!

function detectChain(address: string): 'evm' | 'solana' | 'sui' {
  if (address.length >= 32 && address.length <= 44 && !address.startsWith('0x')) return 'solana'
  if (address.startsWith('0x') && address.length === 66) return 'sui'
  return 'evm'
}

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
  // GenLayer uses gen_sendTransaction with encoded calldata
  const result = await rpc('gen_sendTransaction', [{
    from:  undefined,
    to:    ROAST_CONTRACT,
    value: '0x0',
    data:  JSON.stringify({ method: contractMethod, args }),
    // Pass private key for server-side signing
    private_key: PRIVATE_KEY,
  }])
  return result
}

async function readContract(contractMethod: string, args: any[] = []) {
  const result = await rpc('gen_call', [{
    to:   ROAST_CONTRACT,
    data: JSON.stringify({ method: contractMethod, args }),
  }, 'latest'])
  return result
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
    const { address } = await req.json()
    if (!address?.trim()) {
      return NextResponse.json({ error: 'No address provided' }, { status: 400 })
    }

    const chain = detectChain(address.trim())

    // Send tx to GenLayer contract
    let txHash: string
    try {
      txHash = await sendTx('roast_wallet', [address.trim(), chain])
    } catch (e: any) {
      console.error('Send tx error:', e)
      return NextResponse.json({ error: `GenLayer tx failed: ${e.message}` }, { status: 500 })
    }

    if (!txHash) {
      return NextResponse.json({ error: 'No transaction hash returned' }, { status: 500 })
    }

    // Wait for consensus
    await waitForTx(txHash)

    // Read the result
    const roast = await readContract('get_last_roast')

    return NextResponse.json({
      roast:     roast ?? 'The chain has spoken but the roast was lost in consensus.',
      txHash,
      chain,
      address:   address.trim(),
      explorer:  `https://explorer-bradbury.genlayer.com/tx/${txHash}`,
      timestamp: new Date().toISOString(),
    })

  } catch (err: any) {
    console.error('Roast error:', err)
    return NextResponse.json({ error: err.message ?? 'Something went wrong' }, { status: 500 })
  }
}
