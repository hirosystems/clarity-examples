import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("defie tests", () => {
  it("ensure user can make defi transaction", () => {
    // prepare by minting 100 tokens and transfer to defi contract

    let block = simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(100), Cl.standardPrincipal(wallet1)],
      deployer
    );
    // Check the result of the mint transaction
    expect(block.result).toBeOk(Cl.bool(true));

    block = simnet.callPublicFn(
      "fungible-token",
      "transfer",
      [
        Cl.uint(100),
        Cl.standardPrincipal(wallet1),
        Cl.contractPrincipal(deployer, "defi"),
        Cl.none(),
      ],
      wallet1
    );

    // Check the result of the transfer transaction
    expect(block.result).toBeOk(Cl.bool(true));

    console.log("check");
    block = simnet.callPublicFn(
      "defi",
      "release-token",
      [Cl.uint(42), Cl.contractPrincipal(deployer, "fungible-token")],
      wallet1
    );
    expect(block.result).toBeOk(Cl.bool(true));
  });
});
