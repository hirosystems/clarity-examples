import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("test non-fungible token contract", () => {
  it("mints a new NFT and retrieves the last token ID", () => {
    const block = simnet.callPublicFn(
      "non-fungible-token",
      "mint",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );

    // Check the result of the mint transaction
    expect(block.result).toBeOk(Cl.uint(1));

    // Retrieve the last token ID
    const lastTokenIdResponse = simnet.callReadOnlyFn(
      "non-fungible-token",
      "get-last-token-id",
      [],
      deployer
    );
    expect(lastTokenIdResponse.result).toBeOk(Cl.uint(1));
  });

  it("transfers the NFT from wallet_1 to another wallet", () => {
    // First, ensure wallet_1 has an NFT by minting one
    simnet.callPublicFn(
      "non-fungible-token",
      "mint",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );

    const wallet2 = accounts.get("wallet_2")!;

    const block = simnet.callPublicFn(
      "non-fungible-token",
      "transfer",
      [
        Cl.uint(1),
        Cl.standardPrincipal(wallet1),
        Cl.standardPrincipal(wallet2),
      ],
      wallet1
    );

    expect(block.result).toBeOk(Cl.bool(true));

    // Retrieve the owner of the NFT
    const ownerResponse = simnet.callReadOnlyFn(
      "non-fungible-token",
      "get-owner",
      [Cl.uint(1)],
      wallet2
    );
    expect(ownerResponse.result).toBeOk(Cl.some(Cl.standardPrincipal(wallet2)));
  });
});
