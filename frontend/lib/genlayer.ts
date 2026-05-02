// GenLayer client configuration for Testnet Bradbury

export const GENLAYER_CONFIG = {
  rpc:          'https://rpc-bradbury.genlayer.com',
  chainId:      4221,
  chainRpc:     'https://rpc.testnet-chain.genlayer.com',
  explorer:     'https://explorer-bradbury.genlayer.com',
  chainExplorer:'https://explorer.testnet-chain.genlayer.com',
  currency:     'GEN',
  faucet:       'https://testnet-faucet.genlayer.foundation',
}

export const ROAST_CONTRACT  = process.env.NEXT_PUBLIC_ROAST_CONTRACT  as string
export const ORACLE_CONTRACT = process.env.NEXT_PUBLIC_ORACLE_CONTRACT as string

// Poll for transaction result on GenLayer
export async function pollForResult(
  txHash: string,
  maxAttempts = 30,
  intervalMs  = 4000
): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, intervalMs))
    try {
      const res = await fetch(`${GENLAYER_CONFIG.rpc}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method:  'eth_getTransactionReceipt',
          params:  [txHash],
          id:      1,
        }),
      })
      const data = await res.json()
      if (data.result && data.result.status === '0x1') {
        return data.result
      }
    } catch { /* keep polling */ }
  }
  throw new Error('Transaction timed out')
}

// Call a read method on a GenLayer contract
export async function readContract(
  contractAddress: string,
  method: string,
  args: any[] = []
): Promise<any> {
  const res = await fetch(`${GENLAYER_CONFIG.rpc}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method:  'gen_call',
      params:  [{ to: contractAddress, data: { method, args } }, 'latest'],
      id:      1,
    }),
  })
  const data = await res.json()
  return data.result
}
