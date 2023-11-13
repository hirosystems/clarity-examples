import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "stxswap_v10";
const preimageHash =
  "4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a";
const preimage = "01";
const amount = 1000;
const timelock = 5;

describe("stxswap_v10 contract tests", () => {
  it("ensures that user can lock and claim stx", () => {
    // Lock STX
    const lockResult = simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount),
        Cl.uint(timelock),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    expect(lockResult.result).toBeOk(Cl.bool(true));

    // Claim STX
    const claimResult = simnet.callPublicFn(
      contractName,
      "claimStx",
      [Cl.bufferFromHex(preimage), Cl.uint(amount)],
      wallet2
    );

    expect(claimResult.result).toBeOk(Cl.bool(true));
  });

  it("allows user to lock and refund stx", () => {
    const lockStxResponse = simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount),
        Cl.uint(5),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );
    expect(lockStxResponse.result).toBeOk(Cl.bool(true));

    // Verify the swap before the refund
    const swap = simnet.callReadOnlyFn(
      contractName,
      "getSwap",
      [Cl.bufferFromHex(preimageHash)],
      wallet1
    );
    expect(swap.result).toBeSome(
      Cl.tuple({
        amount: Cl.uint(amount),
        timelock: Cl.uint(5),
        claimPrincipal: Cl.standardPrincipal(wallet2),
        initiator: Cl.standardPrincipal(wallet1),
      })
    );

    simnet.mineEmptyBlocks(6);

    const refundStxResponse = simnet.callPublicFn(
      contractName,
      "refundStx",
      [Cl.bufferFromHex(preimageHash)],
      wallet1
    );
    expect(refundStxResponse.result).toBeOk(Cl.bool(true));
  });

  it("ensures user can't claim funds that are locked for someone else", () => {
    // Lock STX
    simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount),
        Cl.uint(timelock),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    // Attempt to claim STX with the wrong principal
    const claimResult = simnet.callPublicFn(
      contractName,
      "claimStx",
      [Cl.bufferFromHex(preimage), Cl.uint(amount)],
      wallet1
    );

    expect(claimResult.result).toBeErr(Cl.uint(1002));
  });

  it("ensures that user can't claim funds for non-existent swap", () => {
    // Attempt to claim STX for a non-existent swap
    const claimResult = simnet.callPublicFn(
      contractName,
      "claimStx",
      [Cl.bufferFromHex("02"), Cl.uint(amount)],
      wallet2
    );

    expect(claimResult.result).toBeErr(Cl.uint(1000));
  });

  it("ensures that user can't lock with the same hash twice", () => {
    // Lock STX with a preimage hash
    simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount),
        Cl.uint(timelock),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    // Attempt to lock STX again with the same preimage hash
    const lockResult = simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount + 10),
        Cl.uint(timelock),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    expect(lockResult.result).toBeErr(Cl.uint(1005));
  });

  it("ensures that user can't refund non-existent hash", () => {
    // Attempt to refund STX for a non-existent swap
    const refundResult = simnet.callPublicFn(
      contractName,
      "refundStx",
      [Cl.bufferFromHex(preimageHash)],
      wallet1
    );

    expect(refundResult.result).toBeErr(Cl.uint(1000));
  });

  it("ensures that user can't claim after refund", () => {
    // Lock STX
    simnet.callPublicFn(
      contractName,
      "lockStx",
      [
        Cl.bufferFromHex(preimageHash),
        Cl.uint(amount),
        Cl.uint(timelock),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    // Mine empty blocks until the timelock expires
    simnet.mineEmptyBlocks(timelock + 1);

    // Refund STX after timelock
    const refundResult = simnet.callPublicFn(
      contractName,
      "refundStx",
      [Cl.bufferFromHex(preimageHash)],
      wallet1
    );

    expect(refundResult.result).toBeOk(Cl.bool(true));

    // Attempt to claim STX after refund
    const claimResult = simnet.callPublicFn(
      contractName,
      "claimStx",
      [Cl.bufferFromHex(preimage), Cl.uint(amount)],
      wallet2
    );

    expect(claimResult.result).toBeErr(Cl.uint(1000));
  });
});
