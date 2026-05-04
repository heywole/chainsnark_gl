import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

export const genLayerBradbury = defineChain({
  id: 4221,
  name: 'GenLayer Bradbury',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet-chain.genlayer.com'] },
    public:  { http: ['https://rpc.testnet-chain.genlayer.com'] },
  },
  blockExplorers: {
    default: { name: 'GenLayer Explorer', url: 'https://explorer-bradbury.genlayer.com' },
  },
})

export const wagmiConfig = getDefaultConfig({
  appName:   'ChainSnark',
  projectId: 'chainsnark4221',
  chains:    [genLayerBradbury],
  ssr:       true,
})

export const ROAST_CONTRACT  = process.env.NEXT_PUBLIC_ROAST_CONTRACT  as `0x${string}`
export const ORACLE_CONTRACT = process.env.NEXT_PUBLIC_ORACLE_CONTRACT as `0x${string}`

// GenLayer RPC for reading
export const GL_RPC = 'https://rpc-bradbury.genlayer.com'
