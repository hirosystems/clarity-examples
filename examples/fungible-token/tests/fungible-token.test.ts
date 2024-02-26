import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("test fungible token contract", () => {
  it("deploys the contract and mints 100 tokens to wallet_1", () => {
    const block = simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(100), Cl.standardPrincipal(wallet1)],
      deployer
    );

    // Check the result of the mint transaction
    expect(block.result).toBeOk(Cl.bool(true));

    // Check the balance of wallet_1
    const balanceResponse = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet1)],
      wallet1
    );
    expect(balanceResponse.result).toBeOk(Cl.uint(100));
  });

  it("transfers 42 tokens from wallet_1 to wallet_2", () => {
    // First, ensure wallet_1 has enough tokens by minting them
    simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(100), Cl.standardPrincipal(wallet1)],
      deployer
    );

    const block = simnet.callPublicFn(
      "fungible-token",
      "transfer",
      [
        Cl.uint(42),
        Cl.standardPrincipal(wallet1),
        Cl.standardPrincipal(wallet2),
        Cl.none(),
      ],
      wallet1
    );

    expect(block.result).toBeOk(Cl.bool(true));

    // Check the balance of wallet_2
    const balanceResponse = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet2)],
      wallet2
    );
    expect(balanceResponse.result).toBeOk(Cl.uint(42));
  });

  it("transfers more tokens from wallet_2 than wallet_2 owns to wallet_1", () => {
    const block = simnet.callPublicFn(
      "fungible-token",
      "transfer",
      [
        Cl.uint(42 * 42),
        Cl.standardPrincipal(wallet2),
        Cl.standardPrincipal(wallet1),
        Cl.none(),
      ],
      wallet2
    );

    expect(block.result).toBeErr(Cl.uint(1));
  });
});
