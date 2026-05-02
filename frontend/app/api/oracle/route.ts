import { NextRequest, NextResponse } from 'next/server'

const CONTRACT = process.env.NEXT_PUBLIC_ORACLE_CONTRACT!
const KEY      = process.env.DEPLOYER_PRIVATE_KEY!

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    if (!question?.trim()) return NextResponse.json({ error: 'No question provided' }, { status: 400 })

    const { createClient, createAccount } = await import('genlayer-js')
    const { testnetBradbury } = await import('genlayer-js/chains')
    const { TransactionStatus } = await import('genlayer-js/types')

    const account = createAccount(KEY as `0x${string}`)
    const client  = createClient({ chain: testnetBradbury, account })

    const txHash = await client.writeContract({
      address:      CONTRACT as `0x${string}`,
      functionName: 'ask_oracle',
      args:         [question.trim()],
      value:        0n,
    })

    console.log('TX sent:', txHash)

    try {
      await client.waitForTransactionReceipt({
        hash:     txHash,
        status:   TransactionStatus.FINALIZED,
        retries:  80,
        interval: 5000,
      })
    } catch (e) {
      console.log('waitForReceipt error (ignoring):', e)
      await new Promise(r => setTimeout(r, 30000))
    }

    const answer = await client.readContract({
      address:      CONTRACT as `0x${string}`,
      functionName: 'get_last_answer',
      args:         [],
    })

    console.log('Answer result:', answer)

    return NextResponse.json({
      answer:    String(answer),
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