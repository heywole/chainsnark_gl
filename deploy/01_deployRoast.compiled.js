import { deployContract } from "genlayer/deploy";
async function main() {
  const contract = await deployContract({
    contractPath: "contracts/chainsnark_roast.py",
    args: [
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjVmMjZlYzM4LWNjMTYtNDU4Yy1iNGEyLTE2ODM1YjA2MTFlOCIsIm9yZ0lkIjoiNTEzMzQ1IiwidXNlcklkIjoiNTI4MjUzIiwidHlwZUlkIjoiZDEzYzY2NmMtNzJhNC00MWEwLTkxNzQtNTg3OWJhNjU2MTI0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Nzc0NTcxMzcsImV4cCI6NDkzMzIxNzEzN30.GTI2S8CRDuJQTOVgxzPvfGloqwP0xPDm2e6gDm3qpgU",
      "12cdf38f-06c7-4d9c-80e9-c4ab5ef6ac8b",
      "T1iXtX58ACglgW2Sv51mcYaNAJ7XHd"
    ]
  });
  console.log("Roast contract deployed at:", contract.address);
}
main();
