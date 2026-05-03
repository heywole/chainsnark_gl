export const maxDuration = 300 // 5 minutes
import { NextRequest, NextResponse } from 'next/server'

const CONTRACT = process.env.NEXT_PUBLIC_ROAST_CONTRACT!
const KEY      = process.env.DEPLOYER_PRIVATE_KEY!

function detectChain(a: string) {
  if (a.length >= 32 && a.length <= 44 && !a.startsWith('0x')) return 'solana'
  if (a.startsWith('0x') && a.length === 66) return 'sui'
  return 'evm'
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()
    if (!address?.trim()) return NextResponse.json({ error: 'No address provided' }, { status: 400 })

    const chain = detectChain(address.trim())
    const { createClient, createAccount } = await import('genlayer-js')
    const { testnetBradbury } = await import('genlayer-js/chains')
    const { TransactionStatus } = await import('genlayer-js/types')

    const account = createAccount(KEY as `0x${string}`)
    const client  = createClient({ chain: testnetBradbury, account })

    const txHash = await client.writeContract({
      address:      CONTRACT as `0x${string}`,
      functionName: 'roast_wallet',
      args:         [address.trim(), chain],
      value:        0n,
    })

    console.log('TX sent:', txHash)

    // Wait using SDK but catch the error and still try to read
    try {
      await client.waitForTransactionReceipt({
        hash:     txHash,
        status:   TransactionStatus.FINALIZED,
        retries:  80,
        interval: 5000,
      })
    } catch (e) {
      console.log('waitForReceipt error (ignoring):', e)
      // Wait extra time then try to read anyway
      await new Promise(r => setTimeout(r, 30000))
    }

    // Read result using SDK
    const roast = await client.readContract({
      address:      CONTRACT as `0x${string}`,
      functionName: 'get_last_roast',
      args:         [],
    })

    console.log('Roast result:', roast)

    return NextResponse.json({
      roast:     String(roast),
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