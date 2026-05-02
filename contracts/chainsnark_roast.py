# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

class ChainSnarkRoast(gl.Contract):
    """
    ChainSnark - The Blockchain That Judges You
    Feature: THE ROAST
    Supports: EVM (Moralis) · Solana (Helius) · SUI (Blockberry)
    """

    roasts:         dict
    roast_count:    int
    MORALIS_KEY:    str
    HELIUS_KEY:     str
    BLOCKBERRY_KEY: str

    def __init__(self, moralis_key: str, helius_key: str, blockberry_key: str):
        self.roasts         = {}
        self.roast_count    = 0
        self.MORALIS_KEY    = moralis_key
        self.HELIUS_KEY     = helius_key
        self.BLOCKBERRY_KEY = blockberry_key

    @gl.public.view
    def get_roast(self, roast_id: str) -> str:
        return self.roasts.get(roast_id, "")

    @gl.public.view
    def get_total_roasts(self) -> int:
        return self.roast_count

    @gl.public.view
    def get_recent_roasts(self) -> str:
        keys = list(self.roasts.keys())[-10:]
        return json.dumps(keys)

    @gl.public.write
    def roast_wallet(self, address: str, chain_type: str) -> None:
        wallet_data = ""

        if chain_type == "solana":
            url = (
                f"https://api.helius.xyz/v0/addresses/{address}/transactions"
                f"?api-key={self.HELIUS_KEY}&limit=15"
            )
            result = gl.nondet.web.get_as_text(url)
            wallet_data = result[:3000] if result else "No Solana transactions found"

        elif chain_type == "sui":
            url = (
                f"https://api.blockberry.one/sui/v1/accounts/{address}/activities"
                f"?size=10&api_key={self.BLOCKBERRY_KEY}"
            )
            result = gl.nondet.web.get_as_text(url)
            wallet_data = result[:3000] if result else "No SUI transactions found"

        else:
            chains   = ["eth", "bsc", "polygon", "base", "arbitrum", "avalanche", "optimism"]
            all_data = []
            for chain in chains:
                url = (
                    f"https://deep-index.moralis.io/api/v2.2/{address}/transactions"
                    f"?chain={chain}&limit=5&order=DESC"
                    f"&X-API-Key={self.MORALIS_KEY}"
                )
                result = gl.nondet.web.get_as_text(url)
                if result and "result" in result:
                    all_data.append(f"[{chain.upper()}]: {result[:500]}")

            networth_url = (
                f"https://deep-index.moralis.io/api/v2.2/wallets/{address}/net-worth"
                f"?chains[0]=eth&chains[1]=bsc&chains[2]=polygon&chains[3]=base"
                f"&X-API-Key={self.MORALIS_KEY}"
            )
            networth = gl.nondet.web.get_as_text(networth_url)
            if networth:
                all_data.append(f"[NET WORTH]: {networth[:300]}")

            wallet_data = "\n".join(all_data[:6]) if all_data else "No EVM transactions found"

        short_addr  = address[:6] + "..." + address[-4:]
        chain_label = {
            "evm":    "EVM (ETH/BSC/Base/Polygon/Arbitrum/Avalanche/Optimism)",
            "solana": "Solana",
            "sui":    "SUI Network",
        }.get(chain_type, "EVM")

        prompt = f"""You are ChainSnark, a brutally honest and hilarious AI comedian that roasts crypto wallets.

Wallet: {short_addr} on {chain_label}
On-chain data:
{wallet_data}

Write a savage, specific roast of this wallet owner based on their actual data.
Maximum 4 sentences. End with one killer punchline people will screenshot.
No emojis in text. Be brutal and funny. Return ONLY the roast text."""

        def leader_fn():
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leaders_res) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False
            roast_text = str(leaders_res.calldata)
            return len(roast_text) > 20 and len(roast_text) < 2000

        roast_text = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        roast_id = f"{address[:8]}_{self.roast_count}"
        self.roasts[roast_id] = json.dumps({
            "address":  address,
            "chain":    chain_type,
            "roast":    str(roast_text),
            "roast_id": roast_id,
        })
        self.roast_count += 1
