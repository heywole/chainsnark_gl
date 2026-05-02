import { deployContract } from "genlayer/deploy";

async function main() {
  const contract = await deployContract({
    contractPath: "contracts/chainsnark_oracle.py",
    args: [],
  });
  console.log("Oracle contract deployed at:", contract.address);
}

main();
