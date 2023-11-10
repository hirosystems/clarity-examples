import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { tx } from "@hirosystems/clarinet-sdk";

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "stxswap_v10";
const preimageHash =
  "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a";
const preimage = "0x01";
const amount = 1000;
const timelock = 5;

describe("stxswap_v10 contract tests", () => {
  it("ensures that user can lock and claim stx", async () => {
    // Lock STX
    const lockResult = await simnet.mineBlock([
      tx.callPublicFn(
        contractName,
        "lockStx",
        [
          preimageHash,
          Cl.uint(amount),
          Cl.uint(timelock),
          Cl.standardPrincipal(wallet2),
        ],
        wallet1
      ),
    ]);

    expect(lockResult[0].result).toBeOk(Cl.bool(true));

    // Claim STX
    const claimResult = await simnet.mineBlock([
      tx.callPublicFn(
        contractName,
        "claimStx",
        [Cl.buffer(preimage), Cl.uint(amount)],
        wallet2
      ),
    ]);

    expect(claimResult[0].result).toBeOk(Cl.bool(true));
  });

  it("ensures that user can lock and refund stx", async () => {
    // Lock STX
    await simnet.mineBlock([
      tx.callPublicFn(
        contractName,
        "lockStx",
        [
          Cl.buffer(preimageHash),
          Cl.uint(amount),
          Cl.uint(timelock),
          Cl.standardPrincipal(wallet2),
        ],
        wallet1
      ),
    ]);

    // Mine empty blocks until timelock
    await simnet.mineEmptyBlock(timelock + 1);

    // Refund STX
    const refundResult = await simnet.mineBlock([
      tx.callPublicFn(
        contractName,
        "refundStx",
        [Cl.buffer(preimageHash)],
        wallet1
      ),
    ]);

    expect(refundResult[0].result).toBeOk(Cl.bool(true));
  });
});
