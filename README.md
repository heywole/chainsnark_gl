# ⛓ ChainSnark — GenLayer Edition
### The Blockchain That Judges You

Built on **GenLayer Testnet Bradbury** using Python Intelligent Contracts.
Supports EVM · Solana · SUI wallets. No wallet connection needed for users.

---

## 🚀 STEP BY STEP — Do This In Order

---

### STEP 1 — Get Free GEN Tokens (if not done)
Go to: https://testnet-faucet.genlayer.foundation
Connect wallet → claim 100 GEN free → done

---

### STEP 2 — Install GenLayer CLI
```bash
pip install genlayer
```

---

### STEP 3 — Configure Your Wallet
```bash
genlayer config set private-key YOUR_PRIVATE_KEY
genlayer network testnet-bradbury
```
Replace YOUR_PRIVATE_KEY with your wallet private key
(Use a fresh testnet wallet — not your main wallet)

---

### STEP 4 — Deploy The Roast Contract
```bash
genlayer deploy --contract contracts/chainsnark_roast.py \
  --args "MORALIS_KEY" "HELIUS_KEY" "BLOCKBERRY_KEY"
```

Replace with your actual keys:
- MORALIS_KEY  = your Moralis JWT key
- HELIUS_KEY   = 12cdf38f-06c7-4d9c-80e9-c4ab5ef6ac8b
- BLOCKBERRY_KEY = T1iXtX58ACglgW2Sv51mcYaNAJ7XHd

📋 COPY THE CONTRACT ADDRESS IT PRINTS — you need it next

---

### STEP 5 — Deploy The Oracle Contract
```bash
genlayer deploy --contract contracts/chainsnark_oracle.py
```

📋 COPY THIS CONTRACT ADDRESS TOO

---

### STEP 6 — Update .env.local
Open frontend/.env.local and fill in:
```
NEXT_PUBLIC_ROAST_CONTRACT=0x...   ← paste roast address from Step 4
NEXT_PUBLIC_ORACLE_CONTRACT=0x...  ← paste oracle address from Step 5
DEPLOYER_PRIVATE_KEY=0x...         ← your wallet private key
```
Everything else is already filled in.

---

### STEP 7 — Install Frontend
```bash
cd frontend
npm install
```

---

### STEP 8 — Test Locally First
```bash
npm run dev
```
Open http://localhost:3000
Try a roast and oracle — make sure they work.

---

### STEP 9 — Deploy To Vercel
```bash
npx vercel
```

When Vercel asks for environment variables, add ALL of these:
- NEXT_PUBLIC_ROAST_CONTRACT
- NEXT_PUBLIC_ORACLE_CONTRACT
- NEXT_PUBLIC_GENLAYER_RPC
- DEPLOYER_PRIVATE_KEY
- MORALIS_API_KEY
- HELIUS_API_KEY
- BLOCKBERRY_API_KEY

OR: Push to GitHub → import on vercel.com → add env vars in dashboard

---

### STEP 10 — Share It!
Post your site on X tagging @GenLayer and @ritualnet
Show your contract on: https://explorer-bradbury.genlayer.com

---

## 🔗 GenLayer Network Info

| Property | Value |
|---|---|
| Network | Testnet Bradbury |
| Chain ID | 4221 |
| RPC | https://rpc-bradbury.genlayer.com |
| Explorer | https://explorer-bradbury.genlayer.com |
| Faucet | https://testnet-faucet.genlayer.foundation |
| Currency | GEN (100 free per day) |

---

## 📁 Project Structure

```
chainsnark-gl/
├── contracts/
│   ├── chainsnark_roast.py    ← Python AI Contract (fetches all chains + roasts)
│   └── chainsnark_oracle.py   ← Python AI Contract (answers any question)
├── README.md                  ← You are here
└── frontend/
    ├── .env.local             ← Your API keys (already filled — add contract addresses)
    ├── app/
    │   ├── page.tsx           ← Landing page
    │   ├── roast/page.tsx     ← Roast feature
    │   ├── oracle/page.tsx    ← Oracle feature
    │   └── api/
    │       ├── roast/route.ts    ← Sends tx to GenLayer + polls result
    │       └── oracle/route.ts   ← Sends tx to GenLayer + polls result
    ├── components/
    │   ├── ShareCard.tsx      ← Beautiful X share card
    │   └── Thinking.tsx       ← Loading animation
    └── lib/
        └── genlayer.ts        ← GenLayer network config
```

---

## 🌍 Chains Supported

| Chain | API Used |
|---|---|
| ETH, BSC, Base, Polygon, Arbitrum, Avalanche, Optimism | Moralis |
| Solana | Helius |
| SUI | Blockberry |

---

## ⚠️ Security Reminders

- NEVER push .env.local to GitHub (it is gitignored)
- Use a FRESH testnet wallet — not your main wallet
- DEPLOYER_PRIVATE_KEY is server-side only — never exposed to users
- Vercel encrypts all environment variables — hackers cannot see them

---

Built with love on GenLayer · ChainSnark 🔥
